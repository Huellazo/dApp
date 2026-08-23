import React, { useEffect, useRef } from 'react';
import { View, Text, Pressable, Platform } from 'react-native';
import { FontAwesome5 } from '@expo/vector-icons';
import { POIWithGeofence } from '@/services/geofence-service';

// Estilo Vectorial 3D de libre acceso (CARTO Voyager / OpenFreeMap)
const VECTOR_3D_STYLE = 'https://basemaps.cartocdn.com/gl/voyager-gl-style/style.json';

interface ScanMapboxRadarProps {
  userCoords?: [number, number]; // [lng, lat]
  pois?: POIWithGeofence[];
  onSelectPOI?: (poi: any) => void;
  onOpenFullMap?: () => void;
  height?: number | string;
  isFullScreen?: boolean;
  onCloseFullScreen?: () => void;
}

export function ScanMapboxRadar({
  userCoords = [-97.7786, 17.8067], // Centro de Huajuapan de León
  pois = [],
  onSelectPOI,
  onOpenFullMap,
  height = 220,
  isFullScreen = false,
  onCloseFullScreen,
}: ScanMapboxRadarProps) {
  const mapContainerRef = useRef<HTMLDivElement | null>(null);
  const mapRef = useRef<any>(null);

  useEffect(() => {
    let mapInstance: any = null;
    let resizeObserver: any = null;

    if (Platform.OS === 'web' && typeof window !== 'undefined') {
      // 1. Inyectar CSS de MapLibre GL v4 (Fork de código abierto de Mapbox GL sin requerir API key)
      if (!document.getElementById('maplibre-gl-css')) {
        const link = document.createElement('link');
        link.id = 'maplibre-gl-css';
        link.rel = 'stylesheet';
        link.href = 'https://unpkg.com/maplibre-gl@4.7.1/dist/maplibre-gl.css';
        document.head.appendChild(link);
      }

      const initMap = (maplibregl: any) => {
        if (!mapContainerRef.current) return;

        // Crear mapa vectorial 3D sin restricción de token
        mapInstance = new maplibregl.Map({
          container: mapContainerRef.current,
          center: userCoords,
          zoom: isFullScreen ? 16.5 : 15.8,
          pitch: 52, // Inclinación 3D realista
          bearing: -20,
          style: VECTOR_3D_STYLE,
        });

        const triggerResize = () => {
          if (mapInstance) {
            mapInstance.resize();
          }
        };

        mapInstance.on('load', () => {
          try {
            // Edificios 3D en tono dorado estilo Manchones Mexicanos (#F2CC8F)
            const layers = mapInstance.getStyle().layers;
            const labelLayerId = layers?.find(
              (layer: any) => layer.type === 'symbol' && layer.layout && layer.layout['text-field']
            )?.id;

            // Capa de extrusión 3D
            if (mapInstance.getSource('openmaptiles')) {
              mapInstance.addLayer(
                {
                  id: 'add-3d-buildings',
                  source: 'openmaptiles',
                  'source-layer': 'building',
                  type: 'fill-extrusion',
                  minzoom: 13,
                  paint: {
                    'fill-extrusion-color': '#F2CC8F',
                    'fill-extrusion-height': [
                      'interpolate',
                      ['linear'],
                      ['zoom'],
                      13,
                      0,
                      16,
                      ['get', 'render_height'],
                    ],
                    'fill-extrusion-base': [
                      'interpolate',
                      ['linear'],
                      ['zoom'],
                      13,
                      0,
                      16,
                      ['get', 'render_min_height'],
                    ],
                    'fill-extrusion-opacity': 0.85,
                  },
                },
                labelLayerId
              );
            }

            // GeoJSON del perímetro del Zócalo de Huajuapan de León (Eraser polygon)
            mapInstance.addSource('eraser', {
              type: 'geojson',
              data: {
                type: 'FeatureCollection',
                features: [
                  {
                    type: 'Feature',
                    properties: {},
                    geometry: {
                      coordinates: [
                        [
                          [-97.7795, 17.8075],
                          [-97.7775, 17.8075],
                          [-97.7775, 17.8058],
                          [-97.7795, 17.8058],
                          [-97.7795, 17.8075],
                        ],
                      ],
                      type: 'Polygon',
                    },
                  },
                ],
              },
            });

            // Borde punteado terracota (#E07A5F)
            mapInstance.addLayer({
              id: 'eraser-debug',
              type: 'line',
              source: 'eraser',
              paint: {
                'line-color': '#E07A5F',
                'line-dasharray': [0, 4, 3],
                'line-width': 5,
              },
            });

            // Marcadores interactivos
            pois.forEach((poi) => {
              const el = document.createElement('div');
              el.style.width = '34px';
              el.style.height = '34px';
              el.style.borderRadius = '50%';
              el.style.backgroundColor = poi.isClaimable ? '#81B29A' : '#E07A5F';
              el.style.border = '3px solid #3D405B';
              el.style.cursor = 'pointer';
              el.style.boxShadow = '3px 3px 0px #3D405B';
              el.style.display = 'flex';
              el.style.alignItems = 'center';
              el.style.justifyContent = 'center';
              el.style.fontSize = '15px';
              el.innerHTML = poi.isClaimable ? '🎁' : '📍';

              el.addEventListener('click', (e) => {
                e.stopPropagation();
                if (onSelectPOI) onSelectPOI(poi);
              });

              new maplibregl.Marker({ element: el })
                .setLngLat(poi.coords)
                .addTo(mapInstance);
            });
          } catch (e) {
            console.log('Map 3D layer load notice:', e);
          }

          requestAnimationFrame(triggerResize);
          setTimeout(triggerResize, 150);
          setTimeout(triggerResize, 600);
        });

        // ResizeObserver para recalcular el viewport WebGL dinámicamente
        if (typeof ResizeObserver !== 'undefined' && mapContainerRef.current) {
          resizeObserver = new ResizeObserver(() => {
            triggerResize();
          });
          resizeObserver.observe(mapContainerRef.current);
        }

        mapRef.current = mapInstance;
      };

      // Cargar motor MapLibre GL v4 vía CDN
      if ((window as any).maplibregl) {
        initMap((window as any).maplibregl);
      } else if (!document.getElementById('maplibre-gl-js-cdn')) {
        const script = document.createElement('script');
        script.id = 'maplibre-gl-js-cdn';
        script.src = 'https://unpkg.com/maplibre-gl@4.7.1/dist/maplibre-gl.js';
        script.onload = () => {
          if ((window as any).maplibregl) {
            initMap((window as any).maplibregl);
          }
        };
        document.head.appendChild(script);
      } else {
        const checkInterval = setInterval(() => {
          if ((window as any).maplibregl) {
            clearInterval(checkInterval);
            initMap((window as any).maplibregl);
          }
        }, 100);
      }
    }

    return () => {
      if (resizeObserver && mapContainerRef.current) {
        try {
          resizeObserver.disconnect();
        } catch (_) {}
      }
      if (mapRef.current) {
        try {
          if (typeof mapRef.current.remove === 'function') {
            mapRef.current.remove();
          }
        } catch (e) {
          // Captura limpia de destrucción segura de MapLibre
        }
        mapRef.current = null;
      }
    };
  }, [userCoords, pois, isFullScreen]);

  const targetHeight = isFullScreen ? '100vh' : typeof height === 'number' ? `${height}px` : height;

  return (
    <Pressable
      onPress={() => !isFullScreen && onOpenFullMap && onOpenFullMap()}
      className={`w-full overflow-hidden relative ${
        isFullScreen
          ? 'flex-1 border-0'
          : 'border-4 border-border rounded-xl shadow-brutal-md mb-4 active:scale-98 transition-transform'
      }`}
      style={{ height: targetHeight, minHeight: isFullScreen ? '100vh' : 220 } as any}
    >
      {Platform.OS === 'web' ? (
        <div
          ref={mapContainerRef}
          style={{
            width: '100%',
            height: '100%',
            minHeight: isFullScreen ? '100vh' : '220px',
            position: 'absolute',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            backgroundColor: '#E6EAEF',
          }}
        />
      ) : (
        <View className="flex-1 bg-[#E6EAEF] justify-center items-center">
          <Text className="text-border font-black text-sm uppercase">
            Mapa 3D Real (Huajuapan)
          </Text>
        </View>
      )}

      {/* Overlay Superior */}
      <View className="absolute top-4 left-4 bg-background/95 border-2 border-border px-3 py-1.5 shadow-brutal-sm flex-row items-center z-50">
        <FontAwesome5 name="map-marked-alt" size={14} color="#E07A5F" style={{ marginRight: 6 }} />
        <Text className="text-border font-black text-xs uppercase">
          {isFullScreen
            ? 'Mapa 3D Pantalla Completa • Huajuapan'
            : 'Radar 3D • Huajuapan de León'}
        </Text>
      </View>

      {/* 🔴 Botón Circular (X) para Cerrar en Pantalla Completa */}
      {isFullScreen && onCloseFullScreen ? (
        <Pressable
          onPress={onCloseFullScreen}
          className="absolute top-4 right-4 z-50 w-11 h-11 bg-background border-4 border-border rounded-full justify-center items-center shadow-brutal active:scale-95"
        >
          <FontAwesome5 name="times" size={18} color="#3D405B" />
        </Pressable>
      ) : (
        onOpenFullMap && (
          <View className="absolute bottom-3 right-3 bg-background border-2 border-border px-2.5 py-1 shadow-brutal-sm rounded-full flex-row items-center z-50">
            <FontAwesome5 name="expand-arrows-alt" size={10} color="#3D405B" style={{ marginRight: 4 }} />
            <Text className="text-border font-black text-[10px] uppercase">
              Toca para Expandir 3D
            </Text>
          </View>
        )
      )}
    </Pressable>
  );
}
