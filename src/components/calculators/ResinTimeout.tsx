import { useState, useMemo } from "react";
import { Timer, RotateCcw, ChevronDown, ChevronRight, AlertCircle, Clock } from "lucide-react";
import { Card, CardHeader, CardBody, CardFooter } from "../ui/Card";
import { NumberInput } from "../ui/NumberInput";
import { LINE_PROFILES } from "../../data/lineProfiles";
import { calculatePoundsPerHour, calculateHoursUntilEmpty, calculateHopperPPH, formatHoursAsTime } from "../../utils/formulas";

interface HopperState {
  id: string;
  name: string;
  usagePercent: number | string;
  poundsRemaining: number | string;
}

interface LayerState {
  id: string;
  blendPercent: number | string;
  hoppers: HopperState[];
  isExpanded: boolean;
}

interface LineInputs {
  width: number | string;
  gauge: number | string;
  fpm: number | string;
}

const createDefaultHoppers = (layerId: string): HopperState[] => [
  { id: "main", name: `${layerId} Main`, usagePercent: 50, poundsRemaining: 50 },
  { id: "add1", name: `${layerId}1`, usagePercent: 15, poundsRemaining: 25 },
  { id: "add2", name: `${layerId}2`, usagePercent: 15, poundsRemaining: 25 },
  { id: "add3", name: `${layerId}3`, usagePercent: 10, poundsRemaining: 25 },
  { id: "add4", name: `${layerId}4`, usagePercent: 7, poundsRemaining: 25 },
  { id: "add5", name: `${layerId}5`, usagePercent: 3, poundsRemaining: 25 },
];

const createLayersForLine = (layerLabels: string[]): LayerState[] => {
  const equalBlend = 100 / layerLabels.length;
  return layerLabels.map((label, index) => ({
    id: label,
    blendPercent: Math.round(equalBlend * 10) / 10,
    hoppers: createDefaultHoppers(label),
    isExpanded: index === 0, // First layer expanded by default
  }));
};

