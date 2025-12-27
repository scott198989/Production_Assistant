import { QualityMonitor } from "./QualityMonitor";

export function OpacityMonitor() {
  return (
    <QualityMonitor
      title="Opacity Monitor"
      subtitle="Track film opacity readings"
      unit="%"
      defaultTarget={15}
      defaultMin={10}
      defaultMax={20}
      adjustmentGuidance={{
        low: "Increase filler loading or adjust additive levels to increase opacity",
        high: "Reduce filler loading or adjust additive levels to decrease opacity",
      }}
    />
  );
}

export default OpacityMonitor;
