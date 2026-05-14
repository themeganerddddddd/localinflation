import assert from "node:assert/strict";
import { spawnSync } from "node:child_process";
import { existsSync, mkdtempSync, readFileSync } from "node:fs";
import { tmpdir } from "node:os";
import path from "node:path";
import test from "node:test";
import { buildFutureScenarios } from "../lib/calculations.ts";
import {
  calculateDirectGasolineCpiEffect,
  calculateExpandedEnergyEffect,
  calculateStressScenarioTotalCpiPressure,
  componentCpiEffects,
  type OilCpiComponent
} from "../lib/oilCalculations.ts";
import { calculateOilDurationImpact } from "../lib/oilDurationModel.ts";
import components from "../data/config/oil_cpi_components.json" with { type: "json" };

test("direct gasoline channel separates gasoline price increase from CPI contribution", () => {
  const direct = calculateDirectGasolineCpiEffect({
    currentOilPrice: 75,
    scenarioOilPrice: 150,
    oilToGasPassThrough: 0.5,
    gasolineCpiWeight: 0.03
  });

  assert.equal(direct.oilChangePct, 1);
  assert.equal(direct.gasolineChangePct, 0.5);
  assert.equal(direct.directGasolineCpiEffectPp, 1.5);
});

test("severe oil shock uses nonlinear stress pressure above direct gasoline CPI effect", () => {
  const direct = calculateDirectGasolineCpiEffect({
    currentOilPrice: 76,
    scenarioOilPrice: 150,
    oilToGasPassThrough: 0.5,
    gasolineCpiWeight: 0.03
  });
  const effects = componentCpiEffects(direct.oilChangePct, components as OilCpiComponent[], "baseline");
  const expanded = calculateExpandedEnergyEffect({
    directGasolineCpiEffectPp: direct.directGasolineCpiEffectPp,
    componentEffects: effects
  });
  const stress = calculateStressScenarioTotalCpiPressure({
    directGasolineCpiEffectPp: direct.directGasolineCpiEffectPp,
    expandedEnergyLow: expanded.expandedEnergyLow,
    expandedEnergyHigh: expanded.expandedEnergyHigh,
    componentEffects: effects,
    oilChangePct: direct.oilChangePct,
    horizon: "12m",
    passThroughSetting: "baseline",
    localOilExposureMultiplier: 1
  });

  assert.ok(Math.abs(direct.oilChangePct - 0.9737) < 0.001);
  assert.ok(Math.abs(direct.gasolineChangePct - 0.4868) < 0.001);
  assert.ok(Math.abs(direct.directGasolineCpiEffectPp - 1.4605) < 0.01);
  assert.equal(stress.shockClass, "severe");
  assert.ok(stress.stressHigh >= 4.7);
  assert.ok(stress.stressLow > direct.directGasolineCpiEffectPp);
});

test("duration model cumulative pressure is above direct gasoline contribution for sustained 100 percent oil shock", () => {
  const direct = calculateDirectGasolineCpiEffect({
    currentOilPrice: 75,
    scenarioOilPrice: 150,
    oilToGasPassThrough: 0.5,
    gasolineCpiWeight: 0.03
  });
  const effects = componentCpiEffects(direct.oilChangePct, components as OilCpiComponent[], "baseline");
  const expanded = calculateExpandedEnergyEffect({
    directGasolineCpiEffectPp: direct.directGasolineCpiEffectPp,
    componentEffects: effects
  });
  const duration = calculateOilDurationImpact({
    oilChangePct: direct.oilChangePct,
    gasolineChangePct: direct.gasolineChangePct,
    directGasolineContributionPp: direct.directGasolineCpiEffectPp,
    expandedEnergyLowPp: expanded.expandedEnergyLow,
    expandedEnergyHighPp: expanded.expandedEnergyHigh,
    durationMonths: 12,
    horizon: "12m",
    passThroughSetting: "baseline",
    localOilExposureMultiplier: 1
  });

  assert.ok(duration.cumulativePressureHighPct > direct.directGasolineCpiEffectPp);
});

test("local projection scaffold writes placeholder output when oil macro data is missing", () => {
  const tempDir = mkdtempSync(path.join(tmpdir(), "localinflation-oil-lp-"));
  const outputPath = path.join(tempDir, "oil_local_projection_responses.json");
  const localPython = path.join(process.cwd(), ".venv", "Scripts", "python.exe");
  const parentPython = path.join(process.cwd(), "..", ".venv", "Scripts", "python.exe");
  const pythonPath = existsSync(localPython) ? localPython : existsSync(parentPython) ? parentPython : "python";
  const result = spawnSync(pythonPath, ["models/oil_pass_through_local_projection.py"], {
    cwd: process.cwd(),
    env: {
      ...process.env,
      OIL_MACRO_CSV_PATH: path.join(tempDir, "missing_oil_macro_monthly.csv"),
      OIL_MACRO_INPUT_PATH: path.join(tempDir, "missing_oil_macro_monthly.json"),
      OIL_LOCAL_PROJECTION_OUTPUT_PATH: outputPath
    },
    encoding: "utf8"
  });

  assert.equal(result.status, 0, result.stderr);
  const payload = JSON.parse(readFileSync(outputPath, "utf8"));
  assert.equal(payload.status, "placeholder");
  assert.deepEqual(payload.responses, []);
});

test("future cost high scenario stays above baseline when recent inflation drives the baseline", () => {
  const cpiValues = [
    { year: 2015, index: 100 },
    { year: 2016, index: 101 },
    { year: 2017, index: 102 },
    { year: 2018, index: 103 },
    { year: 2019, index: 104 },
    { year: 2020, index: 106 },
    { year: 2021, index: 112 },
    { year: 2022, index: 121 },
    { year: 2023, index: 127 },
    { year: 2024, index: 131 },
    { year: 2025, index: 135 }
  ];
  const scenarios = buildFutureScenarios(cpiValues, 100, 2025, 2035);
  const baseline = scenarios.find((scenario) => scenario.label === "Baseline");
  const high = scenarios.find((scenario) => scenario.label === "High");

  assert.ok(baseline);
  assert.ok(high);
  assert.ok(high.annualRate >= baseline.annualRate);
  assert.ok(high.value >= baseline.value);
});
