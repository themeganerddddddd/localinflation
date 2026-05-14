"""
Generate monthly oil, gasoline, CPI, and macro data for oil-inflation models.

Outputs:
- data/generated/oil_macro_monthly.json
- data/generated/oil_macro_monthly.csv
- data/generated/oil_macro_metadata.json
"""

from __future__ import annotations

import csv
import json
import math
import os
from datetime import datetime, timezone
from pathlib import Path
from urllib.parse import urlencode
from urllib.request import urlopen

ROOT = Path(__file__).resolve().parents[1]
OUT_DIR = ROOT / "data" / "generated"
JSON_PATH = OUT_DIR / "oil_macro_monthly.json"
CSV_PATH = OUT_DIR / "oil_macro_monthly.csv"
META_PATH = OUT_DIR / "oil_macro_metadata.json"

FRED_SERIES = {
    "wti": "DCOILWTICO",
    "brent": "DCOILBRENTEU",
    "gasoline": "GASREGW",
    "diesel": "GASDESW",
    "cpi_all_items": "CPIAUCSL",
    "cpi_core": "CPILFESL",
    "cpi_energy": "CPIENGSL",
    "ppi": "PPIACO",
    "unemployment_rate": "UNRATE",
    "federal_funds_rate": "FEDFUNDS",
    "industrial_production": "INDPRO",
    "dollar_index": "DTWEXBGS",
    "recession": "USREC",
}


def now_iso() -> str:
    return datetime.now(timezone.utc).isoformat()


def month_key(date_value: str) -> str:
    return date_value[:7]


def mean(values: list[float]) -> float | None:
    return sum(values) / len(values) if values else None


def pct_change(current: float | None, previous: float | None) -> float | None:
    if current is None or previous in (None, 0):
        return None
    return (current / previous - 1) * 100


def fetch_fred_api(series_id: str, api_key: str) -> dict[str, float]:
    query = urlencode({
        "series_id": series_id,
        "api_key": api_key,
        "file_type": "json",
        "observation_start": "1986-01-01",
    })
    with urlopen(f"https://api.stlouisfed.org/fred/series/observations?{query}", timeout=25) as response:
        payload = json.loads(response.read().decode("utf-8"))
    monthly: dict[str, list[float]] = {}
    for row in payload.get("observations", []):
        raw = row.get("value")
        if raw in (None, "."):
            continue
        try:
            monthly.setdefault(month_key(row["date"]), []).append(float(raw))
        except ValueError:
            continue
    return {month: mean(values) for month, values in monthly.items() if mean(values) is not None}


def fetch_fred_csv(series_id: str) -> dict[str, float]:
    with urlopen(f"https://fred.stlouisfed.org/graph/fredgraph.csv?id={series_id}", timeout=25) as response:
        rows = csv.DictReader(response.read().decode("utf-8").splitlines())
        monthly: dict[str, list[float]] = {}
        for row in rows:
            raw = row.get(series_id)
            if raw in (None, "."):
                continue
            try:
                monthly.setdefault(month_key(row["observation_date"]), []).append(float(raw))
            except ValueError:
                continue
    return {month: mean(values) for month, values in monthly.items() if mean(values) is not None}


def load_public_series() -> tuple[str, dict[str, dict[str, float]]]:
    api_key = os.getenv("FRED_API_KEY", "").strip()
    series: dict[str, dict[str, float]] = {}
    for name, series_id in FRED_SERIES.items():
        try:
            series[name] = fetch_fred_api(series_id, api_key) if api_key else fetch_fred_csv(series_id)
        except Exception:
            series[name] = {}
    required = ["wti", "gasoline", "cpi_all_items", "cpi_core", "cpi_energy"]
    if min(len(series.get(name, {})) for name in required) < 120:
        raise RuntimeError("insufficient public series coverage")
    return ("trained_data", series)


