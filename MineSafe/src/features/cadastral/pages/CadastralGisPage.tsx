import React, { useState } from 'react';
import { CadastralGisMap } from '../../../components/cadastral/CadastralGisMap';
import {
  MOCK_PARCELS,
  MOCK_ALIGNMENT_ROUTES,
  MOCK_CORRIDOR_BUFFER,
} from '../../../components/cadastral/data/cadastralMockData';
import { Parcel, AlignmentRoute } from '../../../components/cadastral/types';
import {
  MapPin,
  Layers,
  CheckCircle2,
  AlertOctagon,
  IndianRupee,
  LandPlot,
  ArrowRight,
  Search,
} from 'lucide-react';

export const CadastralGisPage: React.FC = () => {
  const [selectedParcel, setSelectedParcel] = useState<Parcel | null>(null);
  const [selectedRoute, setSelectedRoute] = useState<AlignmentRoute | null>(
    MOCK_ALIGNMENT_ROUTES[0]
  );
  const [filterStage, setFilterStage] = useState<'ALL' | 'POSSESSED' | 'IN_PROGRESS' | 'DISPUTED'>('ALL');
  const [searchQuery, setSearchQuery] = useState('');

  // Total Statistics
  const totalParcels = MOCK_PARCELS.length;
  const possessedParcels = MOCK_PARCELS.filter((p) => p.acquisitionStage === 'POSSESSED').length;
  const disputedParcels = MOCK_PARCELS.filter((p) => p.acquisitionStage === 'DISPUTED').length;
  const totalAward = MOCK_PARCELS.reduce((acc, p) => acc + p.totalCompensation, 0);
  const totalArea = MOCK_PARCELS.reduce((acc, p) => acc + p.areaHectares, 0);

  // Filtered parcels for table
  const filteredParcels = MOCK_PARCELS.filter((p) => {
    const matchesFilter =
      filterStage === 'ALL' || p.acquisitionStage === filterStage;
    const matchesSearch =
      p.surveyNo.toLowerCase().includes(searchQuery.toLowerCase()) ||
      p.ownerName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      p.village.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesFilter && matchesSearch;
  });

  return (
    <div className="space-y-6 max-w-7xl mx-auto pb-12 font-sans">
      {/* ─── Page Header ─── */}
      <div className="bg-white border border-stone-200 rounded-3xl p-6 shadow-sm flex flex-col lg:flex-row lg:items-center justify-between gap-4">
        <div className="flex items-center gap-3.5">
          <div className="w-12 h-12 rounded-2xl bg-amber-50 border border-amber-200 flex items-center justify-center text-amber-700 font-bold shadow-xs">
            <Layers className="w-6 h-6" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-2xl font-black text-stone-900 tracking-tight">
                Cadastral GIS & Land Acquisition Engine
              </h1>
              <span className="px-2 py-0.5 rounded-full text-[10px] font-mono font-bold bg-emerald-50 text-emerald-800 border border-emerald-300">
                OpenGIS Leaflet Engine
              </span>
            </div>
            <p className="text-xs text-stone-500 font-mono mt-0.5">
              Bailadila - Kirandul Mineral Corridor RoW Alignment & Statutory Compensation GIS
            </p>
          </div>
        </div>

        {/* Quick Statutory Indicators */}
        <div className="flex items-center gap-2 flex-wrap">
          <div className="px-3.5 py-2 rounded-2xl bg-stone-50 border border-stone-200 text-right">
            <div className="text-[10px] font-bold text-stone-500 uppercase tracking-wider">
              Corridor RoW
            </div>
            <div className="font-mono font-black text-sm text-stone-900">
              60m Buffer (14.8 km)
            </div>
          </div>
          <div className="px-3.5 py-2 rounded-2xl bg-amber-50 border border-amber-200 text-right">
            <div className="text-[10px] font-bold text-amber-700 uppercase tracking-wider">
              Total Award Value
            </div>
            <div className="font-mono font-black text-sm text-amber-900">
              ₹ {totalAward.toFixed(1)} Lakhs
            </div>
          </div>
        </div>
      </div>

      {/* ─── Metric Cards Grid ─── */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3.5">
        <div className="p-4 rounded-2xl bg-white border border-stone-200 shadow-xs">
          <div className="flex items-center gap-2 text-xs font-semibold text-stone-500 mb-1">
            <LandPlot className="w-4 h-4 text-amber-700" />
            <span>Surveyed Parcels</span>
          </div>
          <div className="text-2xl font-mono font-black text-stone-900">
            {totalParcels}
          </div>
          <div className="text-[11px] text-stone-500 font-mono mt-0.5">
            Total {totalArea.toFixed(1)} Hectares
          </div>
        </div>

        <div className="p-4 rounded-2xl bg-white border border-stone-200 shadow-xs">
          <div className="flex items-center gap-2 text-xs font-semibold text-stone-500 mb-1">
            <CheckCircle2 className="w-4 h-4 text-emerald-600" />
            <span>Possession Complete</span>
          </div>
          <div className="text-2xl font-mono font-black text-emerald-700">
            {possessedParcels}{' '}
            <span className="text-sm font-normal text-stone-400">
              ({Math.round((possessedParcels / totalParcels) * 100)}%)
            </span>
          </div>
          <div className="text-[11px] text-emerald-700 font-mono mt-0.5">
            Handed Over to Mining Infra
          </div>
        </div>

        <div className="p-4 rounded-2xl bg-white border border-stone-200 shadow-xs">
          <div className="flex items-center gap-2 text-xs font-semibold text-stone-500 mb-1">
            <AlertOctagon className="w-4 h-4 text-red-600" />
            <span>Court Stay Orders</span>
          </div>
          <div className="text-2xl font-mono font-black text-red-700">
            {disputedParcels}{' '}
            <span className="text-sm font-normal text-stone-400">
              ({Math.round((disputedParcels / totalParcels) * 100)}%)
            </span>
          </div>
          <div className="text-[11px] text-red-700 font-mono mt-0.5">
            High Court Contention
          </div>
        </div>

        <div className="p-4 rounded-2xl bg-white border border-stone-200 shadow-xs">
          <div className="flex items-center gap-2 text-xs font-semibold text-stone-500 mb-1">
            <IndianRupee className="w-4 h-4 text-amber-700" />
            <span>DBT Direct Transfer</span>
          </div>
          <div className="text-2xl font-mono font-black text-stone-900">
            ₹ 145.1 L
          </div>
          <div className="text-[11px] text-stone-500 font-mono mt-0.5">
            Credited to Titleholder Banks
          </div>
        </div>
      </div>

      {/* ─── Main Interactive Cadastral GIS Map ─── */}
      <div className="bg-white border border-stone-200 rounded-3xl p-4 shadow-sm space-y-3">
        <div className="flex items-center justify-between px-2">
          <div className="flex items-center gap-2">
            <MapPin className="w-4 h-4 text-amber-700" />
            <span className="text-sm font-bold text-stone-900">
              Interactive Geospatial Cadastral Viewer
            </span>
            <span className="text-xs text-stone-400 hidden sm:inline">
              • Click any parcel polygon or corridor route to inspect attributes
            </span>
          </div>
        </div>

        <CadastralGisMap
          parcels={MOCK_PARCELS}
          corridorBuffer={MOCK_CORRIDOR_BUFFER}
          routes={MOCK_ALIGNMENT_ROUTES}
          height="h-[640px]"
          onSelectParcel={setSelectedParcel}
          onSelectRoute={setSelectedRoute}
        />
      </div>

      {/* ─── Scenario Comparison Section ─── */}
      <div className="bg-white border border-stone-200 rounded-3xl p-6 shadow-sm space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="font-extrabold text-stone-900 text-lg tracking-tight">
              Corridor Alignment Scenario Analysis
            </h3>
            <p className="text-xs text-stone-500">
              Comparative statutory feasibility between Greenfield Bypass and Brownfield Widening
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {MOCK_ALIGNMENT_ROUTES.map((route) => {
            const isSelected = selectedRoute?.id === route.id;
            return (
              <div
                key={route.id}
                onClick={() => setSelectedRoute(route)}
                className={`p-5 rounded-2xl border transition-all cursor-pointer ${
                  isSelected
                    ? 'border-amber-500 ring-2 ring-amber-500/20 bg-amber-50/40'
                    : 'border-stone-200 hover:border-stone-300 bg-stone-50/40'
                }`}
              >
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center gap-2">
                    <span
                      className="w-3 h-3 rounded-full"
                      style={{ backgroundColor: route.color }}
                    />
                    <h4 className="font-bold text-sm text-stone-900">
                      {route.name}
                    </h4>
                  </div>
                  <span
                    className={`text-[10px] font-mono font-bold px-2 py-0.5 rounded-md ${
                      route.type === 'GREENFIELD'
                        ? 'bg-emerald-50 text-emerald-800 border border-emerald-300'
                        : 'bg-red-50 text-red-800 border border-red-300'
                    }`}
                  >
                    {route.type}
                  </span>
                </div>

                <p className="text-xs text-stone-600 mb-3 leading-relaxed">
                  {route.description}
                </p>

                <div className="grid grid-cols-3 gap-2 py-2 border-t border-b border-stone-200 font-mono text-xs mb-3">
                  <div>
                    <span className="text-[10px] text-stone-500 block">Length</span>
                    <span className="font-bold text-stone-900">
                      {route.lengthKm} km
                    </span>
                  </div>
                  <div>
                    <span className="text-[10px] text-stone-500 block">Est. Cost</span>
                    <span className="font-bold text-stone-900">
                      ₹ {route.estimatedCostCr} Cr
                    </span>
                  </div>
                  <div>
                    <span className="text-[10px] text-stone-500 block">Impacted Parcels</span>
                    <span className="font-bold text-stone-900">
                      {route.parcelsImpacted} Parcels
                    </span>
                  </div>
                </div>

                <div className="space-y-1 text-xs">
                  <div className="text-[10px] font-bold text-stone-500 uppercase tracking-wider">
                    Key Feasibility Factor:
                  </div>
                  <div className="flex items-center gap-1.5 text-emerald-700 font-medium">
                    <ArrowRight className="w-3.5 h-3.5 shrink-0" />
                    <span>{route.advantages[0]}</span>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* ─── Statutory Parcels Registry Table ─── */}
      <div className="bg-white border border-stone-200 rounded-3xl p-6 shadow-sm space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div>
            <h3 className="font-extrabold text-stone-900 text-lg tracking-tight">
              Cadastral Survey Registry
            </h3>
            <p className="text-xs text-stone-500">
              Section 11 Land Acquisition & DBT Compensation Records
            </p>
          </div>

          {/* Filter Pills and Search */}
          <div className="flex flex-wrap items-center gap-2">
            <div className="relative">
              <Search className="w-3.5 h-3.5 text-stone-400 absolute left-2.5 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search Survey No. / Landowner..."
                className="pl-8 pr-3 py-1.5 rounded-xl border border-stone-200 text-xs bg-stone-50 focus:outline-none focus:ring-2 focus:ring-amber-500 text-stone-800"
              />
            </div>

            <div className="flex items-center rounded-xl bg-stone-100 p-0.5 text-xs font-semibold">
              {(['ALL', 'POSSESSED', 'IN_PROGRESS', 'DISPUTED'] as const).map((stage) => (
                <button
                  key={stage}
                  onClick={() => setFilterStage(stage)}
                  className={`px-2.5 py-1 rounded-lg transition-colors cursor-pointer ${
                    filterStage === stage
                      ? 'bg-amber-700 text-white shadow-xs'
                      : 'text-stone-600 hover:text-stone-900'
                  }`}
                >
                  {stage.replace('_', ' ')}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Table */}
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs text-stone-600">
            <thead className="bg-stone-50 text-[11px] font-bold text-stone-500 uppercase tracking-wider border-b border-stone-200">
              <tr>
                <th className="px-4 py-3">Survey No.</th>
                <th className="px-4 py-3">Landowner</th>
                <th className="px-4 py-3">Village / Sector</th>
                <th className="px-4 py-3">Area (Ha)</th>
                <th className="px-4 py-3">Award (₹ Lakhs)</th>
                <th className="px-4 py-3">Statutory Stage</th>
                <th className="px-4 py-3">DBT Transfer</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-stone-100">
              {filteredParcels.map((parcel) => {
                const isSelected = selectedParcel?.id === parcel.id;
                return (
                  <tr
                    key={parcel.id}
                    onClick={() => setSelectedParcel(parcel)}
                    className={`hover:bg-amber-50/40 cursor-pointer transition-colors ${
                      isSelected ? 'bg-amber-50 font-medium' : ''
                    }`}
                  >
                    <td className="px-4 py-3 font-mono font-bold text-stone-900">
                      {parcel.surveyNo}
                    </td>
                    <td className="px-4 py-3 font-semibold text-stone-800">
                      {parcel.ownerName}
                    </td>
                    <td className="px-4 py-3 text-stone-500">{parcel.village}</td>
                    <td className="px-4 py-3 font-mono">{parcel.areaHectares}</td>
                    <td className="px-4 py-3 font-mono font-bold text-stone-900">
                      ₹ {parcel.totalCompensation.toFixed(1)} L
                    </td>
                    <td className="px-4 py-3">
                      <span
                        className={`inline-flex items-center px-2 py-0.5 rounded text-[10px] font-bold ${
                          parcel.acquisitionStage === 'POSSESSED'
                            ? 'bg-emerald-100 text-emerald-800'
                            : parcel.acquisitionStage === 'DISPUTED'
                            ? 'bg-red-100 text-red-800'
                            : 'bg-blue-100 text-blue-800'
                        }`}
                      >
                        {parcel.acquisitionStage.replace('_', ' ')}
                      </span>
                    </td>
                    <td className="px-4 py-3 font-mono text-[11px]">
                      {parcel.dbtStatus === 'PAID' ? (
                        <span className="text-emerald-700 font-bold">✓ Credited</span>
                      ) : parcel.dbtStatus === 'PROCESSING' ? (
                        <span className="text-amber-700">Processing</span>
                      ) : parcel.dbtStatus === 'HELD' ? (
                        <span className="text-red-700 font-bold">Escrow Held</span>
                      ) : (
                        <span className="text-stone-400">Pending</span>
                      )}
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
