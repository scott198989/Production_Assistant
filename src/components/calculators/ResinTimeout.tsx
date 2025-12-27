import { useState, useMemo, useEffect } from "react";
import { Timer, RotateCcw, ChevronDown, ChevronRight, AlertCircle, AlertTriangle, CheckCircle } from "lucide-react";
import { Card, CardHeader, CardBody, CardFooter } from "../ui/Card";
import { NumberInput } from "../ui/NumberInput";
import { LINE_PROFILES } from "../../data/lineProfiles";
import { calculatePoundsPerHour, calculateHopperPPH } from "../../utils/formulas";

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
  pph: number;
  currentPounds: number;
  poundsToConsume: number;
  tenPercentBuffer: number;
  drainPounds: number;
  shutOffTime: Date | null;
  hoursUntilShutOff: number | null;
  status: "ok" | "warning" | "critical";
  message: string;
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

    // Calculate job end time
    const hoursUntilJobEnd = remainingPounds / totalPPH;
    const jobEndTime = new Date(startDateTime.getTime() + hoursUntilJobEnd * 60 * 60 * 1000);

    // Drain time in hours
    const drainTimeHours = drainTime / 60;

    // Calculate for each hopper
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
        const currentPounds = typeof hopper.poundsRemaining === "number"
          ? hopper.poundsRemaining
          : parseFloat(hopper.poundsRemaining as string);

        if (isNaN(usagePercent) || isNaN(currentPounds) || usagePercent <= 0) return;

        const hopperPPH = calculateHopperPPH(totalPPH, layerBlend, usagePercent);

        // 10% buffer = 10% of CURRENT hopper contents (what we want left at changeover)
        const tenPercentBuffer = currentPounds * 0.10;

        // Drain: material consumed during drain time after hopper shuts off
        const drainPounds = hopperPPH * drainTimeHours;

        // At shut-off time, hopper must have: 10% buffer + drain pounds remaining
        // So during drain, the drain pounds are consumed, leaving exactly 10%
        const poundsAtShutOff = tenPercentBuffer + drainPounds;

        // Pounds we can consume from hopper before shutting off
        const poundsToConsume = currentPounds - poundsAtShutOff;

        // Hours of consumption until shut-off
        const hoursOfConsumption = poundsToConsume / hopperPPH;

        let status: "ok" | "warning" | "critical";
        let message: string;
        let shutOffTime: Date | null = null;
        let hoursUntilShutOff: number | null = null;

        if (currentPounds <= 0) {
          status = "critical";
          message = "Empty - needs refill!";
        } else if (poundsToConsume <= 0) {
          // Not enough material to even start (current is already below what we need at shutoff)
          status = "critical";
          message = `Need ${Math.abs(poundsToConsume).toFixed(0)} more lbs`;
        } else if (hoursOfConsumption < hoursUntilJobEnd) {
          // Hopper will run out before job ends - this is normal, calculate shut-off time
          shutOffTime = new Date(startDateTime.getTime() + hoursOfConsumption * 60 * 60 * 1000);
          hoursUntilShutOff = hoursOfConsumption;

          // Warning if shut-off is within 30 minutes from now
          const now = new Date();
          const minutesUntilShutOff = (shutOffTime.getTime() - now.getTime()) / (1000 * 60);

          if (minutesUntilShutOff < 0) {
            status = "critical";
            message = "Past shut-off time!";
          } else if (minutesUntilShutOff < 30) {
            status = "warning";
            message = `Shut off in ${Math.round(minutesUntilShutOff)}min`;
          } else {
            status = "ok";
            message = formatTime(shutOffTime);
          }
        } else {
          // Hopper has more than enough - will run until job ends
          // Shut off at changeover time (or slightly before for drain)
          const hoursBeforeEnd = drainTimeHours;
          shutOffTime = new Date(jobEndTime.getTime() - hoursBeforeEnd * 60 * 60 * 1000);
          hoursUntilShutOff = hoursUntilJobEnd - hoursBeforeEnd;
          status = "ok";
          message = `${formatTime(shutOffTime)} (extra material)`;
        }

        hopperResults.push({
          layerId: layer.id,
          hopperId: hopper.id,
          hopperName: hopper.name,
          pph: hopperPPH,
          currentPounds,
          poundsToConsume,
          tenPercentBuffer,
          drainPounds,
          shutOffTime,
          hoursUntilShutOff,
          status,
          message,
        });
      });
    });

    if (hopperResults.length === 0) return null;

    // Sort by shut-off time (earliest first), null times at end
    const sortedResults = [...hopperResults].sort((a, b) => {
      if (!a.shutOffTime && !b.shutOffTime) return 0;
      if (!a.shutOffTime) return 1;
      if (!b.shutOffTime) return -1;
      return a.shutOffTime.getTime() - b.shutOffTime.getTime();
    });

    // Find first valid shut-off (changeover trigger)
    const firstShutOff = sortedResults.find((r) => r.shutOffTime && r.status !== "critical");

    // Calculate time from now
    const now = new Date();
    const hoursFromNow = (jobEndTime.getTime() - now.getTime()) / (1000 * 60 * 60);

    return {
      totalPPH,
      remainingPounds,
      hoursUntilJobEnd,
      jobEndTime,
      startDateTime,
      drainTimeMinutes: drainTime,
      hopperResults: sortedResults,
      firstShutOff,
      hoursFromNow,
      hasIssues: hopperResults.some((r) => r.status === "critical"),
    };
  }, [lineInputs, jobInputs, layers]);

  return (
    <div className="mx-auto max-w-4xl">
      <Card>
        <CardHeader
          title="Resin Timeout Calculator"
          subtitle="Calculate material changeover timing with 10% buffer"
          infoTooltip="Calculates when to shut off each hopper, leaving 10% buffer to avoid running dry"
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
                    hint="Pounds left to run"
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
                    hint="Material drain time"
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
                <h3 className="mb-3 text-sm font-medium text-slate-300">Layer Configuration</h3>
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
              {/* Issues Alert */}
              {timeoutData.hasIssues && (
                <div className="flex items-center gap-3 rounded-lg bg-danger/20 border border-danger/30 p-4">
                  <AlertTriangle className="text-danger flex-shrink-0" size={24} />
                  <div>
                    <p className="font-medium text-danger">Material Shortage Detected</p>
                    <p className="text-sm text-slate-300">One or more hoppers don't have enough material to complete the job with 10% buffer.</p>
                  </div>
                </div>
              )}

              {/* CHANGEOVER TIME - Main Result */}
              <div className="rounded-lg bg-primary/20 border-2 border-primary p-6 text-center">
                <p className="text-sm font-medium text-primary mb-1">Changeover Date/Time</p>
                <p className="text-3xl font-bold text-slate-100">
                  {formatDateTime(timeoutData.jobEndTime)}
                </p>
                <p className="text-sm text-slate-400 mt-2">
                  {formatDuration(timeoutData.hoursFromNow)} from now • {timeoutData.remainingPounds.toLocaleString()} lbs @ {timeoutData.totalPPH.toFixed(0)} PPH
                </p>
              </div>

              {/* Secondary Stats */}
              <div className="grid gap-4 sm:grid-cols-2">
                {/* Time Remaining */}
                <div className="rounded-lg bg-slate-700 p-4">
                  <div className="flex items-center gap-3">
                    <div className="rounded-full bg-success/20 p-2">
                      <Timer className="text-success" size={20} />
                    </div>
                    <div>
                      <p className="text-xs text-slate-400">Time Until Changeover</p>
                      <p className="text-lg font-bold text-slate-100">
                        {formatDuration(timeoutData.hoursFromNow)}
                      </p>
                    </div>
                  </div>
                </div>

                {/* First Shut-off */}
                {timeoutData.firstShutOff && (
                  <div className="rounded-lg bg-warning/20 border border-warning/30 p-4">
                    <div className="flex items-center gap-3">
                      <div className="rounded-full bg-warning/20 p-2">
                        <AlertCircle className="text-warning" size={20} />
                      </div>
                      <div>
                        <p className="text-xs text-slate-400">First Hopper Shut-off</p>
                        <p className="text-lg font-bold text-warning">
                          {timeoutData.firstShutOff.shutOffTime
                            ? formatTime(timeoutData.firstShutOff.shutOffTime)
                            : "N/A"
                          }
                        </p>
                        <p className="text-xs text-slate-300">
                          {timeoutData.firstShutOff.hopperName}
                        </p>
                      </div>
                    </div>
                  </div>
                )}
              </div>

              {/* Hopper Shut-off Schedule */}
              <div>
                <h4 className="mb-3 text-sm font-medium text-slate-300">Hopper Shut-off Schedule</h4>
                <p className="mb-3 text-xs text-slate-500">
                  Each hopper will shut off at the time shown, leaving 10% buffer + drain material. At changeover, each hopper will have exactly 10% remaining.
                </p>
                <div className="rounded-lg border border-slate-700 overflow-hidden overflow-x-auto">
                  <table className="w-full text-sm">
                    <thead className="bg-slate-800">
                      <tr className="text-left text-slate-400">
                        <th className="px-4 py-2 whitespace-nowrap">Hopper</th>
                        <th className="px-4 py-2 whitespace-nowrap">PPH</th>
                        <th className="px-4 py-2 whitespace-nowrap">Current</th>
                        <th className="px-4 py-2 whitespace-nowrap">10% Buffer</th>
                        <th className="px-4 py-2 whitespace-nowrap">Drain</th>
                        <th className="px-4 py-2 whitespace-nowrap">Shut-off Time</th>
                        <th className="px-4 py-2 whitespace-nowrap">Status</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-700">
                      {timeoutData.hopperResults.map((result) => (
                        <tr
                          key={`${result.layerId}-${result.hopperId}`}
                          className={`${
                            result.status === "critical" ? "bg-danger/10" :
                            result.status === "warning" ? "bg-warning/10" : ""
                          }`}
                        >
                          <td className="px-4 py-2 font-medium text-slate-200 whitespace-nowrap">
                            {result.hopperName}
                          </td>
                          <td className="px-4 py-2 text-slate-400 whitespace-nowrap">
                            {result.pph.toFixed(1)}
                          </td>
                          <td className="px-4 py-2 text-slate-300 whitespace-nowrap">
                            {result.currentPounds.toFixed(0)} lbs
                          </td>
                          <td className="px-4 py-2 text-slate-400 whitespace-nowrap">
                            {result.tenPercentBuffer.toFixed(1)} lbs
                          </td>
                          <td className="px-4 py-2 text-slate-400 whitespace-nowrap">
                            {result.drainPounds.toFixed(1)} lbs
                          </td>
                          <td className="px-4 py-2 whitespace-nowrap">
                            {result.shutOffTime ? (
                              <span className="font-bold text-lg text-slate-100">
                                {formatTime(result.shutOffTime)}
                              </span>
                            ) : (
                              <span className="text-slate-500">—</span>
                            )}
                          </td>
                          <td className="px-4 py-2">
                            <div className="flex items-center gap-2">
                              {result.status === "ok" && (
                                <CheckCircle size={16} className="text-success flex-shrink-0" />
                              )}
                              {result.status === "warning" && (
                                <AlertCircle size={16} className="text-warning flex-shrink-0" />
                              )}
                              {result.status === "critical" && (
                                <AlertTriangle size={16} className="text-danger flex-shrink-0" />
                              )}
                              <span className={`text-xs whitespace-nowrap ${
                                result.status === "ok" ? "text-success" :
                                result.status === "warning" ? "text-warning" : "text-danger"
                              }`}>
                                {result.message}
                              </span>
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>

            <div className="mt-4 flex justify-end">
              <button type="button" onClick={handleReset} className="btn-ghost">
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
          <p><strong className="text-slate-300">1. Enter job info:</strong> Remaining pounds on job, date/time, and drain time</p>
          <p><strong className="text-slate-300">2. Set line parameters:</strong> Width, gauge, and speed to calculate PPH output</p>
          <p><strong className="text-slate-300">3. Configure layers:</strong> Set blend % and hopper usage % for your recipe</p>
          <p><strong className="text-slate-300">4. Enter hopper levels:</strong> Current pounds in each hopper</p>
          <div className="pt-2 border-t border-slate-700 mt-3">
            <p className="font-medium text-slate-300 mb-1">The Result:</p>
            <p className="text-slate-500">
              <strong className="text-primary">Changeover time</strong> = when the job ends based on remaining pounds ÷ PPH.
            </p>
            <p className="text-slate-500 mt-1">
              Each hopper's <strong className="text-warning">shut-off time</strong> is calculated so that at changeover,
              exactly <strong className="text-warning">10% of current hopper contents</strong> remains.
              The drain time is accounted for—material that flows after shutting off the hopper.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

export default ResinTimeout;
