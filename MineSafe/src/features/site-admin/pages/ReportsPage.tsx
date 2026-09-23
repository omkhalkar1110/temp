import React, { useEffect, useState } from 'react';
import {
  FileText,
  RefreshCw,
  AlertTriangle,
  Truck,
  ShieldAlert,
  Activity,
  Radio,
  Clock,
  CheckCircle2,
} from 'lucide-react';
import { apiClient } from '../../../services/api';
import { useSiteStore } from '../../../store/siteStore';

interface HealthData {
  status: string;
  version: string;
  mode: string;
  timestamp: string;
  services: {
    database: string;
    hardware: string;
    simulator: string;
    weather: string;
    ml: string;
  };
  hardware: {
    connected: boolean;
    port: string | null;
    packetCount: number;
  };
}

interface HardwareStatus {
  connected: boolean;
  connectionState: string;
  serialPort: string | null;
  baudRate: number;
  packetCount: number;
  lastPacketAt: string | null;
  gatewayId: string;
  sensorNodeId: string;
  latestState?: {
    raw?: {
      distanceCm: number | null;
      distanceM: number | null;
      accelX: number | null;
      accelY: number | null;
    };
    derived?: {
      approachRateMps: number;
      motionState: string;
      accelMagnitude: number | null;
    };
  };
}

interface VehicleData {
  id: string;
  name: string;
  status: string;
  telemetry?: {
    riskScorePercent?: number;
    riskLevel?: string;
  };
}

interface AlertData {
  id: string;
  severity: string;
  status: string;
  timestamp: string;
}

function fmtTime(iso: string | null | undefined) {
  if (!iso) return 'N/A';
  return new Date(iso).toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit', second: '2-digit' });
}

const StatBox: React.FC<{ label: string; value: string | number; sub?: string; cls?: string }> = ({ label, value, sub, cls }) => (
  <div className="bg-white border border-slate-200 rounded-2xl p-4 shadow-sm">
    <div className="text-[10px] font-mono text-slate-400 uppercase tracking-wide">{label}</div>
    <div className={`text-2xl font-black mt-1 ${cls || 'text-slate-900'}`}>{value}</div>
    {sub && <div className="text-[10px] font-mono text-slate-400 mt-0.5">{sub}</div>}
  </div>
);

const ServiceRow: React.FC<{ name: string; status: string }> = ({ name, status }) => {
  const ok = ['ONLINE', 'LIVE', 'CONNECTED', 'ENABLED', 'RUNNING', 'ACTIVE'].includes(status);
  const warn = ['FALLBACK_READY', 'STALE', 'DEGRADED', 'PAUSED'].includes(status);
  return (
    <div className="flex items-center justify-between py-2 px-3 rounded-xl bg-slate-50/60 border border-slate-200">
      <span className="text-xs font-mono text-slate-600">{name}</span>
      <span className={`text-[10px] font-mono font-bold px-2 py-0.5 rounded-full border ${
        ok   ? 'bg-emerald-50 text-emerald-700 border-emerald-200' :
        warn ? 'bg-amber-50 text-amber-700 border-amber-200' :
               'bg-slate-100 text-slate-500 border-slate-200'
      }`}>{status}</span>
    </div>
  );
};