def placeholder_series() -> tuple[str, dict[str, dict[str, float]]]:
    series = {key: {} for key in FRED_SERIES}
    for index in range(36 * 12):
        year = 1990 + index // 12
        month = index % 12 + 1
        key = f"{year:04d}-{month:02d}"
        trend = index / 12
        oil_cycle = 18 * math.sin(index / 9) + 10 * math.sin(index / 31)
        shock = 42 * math.exp(-((index - 382) / 9) ** 2)
        wti = max(18, 35 + trend * 1.25 + oil_cycle + shock)
        brent = wti + 3.2 + 1.8 * math.sin(index / 17)
        gasoline = max(1.0, 1.25 + wti * 0.034 + 0.1 * math.sin(index / 4))
        diesel = max(1.1, 1.38 + wti * 0.038 + 0.14 * math.sin(index / 5))
        cpi = 130 + trend * 4.6 + wti * 0.14 + 0.9 * math.sin(index / 15)
        core = 135 + trend * 4.2 + wti * 0.035 + 0.5 * math.sin(index / 19)
        energy = 120 + trend * 3.4 + wti * 0.95 + 6 * math.sin(index / 4)
        ppi = 125 + trend * 4.7 + wti * 0.18
        indpro = 83 + trend * 0.75 + 3 * math.sin(index / 22)
        dollar = 95 + 8 * math.sin(index / 29)
        recession = 1 if index in range(121, 130) or index in range(361, 365) else 0
        series["wti"][key] = wti
        series["brent"][key] = brent
        series["gasoline"][key] = gasoline
        series["diesel"][key] = diesel
        series["cpi_all_items"][key] = cpi
        series["cpi_core"][key] = core
        series["cpi_energy"][key] = energy
        series["ppi"][key] = ppi
        series["unemployment_rate"][key] = 4.8 + 1.2 * recession + 0.8 * math.sin(index / 45)
        series["federal_funds_rate"][key] = max(0.05, 2.3 + 1.8 * math.sin(index / 38))
        series["industrial_production"][key] = indpro
        series["dollar_index"][key] = dollar
        series["recession"][key] = recession
    return ("placeholder", series)


def build_rows(series: dict[str, dict[str, float]]) -> list[dict[str, float | int | str | None]]:
    required_months = [set(series[name]) for name in ["wti", "gasoline", "cpi_all_items", "cpi_core", "cpi_energy"]]
    months = sorted(set.intersection(*required_months))
    rows: list[dict[str, float | int | str | None]] = []
    previous: dict[str, float | None] = {}
    for month in months:
        row: dict[str, float | int | str | None] = {"date": month}
        for name in FRED_SERIES:
            value = series.get(name, {}).get(month)
            row[name] = round(value, 4) if value is not None else None
        for name, output in [
            ("wti", "wti_mom_pct"),
            ("brent", "brent_mom_pct"),
            ("gasoline", "gasoline_mom_pct"),
            ("diesel", "diesel_mom_pct"),
            ("cpi_all_items", "cpi_mom_pct"),
            ("cpi_core", "core_cpi_mom_pct"),
            ("cpi_energy", "cpi_energy_mom_pct"),
            ("ppi", "ppi_mom_pct"),
            ("industrial_production", "industrial_production_mom_pct"),
            ("dollar_index", "dollar_index_mom_pct"),
        ]:
            row[output] = pct_change(row.get(name), previous.get(name))
            previous[name] = row.get(name)
        year, month_num = month.split("-")
        row["month"] = int(month_num)
        row["year"] = int(year)
        rows.append(row)

    for index, row in enumerate(rows):
        def prior_pct(field: str, lag: int) -> float | None:
            if index < lag or rows[index - lag].get(field) in (None, 0):
                return None
            return pct_change(row.get(field), rows[index - lag].get(field))
        row["wti_3m_pct"] = prior_pct("wti", 3)
        row["wti_6m_pct"] = prior_pct("wti", 6)
        row["gasoline_3m_pct"] = prior_pct("gasoline", 3)
        recent = [r.get("wti_mom_pct") for r in rows[max(0, index - 5) : index + 1]]
        numeric_recent = [float(value) for value in recent if isinstance(value, (int, float))]
        if len(numeric_recent) >= 2:
            avg = sum(numeric_recent) / len(numeric_recent)
            row["oil_volatility_6m"] = (sum((value - avg) ** 2 for value in numeric_recent) / len(numeric_recent)) ** 0.5
        else:
            row["oil_volatility_6m"] = None
    return rows


def write_outputs(status: str, rows: list[dict[str, float | int | str | None]]) -> None:
    OUT_DIR.mkdir(parents=True, exist_ok=True)
    JSON_PATH.write_text(json.dumps({"status": status, "frequency": "monthly", "observations": rows}, indent=2))
    fieldnames = list(rows[0].keys()) if rows else []
    with CSV_PATH.open("w", newline="") as handle:
      writer = csv.DictWriter(handle, fieldnames=fieldnames)
      writer.writeheader()
      writer.writerows(rows)
    META_PATH.write_text(json.dumps({
        "status": status,
        "updated_at": now_iso(),
        "source_notes": ["FRED", "BLS and EIA where configured", "placeholder data when public/API access fails"],
        "row_count": len(rows),
        "start_date": rows[0]["date"] if rows else None,
        "end_date": rows[-1]["date"] if rows else None,
    }, indent=2))


def main() -> None:
    try:
        status, series = load_public_series()
    except Exception:
        status, series = placeholder_series()
    rows = build_rows(series)
    write_outputs(status, rows)
    print(f"Wrote {len(rows)} monthly oil macro rows ({status}).")


if __name__ == "__main__":
    main()
