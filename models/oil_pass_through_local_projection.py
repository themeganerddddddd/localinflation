"""Train historical oil pass-through local projections."""

from __future__ import annotations

import json
import os
from datetime import datetime, timezone
from pathlib import Path

ROOT = Path(__file__).resolve().parents[1]
CSV_INPUT = Path(os.environ.get("OIL_MACRO_CSV_PATH", ROOT / "data" / "generated" / "oil_macro_monthly.csv"))
JSON_INPUT = Path(os.environ.get("OIL_MACRO_INPUT_PATH", ROOT / "data" / "generated" / "oil_macro_monthly.json"))
OUTPUT_PATH = Path(os.environ.get("OIL_LOCAL_PROJECTION_OUTPUT_PATH", ROOT / "data" / "generated" / "oil_local_projection_responses.json"))
HORIZONS = [1, 3, 6, 12, 24, 36]


def now_iso() -> str:
    return datetime.now(timezone.utc).isoformat()


def placeholder(reason: str) -> dict:
    return {
        "model": "Local Projections",
        "status": "placeholder",
        "reason": reason,
        "shock": "10_percent_oil_price_increase",
        "description": "Historical model not trained yet. This section is designed to estimate CPI responses after oil shocks using historical monthly oil and CPI data.",
        "responses": [],
    }


def save(payload: dict) -> None:
    OUTPUT_PATH.parent.mkdir(parents=True, exist_ok=True)
    OUTPUT_PATH.write_text(json.dumps(payload, indent=2))


def main() -> None:
    try:
        import pandas as pd
        import statsmodels.api as sm
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

    if len(df) < 96 or "date" not in df.columns:
        save(placeholder("insufficient monthly observations"))
        return

    df = df.sort_values("date").reset_index(drop=True)
    required = ["wti_mom_pct", "cpi_mom_pct", "core_cpi_mom_pct", "cpi_all_items"]
    if any(column not in df.columns for column in required):
        save(placeholder("required model columns missing"))
        return

    df["date"] = pd.to_datetime(df["date"])
    df["month"] = df["date"].dt.month.astype("category")
    df["lagged_cpi_mom_pct"] = df["cpi_mom_pct"].shift(1)
    df["lagged_core_cpi_mom_pct"] = df["core_cpi_mom_pct"].shift(1)
    df["lagged_wti_mom_pct"] = df["wti_mom_pct"].shift(1)
    if "industrial_production_mom_pct" not in df.columns:
        df["industrial_production_mom_pct"] = 0.0

    responses = []
    for horizon in HORIZONS:
        df[f"future_cpi_change_{horizon}"] = (df["cpi_all_items"].shift(-horizon) / df["cpi_all_items"] - 1) * 100
        columns = [
            "wti_mom_pct",
            "lagged_cpi_mom_pct",
            "lagged_core_cpi_mom_pct",
            "lagged_wti_mom_pct",
            "unemployment_rate",
            "federal_funds_rate",
            "industrial_production_mom_pct",
            "month",
            f"future_cpi_change_{horizon}",
        ]
        available = [column for column in columns if column in df.columns]
        model_df = df[available].dropna()
        if len(model_df) < 60:
            continue
        y = model_df[f"future_cpi_change_{horizon}"]
        x_columns = [column for column in available if column != f"future_cpi_change_{horizon}"]
        x = pd.get_dummies(model_df[x_columns], columns=["month"], drop_first=True)
        x = sm.add_constant(x.astype(float))
        result = sm.OLS(y, x).fit(cov_type="HC1")
        beta = float(result.params.get("wti_mom_pct", 0.0))
        se = float(result.bse.get("wti_mom_pct", 0.0))
        responses.append({
            "horizon_months": horizon,
            "cpi_effect_pp": round(beta * 10, 4),
            "lower_ci": round((beta - 1.96 * se) * 10, 4),
            "upper_ci": round((beta + 1.96 * se) * 10, 4),
            "n_obs": int(len(model_df)),
        })

    if not responses:
        save(placeholder("model did not produce usable responses"))
        return

    save({
        "model": "Local Projections",
        "status": "trained",
        "shock": "10_percent_oil_price_increase",
        "description": "Estimated historical CPI response to a 10% monthly WTI oil price shock.",
        "updated_at": now_iso(),
        "responses": responses,
        "notes": [
            "Historical estimates are not forecasts.",
            "Effects are estimated from monthly historical relationships.",
        ],
    })


if __name__ == "__main__":
    main()