export const ReportsPage: React.FC = () => {
  const { selectedSite } = useSiteStore();
  const siteId = selectedSite?.id || 'site-kirandul-01';

  const [health, setHealth] = useState<HealthData | null>(null);
  const [hw, setHw] = useState<HardwareStatus | null>(null);
  const [vehicles, setVehicles] = useState<VehicleData[]>([]);
  const [alerts, setAlerts] = useState<AlertData[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [refreshedAt, setRefreshedAt] = useState<Date | null>(null);
  const [refreshKey, setRefreshKey] = useState(0);

  useEffect(() => {
    let cancelled = false;

    const loadReports = async () => {
      try {
        const [healthRes, hwRes, vehiclesRes, alertsRes] = await Promise.allSettled([
          apiClient.get<HealthData>('/health'),
          apiClient.get<HardwareStatus>('/hardware/status'),
          apiClient.get<VehicleData[]>(`/sites/${siteId}/vehicles`),
          apiClient.get<AlertData[]>(`/sites/${siteId}/alerts`),
        ]);

        if (cancelled) return;

        if (healthRes.status === 'fulfilled') setHealth(healthRes.value.data);
        if (hwRes.status === 'fulfilled') setHw(hwRes.value.data);
        if (vehiclesRes.status === 'fulfilled') setVehicles(vehiclesRes.value.data || []);
        if (alertsRes.status === 'fulfilled') setAlerts(alertsRes.value.data || []);

        setError(null);
        setRefreshedAt(new Date());
      } catch (err: any) {
        if (cancelled) return;
        setError(err?.message || 'Unable to reach backend');
      } finally {
        if (!cancelled) {
          setLoading(false);
        }
      }
    };

    loadReports();

    return () => {
      cancelled = true;
    };
  }, [siteId, refreshKey]);

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] gap-3">
        <RefreshCw className="w-8 h-8 text-blue-500 animate-spin" />
        <p className="text-sm font-mono text-slate-500">Loading reports…</p>
      </div>
    );
  }

  if (error && !health) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[60vh] gap-3 text-center px-4">
        <AlertTriangle className="w-10 h-10 text-red-400" />
        <h2 className="text-xl font-bold text-slate-900">Unable to reach backend</h2>
        <p className="text-sm text-slate-500 font-mono">{error}</p>
        <button onClick={() => { setLoading(true); setRefreshKey(k => k + 1); }} className="px-4 py-2 rounded-xl bg-blue-600 text-white text-sm font-bold hover:bg-blue-700">Retry</button>
      </div>
    );
  }

  const activeAlerts = alerts.filter(a => a.status === 'ACTIVE').length;
  const criticalAlerts = alerts.filter(a => a.severity === 'CRITICAL').length;
  const resolvedAlerts = alerts.filter(a => a.status === 'RESOLVED').length;
  const byStatus = vehicles.reduce<Record<string, number>>((acc, v) => {
    acc[v.status] = (acc[v.status] || 0) + 1;
    return acc;
  }, {});

  const raw = hw?.latestState?.raw;
  const derived = hw?.latestState?.derived;

  return (
    <div className="space-y-5 max-w-7xl mx-auto pb-12 font-sans">

      {/* Header */}
      <div className="bg-white border border-slate-200 rounded-3xl p-5 shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 rounded-2xl bg-amber-50 border border-amber-200 flex items-center justify-center shrink-0">
            <FileText className="w-6 h-6 text-amber-600" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="text-xs font-mono font-bold px-2 py-0.5 rounded bg-amber-50 text-amber-700 border border-amber-200">REPORTS</span>
              <span className="text-xs font-mono text-slate-400">System Status Dashboard</span>
            </div>
            <h1 className="text-xl font-black text-slate-900 tracking-tight mt-0.5">3rd Vision Operations Report</h1>
            <p className="text-xs text-slate-400 font-mono">
              {selectedSite?.name || 'Kirandul Iron Ore Complex'} · {health?.mode || 'N/A'} · v{health?.version || 'N/A'}
            </p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <button
            onClick={() => setRefreshKey(k => k + 1)}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-slate-100 border border-slate-200 text-xs font-mono text-slate-600 hover:bg-slate-200 transition-colors"
          >
            <RefreshCw className="w-3.5 h-3.5" />
            Refresh
          </button>
          {refreshedAt && (
            <span className="text-xs font-mono text-slate-400 flex items-center gap-1">
              <Clock className="w-3 h-3" />
              {fmtTime(refreshedAt.toISOString())}
            </span>
          )}
        </div>
      </div>

      {/* Fleet summary */}
      <div>
        <h2 className="text-sm font-bold text-slate-700 mb-3 flex items-center gap-2">
          <Truck className="w-4 h-4 text-slate-400" /> Fleet Overview
        </h2>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
          <StatBox label="Total Vehicles" value={vehicles.length} sub="Kirandul fleet" />
          <StatBox label="Safe" value={byStatus.SAFE || 0} cls="text-emerald-700" sub="Operating normally" />
          <StatBox label="Warning" value={byStatus.WARNING || 0} cls="text-amber-700" sub="Elevated risk" />
          <StatBox label="High Risk / Critical" value={(byStatus.HIGH_RISK || 0) + (byStatus.CRITICAL || 0)} cls={(byStatus.HIGH_RISK || 0) + (byStatus.CRITICAL || 0) > 0 ? 'text-red-700' : 'text-emerald-700'} sub="Requires attention" />
        </div>
      </div>

      {/* Alert summary */}
      <div>
        <h2 className="text-sm font-bold text-slate-700 mb-3 flex items-center gap-2">
          <ShieldAlert className="w-4 h-4 text-slate-400" /> Alert Summary
        </h2>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
          <StatBox label="Total Alerts" value={alerts.length} sub="All time" />
          <StatBox label="Active" value={activeAlerts} cls={activeAlerts > 0 ? 'text-red-600' : 'text-emerald-600'} sub="Require response" />
          <StatBox label="Critical" value={criticalAlerts} cls={criticalAlerts > 0 ? 'text-red-700 font-black' : 'text-slate-700'} sub="Highest severity" />
          <StatBox label="Resolved" value={resolvedAlerts} cls="text-emerald-700" sub="Closed" />
        </div>
      </div>

      {/* Hardware telemetry summary */}
      <div>
        <h2 className="text-sm font-bold text-slate-700 mb-3 flex items-center gap-2">
          <Radio className="w-4 h-4 text-slate-400" /> Hardware Telemetry Summary
        </h2>
        <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
          <StatBox
            label="Packets Received"
            value={hw?.packetCount?.toLocaleString() ?? 'N/A'}
            sub={hw?.connected ? 'Hardware connected' : 'Hardware disconnected'}
            cls={hw?.connected ? 'text-emerald-700' : 'text-slate-500'}
          />
          <StatBox
            label="Serial Port"
            value={hw?.serialPort ?? 'N/A'}
            sub={hw?.baudRate ? `${hw.baudRate} baud` : '—'}
          />
          <StatBox
            label="Connection State"
            value={hw?.connectionState ?? 'N/A'}
            cls={hw?.connectionState === 'CONNECTED' ? 'text-emerald-700' : 'text-slate-500'}
          />
          <StatBox
            label="Last Distance (HC-SR04)"
            value={raw?.distanceCm != null ? `${Number(raw.distanceCm).toFixed(2)} cm` : 'N/A'}
            sub={raw?.distanceM != null ? `${Number(raw.distanceM).toFixed(3)} m` : undefined}
            cls="text-blue-700"
          />
          <StatBox
            label="Approach Rate"
            value={derived?.approachRateMps != null ? `${Number(derived.approachRateMps).toFixed(3)} m/s` : 'N/A'}
            sub="Time-differentiated"
          />
          <StatBox
            label="Motion State"
            value={derived?.motionState ?? 'N/A'}
            cls={derived?.motionState === 'HIGH_VIBRATION' ? 'text-red-600' : derived?.motionState === 'IN_MOTION' ? 'text-amber-600' : 'text-emerald-600'}
          />
        </div>
        <p className="text-[10px] font-mono text-slate-400 mt-2 px-1">
          ℹ GPS, speed, fuel, engine temperature, heading — not available from current hardware (HC-SR04 + MPU6500 partial)
        </p>
      </div>

      {/* System health */}
      <div>
        <h2 className="text-sm font-bold text-slate-700 mb-3 flex items-center gap-2">
          <Activity className="w-4 h-4 text-slate-400" /> System Health
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
          <div className="bg-white border border-slate-200 rounded-2xl p-5 shadow-sm space-y-2">
            <h3 className="text-xs font-mono font-bold text-slate-500 uppercase tracking-wide mb-3">Backend Services</h3>
            {health ? (
              <>
                <ServiceRow name="Database (Supabase)" status={health.services.database} />
                <ServiceRow name="Hardware Gateway" status={health.services.hardware} />
                <ServiceRow name="Weather Service" status={health.services.weather} />
                <ServiceRow name="ML Risk Service" status={health.services.ml} />
                <ServiceRow name="Simulation Engine" status={health.services.simulator} />
                <ServiceRow name="Real-time (Socket.IO)" status={(health.services as any).realtime || 'ACTIVE'} />
              </>
            ) : (
              <p className="text-sm text-slate-400 font-mono">No data available</p>
            )}
          </div>

          <div className="bg-white border border-slate-200 rounded-2xl p-5 shadow-sm">
            <h3 className="text-xs font-mono font-bold text-slate-500 uppercase tracking-wide mb-3">Recent Alerts Log</h3>
            {alerts.length === 0 ? (
              <div className="flex flex-col items-center justify-center py-8 gap-2 text-center">
                <CheckCircle2 className="w-8 h-8 text-emerald-300" />
                <p className="text-slate-400 text-sm font-mono">No active alerts</p>
              </div>
            ) : (
              <div className="space-y-1.5 max-h-64 overflow-y-auto">
                {alerts.slice(0, 12).map(a => (
                  <div key={a.id} className="flex items-center justify-between gap-2 px-3 py-1.5 rounded-lg border border-slate-100 bg-slate-50/50 text-xs font-mono">
                    <span className={`text-[9px] font-bold px-1.5 py-0.5 rounded-full border ${
                      a.severity === 'CRITICAL' ? 'bg-red-50 text-red-700 border-red-200' :
                      a.severity === 'HIGH'     ? 'bg-red-50 text-red-600 border-red-100' :
                      a.severity === 'WARNING'  ? 'bg-amber-50 text-amber-700 border-amber-200' :
                                                  'bg-blue-50 text-blue-600 border-blue-100'
                    }`}>{a.severity}</span>
                    <span className={`text-[9px] font-bold px-1.5 py-0.5 rounded-full border ${
                      a.status === 'ACTIVE'       ? 'bg-red-50 text-red-600 border-red-100' :
                      a.status === 'ACKNOWLEDGED' ? 'bg-amber-50 text-amber-600 border-amber-100' :
                                                    'bg-emerald-50 text-emerald-600 border-emerald-100'
                    }`}>{a.status}</span>
                    <span className="text-slate-400 flex-1 truncate">{a.id}</span>
                    <span className="text-slate-300 shrink-0">{fmtTime(a.timestamp)}</span>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>

    </div>
  );
};
