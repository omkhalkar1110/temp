import React, { useEffect, useRef } from 'react';
import L from 'leaflet';
import { Parcel, AlignmentRoute, CorridorBuffer, BasemapType } from './types';

interface LeafletCadastralMapProps {
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
  onSelectParcel: (parcel: Parcel) => void;
  onSelectRoute: (route: AlignmentRoute) => void;
  onHoverParcel?: (parcel: Parcel | null) => void;
}

export const LeafletCadastralMap: React.FC<LeafletCadastralMapProps> = ({
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
  const containerRef = useRef<HTMLDivElement>(null);
  const mapInstanceRef = useRef<L.Map | null>(null);
  const tileLayerRef = useRef<L.TileLayer | null>(null);

  // Layer groups for dynamic updating
  const parcelLayerGroupRef = useRef<L.LayerGroup | null>(null);
  const corridorLayerGroupRef = useRef<L.LayerGroup | null>(null);
  const routeLayerGroupRef = useRef<L.LayerGroup | null>(null);

  // 1. Initialize Map Instance with Clean Lifecycle
  useEffect(() => {
    const container = containerRef.current;
    if (!container) return;

    // Prevent duplicate initialization on hot reloads
    if ((container as unknown as { _leaflet_id?: number })._leaflet_id) {
      delete (container as unknown as { _leaflet_id?: number })._leaflet_id;
    }

    const map = L.map(container, {
      center: center,
      zoom: zoom,
      zoomControl: false, // We use custom position or let user zoom with controls
      attributionControl: true,
      fadeAnimation: true,
      zoomAnimation: true,
    });

    // Place zoom control bottom right
    L.control.zoom({ position: 'bottomright' }).addTo(map);

    // Create Layer Groups
    corridorLayerGroupRef.current = L.layerGroup().addTo(map);
    parcelLayerGroupRef.current = L.layerGroup().addTo(map);
    routeLayerGroupRef.current = L.layerGroup().addTo(map);

    mapInstanceRef.current = map;

    // ResizeObserver to ensure map redraws on layout/sidebar changes
    const resizeObserver = new ResizeObserver(() => {
      map.invalidateSize();
    });
    resizeObserver.observe(container);

    return () => {
      resizeObserver.disconnect();
      map.remove();
      mapInstanceRef.current = null;
      tileLayerRef.current = null;
      parcelLayerGroupRef.current = null;
      corridorLayerGroupRef.current = null;
      routeLayerGroupRef.current = null;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // 2. Center and Zoom Synchronization
  useEffect(() => {
    const map = mapInstanceRef.current;
    if (!map) return;
    const currentCenter = map.getCenter();
    if (
      Math.abs(currentCenter.lat - center[0]) > 0.0001 ||
      Math.abs(currentCenter.lng - center[1]) > 0.0001
    ) {
      map.panTo(center, { animate: true, duration: 0.5 });
    }
  }, [center]);

  useEffect(() => {
    const map = mapInstanceRef.current;
    if (!map) return;
    if (map.getZoom() !== zoom) {
      map.setZoom(zoom);
    }
  }, [zoom]);

  // 3. Basemap Tile Switching
  useEffect(() => {
    const map = mapInstanceRef.current;
    if (!map) return;

    if (tileLayerRef.current) {
      map.removeLayer(tileLayerRef.current);
    }

    if (basemap === 'satellite') {
      // Esri World Imagery (High-res satellite)
      tileLayerRef.current = L.tileLayer(
        'https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}',
        {
          attribution: '&copy; Esri, DigitalGlobe, GeoEye, Earthstar Geographics',
          maxZoom: 19,
        }
      ).addTo(map);
    } else {
      // CartoDB Voyager (Clean Vector Roadmap)
      tileLayerRef.current = L.tileLayer(
        'https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}{r}.png',
        {
          attribution:
            '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> &copy; <a href="https://carto.com/attributions">CARTO</a>',
          subdomains: 'abcd',
          maxZoom: 20,
        }
      ).addTo(map);
    }
  }, [basemap]);

  // 4. Corridor Buffer Layer
  useEffect(() => {
    const layerGroup = corridorLayerGroupRef.current;
    if (!layerGroup) return;

    layerGroup.clearLayers();

    if (!showRoutes || !corridorBuffer) return;

    const latLngs = corridorBuffer.coordinates.map(([lat, lng]) => [lat, lng] as L.LatLngExpression);

    const bufferPolygon = L.polygon(latLngs, {
      color: '#D97706', // Amber stroke
      weight: 2,
      dashArray: '6, 6',
      fillColor: '#FEF3C7', // Light Amber fill
      fillOpacity: 0.22,
    });

    bufferPolygon.bindTooltip(
      `<div class="text-xs font-sans font-semibold text-amber-900">${corridorBuffer.name}</div>`,
      { sticky: true, className: 'cadastral-tooltip' }
    );

    layerGroup.addLayer(bufferPolygon);
  }, [corridorBuffer, showRoutes]);

  // 5. Cadastral Parcel Polygons (Status Color-Coding & Tooltips)
  useEffect(() => {
    const layerGroup = parcelLayerGroupRef.current;
    if (!layerGroup) return;

    layerGroup.clearLayers();

    if (!showParcels) return;

    parcels.forEach((parcel) => {
      const isSelected = parcel.id === selectedParcelId;

      // Color logic based on requirements:
      // In Progress: #3B82F6 (fill #60A5FA at 30% opacity)
      // Possessed:   #10B981 (fill #34D399 at 30% opacity)
      // Disputed:    #EF4444 (fill #F87171 at 30% opacity)
      // Selected:    #F59E0B (fill #FBBF24 at 65% opacity, stroke 3.5px)
      let strokeColor = '#3B82F6';
      let fillColor = '#60A5FA';
      let fillOpacity = 0.3;
      let weight = 2;

      if (parcel.acquisitionStage === 'POSSESSED') {
        strokeColor = '#10B981';
        fillColor = '#34D399';
      } else if (parcel.acquisitionStage === 'DISPUTED') {
        strokeColor = '#EF4444';
        fillColor = '#F87171';
      }

      if (isSelected) {
        strokeColor = '#F59E0B';
        fillColor = '#FBBF24';
        fillOpacity = 0.65;
        weight = 3.5;
      }

      const latLngs = parcel.coordinates.map(([lat, lng]) => [lat, lng] as L.LatLngExpression);

      const polygon = L.polygon(latLngs, {
        color: strokeColor,
        weight: weight,
        fillColor: fillColor,
        fillOpacity: fillOpacity,
      });

      // Hover Tooltip: Survey Number, Landowner, Village, and Award Amount
      const tooltipContent = `
        <div style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; padding: 6px 8px; min-width: 170px;">
          <div style="display: flex; align-items: center; justify-content: space-between; margin-bottom: 3px;">
            <span style="font-weight: 800; font-size: 12px; color: #0F172A;">${parcel.surveyNo}</span>
            <span style="font-size: 9px; font-weight: 800; padding: 1px 5px; border-radius: 4px; background: ${
              parcel.acquisitionStage === 'POSSESSED'
                ? '#ECFDF5; color: #065F46;'
                : parcel.acquisitionStage === 'DISPUTED'
                ? '#FEF2F2; color: #991B1B;'
                : '#EFF6FF; color: #1E40AF;'
            }">${parcel.acquisitionStage.replace('_', ' ')}</span>
          </div>
          <div style="font-size: 11px; color: #334155; font-weight: 600; margin-bottom: 2px;">
            ${parcel.ownerName}
          </div>
          <div style="font-size: 10px; color: #64748B; margin-bottom: 4px;">
            ${parcel.village} (${parcel.areaHectares} Ha)
          </div>
          <div style="display: flex; align-items: center; justify-content: space-between; border-top: 1px solid #E2E8F0; padding-top: 3px;">
            <span style="font-size: 10px; color: #64748B;">Award Amount:</span>
            <span style="font-size: 11px; font-weight: 800; color: #0F172A; font-family: monospace;">₹ ${parcel.totalCompensation.toFixed(1)} Lakhs</span>
          </div>
          ${
            parcel.isDisputed
              ? '<div style="margin-top: 3px; font-size: 9px; font-weight: 700; color: #DC2626;">⚠️ Court Stay Order Active</div>'
              : ''
          }
        </div>
      `;

      polygon.bindTooltip(tooltipContent, {
        sticky: true,
        direction: 'auto',
        opacity: 0.96,
        className: 'leaflet-custom-cadastral-tooltip',
      });

      // Click event
      polygon.on('click', () => {
        onSelectParcel(parcel);
      });

      // Hover event
      polygon.on('mouseover', () => {
        onHoverParcel?.(parcel);
        if (!isSelected) {
          polygon.setStyle({
            weight: 3,
            fillOpacity: 0.45,
          });
        }
      });

      polygon.on('mouseout', () => {
        onHoverParcel?.(null);
        if (!isSelected) {
          polygon.setStyle({
            weight: weight,
            fillOpacity: fillOpacity,
          });
        }
      });

      layerGroup.addLayer(polygon);
    });
  }, [parcels, selectedParcelId, showParcels, onSelectParcel, onHoverParcel]);

  // 6. Corridor Alignment Route Polylines
  useEffect(() => {
    const layerGroup = routeLayerGroupRef.current;
    if (!layerGroup) return;

    layerGroup.clearLayers();

    if (!showRoutes) return;

    routes.forEach((route) => {
      const isSelected = route.id === selectedRouteId;
      const latLngs = route.coordinates.map(([lat, lng]) => [lat, lng] as L.LatLngExpression);

      const polyline = L.polyline(latLngs, {
        color: route.color,
        weight: isSelected ? 6 : 4.5,
        opacity: isSelected ? 1 : 0.85,
        dashArray: route.dashArray || undefined,
        lineCap: 'round',
        lineJoin: 'round',
      });

      polyline.bindTooltip(
        `
        <div style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; padding: 4px 6px;">
          <div style="font-weight: 800; font-size: 11px; color: ${route.color};">${route.name}</div>
          <div style="font-size: 10px; color: #475569; font-family: monospace;">Length: ${route.lengthKm} km • Est. ₹${route.estimatedCostCr} Cr</div>
          <div style="font-size: 9px; color: #64748B; margin-top: 2px;">Click to select scenario alignment</div>
        </div>
      `,
        { sticky: true, className: 'leaflet-custom-cadastral-tooltip' }
      );

      polyline.on('click', () => {
        onSelectRoute(route);
      });

      polyline.on('mouseover', () => {
        polyline.setStyle({ weight: isSelected ? 7 : 6 });
      });

      polyline.on('mouseout', () => {
        polyline.setStyle({ weight: isSelected ? 6 : 4.5 });
      });

      layerGroup.addLayer(polyline);
    });
  }, [routes, selectedRouteId, showRoutes, onSelectRoute]);

  return (
    <div
      ref={containerRef}
      id="leaflet-cadastral-map-container"
      className="w-full h-full relative z-0 select-none outline-none"
    />
  );
};
