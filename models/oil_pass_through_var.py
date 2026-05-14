"""Train VAR impulse responses for oil-inflation pass-through."""

from __future__ import annotations

import json
from datetime import datetime, timezone
from pathlib import Path

ROOT = Path(__file__).resolve().parents[1]
CSV_INPUT = ROOT / "data" / "generated" / "oil_macro_monthly.csv"
JSON_INPUT = ROOT / "data" / "generated" / "oil_macro_monthly.json"
OUTPUT_PATH = ROOT / "data" / "generated" / "oil_var_impulse_responses.json"
HORIZONS = [1, 3, 6, 12, 24, 36]


def now_iso() -> str:
    return datetime.now(timezone.utc).isoformat()


def placeholder(reason: str) -> dict:
    return {
        "model": "VAR",
        "status": "placeholder",
        "reason": reason,
        "shock": "one_standard_deviation_wti_shock",
        "description": "VAR impulse-response model not trained yet.",
        "responses": [],
    }


def save(payload: dict) -> None:
    OUTPUT_PATH.parent.mkdir(parents=True, exist_ok=True)
    OUTPUT_PATH.write_text(json.dumps(payload, indent=2))


def main() -> None:
    try:
        import pandas as pd
        from statsmodels.tsa.api import VAR
    except ImportError as error:
        save(placeholder(f"missing dependency: {error.name}"))
        return

    try:
        if CSV_INPUT.exists():
            df = pd.read_csv(CSV_INPUT)
        elif JSON_INPUT.exists():
            payload = json.loads(JSON_INPUT.read_text())
            df = pd.DataFrame(payload.get("observations", payload if isinstance(payload, list) else []))
        else:
            save(placeholder("oil macro input is missing"))
            return
    except Exception as error:
        save(placeholder(f"could not read oil macro data: {error}"))
        return

    variables = ["wti_mom_pct", "gasoline_mom_pct", "cpi_energy_mom_pct", "cpi_mom_pct", "core_cpi_mom_pct"]
    optional = [column for column in ["ppi_mom_pct", "unemployment_rate", "federal_funds_rate"] if column in df.columns]
    columns = variables + optional
    if len(df) < 96 or any(column not in df.columns for column in variables):
        save(placeholder("insufficient data or required columns missing"))
        return

    model_df = df[columns].dropna().clip(lower=df[columns].quantile(0.01), upper=df[columns].quantile(0.99), axis=1)
    if len(model_df) < 96:
        save(placeholder("insufficient non-null observations"))
        return

    try:
        maxlags = min(12, max(2, len(model_df) // 30))
        result = VAR(model_df).fit(maxlags=maxlags, ic="aic")
        irf = result.irf(max(HORIZONS))
        wti_index = columns.index("wti_mom_pct")
        cpi_index = columns.index("cpi_mom_pct")
        core_index = columns.index("core_cpi_mom_pct")
        energy_index = columns.index("cpi_energy_mom_pct")
        responses = []
        for horizon in HORIZONS:
            responses.append({
                "horizon_months": horizon,
                "cpi_effect_pp": round(float(irf.irfs[1:horizon + 1, cpi_index, wti_index].sum()), 4),
                "core_cpi_effect_pp": round(float(irf.irfs[1:horizon + 1, core_index, wti_index].sum()), 4),
                "energy_cpi_effect_pp": round(float(irf.irfs[1:horizon + 1, energy_index, wti_index].sum()), 4),
            })
        save({
            "model": "VAR",
            "status": "trained",
            "shock": "one_standard_deviation_wti_shock",
            "description": "VAR impulse response of CPI variables after WTI oil price shock.",
            "updated_at": now_iso(),
            "lag_order": int(result.k_ar),
            "responses": responses,
            "notes": [
                "VAR impulse responses are historical estimates, not forecasts.",
                "Shock scale is one standard deviation unless otherwise rescaled.",
            ],
        })
    except Exception as error:
        save(placeholder(f"VAR estimation failed: {error}"))


if __name__ == "__main__":
    main()
