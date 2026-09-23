import React, { useState } from 'react';
import { ChevronDown, ChevronUp, Layers, ShieldCheck } from 'lucide-react';
import { MapEngine } from './types';

interface CadastralLegendProps {
  activeEngine?: MapEngine;
  isKeyValid?: boolean;
  totalParcels: number;
  possessedCount: number;
  inProgressCount: number;
  disputedCount: number;
}

export const CadastralLegend: React.FC<CadastralLegendProps> = ({
  activeEngine: _activeEngine,
  isKeyValid: _isKeyValid,
  totalParcels,
  possessedCount,
  inProgressCount,
  disputedCount,
}) => {
  const [collapsed, setCollapsed] = useState(false);

  return (
    <div
      id="cadastral-map-legend"
      className="absolute bottom-6 left-4 z-20 w-72 max-w-[calc(100vw-2rem)] bg-white/95 backdrop-blur-md text-stone-900 border border-stone-200 rounded-2xl p-3.5 shadow-xl select-none"
    >
      {/* Header & Collapse Toggle */}
      <div className="flex items-center justify-between gap-2 border-b border-stone-200 pb-2.5">
        <div className="flex items-center gap-2">
          <Layers className="w-4 h-4 text-amber-700" />
          <span className="font-bold text-xs tracking-tight text-stone-900">
            Cadastral GIS Legend
          </span>
        </div>

        <div className="flex items-center gap-2">
          {/* Active Engine Badge */}
          <span className="text-[9px] font-mono font-bold px-2 py-0.5 rounded-md border bg-emerald-50 text-emerald-800 border-emerald-300">
            OpenGIS Leaflet
          </span>

          <button
            onClick={() => setCollapsed(!collapsed)}
            className="text-stone-400 hover:text-stone-800 transition-colors cursor-pointer"
            title={collapsed ? 'Expand Legend' : 'Collapse Legend'}
          >
            {collapsed ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
          </button>
        </div>
      </div>

      {!collapsed && (
        <div className="mt-3 space-y-3 text-xs">
          {/* Statutory Parcel Status */}
          <div>
            <div className="flex items-center justify-between text-[10px] font-bold text-stone-500 uppercase tracking-wider mb-2">
              <span>Cadastral Acquisition</span>
              <span className="font-mono text-stone-700 font-semibold">{totalParcels} Total</span>
            </div>

            <div className="space-y-1.5 font-sans">
              <div className="flex items-center justify-between text-stone-700">
                <div className="flex items-center gap-2">
                  <span className="w-2.5 h-2.5 rounded-full bg-[#10B981] shadow-xs" />
                  <span>Possessed / Acquired</span>
                </div>
                <span className="font-mono text-[11px] text-emerald-700 font-semibold">
                  {possessedCount}
                </span>
              </div>

              <div className="flex items-center justify-between text-stone-700">
                <div className="flex items-center gap-2">
                  <span className="w-2.5 h-2.5 rounded-full bg-[#3B82F6] shadow-xs" />
                  <span>In Progress</span>
                </div>
                <span className="font-mono text-[11px] text-blue-700 font-semibold">
                  {inProgressCount}
                </span>
              </div>

              <div className="flex items-center justify-between text-stone-700">
                <div className="flex items-center gap-2">
                  <span className="w-2.5 h-2.5 rounded-full bg-[#EF4444] shadow-xs" />
                  <span>Disputed / Court Stay</span>
                </div>
                <span className="font-mono text-[11px] text-red-700 font-semibold">
                  {disputedCount}
                </span>
              </div>

              <div className="flex items-center justify-between text-stone-700">
                <div className="flex items-center gap-2">
                  <span className="w-2.5 h-2.5 rounded-full bg-[#F59E0B] ring-2 ring-amber-400 shadow-xs" />
                  <span>Active / Selected</span>
                </div>
                <span className="text-[10px] text-amber-700 font-mono font-medium">3.5px stroke</span>
              </div>
            </div>
          </div>

          {/* Corridor & Alignment Key */}
          <div className="pt-2 border-t border-stone-200">
            <div className="text-[10px] font-bold text-stone-500 uppercase tracking-wider mb-2">
              Corridor Alignments
            </div>

            <div className="space-y-1.5 font-sans text-[11px]">
              <div className="flex items-center gap-2 text-stone-700">
                <span className="w-4 h-1 bg-[#059669] rounded-full shrink-0" />
                <span className="truncate">Route A (Greenfield Bypass - 14.8 km)</span>
              </div>

              <div className="flex items-center gap-2 text-stone-700">
                <span className="w-4 h-0.5 border-t-2 border-dashed border-[#DC2626] shrink-0" />
                <span className="truncate">Route B (Brownfield Widening - 11.2 km)</span>
              </div>

              <div className="flex items-center gap-2 text-stone-700">
                <span className="w-3.5 h-3.5 rounded border border-dashed border-[#D97706] bg-[#FEF3C7] shrink-0" />
                <span className="truncate">Corridor RoW (60m Buffer Area)</span>
              </div>
            </div>
          </div>

          {/* Engine Architecture Badge */}
          <div className="pt-2 border-t border-stone-200 flex items-center justify-between text-[10px] text-stone-500 font-mono">
            <div className="flex items-center gap-1.5">
              <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
              <span>OpenGIS Leaflet Engine</span>
            </div>
            <span>High-Precision GIS</span>
          </div>
        </div>
      )}
    </div>
  );
};
