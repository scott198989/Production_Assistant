import { QualityMonitor } from "./QualityMonitor";

export function TreaterMonitor() {
  return (
    <QualityMonitor
      title="Corona Treater Monitor"
      subtitle="Monitor treater output and dyne levels"
      unit="dyne"
      defaultTarget={42}
      defaultMin={38}
      defaultMax={50}
      adjustmentGuidance={{
        low: "Increase treater power or reduce line speed to raise dyne level",
        high: "Reduce treater power or increase line speed to lower dyne level (if exceeding max)",
      }}
    />
  );
}

export default TreaterMonitor;
