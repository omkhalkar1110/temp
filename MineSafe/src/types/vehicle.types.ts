export type VehicleStatus = 'SAFE' | 'WARNING' | 'HIGH_RISK' | 'CRITICAL';
export type VehicleType = 'DUMPER' | 'EXCAVATOR' | 'HAUL_TRUCK' | 'DRILL_RIG' | 'PATROL';

export interface VehicleTelemetry {
  speedKmh: number;
  recommendedSpeedKmh: number;
  latitude: number;
  longitude: number;
  heading: number; // degrees 0-360
  fuelLevelPercent: number;
  engineTempCelsius: number;
  nearestVehicleId?: string;
  nearestVehicleName?: string;
  nearestVehicleDistanceMeters?: number;
  relativeSpeedKmh?: number;
  riskScorePercent: number;
  riskLevel: VehicleStatus;
  riskFactors: string[];
  recommendedAction: string;
  lastUpdate: string;
}

export interface Vehicle {
  id: string;
  siteId: string;
  zoneId: string;
  code: string; // e.g. D-104
  name: string;
  type: VehicleType;
  model?: string;
  driverName?: string;
  operatorId?: string;
  operatorName?: string;
  operatorPhone?: string;
  assignedZoneName?: string;
  status: VehicleStatus;
  telemetry: VehicleTelemetry;
  sensorsAttached: string[]; // sensor IDs
}
