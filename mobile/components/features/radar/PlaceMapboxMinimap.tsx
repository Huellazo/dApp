import React, { useEffect, useRef, useState } from 'react';
import { View, Text, Pressable, Platform, Linking, Modal } from 'react-native';
import { FontAwesome5 } from '@expo/vector-icons';
import { MOCK_POIS } from '@/mocks/db';

// Estilo Vectorial 2D Limpio de libre acceso (CARTO Voyager 2D)
const VECTOR_2D_STYLE = 'https://basemaps.cartocdn.com/gl/voyager-gl-style/style.json';

interface PlaceMapboxMinimapProps {
  placeName: string;
  coords: [number, number]; // [lng, lat]
  address?: string;
  category?: string;
  type?: string;
}

// Clasificación de ícono y color según categoría del lugar
function getPlaceMarkerStyle(type: string = '', category: string = '') {
  const t = type.toLowerCase() + ' ' + category.toLowerCase();
  if (t.includes('café') || t.includes('bistró') || t.includes('cafe')) {
    return { emoji: '☕', color: '#D4A373', badge: 'CAFÉ' };
  }
  if (t.includes('restaurante') || t.includes('fonda') || t.includes('asador') || t.includes('comida') || t.includes('cocina')) {
    return { emoji: '🍽️', color: '#E07A5F', badge: 'RESTAURANTE' };
  }
  if (t.includes('mercado') || t.includes('artesanía') || t.includes('tienda')) {
    return { emoji: '🛍️', color: '#F4A261', badge: 'MERCADO' };
  }
  if (t.includes('mirador') || t.includes('ecoturismo') || t.includes('río') || t.includes('presa')) {
    return { emoji: '🏞️', color: '#2A9D8F', badge: 'NATURALEZA' };
  }
  return { emoji: '🏛️', color: '#81B29A', badge: 'CULTURA' };
}

