import { useState } from 'react';

export default function PortComponent({ portData }) {
  const [isExpanded, setIsExpanded] = useState(false);
  
  const port = {
    puerto: portData.numero,
    name: portData.producto,
    product: portData.producto,
    version: portData.version,
    cpe: portData.cpe,
    state: portData.state,
  };
  
  const sortedCves = portData.cves.sort((a, b) => {
    try {
      const aScore = a.cvss_score?.score || 0;
      const bScore = b.cvss_score?.score || 0;
      return bScore - aScore;
    } catch (e) {
      return 0;
    }
  });

  const severityCounts = sortedCves.reduce((acc, cve) => {
    try {
      const severity = cve.cvss_score?.severity || "UNKNOWN";
      acc[severity] = (acc[severity] || 0) + 1;
      return acc;
    } catch (e) {
      acc["UNKNOWN"] = (acc["UNKNOWN"] || 0) + 1;
      return acc;
    }
  }, {});

  return (
    <div className="mb-6 border border-white/20 rounded-xl overflow-hidden">
      <div 
        className="bg-white/10 p-4 flex justify-between items-center cursor-pointer hover:bg-white/20 transition-colors"
        onClick={() => setIsExpanded(!isExpanded)}
        role="button"
        tabIndex="0"
      >
        <div className="flex items-center gap-4">
          <div className="flex items-center justify-center bg-white/20 p-3 w-[52px] rounded-full">
            <p className="font-bold text-lg">{port.puerto}</p>
          </div>
          <div>
            <h3 className="font-bold">
              {port.name} ({port.product} {port.version})
            </h3>
            <p className="text-sm text-white/70">{port.cpe}</p>
          </div>
        </div>
        <div className="flex items-center gap-3">
          <span
            className={`px-3 py-1 rounded-full text-sm ${
              port.state === "open"
                ? "bg-green-500/20 text-green-400"
                : "bg-red-500/20 text-red-400"
            }`}
          >
            {port.state}
          </span>
          <div className="flex items-center gap-2">
            <span className="text-sm text-white/70">
              {sortedCves.length} vulnerabilidades
            </span>
            <svg
              className={`w-5 h-5 transform transition-transform ${
                isExpanded ? 'rotate-180' : ''
              }`}
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M19 9l-7 7-7-7"
              />
            </svg>
          </div>
        </div>
      </div>

      {isExpanded && (
        <div className="p-4 border-t border-white/10 bg-white/5">
          <div className="flex gap-3 mb-4">
            {severityCounts.CRITICAL > 0 && (
              <div className="bg-red-900/30 text-red-400 px-3 py-1 rounded-lg text-sm">
                {severityCounts.CRITICAL} Críticas
              </div>
            )}
            {severityCounts.HIGH > 0 && (
              <div className="bg-orange-900/30 text-orange-400 px-3 py-1 rounded-lg text-sm">
                {severityCounts.HIGH} Altas
              </div>
            )}
            {severityCounts.MEDIUM > 0 && (
              <div className="bg-yellow-900/30 text-yellow-400 px-3 py-1 rounded-lg text-sm">
                {severityCounts.MEDIUM} Medias
              </div>
            )}
            {severityCounts.LOW > 0 && (
              <div className="bg-blue-900/30 text-blue-400 px-3 py-1 rounded-lg text-sm">
                {severityCounts.LOW} Bajas
              </div>
            )}
          </div>

          <div className="space-y-3">
            {sortedCves.map((cve) => {
              const cvssData = cve.cvss_score;
              let severityColor = "text-gray-400";
              let severityBg = "bg-gray-800/50";

              if (cvssData?.severity === "CRITICAL") {
                severityColor = "text-red-400";
                severityBg = "bg-red-900/30";
              } else if (cvssData?.severity === "HIGH") {
                severityColor = "text-orange-400";
                severityBg = "bg-orange-900/30";
              } else if (cvssData?.severity === "MEDIUM") {
                severityColor = "text-yellow-400";
                severityBg = "bg-yellow-900/30";
              } else if (cvssData?.severity === "LOW") {
                severityColor = "text-blue-400";
                severityBg = "bg-blue-900/30";
              }

              return (
                <div
                  key={cve.id}
                  className="border border-white/10 rounded-lg p-4 bg-white/5 hover:bg-white/10 transition-colors"
                >
                  <div className="flex justify-between items-start mb-2">
                    <h4 className="font-medium">{cve.id}</h4>
                    <div
                      className={`${severityBg} ${severityColor} px-3 py-1 rounded-lg text-sm flex items-center gap-1`}
                    >
                      <span>{cvssData?.score || "?"}</span>
                      <span className="text-xs">({cvssData?.severity || "UNKNOWN"})</span>
                    </div>
                  </div>
                  <p className="text-sm text-white/70 mb-3 line-clamp-2">
                    {cve.descripcion}
                  </p>
                  <div className="flex justify-between items-center text-xs text-white/50">
                    <span>
                      Publicado: {new Date(cve.published).toLocaleDateString()}
                    </span>
                    <a
                      href={`https://nvd.nist.gov/vuln/detail/${cve.id}`}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-blue-400 hover:underline"
                    >
                      Ver detalles
                    </a>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}