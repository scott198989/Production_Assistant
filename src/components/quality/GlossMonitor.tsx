import { QualityMonitor } from "./QualityMonitor";

export function GlossMonitor() {
  return (
    <QualityMonitor
      title="Gloss Monitor"
      subtitle="Track film gloss readings"
      unit="GU"
      defaultTarget={75}
      defaultMin={65}
      defaultMax={85}
      adjustmentGuidance={{
        low: "Check cooling conditions, reduce frost line height, or adjust resin blend",
        high: "Increase frost line height or adjust cooling to reduce gloss if needed",
      }}
    />
  );
}

export default GlossMonitor;