export function PlaceMapboxMinimap({
  placeName,
  coords,
  address = 'Huajuapan de León, Oaxaca',
  category = 'Lugar Comercial',
  type = '',
}: PlaceMapboxMinimapProps) {
  const mapContainerRef = useRef<HTMLDivElement | null>(null);
  const fullMapContainerRef = useRef<HTMLDivElement | null>(null);
  const mapRef = useRef<any>(null);
  const fullMapRef = useRef<any>(null);
  const [isFullMapVisible, setIsFullMapVisible] = useState(false);

  const primaryMarkerInfo = getPlaceMarkerStyle(type || placeName, category);

  // Inyectar estilos CSS para la animación del Pin Seleccionado
  useEffect(() => {
    if (Platform.OS === 'web' && typeof document !== 'undefined') {
      if (!document.getElementById('map-pin-pulse-css')) {
        const style = document.createElement('style');
        style.id = 'map-pin-pulse-css';
        style.innerHTML = `
          @keyframes pinPulse {
            0% { transform: scale(0.95); box-shadow: 0 0 0 0 rgba(224, 122, 95, 0.7); }
            70% { transform: scale(1.15); box-shadow: 0 0 0 16px rgba(224, 122, 95, 0); }
            100% { transform: scale(0.95); box-shadow: 0 0 0 0 rgba(224, 122, 95, 0); }
          }
          .selected-place-pin {
            animation: pinPulse 2s infinite ease-in-out;
          }
        `;
        document.head.appendChild(style);
      }
    }
  }, []);

  // Inicialización de mapa 2D centrado de forma lógica en el lugar seleccionado
  const setup2DMap = (container: HTMLDivElement, isFullscreenMode: boolean) => {
    if (typeof window === 'undefined' || !container) return null;

    if (!document.getElementById('maplibre-gl-css')) {
      const link = document.createElement('link');
      link.id = 'maplibre-gl-css';
      link.rel = 'stylesheet';
      link.href = 'https://unpkg.com/maplibre-gl@4.7.1/dist/maplibre-gl.css';
      document.head.appendChild(link);
    }

    const maplibregl = (window as any).maplibregl;
    if (!maplibregl) return null;

    // Mapa 2D plano enfocado con zoom 16.5 exactamente en las coordenadas del lugar
    const map = new maplibregl.Map({
      container: container,
      style: VECTOR_2D_STYLE,
      center: coords, // Centrado lógico en el comercio
      zoom: isFullscreenMode ? 16.8 : 16.2,
      pitch: 0, // Vista 2D plana
      bearing: 0,
    });

    const triggerResize = () => {
      if (map) map.resize();
    };

    map.on('load', () => {
      // 1. Agregar marcadores de la base de datos de Huajuapan
      MOCK_POIS.forEach((poi) => {
        const poiLng = poi.coordinates.longitude;
        const poiLat = poi.coordinates.latitude;
        
        // Determinar si este punto es el comercio/lugar actual consultado
        const isCurrentPlace =
          Math.abs(poiLng - coords[0]) < 0.0005 && Math.abs(poiLat - coords[1]) < 0.0005;

        const markerStyle = getPlaceMarkerStyle(poi.type || poi.name, poi.category);

        const el = document.createElement('div');
        if (isCurrentPlace) {
          el.className = 'selected-place-pin';
          el.style.width = '46px';
          el.style.height = '46px';
          el.style.borderRadius = '50%';
          el.style.backgroundColor = '#E07A5F';
          el.style.border = '4px solid #3D405B';
          el.style.boxShadow = '4px 4px 0px #3D405B';
          el.style.display = 'flex';
          el.style.alignItems = 'center';
          el.style.justifyContent = 'center';
          el.style.fontSize = '22px';
          el.style.cursor = 'pointer';
          el.style.zIndex = '9999';
        } else {
          el.style.width = '32px';
          el.style.height = '32px';
          el.style.borderRadius = '50%';
          el.style.backgroundColor = markerStyle.color;
          el.style.border = '2.5px solid #3D405B';
          el.style.boxShadow = '2px 2px 0px #3D405B';
          el.style.display = 'flex';
          el.style.alignItems = 'center';
          el.style.justifyContent = 'center';
          el.style.fontSize = '14px';
          el.style.cursor = 'pointer';
          el.style.opacity = '0.85';
          el.style.zIndex = '100';
        }
        el.innerHTML = isCurrentPlace ? '📍' : markerStyle.emoji;

        // Popup interactivo de información del negocio
        const popupContent = `
          <div style="font-family: system-ui, sans-serif; padding: 8px; text-align: center; max-width: 200px;">
            <div style="font-size: 10px; font-weight: 900; text-transform: uppercase; color: #E07A5F; margin-bottom: 2px;">
              ${isCurrentPlace ? '📍 LUGAR SELECCIONADO' : markerStyle.badge}
            </div>
            <div style="font-weight: 900; font-size: 14px; color: #3D405B; margin-bottom: 4px; line-height: 1.2;">
              ${poi.name}
            </div>
            <div style="font-size: 11px; font-weight: 700; color: #666; margin-bottom: 8px;">
              ${poi.address}
            </div>
            <a 
              href="https://www.google.com/maps/search/?api=1&query=${poiLat},${poiLng}" 
              target="_blank" 
              style="display: inline-block; background-color: #F4F1DE; border: 2.5px solid #3D405B; color: #3D405B; font-size: 10px; font-weight: 900; text-decoration: none; padding: 5px 10px; text-transform: uppercase; border-radius: 6px; box-shadow: 2px 2px 0px #3D405B;"
            >
              Cómo llegar 🗺️
            </a>
          </div>
        `;

        const popup = new maplibregl.Popup({ offset: 25 }).setHTML(popupContent);

        const marker = new maplibregl.Marker({ element: el })
          .setLngLat([poiLng, poiLat])
          .setPopup(popup)
          .addTo(map);

        // Si es el lugar seleccionado, abrir automáticamente el Popup al cargar
        if (isCurrentPlace) {
          popup.addTo(map);
        }
      });

      requestAnimationFrame(triggerResize);
      setTimeout(triggerResize, 200);
    });

    return map;
  };

  // Efecto para el minimapa
  useEffect(() => {
    if (Platform.OS === 'web' && typeof window !== 'undefined') {
      const loadEngine = () => {
        if ((window as any).maplibregl && mapContainerRef.current) {
          mapRef.current = setup2DMap(mapContainerRef.current, false);
        }
      };

      if ((window as any).maplibregl) {
        loadEngine();
      } else if (!document.getElementById('maplibre-gl-js-cdn')) {
        const script = document.createElement('script');
        script.id = 'maplibre-gl-js-cdn';
        script.src = 'https://unpkg.com/maplibre-gl@4.7.1/dist/maplibre-gl.js';
        script.onload = loadEngine;
        document.head.appendChild(script);
      } else {
        const check = setInterval(() => {
          if ((window as any).maplibregl) {
            clearInterval(check);
            loadEngine();
          }
        }, 100);
      }
    }

    return () => {
      if (mapRef.current) {
        try {
          if (typeof mapRef.current.remove === 'function') {
            mapRef.current.remove();
          }
        } catch (_) {}
        mapRef.current = null;
      }
    };
  }, [coords]);

  // Efecto para el modal de pantalla completa 2D
  useEffect(() => {
    if (isFullMapVisible && Platform.OS === 'web' && typeof window !== 'undefined') {
      setTimeout(() => {
        if (fullMapContainerRef.current && (window as any).maplibregl) {
          fullMapRef.current = setup2DMap(fullMapContainerRef.current, true);
        }
      }, 100);
    }

    return () => {
      if (fullMapRef.current) {
        try {
          if (typeof fullMapRef.current.remove === 'function') {
            fullMapRef.current.remove();
          }
        } catch (_) {}
        fullMapRef.current = null;
      }
    };
  }, [isFullMapVisible, coords]);

  const handleOpenExternalMaps = () => {
    const [lng, lat] = coords;
    const url = `https://www.google.com/maps/search/?api=1&query=${lat},${lng}`;
    Linking.openURL(url).catch((err) => console.log('Error opening maps:', err));
  };

  return (
    <View className="w-full bg-background border-4 border-border shadow-brutal my-4 overflow-hidden rounded-xl">
      {/* Banner Superior del Mapa 2D */}
      <View className="bg-surface border-b-3 border-border p-3 flex-row items-center justify-between">
        <View className="flex-row items-center flex-1 mr-2">
          <View className="p-2 border-2 border-border shadow-brutal-sm mr-2.5 rounded-lg" style={{ backgroundColor: primaryMarkerInfo.color }}>
            <Text className="text-base">{primaryMarkerInfo.emoji}</Text>
          </View>
          <View className="flex-1">
            <View className="flex-row items-center">
              <Text className="text-border font-black text-sm uppercase mr-2" numberOfLines={1}>
                {placeName}
              </Text>
              <View className="bg-accent1/20 border border-border px-1.5 py-0.5 rounded">
                <Text className="text-[9px] font-black text-border uppercase">
                  {primaryMarkerInfo.badge}
                </Text>
              </View>
            </View>
            <Text className="text-border/70 font-bold text-[10px] uppercase mt-0.5" numberOfLines={1}>
              📍 {address}
            </Text>
          </View>
        </View>

        <View className="flex-row items-center gap-1.5">
          <Pressable
            onPress={() => setIsFullMapVisible(true)}
            className="bg-background border-2 border-border p-2 shadow-brutal-sm active:scale-95 rounded-lg"
          >
            <FontAwesome5 name="expand-arrows-alt" size={12} color="#3D405B" />
          </Pressable>

          <Pressable
            onPress={handleOpenExternalMaps}
            className="bg-accent2 border-2 border-border px-2.5 py-1.5 shadow-brutal-sm active:scale-95 flex-row items-center rounded-lg"
          >
            <FontAwesome5 name="directions" size={12} color="#3D405B" style={{ marginRight: 4 }} />
            <Text className="text-border font-black text-[10px] uppercase">Ruta</Text>
          </Pressable>
        </View>
      </View>

      {/* Contenedor del Mapa 2D Interactivo */}
      <Pressable onPress={() => setIsFullMapVisible(true)} className="w-full h-64 bg-[#E6EAEF] relative">
        {Platform.OS === 'web' ? (
          <div
            ref={mapContainerRef}
            style={{
              width: '100%',
              height: '100%',
              minHeight: '256px',
              position: 'absolute',
              top: 0,
              left: 0,
              right: 0,
              bottom: 0,
            }}
          />
        ) : (
          <View className="flex-1 justify-center items-center bg-[#E6EAEF]">
            <Text className="text-border font-black text-xs uppercase">
              Mapa 2D Interactivo ({placeName})
            </Text>
          </View>
        )}

        {/* Indicador de Pin Seleccionado */}
        <View className="absolute top-3 left-3 bg-primary border-2 border-border px-2.5 py-1 shadow-brutal-sm rounded-lg flex-row items-center z-10">
          <FontAwesome5 name="map-pin" size={10} color="#FAF9F6" style={{ marginRight: 5 }} />
          <Text className="text-background font-black text-[10px] uppercase">
            Ubicación Exacta Marcada
          </Text>
        </View>

        {/* Botón Flotante para Expandir */}
        <View className="absolute bottom-3 right-3 bg-background/95 border-2 border-border px-2.5 py-1 shadow-brutal-sm rounded-full flex-row items-center z-10">
          <FontAwesome5 name="search-plus" size={10} color="#3D405B" style={{ marginRight: 4 }} />
          <Text className="text-border font-black text-[9px] uppercase">
            Expandir Mapa 2D
          </Text>
        </View>
      </Pressable>

      {/* Modal de Mapa 2D Pantalla Completa */}
      <Modal visible={isFullMapVisible} animationType="fade" onRequestClose={() => setIsFullMapVisible(false)}>
        <View className="flex-1 bg-background relative">
          {/* Header Modal */}
          <View className="bg-surface border-b-4 border-border p-4 flex-row justify-between items-center z-50">
            <View className="flex-row items-center">
              <View className="p-2 border-2 border-border shadow-brutal-sm mr-2.5 rounded-lg" style={{ backgroundColor: primaryMarkerInfo.color }}>
                <Text className="text-base">{primaryMarkerInfo.emoji}</Text>
              </View>
              <View>
                <Text className="text-border font-black text-lg uppercase">
                  {placeName}
                </Text>
                <Text className="text-border/70 font-bold text-xs uppercase">
                  📍 Ubicación Exacta • Huajuapan de León
                </Text>
              </View>
            </View>

            <Pressable
              onPress={() => setIsFullMapVisible(false)}
              className="w-10 h-10 rounded-full bg-background border-3 border-border justify-center items-center shadow-brutal active:scale-95"
            >
              <FontAwesome5 name="times" size={16} color="#3D405B" />
            </Pressable>
          </View>

          {/* Mapa 2D Modal */}
          <View className="flex-1 relative bg-[#E6EAEF]">
            {Platform.OS === 'web' ? (
              <div
                ref={fullMapContainerRef}
                style={{
                  width: '100%',
                  height: '100%',
                  position: 'absolute',
                  top: 0,
                  left: 0,
                  right: 0,
                  bottom: 0,
                }}
              />
            ) : (
              <View className="flex-1 justify-center items-center">
                <Text className="text-border font-black text-sm uppercase">
                  Mapa 2D Pantalla Completa
                </Text>
              </View>
            )}

            {/* Leyenda Inferior en Pantalla Completa */}
            <View className="absolute bottom-6 left-4 right-4 bg-background/95 border-3 border-border p-3 shadow-brutal rounded-xl flex-row justify-around items-center z-50">
              <View className="flex-row items-center">
                <Text className="mr-1 text-sm">📍</Text>
                <Text className="text-border font-black text-[10px] uppercase">Lugar Actual</Text>
              </View>
              <View className="flex-row items-center">
                <Text className="mr-1 text-sm">☕</Text>
                <Text className="text-border font-black text-[10px] uppercase">Cafés</Text>
              </View>
              <View className="flex-row items-center">
                <Text className="mr-1 text-sm">🍽️</Text>
                <Text className="text-border font-black text-[10px] uppercase">Restaurantes</Text>
              </View>
              <View className="flex-row items-center">
                <Text className="mr-1 text-sm">🛍️</Text>
                <Text className="text-border font-black text-[10px] uppercase">Mercados</Text>
              </View>
              <View className="flex-row items-center">
                <Text className="mr-1 text-sm">🏛️</Text>
                <Text className="text-border font-black text-[10px] uppercase">Cultura</Text>
              </View>
            </View>
          </View>
        </View>
      </Modal>
    </View>
  );
}
