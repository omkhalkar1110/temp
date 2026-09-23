import React, { useState, useMemo, useCallback } from 'react';
import { LeafletCadastralMap } from './LeafletCadastralMap';
import { CadastralInspectorDrawer } from './CadastralInspectorDrawer';
import { CadastralControls } from './CadastralControls';
import { CadastralLegend } from './CadastralLegend';
import {
  Parcel,
  AlignmentRoute,
  CorridorBuffer,
  BasemapType,
  MapEngine,
} from './types';
import {
  CADASTRAL_DEFAULT_CENTER,
  CADASTRAL_DEFAULT_ZOOM,
  MOCK_PARCELS,
  MOCK_CORRIDOR_BUFFER,
  MOCK_ALIGNMENT_ROUTES,
} from './data/cadastralMockData';

export interface CadastralGisMapProps {
  parcels?: Parcel[];
  corridorBuffer?: CorridorBuffer;
  routes?: AlignmentRoute[];
  initialCenter?: [number, number];
  initialZoom?: number;
  initialBasemap?: BasemapType;
  height?: string;
  className?: string;
  onSelectParcel?: (parcel: Parcel | null) => void;
  onSelectRoute?: (route: AlignmentRoute | null) => void;
}

export const CadastralGisMap: React.FC<CadastralGisMapProps> = ({
  parcels = MOCK_PARCELS,
  corridorBuffer = MOCK_CORRIDOR_BUFFER,
  routes = MOCK_ALIGNMENT_ROUTES,
  initialCenter = CADASTRAL_DEFAULT_CENTER,
  initialZoom = CADASTRAL_DEFAULT_ZOOM,
  initialBasemap = 'satellite',
  height = 'h-[620px]',
  className = '',
  onSelectParcel,
  onSelectRoute,
}) => {
  // Engine State: Permanently set to OpenGIS Leaflet
  const activeEngine: MapEngine = 'leaflet';

  // Map Navigation & Visual States
  const [center, setCenter] = useState<[number, number]>(initialCenter);
  const [zoom, setZoom] = useState<number>(initialZoom);
  const [basemap, setBasemap] = useState<BasemapType>(initialBasemap);

  // Layer Toggles
  const [showParcels, setShowParcels] = useState(true);
  const [showRoutes, setShowRoutes] = useState(true);
  const [showTraffic, setShowTraffic] = useState(false);

  // Selection States
  const [selectedParcelId, setSelectedParcelId] = useState<string | null>(null);
  const [selectedRouteId, setSelectedRouteId] = useState<string | null>(
    routes[0]?.id || null
  );
  const [_hoveredParcel, setHoveredParcel] = useState<Parcel | null>(null);

  // Selected Parcel Memo
  const selectedParcel = useMemo(() => {
    return parcels.find((p) => p.id === selectedParcelId) || null;
  }, [selectedParcelId, parcels]);

  // Parcel Statistics for Legend
  const { possessedCount, inProgressCount, disputedCount } = useMemo(() => {
    let possessed = 0;
    let inProgress = 0;
    let disputed = 0;
    parcels.forEach((p) => {
      if (p.acquisitionStage === 'POSSESSED') possessed++;
      else if (p.acquisitionStage === 'DISPUTED') disputed++;
      else inProgress++;
    });
    return { possessedCount: possessed, inProgressCount: inProgress, disputedCount: disputed };
  }, [parcels]);

  // Handlers
  const handleSelectParcel = useCallback(
    (parcel: Parcel) => {
      setSelectedParcelId(parcel.id);
      onSelectParcel?.(parcel);
    },
    [onSelectParcel]
  );

  const handleCloseInspector = useCallback(() => {
    setSelectedParcelId(null);
    onSelectParcel?.(null);
  }, [onSelectParcel]);

  const handleSelectRoute = useCallback(
    (route: AlignmentRoute) => {
      setSelectedRouteId(route.id);
      onSelectRoute?.(route);
    },
    [onSelectRoute]
  );

  const handleZoomToParcel = useCallback((parcel: Parcel) => {
    setCenter(parcel.centroid);
    setZoom(16);
  }, []);

  const handleResetView = useCallback(() => {
    setCenter(initialCenter);
    setZoom(initialZoom);
    setSelectedParcelId(null);
  }, [initialCenter, initialZoom]);

  const handleToggleEngine = useCallback(() => {
    // No-op: Leaflet is the fixed OpenGIS engine
  }, []);

  return (
    <div
      id="cadastral-gis-map-root"
      className={`relative w-full ${height} rounded-3xl overflow-hidden border border-stone-200 shadow-md bg-[#EFECE6] select-none ${className}`}
    >
      {/* ─── Leaflet OpenGIS Map Renderer ─── */}
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
        onSelectParcel={handleSelectParcel}
        onSelectRoute={handleSelectRoute}
        onHoverParcel={setHoveredParcel}
      />

      {/* ─── Top Left Floating Controls ─── */}
      <CadastralControls
        basemap={basemap}
        onToggleBasemap={setBasemap}
        showParcels={showParcels}
        onToggleParcels={() => setShowParcels(!showParcels)}
        parcelCount={parcels.length}
        showRoutes={showRoutes}
        onToggleRoutes={() => setShowRoutes(!showRoutes)}
        routes={routes}
        selectedRouteId={selectedRouteId}
        onSelectRouteId={(id) => {
          setSelectedRouteId(id);
          const found = routes.find((r) => r.id === id);
          if (found) onSelectRoute?.(found);
        }}
        showTraffic={showTraffic}
        onToggleTraffic={() => setShowTraffic(!showTraffic)}
        activeEngine={activeEngine}
        onToggleEngine={handleToggleEngine}
        isGoogleMapsAvailable={false}
        onResetView={handleResetView}
      />

      {/* ─── Top Right / Side Selection Inspector Drawer ─── */}
      <CadastralInspectorDrawer
        parcel={selectedParcel}
        onClose={handleCloseInspector}
        onZoomToParcel={handleZoomToParcel}
      />

      {/* ─── Bottom Left Floating Frosted Dark Glass Legend ─── */}
      <CadastralLegend
        activeEngine={activeEngine}
        isKeyValid={false}
        totalParcels={parcels.length}
        possessedCount={possessedCount}
        inProgressCount={inProgressCount}
        disputedCount={disputedCount}
      />
    </div>
  );
};

