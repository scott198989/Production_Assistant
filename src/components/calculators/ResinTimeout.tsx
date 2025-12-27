import { useState, useMemo, useEffect } from "react";
import { Timer, RotateCcw, ChevronDown, ChevronRight, RefreshCw } from "lucide-react";
import { Card, CardHeader, CardBody, CardFooter } from "../ui/Card";
import { NumberInput } from "../ui/NumberInput";
import { LINE_PROFILES } from "../../data/lineProfiles";
import { calculatePoundsPerHour, calculateHopperPPH } from "../../utils/formulas";

// Hopper capacities
const MAIN_HOPPER_CAPACITY = 50; // lbs
const ADDITIVE_HOPPER_CAPACITY = 25; // lbs

interface HopperState {
  id: string;
  name: string;
  type: "main" | "additive";
  usagePercent: number | string;
  capacity: number;
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

interface JobInputs {
  remainingPounds: number | string;
  startDate: string;
  startTime: string;
  drainTimeMinutes: number | string;
}

interface HopperResult {
  layerId: string;
  hopperId: string;
  hopperName: string;
  type: "main" | "additive";
  pph: number;
  capacity: number;
  tenPercentReserve: number;
  shutOffTime: Date;
  timeBeforeChangeover: number; // minutes before changeover
}

const createDefaultHoppers = (layerId: string): HopperState[] => [
  { id: "main", name: `${layerId} Main`, type: "main", usagePercent: 50, capacity: MAIN_HOPPER_CAPACITY },
  { id: "add1", name: `${layerId}1`, type: "additive", usagePercent: 15, capacity: ADDITIVE_HOPPER_CAPACITY },
  { id: "add2", name: `${layerId}2`, type: "additive", usagePercent: 15, capacity: ADDITIVE_HOPPER_CAPACITY },
  { id: "add3", name: `${layerId}3`, type: "additive", usagePercent: 10, capacity: ADDITIVE_HOPPER_CAPACITY },
  { id: "add4", name: `${layerId}4`, type: "additive", usagePercent: 7, capacity: ADDITIVE_HOPPER_CAPACITY },
  { id: "add5", name: `${layerId}5`, type: "additive", usagePercent: 3, capacity: ADDITIVE_HOPPER_CAPACITY },
];

const createLayersForLine = (layerLabels: string[]): LayerState[] => {
  const equalBlend = 100 / layerLabels.length;
  return layerLabels.map((label, index) => ({
    id: label,
    blendPercent: Math.round(equalBlend * 10) / 10,
    hoppers: createDefaultHoppers(label),
    isExpanded: index === 0,
  }));
};

const formatTime = (date: Date): string => {
  return date.toLocaleTimeString("en-US", {
    hour: "numeric",
    minute: "2-digit",
    hour12: true,
  });
};

const formatDateTime = (date: Date): string => {
  return date.toLocaleString("en-US", {
    weekday: "short",
    month: "short",
    day: "numeric",
    hour: "numeric",
    minute: "2-digit",
    hour12: true,
  });
};

const formatDuration = (hours: number): string => {
  if (hours < 0) return "Now";
  const h = Math.floor(hours);
  const m = Math.round((hours - h) * 60);
  if (h === 0) return `${m}m`;
  if (m === 0) return `${h}h`;
  return `${h}h ${m}m`;
};

const formatMinutes = (minutes: number): string => {
  if (minutes < 60) return `${Math.round(minutes)} min`;
  const h = Math.floor(minutes / 60);
  const m = Math.round(minutes % 60);
  if (m === 0) return `${h}h`;
  return `${h}h ${m}m`;
};

export function ResinTimeout() {
  const [selectedLineId, setSelectedLineId] = useState<string | null>(null);
  const [lineInputs, setLineInputs] = useState<LineInputs>({
    width: "",
    gauge: "",
    fpm: "",
  });
  const [jobInputs, setJobInputs] = useState<JobInputs>(() => {
    const now = new Date();
    const dateStr = now.toISOString().split("T")[0] ?? "";
    const timeStr = now.toTimeString().slice(0, 5);
    return {
      remainingPounds: "",
      startDate: dateStr,
      startTime: timeStr,
      drainTimeMinutes: 15,
    };
  });
  const [layers, setLayers] = useState<LayerState[]>([]);

  // Update time every minute for live countdown
  const [, setTick] = useState(0);
  useEffect(() => {
    const interval = setInterval(() => setTick((t) => t + 1), 60000);
    return () => clearInterval(interval);
  }, []);

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

  const handleJobInputChange = (field: keyof JobInputs) => (value: number | string) => {
    setJobInputs((prev) => ({ ...prev, [field]: value }));
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
    field: "usagePercent"
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
    const now = new Date();
    const dateStr = now.toISOString().split("T")[0] ?? "";
    const timeStr = now.toTimeString().slice(0, 5);
    setJobInputs({
      remainingPounds: "",
      startDate: dateStr,
      startTime: timeStr,
      drainTimeMinutes: 15,
    });
    setLayers([]);
  };

  const handleSetCurrentTime = () => {
    const now = new Date();
    const dateStr = now.toISOString().split("T")[0] ?? "";
    const timeStr = now.toTimeString().slice(0, 5);
    setJobInputs((prev) => ({
      ...prev,
      startDate: dateStr,
      startTime: timeStr,
    }));
  };

  // Calculate all timeout data
  const timeoutData = useMemo(() => {
    const width = typeof lineInputs.width === "number" ? lineInputs.width : parseFloat(lineInputs.width as string);
    const gauge = typeof lineInputs.gauge === "number" ? lineInputs.gauge : parseFloat(lineInputs.gauge as string);
    const fpm = typeof lineInputs.fpm === "number" ? lineInputs.fpm : parseFloat(lineInputs.fpm as string);
    const remainingPounds = typeof jobInputs.remainingPounds === "number"
      ? jobInputs.remainingPounds
      : parseFloat(jobInputs.remainingPounds as string);
    const drainTime = typeof jobInputs.drainTimeMinutes === "number"
      ? jobInputs.drainTimeMinutes
      : parseFloat(jobInputs.drainTimeMinutes as string) || 15;

    if (isNaN(width) || isNaN(gauge) || isNaN(fpm) || isNaN(remainingPounds) ||
        width <= 0 || gauge <= 0 || fpm <= 0 || remainingPounds <= 0) {
      return null;
    }

    // Parse start time
    const startDateTime = new Date(`${jobInputs.startDate}T${jobInputs.startTime}:00`);
    if (isNaN(startDateTime.getTime())) return null;

    const totalPPH = calculatePoundsPerHour(width, gauge, fpm);

    // Calculate CHANGEOVER TIME (when job ends)
    const hoursUntilJobEnd = remainingPounds / totalPPH;
    const changeoverTime = new Date(startDateTime.getTime() + hoursUntilJobEnd * 60 * 60 * 1000);

    // Drain time in hours
    const drainTimeHours = drainTime / 60;

    // Calculate for each hopper - WORKING BACKWARDS FROM CHANGEOVER
    const hopperResults: HopperResult[] = [];

    layers.forEach((layer) => {
      const layerBlend = typeof layer.blendPercent === "number"
        ? layer.blendPercent
        : parseFloat(layer.blendPercent as string);

      if (isNaN(layerBlend) || layerBlend <= 0) return;

      layer.hoppers.forEach((hopper) => {
        const usagePercent = typeof hopper.usagePercent === "number"
          ? hopper.usagePercent
          : parseFloat(hopper.usagePercent as string);

        if (isNaN(usagePercent) || usagePercent <= 0) return;

        const hopperPPH = calculateHopperPPH(totalPPH, layerBlend, usagePercent);
        const capacity = hopper.capacity;

        // 10% reserve = what we want LEFT at changeover
        const tenPercentReserve = capacity * 0.10;

        // Drain consumption (material consumed during drain after shut-off)
        const drainPounds = hopperPPH * drainTimeHours;

        // At shut-off time, hopper needs: 10% reserve + drain amount
        // So during drain, it consumes drainPounds, leaving exactly 10%
        const poundsAtShutOff = tenPercentReserve + drainPounds;

        // From a FULL hopper, how many pounds can we consume before shut-off?
        const poundsToConsume = capacity - poundsAtShutOff;

        // Time to consume that amount
        const hoursToConsume = poundsToConsume / hopperPPH;

        // SHUT-OFF TIME = CHANGEOVER - drain time - consumption time
        // (We work backwards: changeover minus the time needed)
        const shutOffTime = new Date(changeoverTime.getTime() - (hoursToConsume + drainTimeHours) * 60 * 60 * 1000);

        // How many minutes before changeover is this shut-off?
        const timeBeforeChangeover = (changeoverTime.getTime() - shutOffTime.getTime()) / (1000 * 60);

        hopperResults.push({
          layerId: layer.id,
          hopperId: hopper.id,
          hopperName: hopper.name,
          type: hopper.type,
          pph: hopperPPH,
          capacity,
          tenPercentReserve,
          shutOffTime,
          timeBeforeChangeover,
        });
      });
    });

    if (hopperResults.length === 0) return null;

    // Sort by shut-off time (earliest first)
    const sortedResults = [...hopperResults].sort((a, b) =>
      a.shutOffTime.getTime() - b.shutOffTime.getTime()
    );

    // Group by layer for display
    const resultsByLayer: Record<string, HopperResult[]> = {};
    sortedResults.forEach(result => {
      if (!resultsByLayer[result.layerId]) {
        resultsByLayer[result.layerId] = [];
      }
      resultsByLayer[result.layerId]!.push(result);
    });

    // Calculate time from now
    const now = new Date();
    const hoursFromNow = (changeoverTime.getTime() - now.getTime()) / (1000 * 60 * 60);

    return {
      totalPPH,
      remainingPounds,
      hoursUntilJobEnd,
      changeoverTime,
      startDateTime,
      drainTimeMinutes: drainTime,
      hopperResults: sortedResults,
      resultsByLayer,
      hoursFromNow,
      firstShutOff: sortedResults[0],
    };
  }, [lineInputs, jobInputs, layers]);

  return (
    <div className="mx-auto max-w-4xl">
      <Card>
        <CardHeader
          title="Resin Timeout Calculator"
          subtitle="Calculate when to shut off each hopper for changeover (v2)"
        />

        <CardBody className="space-y-6">
          {/* Line Selection */}
          <div>
            <label className="label">Select Production Line</label>
            <div className="flex flex-wrap gap-2">
              {LINE_PROFILES.map((line) => (
                <button
                  type="button"
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
              {/* Job Information */}
              <div className="rounded-lg border border-primary/30 bg-primary/5 p-4">
                <h3 className="mb-3 text-sm font-medium text-primary">Job Information</h3>
                <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
                  <NumberInput
                    label="Remaining on Job"
                    value={jobInputs.remainingPounds}
                    onChange={handleJobInputChange("remainingPounds")}
                    unit="lbs"
                    placeholder="8500"
                    hint="Total pounds left to run"
                  />
                  <div>
                    <label htmlFor="start-date" className="label">Start Date</label>
                    <input
                      id="start-date"
                      type="date"
                      value={jobInputs.startDate}
                      onChange={(e) => handleJobInputChange("startDate")(e.target.value)}
                      className="input-base"
                      title="Start date for calculation"
                    />
                  </div>
                  <div>
                    <label htmlFor="start-time" className="label">Start Time</label>
                    <div className="flex gap-2">
                      <input
                        id="start-time"
                        type="time"
                        value={jobInputs.startTime}
                        onChange={(e) => handleJobInputChange("startTime")(e.target.value)}
                        className="input-base flex-1"
                        title="Start time for calculation"
                      />
                      <button
                        type="button"
                        onClick={handleSetCurrentTime}
                        className="btn-secondary px-3"
                        title="Set to current time"
                      >
                        Now
                      </button>
                    </div>
                  </div>
                  <NumberInput
                    label="Drain Time"
                    value={jobInputs.drainTimeMinutes}
                    onChange={handleJobInputChange("drainTimeMinutes")}
                    unit="min"
                    placeholder="15"
                    hint="Time for material to drain"
                  />
                </div>
              </div>

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
                  <div className="mt-3 flex flex-wrap gap-4 text-sm text-slate-400">
                    <span>
                      Output: <span className="font-medium text-slate-200">{timeoutData.totalPPH.toFixed(1)} lbs/hr</span>
                    </span>
                    <span>
                      Job Duration: <span className="font-medium text-slate-200">{formatDuration(timeoutData.hoursUntilJobEnd)}</span>
                    </span>
                  </div>
                )}
              </div>

              {/* Layer Configuration */}
              <div>
                <div className="flex items-center justify-between mb-3">
                  <h3 className="text-sm font-medium text-slate-300">Layer Configuration</h3>
                  <div className="text-xs text-slate-500">
                    Main: {MAIN_HOPPER_CAPACITY} lbs | Additives: {ADDITIVE_HOPPER_CAPACITY} lbs
                  </div>
                </div>
                <div className="space-y-2">
                  {layers.map((layer) => (
                    <div key={layer.id} className="rounded-lg border border-slate-700 bg-slate-800/50">
                      {/* Layer Header */}
                      <button
                        type="button"
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
                              hint="Percentage of total line output for this layer"
                            />
                          </div>

                          <p className="text-xs text-slate-500 mb-3">
                            Hopper usage % within this layer (must total 100%):
                          </p>
                          <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
                            {layer.hoppers.map((hopper) => (
                              <div key={hopper.id} className="rounded bg-slate-700/50 p-3">
                                <div className="flex items-center justify-between mb-2">
                                  <p className="text-sm font-medium text-slate-300">{hopper.name}</p>
                                  <span className="text-xs text-slate-500">
                                    {hopper.capacity} lbs
                                  </span>
                                </div>
                                <NumberInput
                                  label="Usage %"
                                  value={hopper.usagePercent}
                                  onChange={handleHopperChange(layer.id, hopper.id, "usagePercent")}
                                  unit="%"
                                />
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
            <div className="space-y-6">
              {/* CHANGEOVER TIME - Main Result */}
              <div className="rounded-lg bg-primary/20 border-2 border-primary p-6 text-center">
                <p className="text-sm font-medium text-primary mb-1">CHANGEOVER TIME</p>
                <p className="text-4xl font-bold text-slate-100">
                  {formatDateTime(timeoutData.changeoverTime)}
                </p>
                <p className="text-sm text-slate-400 mt-2">
                  {formatDuration(timeoutData.hoursFromNow)} from now
                </p>
                <p className="text-xs text-slate-500 mt-1">
                  {timeoutData.remainingPounds.toLocaleString()} lbs @ {timeoutData.totalPPH.toFixed(0)} PPH
                </p>
              </div>

              {/* Shut-off Schedule by Layer */}
              <div>
                <h4 className="mb-4 text-lg font-medium text-slate-200">Hopper Shut-off Schedule</h4>
                <p className="mb-4 text-sm text-slate-500">
                  Shut off each hopper at the time shown. After the last refill, let each hopper run until its shut-off time.
                  At changeover, each hopper will have 10% remaining.
                </p>

                {Object.entries(timeoutData.resultsByLayer).map(([layerId, hoppers]) => (
                  <div key={layerId} className="mb-4">
                    <h5 className="text-sm font-medium text-slate-400 mb-2 flex items-center gap-2">
                      <span className="w-8 h-8 rounded-full bg-slate-700 flex items-center justify-center text-slate-200">
                        {layerId}
                      </span>
                      Layer {layerId}
                    </h5>
                    <div className="grid gap-2 sm:grid-cols-2 lg:grid-cols-3">
                      {hoppers.map((result) => (
                        <div
                          key={`${result.layerId}-${result.hopperId}`}
                          className="rounded-lg bg-slate-800 border border-slate-700 p-3"
                        >
                          <div className="flex items-center justify-between mb-2">
                            <span className="font-medium text-slate-200">{result.hopperName}</span>
                            <span className="text-xs text-slate-500">{result.pph.toFixed(1)} PPH</span>
                          </div>
                          <div className="text-center py-2">
                            <p className="text-xs text-slate-500 mb-1">SHUT OFF AT</p>
                            <p className="text-2xl font-bold text-warning">
                              {formatTime(result.shutOffTime)}
                            </p>
                            <p className="text-xs text-slate-500 mt-1">
                              {formatMinutes(result.timeBeforeChangeover)} before changeover
                            </p>
                          </div>
                          <div className="flex justify-between text-xs text-slate-500 pt-2 border-t border-slate-700">
                            <span>Capacity: {result.capacity} lbs</span>
                            <span>Reserve: {result.tenPercentReserve.toFixed(0)} lbs</span>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                ))}
              </div>

              {/* Quick Reference Table */}
              <div className="rounded-lg border border-slate-700 bg-slate-800/50 p-4">
                <h5 className="text-sm font-medium text-slate-300 mb-3 flex items-center gap-2">
                  <Timer size={16} />
                  Quick Reference (All Hoppers)
                </h5>
                <div className="overflow-x-auto">
                  <table className="w-full text-sm">
                    <thead>
                      <tr className="text-left text-slate-400 border-b border-slate-700">
                        <th className="pb-2 pr-4">Hopper</th>
                        <th className="pb-2 pr-4">Shut Off At</th>
                        <th className="pb-2">Before Changeover</th>
                      </tr>
                    </thead>
                    <tbody>
                      {timeoutData.hopperResults.map((result) => (
                        <tr key={`${result.layerId}-${result.hopperId}`} className="border-b border-slate-700/50">
                          <td className="py-2 pr-4 font-medium text-slate-200">{result.hopperName}</td>
                          <td className="py-2 pr-4 font-bold text-warning">{formatTime(result.shutOffTime)}</td>
                          <td className="py-2 text-slate-400">{formatMinutes(result.timeBeforeChangeover)}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>

              <div className="flex justify-end">
                <button type="button" onClick={handleReset} className="btn-ghost">
                  <RotateCcw size={18} />
                  Reset
                </button>
              </div>
            </div>
          </CardFooter>
        )}
      </Card>

      {/* How It Works */}
      <div className="mt-6 rounded-lg border border-slate-700 bg-slate-800/50 p-4">
        <h3 className="mb-3 flex items-center gap-2 text-sm font-medium text-slate-300">
          <RefreshCw size={16} />
          How It Works
        </h3>
        <div className="text-sm text-slate-400 space-y-2">
          <p><strong className="text-slate-300">1.</strong> Select your line and enter the remaining pounds on the job</p>
          <p><strong className="text-slate-300">2.</strong> Enter line parameters (width, gauge, FPM) to calculate output rate</p>
          <p><strong className="text-slate-300">3.</strong> Adjust layer blend % and hopper usage % if different from defaults</p>
          <p><strong className="text-slate-300">4.</strong> The calculator determines:</p>
          <ul className="ml-6 space-y-1 list-disc">
            <li><strong className="text-primary">Changeover time</strong> = when the job ends</li>
            <li><strong className="text-warning">Shut-off time</strong> for each hopper = when to stop that hopper</li>
            <li>After your <strong>last refill</strong>, let each hopper run until its shut-off time</li>
            <li>At changeover, each hopper will have <strong>10% remaining</strong> (buffer to avoid running dry)</li>
          </ul>
        </div>
      </div>

      {/* Hopper Capacities Reference */}
      <div className="mt-4 rounded-lg border border-slate-700 bg-slate-800/50 p-4">
        <h3 className="mb-2 text-sm font-medium text-slate-300">Hopper Capacities</h3>
        <div className="text-sm text-slate-400 grid grid-cols-2 gap-4">
          <div>
            <p className="font-medium text-slate-300">Main Hoppers</p>
            <p>{MAIN_HOPPER_CAPACITY} lbs capacity</p>
            <p>10% reserve = {MAIN_HOPPER_CAPACITY * 0.1} lbs</p>
          </div>
          <div>
            <p className="font-medium text-slate-300">Additive Hoppers</p>
            <p>{ADDITIVE_HOPPER_CAPACITY} lbs capacity</p>
            <p>10% reserve = {ADDITIVE_HOPPER_CAPACITY * 0.1} lbs</p>
          </div>
        </div>
      </div>
    </div>
  );
}

export default ResinTimeout;
