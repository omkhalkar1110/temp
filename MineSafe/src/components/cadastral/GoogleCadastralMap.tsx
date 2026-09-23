import React from 'react';
import { LeafletCadastralMap } from './LeafletCadastralMap';
import { Parcel, AlignmentRoute, CorridorBuffer, BasemapType } from './types';

export interface GoogleCadastralMapProps {
  apiKey?: string;
  center: [number, number];
  zoom: number;
  basemap: BasemapType;
  parcels: Parcel[];
  corridorBuffer: CorridorBuffer;
  routes: AlignmentRoute[];
  selectedParcelId: string | null;
  selectedRouteId: string | null;
  showParcels: boolean;
  showRoutes: boolean;
  showTraffic?: boolean;
  onSelectParcel: (parcel: Parcel) => void;
  onSelectRoute: (route: AlignmentRoute) => void;
  onHoverParcel?: (parcel: Parcel | null) => void;
}

/**
 * GoogleCadastralMap adapter:
 * Delegates directly to LeafletCadastralMap to enforce the keyless OpenGIS Leaflet implementation
 * without loading external Google Maps scripts or requesting API credentials.
 */
export const GoogleCadastralMap: React.FC<GoogleCadastralMapProps> = ({
  center,
  zoom,
  basemap,
  parcels,
  corridorBuffer,
  routes,
  selectedParcelId,
  selectedRouteId,
  showParcels,
  showRoutes,
  onSelectParcel,
  onSelectRoute,
  onHoverParcel,
}) => {
  return (
    <LeafletCadastralMap
      center={center}
      zoom={zoom}
      basemap={basemap}
      parcels={parcels}
      corridorBuffer={corridorBuffer}
      routes={routes}
      selectedParcelId={selectedParcelId}
      selectedRouteId={selectedRouteId}
      showParcels={showParcels}
      showRoutes={showRoutes}
      onSelectParcel={onSelectParcel}
      onSelectRoute={onSelectRoute}
      onHoverParcel={onHoverParcel}
    />
  );
};
