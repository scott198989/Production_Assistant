import { QualityMonitor } from "./QualityMonitor";

export function HazeMonitor() {
  return (
    <QualityMonitor
      title="Haze Monitor"
      subtitle="Track film haze readings"
      unit="%"
      defaultTarget={8}
      defaultMin={3}
      defaultMax={12}
      adjustmentGuidance={{
        low: "Haze is below target - may indicate clarity is too high for spec",
        high: "Check for contamination, adjust cooling, or verify material quality to reduce haze",
      }}
    />
  );
}

export default HazeMonitor;
