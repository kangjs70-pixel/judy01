import React, { useEffect, useRef, useState } from 'react';
import L from 'leaflet';
import { Trail } from '../types';
import { Layers, Crosshair, ZoomIn, ZoomOut } from 'lucide-react';

interface TrailMapProps {
  trails: Trail[];
  selectedTrail: Trail | null;
  onSelectTrail: (trail: Trail) => void;
  userLocation: { lat: number; lng: number } | null;
  className?: string;
}

export const TrailMap: React.FC<TrailMapProps> = ({
  trails,
  selectedTrail,
  onSelectTrail,
  userLocation,
  className = '',
}) => {
  const mapContainerRef = useRef<HTMLDivElement>(null);
  const mapInstanceRef = useRef<L.Map | null>(null);
  const markersLayerGroupRef = useRef<L.LayerGroup | null>(null);
  const routePolylineRef = useRef<L.Polyline | null>(null);
  const waypointsLayerGroupRef = useRef<L.LayerGroup | null>(null);
  const userMarkerRef = useRef<L.Marker | null>(null);

  const [mapStyle, setMapStyle] = useState<'osm' | 'topo' | 'carto'>('carto');
  const tileLayerRef = useRef<L.TileLayer | null>(null);

  // Initialize Map
  useEffect(() => {
    if (!mapContainerRef.current || mapInstanceRef.current) return;

    // South Korea center
    const defaultCenter: [number, number] = [36.2, 127.8];
    const map = L.map(mapContainerRef.current, {
      center: defaultCenter,
      zoom: 7,
      zoomControl: false,
    });

    const tileUrls = {
      osm: 'https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png',
      topo: 'https://server.arcgisonline.com/ArcGIS/rest/services/World_Topo_Map/MapServer/tile/{z}/{y}/{x}',
      carto: 'https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}{r}.png',
    };

    const tile = L.tileLayer(tileUrls.carto, {
      maxZoom: 18,
      attribution: '&copy; OpenStreetMap, CartoDB',
    }).addTo(map);

    tileLayerRef.current = tile;
    mapInstanceRef.current = map;

    const markersGroup = L.layerGroup().addTo(map);
    markersLayerGroupRef.current = markersGroup;

    const waypointsGroup = L.layerGroup().addTo(map);
    waypointsLayerGroupRef.current = waypointsGroup;

    return () => {
      map.remove();
      mapInstanceRef.current = null;
    };
  }, []);

  // Handle Tile Style changes
  useEffect(() => {
    if (!mapInstanceRef.current || !tileLayerRef.current) return;

    const tileUrls = {
      osm: 'https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png',
      topo: 'https://server.arcgisonline.com/ArcGIS/rest/services/World_Topo_Map/MapServer/tile/{z}/{y}/{x}',
      carto: 'https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}{r}.png',
    };

    const attributions = {
      osm: '&copy; OpenStreetMap contributors',
      topo: 'Tiles &copy; Esri World Topo Map',
      carto: '&copy; OpenStreetMap, CartoDB',
    };

    tileLayerRef.current.setUrl(tileUrls[mapStyle]);
    tileLayerRef.current.options.attribution = attributions[mapStyle];
  }, [mapStyle]);

  // Update Markers for trails
  useEffect(() => {
    const map = mapInstanceRef.current;
    const markersGroup = markersLayerGroupRef.current;
    if (!map || !markersGroup) return;

    markersGroup.clearLayers();

    trails.forEach((trail) => {
      const isSelected = selectedTrail?.id === trail.id;
      const color =
        trail.difficulty === 'easy'
          ? '#059669' // emerald-600
          : trail.difficulty === 'moderate'
          ? '#d97706' // amber-600
          : '#e11d48'; // rose-600

      // Custom HTML Marker using DivIcon
      const iconHtml = `
        <div style="
          display: flex;
          align-items: center;
          justify-content: center;
          background-color: ${isSelected ? '#111827' : color};
          color: white;
          width: ${isSelected ? '36px' : '30px'};
          height: ${isSelected ? '36px' : '30px'};
          border-radius: 9999px;
          border: 2px solid white;
          box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.2), 0 2px 4px -2px rgba(0, 0, 0, 0.1);
          cursor: pointer;
          transition: transform 0.2s;
        ">
          <svg style="width: 16px; height: 16px;" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"/>
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"/>
          </svg>
        </div>
      `;

      const customIcon = L.divIcon({
        html: iconHtml,
        className: 'custom-trail-marker',
        iconSize: [isSelected ? 36 : 30, isSelected ? 36 : 30],
        iconAnchor: [isSelected ? 18 : 15, isSelected ? 36 : 30],
        popupAnchor: [0, -32],
      });

      const marker = L.marker([trail.startPoint.lat, trail.startPoint.lng], {
        icon: customIcon,
      });

      marker.bindPopup(`
        <div style="min-width: 180px; font-family: sans-serif;">
          <div style="font-size: 11px; color: #6b7280; font-weight: 600;">${trail.regionName}</div>
          <div style="font-size: 14px; font-weight: 700; color: #111827; margin: 2px 0 4px;">${trail.name}</div>
          <div style="font-size: 12px; color: #4b5563;">${trail.distanceKm}km &bull; 약 ${Math.floor(trail.durationMinutes / 60)}시간 ${trail.durationMinutes % 60}분</div>
        </div>
      `);

      marker.on('click', () => {
        onSelectTrail(trail);
      });

      markersGroup.addLayer(marker);
    });
  }, [trails, selectedTrail, onSelectTrail]);

  // Update Route Polyline & Waypoints when selectedTrail changes
  useEffect(() => {
    const map = mapInstanceRef.current;
    const waypointsGroup = waypointsLayerGroupRef.current;
    if (!map || !waypointsGroup) return;

    // Remove previous polyline
    if (routePolylineRef.current) {
      map.removeLayer(routePolylineRef.current);
      routePolylineRef.current = null;
    }

    waypointsGroup.clearLayers();

    if (selectedTrail && selectedTrail.routeCoords.length > 0) {
      // Draw route polyline
      const polyline = L.polyline(selectedTrail.routeCoords, {
        color: '#059669',
        weight: 5,
        opacity: 0.85,
        dashArray: undefined,
        lineCap: 'round',
        lineJoin: 'round',
      }).addTo(map);

      routePolylineRef.current = polyline;

      // Add waypoints
      selectedTrail.waypoints.forEach((wp, index) => {
        const wpIconHtml = `
          <div style="
            background: #ffffff;
            color: #065f46;
            border: 2px solid #059669;
            width: 22px;
            height: 22px;
            border-radius: 9999px;
            font-size: 11px;
            font-weight: 700;
            display: flex;
            align-items: center;
            justify-content: center;
            box-shadow: 0 2px 4px rgba(0,0,0,0.2);
          ">
            ${index + 1}
          </div>
        `;
        const wpIcon = L.divIcon({
          html: wpIconHtml,
          className: 'custom-wp-marker',
          iconSize: [22, 22],
          iconAnchor: [11, 11],
        });

        const wpMarker = L.marker([wp.lat, wp.lng], { icon: wpIcon });
        wpMarker.bindPopup(`
          <div style="font-family: sans-serif; min-width: 150px;">
            <div style="font-size: 12px; font-weight: bold; color: #065f46;">${index + 1}. ${wp.name}</div>
            <div style="font-size: 11px; color: #4b5563; margin-top: 2px;">${wp.description}</div>
            <div style="font-size: 10px; color: #9ca3af; margin-top: 2px;">해발 ${wp.altitude}m</div>
          </div>
        `);
        waypointsGroup.addLayer(wpMarker);
      });

      // Fit map bounds to selected trail route
      const bounds = L.latLngBounds(selectedTrail.routeCoords);
      map.flyToBounds(bounds, { padding: [50, 50], maxZoom: 14, duration: 1.2 });
    }
  }, [selectedTrail]);

  // Handle User Location
  useEffect(() => {
    const map = mapInstanceRef.current;
    if (!map) return;

    if (userLocation) {
      if (!userMarkerRef.current) {
        const userIconHtml = `
          <div style="position: relative; width: 24px; height: 24px;">
            <div style="position: absolute; inset: 0; border-radius: 9999px; background-color: #3b82f6; opacity: 0.4; animation: ping 1.5s cubic-bezier(0, 0, 0.2, 1) infinite;"></div>
            <div style="position: relative; width: 24px; height: 24px; border-radius: 9999px; background-color: #2563eb; border: 3px solid white; box-shadow: 0 2px 5px rgba(0,0,0,0.3);"></div>
          </div>
        `;
        const userIcon = L.divIcon({
          html: userIconHtml,
          className: 'user-loc-icon',
          iconSize: [24, 24],
          iconAnchor: [12, 12],
        });

        const marker = L.marker([userLocation.lat, userLocation.lng], { icon: userIcon });
        marker.bindPopup('<b style="font-size: 12px;">현재 내 위치</b>');
        marker.addTo(map);
        userMarkerRef.current = marker;
      } else {
        userMarkerRef.current.setLatLng([userLocation.lat, userLocation.lng]);
      }
    } else if (userMarkerRef.current) {
      map.removeLayer(userMarkerRef.current);
      userMarkerRef.current = null;
    }
  }, [userLocation]);

  const handleResetView = () => {
    if (!mapInstanceRef.current) return;
    if (trails.length > 0) {
      const bounds = L.latLngBounds(trails.map((t) => [t.startPoint.lat, t.startPoint.lng]));
      mapInstanceRef.current.flyToBounds(bounds, { padding: [40, 40], maxZoom: 10, duration: 1 });
    } else {
      mapInstanceRef.current.flyTo([36.2, 127.8], 7, { duration: 1 });
    }
  };

  const handleZoomIn = () => mapInstanceRef.current?.zoomIn();
  const handleZoomOut = () => mapInstanceRef.current?.zoomOut();

  return (
    <div className={`relative w-full h-full min-h-[350px] overflow-hidden rounded-2xl bg-stone-100 ${className}`}>
      <div ref={mapContainerRef} className="w-full h-full z-10" />

      {/* Map Control Buttons */}
      <div className="absolute top-4 right-4 z-20 flex flex-col gap-2">
        {/* Style switch */}
        <div className="bg-white/90 backdrop-blur-md rounded-xl shadow-md border border-stone-200 p-1 flex flex-col gap-1">
          <button
            type="button"
            onClick={() => setMapStyle('carto')}
            className={`px-2.5 py-1 text-xs font-semibold rounded-lg transition ${
              mapStyle === 'carto' ? 'bg-stone-900 text-white' : 'text-stone-600 hover:bg-stone-100'
            }`}
            title="일반 탐색 지도"
          >
            기본
          </button>
          <button
            type="button"
            onClick={() => setMapStyle('topo')}
            className={`px-2.5 py-1 text-xs font-semibold rounded-lg transition ${
              mapStyle === 'topo' ? 'bg-stone-900 text-white' : 'text-stone-600 hover:bg-stone-100'
            }`}
            title="등고선 지형도 (Topo)"
          >
            지형도
          </button>
          <button
            type="button"
            onClick={() => setMapStyle('osm')}
            className={`px-2.5 py-1 text-xs font-semibold rounded-lg transition ${
              mapStyle === 'osm' ? 'bg-stone-900 text-white' : 'text-stone-600 hover:bg-stone-100'
            }`}
            title="OpenStreetMap"
          >
            OSM
          </button>
        </div>

        {/* Zoom & Reset Center */}
        <div className="bg-white/90 backdrop-blur-md rounded-xl shadow-md border border-stone-200 p-1 flex flex-col gap-1">
          <button
            type="button"
            onClick={handleZoomIn}
            className="p-2 text-stone-700 hover:bg-stone-100 rounded-lg transition"
            title="확대"
          >
            <ZoomIn className="w-4 h-4" />
          </button>
          <button
            type="button"
            onClick={handleZoomOut}
            className="p-2 text-stone-700 hover:bg-stone-100 rounded-lg transition"
            title="축소"
          >
            <ZoomOut className="w-4 h-4" />
          </button>
          <button
            type="button"
            onClick={handleResetView}
            className="p-2 text-stone-700 hover:bg-stone-100 rounded-lg transition border-t border-stone-100"
            title="전국 전체 보기"
          >
            <Crosshair className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Selected Trail overlay hint on map */}
      {selectedTrail && (
        <div className="absolute bottom-4 left-4 right-4 z-20 pointer-events-none">
          <div className="bg-white/95 backdrop-blur-md px-4 py-3 rounded-2xl shadow-lg border border-stone-200 max-w-md pointer-events-auto flex items-center justify-between gap-3">
            <div>
              <span className="text-[11px] font-semibold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-full">
                선택된 코스 경로 안내 중
              </span>
              <h4 className="text-sm font-bold text-stone-900 mt-1">{selectedTrail.name}</h4>
              <p className="text-xs text-stone-500 line-clamp-1">{selectedTrail.courseRoute}</p>
            </div>
            <div className="text-right shrink-0">
              <span className="text-xs font-bold text-stone-900">{selectedTrail.distanceKm} km</span>
              <p className="text-[11px] text-stone-500">
                +{selectedTrail.elevationGainM}m
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
