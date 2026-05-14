import ResultCard from "@/components/ResultCard";
import { formatPercent } from "@/lib/formatters";
import type { OilShockClass } from "@/lib/oilCalculations";
import type { OilDurationModelOutput } from "@/lib/oilDurationModel";
import type { OilLocalProjectionPayload } from "@/components/OilLocalProjectionResults";

type OilResultCardsProps = {
  oilChangePct: number;
  shockClass: OilShockClass;
  gasolineEffectPct: number;
  directGasolineCpiEffectPp: number;
  expandedEnergy: { expandedEnergyLow: number; expandedEnergyHigh: number };
  stressScenario: { stressLow: number; stressHigh: number };
  durationImpact: OilDurationModelOutput;
  localProjection?: OilLocalProjectionPayload;
};

function titleCase(value: string): string {
  return value.charAt(0).toUpperCase() + value.slice(1);
}

export default function OilResultCards({ oilChangePct, shockClass, gasolineEffectPct, directGasolineCpiEffectPp, expandedEnergy, stressScenario, durationImpact, localProjection }: OilResultCardsProps) {
  const localProjectionEstimate = localProjection?.status === "trained" || localProjection?.status === "estimated"
    ? localProjection.responses.find((response) => response.horizon_months === 12) ?? localProjection.responses.at(-1)
    : undefined;

  return (
    <div className="grid gap-4 md:grid-cols-2 xl:grid-cols-3">
      <ResultCard title="Oil price shock" value={formatPercent(oilChangePct * 100)} detail="Scenario price compared with current oil price." tone="blue" />
      <ResultCard title="Shock classification" value={titleCase(shockClass)} detail="Based on the absolute size of the oil-price move." tone="amber" />
      <ResultCard title="Estimated gasoline price increase" value={formatPercent(gasolineEffectPct * 100)} detail="Estimated percent change in retail gasoline prices from oil pass-through." />
      <ResultCard
        title="Direct gasoline contribution to all-items CPI"
        value={`+${directGasolineCpiEffectPp.toFixed(2)}%`}
        detail="Gasoline's direct contribution to the all-items CPI inflation rate."
        tooltip="Gasoline prices can rise 50%, while contributing about 1.5% to all-items CPI if gasoline is 3% of the CPI basket."
        tone="green"
      />
      <ResultCard title="Expanded energy contribution to all-items CPI" value={`+${expandedEnergy.expandedEnergyLow.toFixed(2)}% to +${expandedEnergy.expandedEnergyHigh.toFixed(2)}%`} detail="Gasoline plus direct household energy channels." />
      <ResultCard title="Stress scenario total CPI pressure" value={`+${stressScenario.stressLow.toFixed(2)}% to +${stressScenario.stressHigh.toFixed(2)}%`} detail="Direct energy effects plus possible indirect inflation pressure." tone="amber" />
      <ResultCard title="Calibrated duration model estimate" value={`+${durationImpact.cumulativePressureLowPct.toFixed(2)}% to +${durationImpact.cumulativePressureHighPct.toFixed(2)}%`} detail="Cumulative possible CPI pressure while oil remains elevated." tone="blue" />
      {localProjectionEstimate ? (
        <ResultCard title="Historical local projection estimate" value={`${localProjectionEstimate.cpi_effect_pp.toFixed(2)}%`} detail="Estimated historical CPI response to a 10% monthly WTI oil-price shock." />
      ) : null}
    </div>
  );
}