export function ResinTimeout() {
  const [selectedLineId, setSelectedLineId] = useState<string | null>(null);
  const [lineInputs, setLineInputs] = useState<LineInputs>({
    width: "",
    gauge: "",
    fpm: "",
  });
  const [layers, setLayers] = useState<LayerState[]>([]);
  const [currentTime] = useState(new Date());

  const selectedLine = selectedLineId
    ? LINE_PROFILES.find((l) => l.id === selectedLineId)
    : null;

  const handleLineSelect = (lineId: string) => {
    const line = LINE_PROFILES.find((l) => l.id === lineId);
    if (line) {
      setSelectedLineId(lineId);
      setLayers(createLayersForLine(line.layerLabels));
    }
  };

  const handleLineInputChange = (field: keyof LineInputs) => (value: number | string) => {
    setLineInputs((prev) => ({ ...prev, [field]: value }));
  };

  const toggleLayerExpanded = (layerId: string) => {
    setLayers((prev) =>
      prev.map((layer) =>
        layer.id === layerId ? { ...layer, isExpanded: !layer.isExpanded } : layer
      )
    );
  };

  const handleLayerBlendChange = (layerId: string) => (value: number | string) => {
    setLayers((prev) =>
      prev.map((layer) =>
        layer.id === layerId ? { ...layer, blendPercent: value } : layer
      )
    );
  };

  const handleHopperChange = (
    layerId: string,
    hopperId: string,
    field: "usagePercent" | "poundsRemaining"
  ) => (value: number | string) => {
    setLayers((prev) =>
      prev.map((layer) =>
        layer.id === layerId
          ? {
              ...layer,
              hoppers: layer.hoppers.map((hopper) =>
                hopper.id === hopperId ? { ...hopper, [field]: value } : hopper
              ),
            }
          : layer
      )
    );
  };

  const handleReset = () => {
    setSelectedLineId(null);
    setLineInputs({ width: "", gauge: "", fpm: "" });
    setLayers([]);
  };

  // Calculate all timeout data
  const timeoutData = useMemo(() => {
    const width = typeof lineInputs.width === "number" ? lineInputs.width : parseFloat(lineInputs.width as string);
    const gauge = typeof lineInputs.gauge === "number" ? lineInputs.gauge : parseFloat(lineInputs.gauge as string);
    const fpm = typeof lineInputs.fpm === "number" ? lineInputs.fpm : parseFloat(lineInputs.fpm as string);

    if (isNaN(width) || isNaN(gauge) || isNaN(fpm) || width <= 0 || gauge <= 0 || fpm <= 0) {
      return null;
    }

    const totalPPH = calculatePoundsPerHour(width, gauge, fpm);

    // Calculate for each hopper
    const hopperResults: {
      layerId: string;
      hopperId: string;
      hopperName: string;
      pph: number;
      hoursUntilEmpty: number;
      emptyTime: Date;
    }[] = [];

    layers.forEach((layer) => {
      const layerBlend = typeof layer.blendPercent === "number"
        ? layer.blendPercent
        : parseFloat(layer.blendPercent as string);

      if (isNaN(layerBlend) || layerBlend <= 0) return;

      layer.hoppers.forEach((hopper) => {
        const usagePercent = typeof hopper.usagePercent === "number"
          ? hopper.usagePercent
          : parseFloat(hopper.usagePercent as string);
        const poundsRemaining = typeof hopper.poundsRemaining === "number"
          ? hopper.poundsRemaining
          : parseFloat(hopper.poundsRemaining as string);

        if (isNaN(usagePercent) || isNaN(poundsRemaining) || usagePercent <= 0 || poundsRemaining <= 0) return;

        const hopperPPH = calculateHopperPPH(totalPPH, layerBlend, usagePercent);
        const hoursUntilEmpty = calculateHoursUntilEmpty(poundsRemaining, hopperPPH);
        const emptyTime = new Date(currentTime.getTime() + hoursUntilEmpty * 60 * 60 * 1000);

        hopperResults.push({
          layerId: layer.id,
          hopperId: hopper.id,
          hopperName: hopper.name,
          pph: hopperPPH,
          hoursUntilEmpty,
          emptyTime,
        });
      });
    });

    if (hopperResults.length === 0) return null;

    // Find first hopper to empty (changeover time)
    const sortedResults = [...hopperResults].sort((a, b) => a.hoursUntilEmpty - b.hoursUntilEmpty);
    const firstToEmpty = sortedResults[0];

    return {
      totalPPH,
      hopperResults: sortedResults,
      changeoverTime: firstToEmpty?.emptyTime ?? null,
      timeUntilChangeover: firstToEmpty?.hoursUntilEmpty ?? null,
      firstToEmpty,
    };
  }, [lineInputs, layers, currentTime]);

  return (
    <div className="mx-auto max-w-4xl">
      <Card>
        <CardHeader
          title="Resin Timeout Calculator"
          subtitle="Calculate material changeover timing"
          infoTooltip="Calculates when each hopper will empty based on current consumption rates"
        />

        <CardBody className="space-y-6">
          {/* Line Selection */}
          <div>
            <label className="label">Select Production Line</label>
            <div className="flex flex-wrap gap-2">
              {LINE_PROFILES.map((line) => (
                <button
                  key={line.id}
                  onClick={() => handleLineSelect(line.id)}
                  className={`rounded-lg px-4 py-2 text-sm font-medium transition-colors ${
                    selectedLineId === line.id
                      ? "bg-primary text-white"
                      : "bg-slate-700 text-slate-300 hover:bg-slate-600"
                  }`}
                >
                  {line.name}
                  <span className="ml-1 text-xs opacity-70">({line.layerCount}L)</span>
                </button>
              ))}
            </div>
          </div>

          {selectedLine && (
            <>
              {/* Line Parameters */}
              <div>
                <h3 className="mb-3 text-sm font-medium text-slate-300">Line Parameters</h3>
                <div className="grid gap-4 sm:grid-cols-3">
                  <NumberInput
                    label="Width"
                    value={lineInputs.width}
                    onChange={handleLineInputChange("width")}
                    unit="in"
                    placeholder="24"
                  />
                  <NumberInput
                    label="Gauge"
                    value={lineInputs.gauge}
                    onChange={handleLineInputChange("gauge")}
                    unit="mil"
                    placeholder="1.5"
                  />
                  <NumberInput
                    label="Line Speed"
                    value={lineInputs.fpm}
                    onChange={handleLineInputChange("fpm")}
                    unit="FPM"
                    placeholder="250"
                  />
                </div>

                {timeoutData && (
                  <div className="mt-3 text-sm text-slate-400">
                    Total Output: <span className="font-medium text-slate-200">{timeoutData.totalPPH.toFixed(1)} lbs/hr</span>
                  </div>
                )}
              </div>

              {/* Layer Configuration */}
              <div>
                <h3 className="mb-3 text-sm font-medium text-slate-300">Layer Configuration</h3>
                <div className="space-y-2">
                  {layers.map((layer) => (
                    <div key={layer.id} className="rounded-lg border border-slate-700 bg-slate-800/50">
                      {/* Layer Header */}
                      <button
                        onClick={() => toggleLayerExpanded(layer.id)}
                        className="flex w-full items-center justify-between px-4 py-3"
                      >
                        <div className="flex items-center gap-3">
                          {layer.isExpanded ? (
                            <ChevronDown size={18} className="text-slate-400" />
                          ) : (
                            <ChevronRight size={18} className="text-slate-400" />
                          )}
                          <span className="font-medium text-slate-200">Layer {layer.id}</span>
                          <span className="text-sm text-slate-400">
                            ({layer.blendPercent}% of total)
                          </span>
                        </div>
                        <div className="text-sm text-slate-400">
                          6 hoppers
                        </div>
                      </button>

                      {/* Layer Content */}
                      {layer.isExpanded && (
                        <div className="border-t border-slate-700 px-4 py-4">
                          <div className="mb-4">
                            <NumberInput
                              label="Layer Blend %"
                              value={layer.blendPercent}
                              onChange={handleLayerBlendChange(layer.id)}
                              unit="%"
                              hint="Percentage of total line output"
                            />
                          </div>

                          <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
                            {layer.hoppers.map((hopper) => (
                              <div key={hopper.id} className="rounded bg-slate-700/50 p-3">
                                <p className="mb-2 text-sm font-medium text-slate-300">{hopper.name}</p>
                                <div className="grid gap-2">
                                  <NumberInput
                                    label="Usage %"
                                    value={hopper.usagePercent}
                                    onChange={handleHopperChange(layer.id, hopper.id, "usagePercent")}
                                    unit="%"
                                  />
                                  <NumberInput
                                    label="Lbs Remaining"
                                    value={hopper.poundsRemaining}
                                    onChange={handleHopperChange(layer.id, hopper.id, "poundsRemaining")}
                                    unit="lbs"
                                  />
                                </div>
                              </div>
                            ))}
                          </div>
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            </>
          )}
        </CardBody>

        {timeoutData && (
          <CardFooter>
            <div className="space-y-4">
              {/* Main Countdown */}
              <div className="flex items-center gap-6 rounded-lg bg-slate-700 p-4">
                <div className="flex items-center gap-3">
                  <div className="rounded-full bg-warning/20 p-3">
                    <AlertCircle className="text-warning" size={24} />
                  </div>
                  <div>
                    <p className="text-sm text-slate-400">Next Changeover</p>
                    <p className="text-2xl font-bold text-slate-100">
                      {formatHoursAsTime(timeoutData.timeUntilChangeover ?? 0)}
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  <Clock className="text-slate-400" size={20} />
                  <div>
                    <p className="text-sm text-slate-400">At Time</p>
                    <p className="text-lg font-semibold text-slate-200">
                      {timeoutData.changeoverTime?.toLocaleTimeString("en-US", {
                        hour: "numeric",
                        minute: "2-digit",
                        hour12: true,
                      })}
                    </p>
                  </div>
                </div>

                {timeoutData.firstToEmpty && (
                  <div className="ml-auto text-right">
                    <p className="text-sm text-slate-400">First Empty</p>
                    <p className="text-lg font-semibold text-warning">
                      {timeoutData.firstToEmpty.hopperName}
                    </p>
                  </div>
                )}
              </div>

              {/* Hopper Timeline */}
              <div>
                <h4 className="mb-2 text-sm font-medium text-slate-300">Hopper Empty Times</h4>
                <div className="grid gap-2 sm:grid-cols-2 lg:grid-cols-3">
                  {timeoutData.hopperResults.slice(0, 6).map((result, index) => (
                    <div
                      key={`${result.layerId}-${result.hopperId}`}
                      className={`flex items-center justify-between rounded px-3 py-2 ${
                        index === 0 ? "bg-warning/20 border border-warning/30" : "bg-slate-700/50"
                      }`}
                    >
                      <span className="text-sm font-medium text-slate-200">{result.hopperName}</span>
                      <span className={`text-sm ${index === 0 ? "text-warning" : "text-slate-400"}`}>
                        {formatHoursAsTime(result.hoursUntilEmpty)}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            <div className="mt-4 flex justify-end">
              <button onClick={handleReset} className="btn-ghost">
                <RotateCcw size={18} />
                Reset
              </button>
            </div>
          </CardFooter>
        )}
      </Card>

      {/* Quick Reference */}
      <div className="mt-6 rounded-lg border border-slate-700 bg-slate-800/50 p-4">
        <h3 className="mb-3 flex items-center gap-2 text-sm font-medium text-slate-300">
          <Timer size={16} />
          How It Works
        </h3>
        <div className="text-sm text-slate-400 space-y-2">
          <p>1. <strong>Select your line</strong> to load the layer configuration</p>
          <p>2. <strong>Enter line parameters</strong> (width, gauge, speed) to calculate total PPH</p>
          <p>3. <strong>Adjust layer blend %</strong> to match your recipe (layers should sum to 100%)</p>
          <p>4. <strong>Set hopper usage %</strong> within each layer (hoppers in a layer sum to 100%)</p>
          <p>5. <strong>Enter pounds remaining</strong> in each hopper</p>
          <p className="text-slate-500">The calculator will show when each hopper will empty and which one empties first (your changeover time).</p>
        </div>
      </div>
    </div>
  );
}

export default ResinTimeout;
