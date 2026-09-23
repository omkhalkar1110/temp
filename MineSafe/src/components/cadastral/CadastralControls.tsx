import React from 'react';
import {
  Satellite,
  Map as MapIcon,
  Eye,
  EyeOff,
  Milestone,
  Cpu,
  RotateCcw,
} from 'lucide-react';
import { BasemapType, MapEngine, AlignmentRoute } from './types';

interface CadastralControlsProps {
  basemap: BasemapType;
  onToggleBasemap: (type: BasemapType) => void;
  showParcels: boolean;
  onToggleParcels: () => void;
  parcelCount: number;
  showRoutes: boolean;
  onToggleRoutes: () => void;
  routes: AlignmentRoute[];
  selectedRouteId: string | null;
  onSelectRouteId: (id: string) => void;
  showTraffic?: boolean;
  onToggleTraffic?: () => void;
  activeEngine?: MapEngine;
  onToggleEngine?: () => void;
  isGoogleMapsAvailable?: boolean;
  onResetView: () => void;
}

export const CadastralControls: React.FC<CadastralControlsProps> = ({
  basemap,
  onToggleBasemap,
  showParcels,
  onToggleParcels,
  parcelCount,
  showRoutes,
  onToggleRoutes,
  routes,
  selectedRouteId,
  onSelectRouteId,
  showTraffic: _showTraffic,
  onToggleTraffic: _onToggleTraffic,
  activeEngine: _activeEngine,
  onToggleEngine: _onToggleEngine,
  isGoogleMapsAvailable: _isGoogleMapsAvailable,
  onResetView,
}) => {
  return (
    <div
      id="cadastral-map-controls"
      className="absolute top-4 left-4 z-20 flex flex-col gap-2 max-w-[calc(100vw-2rem)]"
    >
      {/* Primary Toolbar Container */}
      <div className="flex flex-wrap items-center gap-1.5 p-1.5 bg-white/95 backdrop-blur-md rounded-2xl border border-slate-200 shadow-md select-none">
        {/* Basemap Switcher: Satellite vs Vector */}
        <div className="flex items-center rounded-xl bg-slate-100 p-0.5">
          <button
            onClick={() => onToggleBasemap('satellite')}
            className={`flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg text-xs font-semibold transition-all cursor-pointer ${
              basemap === 'satellite'
                ? 'bg-blue-600 text-white shadow-xs'
                : 'text-slate-600 hover:text-slate-900'
            }`}
            title="Satellite / Aerial Imagery"
          >
            <Satellite className="w-3.5 h-3.5" />
            <span>Satellite</span>
          </button>

          <button
            onClick={() => onToggleBasemap('vector')}
            className={`flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg text-xs font-semibold transition-all cursor-pointer ${
              basemap === 'vector'
                ? 'bg-blue-600 text-white shadow-xs'
                : 'text-slate-600 hover:text-slate-900'
            }`}
            title="Clean Vector Street / Topo Map"
          >
            <MapIcon className="w-3.5 h-3.5" />
            <span>Vector</span>
          </button>
        </div>

        <div className="h-5 w-[1px] bg-slate-200 mx-0.5" />

        {/* Cadastral Parcels Layer Toggle with Count */}
        <button
          onClick={onToggleParcels}
          className={`flex items-center gap-1.5 px-2.5 py-1.5 rounded-xl text-xs font-semibold border transition-all cursor-pointer ${
            showParcels
              ? 'bg-blue-50 border-blue-200 text-blue-900 shadow-xs'
              : 'bg-slate-100 border-slate-200 text-slate-600'
          }`}
          title="Toggle Cadastral Parcels Layer"
        >
          {showParcels ? <Eye className="w-3.5 h-3.5 text-blue-600" /> : <EyeOff className="w-3.5 h-3.5" />}
          <span>Parcels</span>
          <span className="px-1.5 py-0.2 rounded-full text-[10px] font-mono font-bold bg-blue-600 text-white">
            {parcelCount}
          </span>
        </button>

        {/* Corridor Alignment Routes Toggle */}
        <button
          onClick={onToggleRoutes}
          className={`flex items-center gap-1.5 px-2.5 py-1.5 rounded-xl text-xs font-semibold border transition-all cursor-pointer ${
            showRoutes
              ? 'bg-blue-50 border-blue-200 text-blue-900 shadow-xs'
              : 'bg-slate-100 border-slate-200 text-slate-600'
          }`}
          title="Toggle Corridor & Scenarios"
        >
          <Milestone className="w-3.5 h-3.5 text-blue-600" />
          <span>Corridor Routes</span>
        </button>

        {/* Recenter Button */}
        <button
          onClick={onResetView}
          className="p-1.5 rounded-xl text-slate-500 hover:text-slate-900 hover:bg-slate-100 border border-transparent hover:border-slate-200 transition-colors cursor-pointer"
          title="Recenter Map View"
        >
          <RotateCcw className="w-4 h-4" />
        </button>
      </div>

      {/* Engine Status & Alignment Scenario Pill */}
      <div className="flex items-center gap-2">
        {/* Engine Status Pill */}
        <div className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-white/95 text-slate-800 backdrop-blur-md border border-slate-200 shadow-sm text-xs">
          <Cpu className="w-3.5 h-3.5 text-emerald-600" />
          <span className="text-[11px] font-mono text-slate-500 font-medium">Engine:</span>
          <span className="font-semibold font-mono text-[11px] px-2 py-0.5 rounded-md bg-emerald-100 text-emerald-800 border border-emerald-200">
            OpenGIS Leaflet
          </span>
        </div>

        {/* Alignment Scenario Selector Dropdown / Pills */}
        {showRoutes && routes.length > 0 && (
          <div className="hidden sm:inline-flex items-center gap-1 px-2 py-1 rounded-xl bg-white/95 backdrop-blur-md border border-slate-200 shadow-sm text-xs">
            <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider px-1">
              Scenario:
            </span>
            {routes.map((route) => {
              const isSelected = route.id === selectedRouteId;
              return (
                <button
                  key={route.id}
                  onClick={() => onSelectRouteId(route.id)}
                  className={`px-2 py-1 rounded-lg text-[11px] font-semibold transition-colors cursor-pointer ${
                    isSelected
                      ? 'bg-slate-900 text-white shadow-xs'
                      : 'text-slate-600 hover:bg-slate-100'
                  }`}
                >
                  {route.name.split(' ')[0]} {route.name.split(' ')[1]}
                </button>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
};
