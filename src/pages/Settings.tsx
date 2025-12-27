import { useState } from "react";
import { Save, RotateCcw, Download, Upload, Check } from "lucide-react";
import { Card, CardHeader, CardBody, CardFooter } from "../components/ui/Card";
import { LINE_PROFILES } from "../data/lineProfiles";
import { MATERIALS } from "../data/materialPresets";

export function Settings() {
  const [defaultLine, setDefaultLine] = useState<string | null>(null);
  const [defaultMaterial, setDefaultMaterial] = useState<string>("ldpe");
  const [saved, setSaved] = useState(false);

  const handleSave = () => {
    // Save to localStorage
    localStorage.setItem("isoflex_preferences", JSON.stringify({
      defaultLine,
      defaultMaterial,
    }));
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  };

  const handleReset = () => {
    setDefaultLine(null);
    setDefaultMaterial("ldpe");
    localStorage.removeItem("isoflex_preferences");
  };

  const handleExport = () => {
    const data = {
      preferences: {
        defaultLine,
        defaultMaterial,
      },
      exportedAt: new Date().toISOString(),
      version: "0.1.0",
    };

    const blob = new Blob([JSON.stringify(data, null, 2)], { type: "application/json" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a");
    a.href = url;
    a.download = `isoflex-settings-${new Date().toISOString().split("T")[0]}.json`;
    a.click();
    URL.revokeObjectURL(url);
  };

  const handleImport = () => {
    const input = document.createElement("input");
    input.type = "file";
    input.accept = ".json";
    input.onchange = (e) => {
      const file = (e.target as HTMLInputElement).files?.[0];
      if (file) {
        const reader = new FileReader();
        reader.onload = (e) => {
          try {
            const data = JSON.parse(e.target?.result as string);
            if (data.preferences) {
              setDefaultLine(data.preferences.defaultLine);
              setDefaultMaterial(data.preferences.defaultMaterial);
              handleSave();
            }
          } catch (error) {
            alert("Invalid settings file");
          }
        };
        reader.readAsText(file);
      }
    };
    input.click();
  };

  return (
    <div className="mx-auto max-w-2xl space-y-6">
      {/* Preferences */}
      <Card>
        <CardHeader
          title="Preferences"
          subtitle="Configure default settings"
        />

        <CardBody className="space-y-6">
          {/* Default Line */}
          <div>
            <label className="label">Default Production Line</label>
            <div className="flex flex-wrap gap-2">
              <button
                onClick={() => setDefaultLine(null)}
                className={`rounded-lg px-4 py-2 text-sm font-medium transition-colors ${
                  defaultLine === null
                    ? "bg-primary text-white"
                    : "bg-slate-700 text-slate-300 hover:bg-slate-600"
                }`}
              >
                None
              </button>
              {LINE_PROFILES.map((line) => (
                <button
                  key={line.id}
                  onClick={() => setDefaultLine(line.id)}
                  className={`rounded-lg px-4 py-2 text-sm font-medium transition-colors ${
                    defaultLine === line.id
                      ? "bg-primary text-white"
                      : "bg-slate-700 text-slate-300 hover:bg-slate-600"
                  }`}
                >
                  {line.name}
                </button>
              ))}
            </div>
            <p className="mt-2 text-sm text-slate-500">
              Sets the default line when opening tools like Resin Timeout
            </p>
          </div>

          {/* Default Material */}
          <div>
            <label className="label">Default Material</label>
            <div className="flex flex-wrap gap-2">
              {MATERIALS.map((material) => (
                <button
                  key={material.id}
                  onClick={() => setDefaultMaterial(material.id)}
                  className={`rounded-lg px-4 py-2 text-sm font-medium transition-colors ${
                    defaultMaterial === material.id
                      ? "bg-primary text-white"
                      : "bg-slate-700 text-slate-300 hover:bg-slate-600"
                  }`}
                >
                  {material.name}
                </button>
              ))}
            </div>
            <p className="mt-2 text-sm text-slate-500">
              Sets the default material for weight calculations
            </p>
          </div>
        </CardBody>

        <CardFooter className="flex items-center justify-between">
          <button onClick={handleReset} className="btn-ghost">
            <RotateCcw size={18} />
            Reset to Defaults
          </button>

          <button onClick={handleSave} className="btn-primary">
            {saved ? <Check size={18} /> : <Save size={18} />}
            {saved ? "Saved!" : "Save Preferences"}
          </button>
        </CardFooter>
      </Card>

      {/* Export / Import */}
      <Card>
        <CardHeader
          title="Data Backup"
          subtitle="Export or import your settings"
        />

        <CardBody>
          <p className="mb-4 text-sm text-slate-400">
            Export your settings to a file for backup or transfer to another computer.
          </p>

          <div className="flex gap-4">
            <button onClick={handleExport} className="btn-secondary flex-1">
              <Download size={18} />
              Export Settings
            </button>

            <button onClick={handleImport} className="btn-secondary flex-1">
              <Upload size={18} />
              Import Settings
            </button>
          </div>
        </CardBody>
      </Card>

      {/* About */}
      <Card>
        <CardHeader
          title="About ISOFlex Dashboard"
          subtitle="Version information"
        />

        <CardBody>
          <div className="space-y-2 text-sm text-slate-400">
            <p><strong className="text-slate-300">Version:</strong> 0.1.0</p>
            <p><strong className="text-slate-300">Build:</strong> Phase 1</p>
            <p className="pt-2">
              Production floor tool for blown film extrusion operators.
              Designed for ease of use during long shifts.
            </p>
          </div>
        </CardBody>
      </Card>

      {/* Line Profiles Reference */}
      <Card>
        <CardHeader
          title="Line Profiles"
          subtitle="Configured production lines"
        />

        <CardBody>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-slate-700 text-left text-slate-400">
                  <th className="pb-2 pr-4">Line</th>
                  <th className="pb-2 pr-4">Die #</th>
                  <th className="pb-2 pr-4">Die Size</th>
                  <th className="pb-2 pr-4">Layers</th>
                  <th className="pb-2">Speed Range</th>
                </tr>
              </thead>
              <tbody className="text-slate-300">
                {LINE_PROFILES.map((line) => (
                  <tr key={line.id} className="border-b border-slate-700/50">
                    <td className="py-2 pr-4 font-medium">{line.name}</td>
                    <td className="py-2 pr-4">{line.dieNumber}</td>
                    <td className="py-2 pr-4">{line.dieSize}"</td>
                    <td className="py-2 pr-4">{line.layerCount} ({line.layerLabels.join(", ")})</td>
                    <td className="py-2">{line.typicalSpeedRange.min}-{line.typicalSpeedRange.max} FPM</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </CardBody>
      </Card>
    </div>
  );
}

export default Settings;
