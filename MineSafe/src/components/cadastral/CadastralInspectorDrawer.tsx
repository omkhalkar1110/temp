import React from 'react';
import {
  X,
  MapPin,
  FileCheck2,
  Scale,
  LandPlot,
  IndianRupee,
  CheckCircle2,
  Clock,
  Ban,
  Building2,
} from 'lucide-react';
import { Parcel } from './types';

interface CadastralInspectorDrawerProps {
  parcel: Parcel | null;
  onClose: () => void;
  onZoomToParcel?: (parcel: Parcel) => void;
}

export const CadastralInspectorDrawer: React.FC<CadastralInspectorDrawerProps> = ({
  parcel,
  onClose,
  onZoomToParcel,
}) => {
  if (!parcel) return null;

  const stageBadge = () => {
    switch (parcel.acquisitionStage) {
      case 'POSSESSED':
        return {
          label: 'Possessed / Acquired',
          bg: 'bg-emerald-50 text-emerald-800 border-emerald-300',
          dot: 'bg-emerald-600',
        };
      case 'DISPUTED':
        return {
          label: 'Court Stay / Disputed',
          bg: 'bg-red-50 text-red-800 border-red-300',
          dot: 'bg-red-600',
        };
      case 'IN_PROGRESS':
      default:
        return {
          label: 'Statutory Acquisition in Progress',
          bg: 'bg-amber-50 text-amber-900 border-amber-300',
          dot: 'bg-amber-600',
        };
    }
  };

  const dbtBadge = () => {
    switch (parcel.dbtStatus) {
      case 'PAID':
        return {
          label: 'DBT Credited to Bank',
          icon: <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />,
          color: 'text-emerald-700 bg-emerald-50 border-emerald-200',
        };
      case 'PROCESSING':
        return {
          label: 'Treasury Processing',
          icon: <Clock className="w-3.5 h-3.5 text-amber-600 animate-spin" />,
          color: 'text-amber-700 bg-amber-50 border-amber-200',
        };
      case 'HELD':
        return {
          label: 'Escrow Held (Legal Stay)',
          icon: <Ban className="w-3.5 h-3.5 text-red-600" />,
          color: 'text-red-700 bg-red-50 border-red-200',
        };
      case 'PENDING':
      default:
        return {
          label: 'Verification Pending',
          icon: <Clock className="w-3.5 h-3.5 text-slate-500" />,
          color: 'text-slate-700 bg-slate-50 border-slate-200',
        };
    }
  };

  const stage = stageBadge();
  const dbt = dbtBadge();

  return (
    <div
      id="cadastral-inspector-drawer"
      className="absolute top-4 right-4 z-30 w-96 max-w-[calc(100vw-2rem)] bg-white/95 backdrop-blur-md rounded-2xl border border-stone-200 shadow-2xl p-5 text-stone-900 transition-all duration-300 animate-in fade-in slide-in-from-right-4 select-text"
    >
      {/* Header */}
      <div className="flex items-start justify-between gap-2 border-b border-stone-200 pb-3.5">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="px-2.5 py-0.5 rounded-md bg-amber-700 text-white font-mono font-bold text-xs tracking-wide">
              {parcel.surveyNo}
            </span>
            <span
              className={`inline-flex items-center gap-1.5 px-2 py-0.5 rounded-md border text-[11px] font-semibold ${stage.bg}`}
            >
              <span className={`w-1.5 h-1.5 rounded-full ${stage.dot}`} />
              {stage.label}
            </span>
          </div>
          <p className="text-xs text-stone-500 flex items-center gap-1">
            <MapPin className="w-3 h-3 text-stone-400" />
            <span>
              {parcel.village}, {parcel.taluka || 'Bade Bacheli'}, {parcel.district || 'Dantewada'}
            </span>
          </p>
        </div>

        <button
          onClick={onClose}
          className="p-1 rounded-lg text-stone-400 hover:text-stone-700 hover:bg-stone-100 transition-colors cursor-pointer"
          title="Close Inspector"
        >
          <X className="w-4 h-4" />
        </button>
      </div>

      {/* Disputed Alert Banner */}
      {parcel.isDisputed && parcel.disputeDetails && (
        <div className="mt-3.5 p-3 rounded-xl bg-red-50 border border-red-200 text-red-900 text-xs">
          <div className="flex items-center gap-2 font-bold mb-1 text-red-700">
            <Scale className="w-4 h-4 text-red-600 shrink-0" />
            <span>Active Court Stay Order</span>
          </div>
          <p className="text-[11px] text-red-800 mb-1.5 leading-relaxed">
            {parcel.disputeDetails.reason}
          </p>
          <div className="flex items-center justify-between text-[10px] font-mono text-red-700 border-t border-red-200 pt-1.5 mt-1">
            <span>Case: {parcel.disputeDetails.caseNumber}</span>
            <span>Next: {parcel.disputeDetails.nextHearingDate || 'Hearing Listed'}</span>
          </div>
        </div>
      )}

      {/* Landowner & Core Attributes */}
      <div className="mt-4 space-y-3">
        <div>
          <div className="text-[10px] uppercase font-bold tracking-wider text-stone-400 mb-0.5">
            Registered Titleholder
          </div>
          <div className="text-sm font-bold text-stone-900">
            {parcel.ownerName}
          </div>
        </div>

        <div className="grid grid-cols-2 gap-2.5">
          <div className="p-2.5 rounded-xl bg-stone-50 border border-stone-200">
            <div className="flex items-center gap-1.5 text-[10px] font-medium text-stone-500 mb-1">
              <LandPlot className="w-3.5 h-3.5 text-amber-700" />
              <span>Surveyed Area</span>
            </div>
            <div className="font-mono font-bold text-sm text-stone-900">
              {parcel.areaHectares} Ha
            </div>
            <div className="text-[10px] text-stone-500 font-mono">
              ({parcel.areaGunthas} Gunthas)
            </div>
          </div>

          <div className="p-2.5 rounded-xl bg-stone-50 border border-stone-200">
            <div className="flex items-center gap-1.5 text-[10px] font-medium text-stone-500 mb-1">
              <Building2 className="w-3.5 h-3.5 text-stone-600" />
              <span>Land Category</span>
            </div>
            <div className="font-semibold text-xs text-stone-900 truncate">
              {parcel.landType}
            </div>
            <div className="text-[10px] text-stone-500">Class A Revenue Land</div>
          </div>
        </div>

        {/* Financial Award & DBT Status (Light Amber/Stone Card) */}
        <div className="p-3.5 rounded-xl bg-amber-50/70 text-stone-900 border border-amber-200 shadow-xs">
          <div className="flex items-center justify-between text-[11px] text-amber-900 mb-1 font-medium">
            <span className="flex items-center gap-1">
              <IndianRupee className="w-3 h-3 text-amber-700" />
              <span>Total Statutory Compensation</span>
            </span>
            <span className="font-mono text-emerald-700 font-bold text-[10px]">
              Section 11 Award
            </span>
          </div>
          <div className="flex items-baseline justify-between mb-2">
            <span className="text-xl font-mono font-black text-stone-900">
              ₹ {parcel.totalCompensation.toFixed(2)} Lakhs
            </span>
            <span className="text-[10px] font-mono text-stone-600">
              Rate: ₹{(parcel.totalCompensation / parcel.areaHectares).toFixed(1)} L/Ha
            </span>
          </div>

          {/* DBT Badge */}
          <div className="pt-2 border-t border-amber-200/80 flex items-center justify-between">
            <span className="text-[10px] text-stone-600">DBT Transfer Status:</span>
            <span
              className={`inline-flex items-center gap-1.5 px-2 py-0.5 rounded-md border text-[10px] font-semibold ${dbt.color}`}
            >
              {dbt.icon}
              <span>{dbt.label}</span>
            </span>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="pt-1 flex items-center gap-2">
          {onZoomToParcel && (
            <button
              onClick={() => onZoomToParcel(parcel)}
              className="flex-1 flex items-center justify-center gap-1.5 py-2 px-3 rounded-xl bg-stone-100 hover:bg-stone-200 text-stone-700 text-xs font-semibold transition-colors cursor-pointer border border-stone-200"
            >
              <MapPin className="w-3.5 h-3.5 text-stone-500" />
              <span>Recenter Parcel</span>
            </button>
          )}

          <button
            onClick={() => {
              alert(
                `Cadastral Record for ${parcel.surveyNo}\nVillage: ${parcel.village}\nOwner: ${parcel.ownerName}\nAward: ₹${parcel.totalCompensation} Lakhs\nStatus: ${parcel.acquisitionStage}`
              );
            }}
            className="flex-1 flex items-center justify-center gap-1.5 py-2 px-3 rounded-xl bg-amber-700 hover:bg-amber-800 text-white text-xs font-semibold transition-colors shadow-xs cursor-pointer"
          >
            <FileCheck2 className="w-3.5 h-3.5" />
            <span>Survey Record</span>
          </button>
        </div>
      </div>
    </div>
  );
};
