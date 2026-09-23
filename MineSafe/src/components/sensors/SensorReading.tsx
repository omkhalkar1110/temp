import React from 'react';
import { Sensor } from '../../types';
import { Radio, Eye, Navigation, CloudFog } from 'lucide-react';

interface SensorReadingProps {
  sensor: Sensor;
}

export const SensorReading: React.FC<SensorReadingProps> = ({ sensor }) => {
  const { type, telemetry } = sensor;

  if (type === 'RADAR' && telemetry.radar) {
    const { distanceMeters, relativeSpeedKmh, objectsDetectedCount, detectionRangeMeters } = telemetry.radar;
    return (
      <div className="space-y-2">
        <div className="flex items-center gap-2 text-xs font-mono text-blue-600 font-bold uppercase">
          <Radio className="w-4 h-4" /> 77GHz Radar Telemetry
        </div>
        <div className="grid grid-cols-2 gap-2 text-xs font-mono">
          <div className="bg-slate-50 p-2.5 rounded-xl border border-slate-200">
            <div className="text-[10px] text-slate-500">Distance</div>
            <div className="text-xl font-extrabold text-slate-900">{distanceMeters}m</div>
          </div>
          <div className="bg-slate-50 p-2.5 rounded-xl border border-slate-200">
            <div className="text-[10px] text-slate-500">Relative Closing Speed</div>
            <div className={`text-xl font-extrabold ${relativeSpeedKmh > 0 ? 'text-red-600' : 'text-emerald-700'}`}>
              {relativeSpeedKmh > 0 ? `+${relativeSpeedKmh}` : relativeSpeedKmh} km/h
            </div>
          </div>
          <div className="bg-slate-50 p-2.5 rounded-xl border border-slate-200">
            <div className="text-[10px] text-slate-500">Objects Detected</div>
            <div className="text-base font-bold text-blue-600">{objectsDetectedCount} Tracked</div>
          </div>
          <div className="bg-slate-50 p-2.5 rounded-xl border border-slate-200">
            <div className="text-[10px] text-slate-500">Detection Range</div>
            <div className="text-base font-bold text-slate-800">{detectionRangeMeters}m Max</div>
          </div>
        </div>
      </div>
    );
  }

  if (type === 'LIDAR' && telemetry.lidar) {
    const { objectsDetectedCount, scanRangeMeters, nearestObjectDistanceMeters, pointCloudHealthPercent } = telemetry.lidar;
    return (
      <div className="space-y-2">
        <div className="flex items-center gap-2 text-xs font-mono text-purple-700 font-bold uppercase">
          <Eye className="w-4 h-4" /> 3D LiDAR Point-Cloud Telemetry
        </div>
        <div className="grid grid-cols-2 gap-2 text-xs font-mono">
          <div className="bg-slate-50 p-2.5 rounded-xl border border-slate-200">
            <div className="text-[10px] text-slate-500">Nearest Object</div>
            <div className="text-xl font-extrabold text-slate-900">{nearestObjectDistanceMeters}m</div>
          </div>
          <div className="bg-slate-50 p-2.5 rounded-xl border border-slate-200">
            <div className="text-[10px] text-slate-500">Scan Range</div>
            <div className="text-xl font-extrabold text-purple-700">{scanRangeMeters}m</div>
          </div>
          <div className="bg-slate-50 p-2.5 rounded-xl border border-slate-200">
            <div className="text-[10px] text-slate-500">Objects Identified</div>
            <div className="text-base font-bold text-blue-600">{objectsDetectedCount} Targets</div>
          </div>
          <div className="bg-slate-50 p-2.5 rounded-xl border border-slate-200">
            <div className="text-[10px] text-slate-500">Cloud Quality</div>
            <div className="text-base font-bold text-emerald-700">{pointCloudHealthPercent}%</div>
          </div>
        </div>
      </div>
    );
  }

  if (type === 'GPS' && telemetry.gps) {
    const { latitude, longitude, speedKmh, headingDegrees, accuracyMeters } = telemetry.gps;
    return (
      <div className="space-y-2">
        <div className="flex items-center gap-2 text-xs font-mono text-emerald-700 font-bold uppercase">
          <Navigation className="w-4 h-4" /> RTK-DGPS Satellite Telemetry
        </div>
        <div className="grid grid-cols-2 gap-2 text-xs font-mono">
          <div className="bg-slate-50 p-2.5 rounded-xl border border-slate-200 col-span-2">
            <div className="text-[10px] text-slate-500">Coordinates (Lat / Lng)</div>
            <div className="text-sm font-extrabold text-slate-900">{latitude.toFixed(4)}° N, {longitude.toFixed(4)}° E</div>
          </div>
          <div className="bg-slate-50 p-2.5 rounded-xl border border-slate-200">
            <div className="text-[10px] text-slate-500">Telemetry Speed</div>
            <div className="text-xl font-extrabold text-emerald-700">{speedKmh} km/h</div>
          </div>
          <div className="bg-slate-50 p-2.5 rounded-xl border border-slate-200">
            <div className="text-[10px] text-slate-500">Heading & Accuracy</div>
            <div className="text-sm font-bold text-slate-800">{headingDegrees}° (±{accuracyMeters * 100}cm)</div>
          </div>
        </div>
      </div>
    );
  }

  if (type === 'VISIBILITY' && telemetry.visibility) {
    const { visibilityMeters, fogLevelPercent, humidityPercent, status } = telemetry.visibility;
    return (
      <div className="space-y-2">
        <div className="flex items-center gap-2 text-xs font-mono text-amber-800 font-bold uppercase">
          <CloudFog className="w-4 h-4" /> Transmissometer Fog Telemetry
        </div>
        <div className="grid grid-cols-2 gap-2 text-xs font-mono">
          <div className="bg-slate-50 p-2.5 rounded-xl border border-slate-200">
            <div className="text-[10px] text-slate-500">Optical Visibility</div>
            <div className={`text-xl font-extrabold ${visibilityMeters < 5 ? 'text-red-600' : 'text-emerald-700'}`}>
              {visibilityMeters}m
            </div>
          </div>
          <div className="bg-slate-50 p-2.5 rounded-xl border border-slate-200">
            <div className="text-[10px] text-slate-500">Fog Obscuration</div>
            <div className="text-xl font-extrabold text-amber-600">{fogLevelPercent}%</div>
          </div>
          <div className="bg-slate-50 p-2.5 rounded-xl border border-slate-200">
            <div className="text-[10px] text-slate-500">Humidity</div>
            <div className="text-base font-bold text-slate-700">{humidityPercent}%</div>
          </div>
          <div className="bg-slate-50 p-2.5 rounded-xl border border-slate-200">
            <div className="text-[10px] text-slate-500">Hazard State</div>
            <div className="text-base font-bold text-red-600 uppercase">{status}</div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="p-3 bg-slate-50 rounded-xl border border-slate-200 text-xs font-mono text-slate-500">
      Telemetry active • Processing telemetry stream...
    </div>
  );
};
