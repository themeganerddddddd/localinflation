"""Train a real sklearn GBDT oil-CPI scenario model."""

from __future__ import annotations

import json
import math
from datetime import datetime, timezone
from pathlib import Path

ROOT = Path(__file__).resolve().parents[1]
CSV_INPUT = ROOT / "data" / "generated" / "oil_macro_monthly.csv"
JSON_INPUT = ROOT / "data" / "generated" / "oil_macro_monthly.json"
OUTPUT_PATH = ROOT / "data" / "generated" / "oil_gbdt_scenarios.json"
HORIZONS = [1, 3, 6, 12]


def now_iso() -> str:
    return datetime.now(timezone.utc).isoformat()


def placeholder(reason: str) -> dict:
    return {
        "model": "GBDT",
        "status": "placeholder",
        "reason": reason,
        "description": "GBDT model not trained yet.",
        "scenario_estimates": [],
    }


def save(payload: dict) -> None:
    OUTPUT_PATH.parent.mkdir(parents=True, exist_ok=True)
    OUTPUT_PATH.write_text(json.dumps(payload, indent=2))


def rmse(values, predictions) -> float:
    return math.sqrt(sum((float(a) - float(b)) ** 2 for a, b in zip(values, predictions)) / max(1, len(values)))


def main() -> None:
    try:
        import numpy as np
        import pandas as pd
        from sklearn.ensemble import HistGradientBoostingRegressor
        from sklearn.inspection import permutation_importance
        from sklearn.metrics import mean_absolute_error
        from sklearn.model_selection import TimeSeriesSplit
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

    if len(df) < 120:
        save(placeholder("insufficient monthly observations"))
        return

    for lag_source, lag_name in [
        ("cpi_mom_pct", "cpi_mom_pct_lag1"),
        ("core_cpi_mom_pct", "core_cpi_mom_pct_lag1"),
        ("cpi_energy_mom_pct", "cpi_energy_mom_pct_lag1"),
        ("ppi_mom_pct", "ppi_mom_pct_lag1"),
    ]:
        if lag_source in df.columns:
            df[lag_name] = df[lag_source].shift(1)

    feature_candidates = [
        "wti_mom_pct",
        "brent_mom_pct",
        "gasoline_mom_pct",
        "diesel_mom_pct",
        "wti_3m_pct",
        "wti_6m_pct",
        "gasoline_3m_pct",
        "oil_volatility_6m",
        "cpi_mom_pct_lag1",
        "core_cpi_mom_pct_lag1",
        "cpi_energy_mom_pct_lag1",
        "ppi_mom_pct_lag1",
        "unemployment_rate",
        "federal_funds_rate",
        "industrial_production_mom_pct",
        "dollar_index_mom_pct",
        "recession",
        "month",
        "year",
    ]
    features = [column for column in feature_candidates if column in df.columns]
    if len(features) < 8 or "cpi_all_items" not in df.columns:
        save(placeholder("required feature columns missing"))
        return

    metrics: dict[str, dict[str, float | int | str]] = {}
    feature_importance = {feature: 0.0 for feature in features}
    trained_models = {}
    latest_x = None

    for horizon in HORIZONS:
        target = f"target_{horizon}m"
        df[target] = (df["cpi_all_items"].shift(-horizon) / df["cpi_all_items"] - 1) * 100
        model_df = df[features + [target, "date"]].dropna().reset_index(drop=True)
        if len(model_df) < 90:
            continue
        x = model_df[features]
        y = model_df[target]
        split = TimeSeriesSplit(n_splits=4)
        fold_mae = []
        fold_rmse = []
        baseline_mae = []
        n_train = n_test = 0
        last_model = None
        last_x_test = last_y_test = None
        for train_index, test_index in split.split(x):
            x_train, x_test = x.iloc[train_index], x.iloc[test_index]
            y_train, y_test = y.iloc[train_index], y.iloc[test_index]
            model = HistGradientBoostingRegressor(max_iter=220, learning_rate=0.045, random_state=42)
            model.fit(x_train, y_train)
            pred = model.predict(x_test)
            fold_mae.append(float(mean_absolute_error(y_test, pred)))
            fold_rmse.append(float(rmse(y_test, pred)))
            baseline = [float(y_train.mean())] * len(y_test)
            baseline_mae.append(float(mean_absolute_error(y_test, baseline)))
            n_train, n_test = len(x_train), len(x_test)
            last_model, last_x_test, last_y_test = model, x_test, y_test
        trained_models[horizon] = last_model
        latest_x = x.tail(1).copy()
        metrics[f"{horizon}m"] = {
            "mae": round(float(np.mean(fold_mae)), 4),
            "rmse": round(float(np.mean(fold_rmse)), 4),
            "baseline_mae": round(float(np.mean(baseline_mae)), 4),
            "n_train": int(n_train),
            "n_test": int(n_test),
            "train_start": str(model_df["date"].iloc[0]),
            "test_end": str(model_df["date"].iloc[-1]),
        }
        if last_model is not None and last_x_test is not None and last_y_test is not None:
            try:
                importance = permutation_importance(last_model, last_x_test, last_y_test, n_repeats=6, random_state=42)
                for feature, value in zip(features, importance.importances_mean):
                    feature_importance[feature] += float(max(value, 0))
            except Exception:
                pass

    if not trained_models or latest_x is None:
        save(placeholder("model training did not produce usable outputs"))
        return

    scenario_estimates = []
    for shock in [10, 25, 50, 100]:
        scenario_x = latest_x.copy()
        for column, scale in [("wti_mom_pct", 1.0), ("brent_mom_pct", 0.95), ("gasoline_mom_pct", 0.5), ("diesel_mom_pct", 0.55)]:
            if column in scenario_x.columns:
                scenario_x[column] = shock * scale
        for column, scale in [("wti_3m_pct", 1.0), ("wti_6m_pct", 1.0), ("gasoline_3m_pct", 0.5)]:
            if column in scenario_x.columns:
                scenario_x[column] = shock * scale
        for horizon, model in trained_models.items():
            mid = float(model.predict(scenario_x)[0])
            metric = metrics.get(f"{horizon}m", {})
            band = float(metric.get("rmse", metric.get("mae", 0.0)))
            scenario_estimates.append({
                "oil_shock_pct": shock,
                "horizon_months": horizon,
                "low": round(mid - band, 4),
                "mid": round(mid, 4),
                "high": round(mid + band, 4),
                "unit": "cumulative_percent",
            })

    total_importance = sum(feature_importance.values()) or 1.0
    save({
        "model": "GBDT",
        "status": "trained",
        "description": "Trained gradient-boosted scenario model using historical oil, gasoline, CPI, and macro data.",
        "updated_at": now_iso(),
        "targets": [f"{horizon}m" for horizon in HORIZONS if horizon in trained_models],
        "metrics": metrics,
        "feature_importance": [
            {"feature": feature, "importance": round(value / total_importance, 4)}
            for feature, value in sorted(feature_importance.items(), key=lambda item: item[1], reverse=True)
        ],
        "scenario_estimates": scenario_estimates,
        "notes": [
            "This is a trained statistical scenario model, not a guaranteed forecast.",
            "Historical relationships may change across inflation regimes.",
        ],
    })


if __name__ == "__main__":
    main()
