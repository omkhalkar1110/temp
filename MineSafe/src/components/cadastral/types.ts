export type AcquisitionStage = 'IN_PROGRESS' | 'POSSESSED' | 'DISPUTED';
export type DbtStatus = 'PAID' | 'PROCESSING' | 'PENDING' | 'HELD';
export type LandType = 'Agricultural' | 'Non-Agricultural' | 'Industrial' | 'Forest/Tribal';
export type MapEngine = 'leaflet' | 'google-maps';
export type BasemapType = 'satellite' | 'vector';

export interface DisputeDetails {
  caseNumber: string;
  courtName: string;
  reason: string;
  stayOrderActive: boolean;
  nextHearingDate?: string;
}

export interface Parcel {
  id: string;
  surveyNo: string;
  ownerName: string;
  village: string;
  taluka?: string;
  district?: string;
  coordinates: [number, number][]; // [latitude, longitude] polygon vertices
  centroid: [number, number]; // [latitude, longitude] center
  totalCompensation: number; // In ₹ Lakhs
  isDisputed: boolean;
  acquisitionStage: AcquisitionStage;
  dbtStatus: DbtStatus;
  areaHectares: number;
  areaGunthas: number;
  landType: LandType;
  disputeDetails?: DisputeDetails;
  awardNotificationDate?: string;
  bankAccountLinked?: boolean;
}

export interface AlignmentRoute {
  id: string;
  name: string;
  type: 'GREENFIELD' | 'BROWNFIELD';
  color: string;
  dashArray?: string;
  coordinates: [number, number][]; // [latitude, longitude] points
  lengthKm: number;
  estimatedCostCr: number;
  parcelsImpacted: number;
  description: string;
  advantages: string[];
  disadvantages: string[];
}

export interface CorridorBuffer {
  id: string;
  name: string;
  coordinates: [number, number][]; // [latitude, longitude] boundary points
  bufferWidthMeters: number;
}
