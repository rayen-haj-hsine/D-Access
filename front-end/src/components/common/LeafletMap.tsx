import React, { useRef, useMemo, useEffect, forwardRef, useImperativeHandle } from 'react';
import { StyleSheet, View, ViewStyle } from 'react-native';
import { WebView, WebViewMessageEvent } from 'react-native-webview';
import type { MapRegion } from '../../types/map';
import { NearbyPlace, WheelchairAccessibility } from '../../types/place';
import { colors } from '../../constants/colors';

export type LeafletMapRef = {
  animateToRegion: (region: MapRegion, duration?: number) => void;
  zoomIn: () => void;
  zoomOut: () => void;
};

type LeafletMapProps = {
  region: MapRegion;
  markers: NearbyPlace[];
  onRegionChangeComplete?: (region: MapRegion) => void;
  onMarkerPress?: (place: NearbyPlace) => void;
  onPress?: () => void;
  style?: ViewStyle;
  showUserLocation?: boolean;
  selectedPlaceId?: string | null;
};

export const LeafletMap = forwardRef<LeafletMapRef, LeafletMapProps>(({
  region,
  markers,
  onRegionChangeComplete,
  onMarkerPress,
  onPress,
  style,
  showUserLocation = false,
  selectedPlaceId,
}, ref) => {
  const webViewRef = useRef<WebView>(null);

  useImperativeHandle(ref, () => ({
    animateToRegion: (newRegion: MapRegion) => {
      const script = `
        if (window.animateToRegion) {
          window.animateToRegion(${newRegion.latitude}, ${newRegion.longitude});
        }
        true;
      `;
      webViewRef.current?.injectJavaScript(script);
    },
    zoomIn: () => {
      console.log('[LeafletMap] Injecting map.zoomIn()');
      webViewRef.current?.injectJavaScript(`
        try { window.map.zoomIn(); } catch(e) {}
        true;
      `);
    },
    zoomOut: () => {
      console.log('[LeafletMap] Injecting map.zoomOut()');
      webViewRef.current?.injectJavaScript(`
        try { window.map.zoomOut(); } catch(e) {}
        true;
      `);
    }
  }));

  const [isMapReady, setIsMapReady] = React.useState(false);

  // Convert accessibility to color/icon for Leaflet
  const getMarkerHTML = (wheelchair: WheelchairAccessibility, isSelected: boolean) => {
    let color = colors.accessibilityUnknown;
    if (wheelchair === 'yes') color = colors.accessibilityYes;
    if (wheelchair === 'no') color = colors.accessibilityNo;
    if (wheelchair === 'limited') color = colors.accessibilityLimited;

    const borderColor = isSelected ? colors.primary : 'rgba(0,0,0,0.4)';
    const borderWidth = isSelected ? 4 : 2;
    const size = isSelected ? 36 : 28;
    const zIndex = isSelected ? 1000 : 0;

    return `
      <div style="
        width: ${size}px; 
        height: ${size}px; 
        background-color: ${color}; 
        border-radius: 50% 50% 50% 0;
        border: ${borderWidth}px solid ${borderColor};
        transform: rotate(-45deg);
        box-shadow: 0 0 8px rgba(0,0,0,0.4);
        display: flex;
        align-items: center;
        justify-content: center;
        z-index: ${zIndex};
      ">
        <div style="
          width: ${size/2.5}px;
          height: ${size/2.5}px;
          background-color: white;
          border-radius: 50%;
          transform: rotate(45deg);
        "></div>
      </div>
    `;
  };

  const htmlSource = useMemo(() => {
    const tileUrl = 'https://a.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}.png';
    const attribution = '© OpenStreetMap • © CARTO';

    return `
      <!DOCTYPE html>
      <html>
        <head>
          <meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no" />
          <link rel="stylesheet" href="https://unpkg.com/leaflet@1.9.4/dist/leaflet.css" />
          <script src="https://unpkg.com/leaflet@1.9.4/dist/leaflet.js"></script>
          <style>
            body { margin: 0; padding: 0; height: 100vh; width: 100vw; background: #EEE; }
            #map { height: 100%; width: 100%; }
            .custom-div-icon { background: none !important; border: none !important; }
          </style>
        </head>
        <body>
          <div id="map"></div>
          <script>
            window.map = L.map('map', {
              zoomControl: false,
              attributionControl: true
            }).setView([${region.latitude}, ${region.longitude}], 15);

            L.tileLayer('${tileUrl}', {
              maxZoom: 19,
              attribution: '${attribution}'
            }).addTo(map);

            var markers = {};

            window.updateMarkers = function(placesJson) {
              try {
                var places = JSON.parse(placesJson);
                var currentIds = places.map(p => p.sourceId);
                
                // Remove old
                Object.keys(markers).forEach(id => {
                  if (currentIds.indexOf(id) === -1) {
                    window.map.removeLayer(markers[id]);
                    delete markers[id];
                  }
                });

                // Add or reposition
                places.forEach(place => {
                  var [lng, lat] = place.location.coordinates;
                  var id = place.sourceId;
                  
                  if (!markers[id]) {
                    var icon = L.divIcon({
                      html: place.iconHtml,
                      className: 'custom-div-icon',
                      iconSize: [30, 30],
                      iconAnchor: [15, 30]
                    });

                    var m = L.marker([lat, lng], { icon: icon }).addTo(window.map);
                    m.on('click', function() {
                      window.ReactNativeWebView.postMessage(JSON.stringify({
                        type: 'MARKER_PRESS',
                        place: place
                      }));
                    });
                    markers[id] = m;
                  }
                });
              } catch(e) {
                 window.ReactNativeWebView.postMessage(JSON.stringify({type: 'ERROR', detail: e.message}));
              }
            }

            window.map.on('moveend', function() {
              var center = window.map.getCenter();
              var bounds = window.map.getBounds();
              window.ReactNativeWebView.postMessage(JSON.stringify({
                type: 'REGION_CHANGE',
                region: {
                  latitude: center.lat,
                  longitude: center.lng,
                  latitudeDelta: Math.abs(bounds.getNorth() - bounds.getSouth()),
                  longitudeDelta: Math.abs(bounds.getEast() - bounds.getWest())
                }
              }));
            });

            // Signal ready
            window.ReactNativeWebView.postMessage(JSON.stringify({ type: 'MAP_READY' }));

            // For animating region from RN via injectJavaScript
            window.animateToRegion = function(lat, lng) {
              try {
                window.map.flyTo([lat, lng], 15);
              } catch (e) {}
            };
          </script>
        </body>
      </html>
    `;
  }, []); // Only compute the HTML ONCE on mount. Use animateToRegion for jumps.

  // Sync markers when ready or when markers change
  useEffect(() => {
    if (!isMapReady) return;

    const formattedMarkers = markers.map(m => ({
      ...m,
      iconHtml: getMarkerHTML(
        m.accessibility?.wheelchair as WheelchairAccessibility || 'unknown',
        m.sourceId === selectedPlaceId
      )
    }));

    const placesString = JSON.stringify(formattedMarkers);
    
    // Use injectJavaScript instead of postMessage for reliable cross-platform execution
    const script = `
      if (window.updateMarkers) {
        window.updateMarkers(${JSON.stringify(placesString)});
      }
      true;
    `;
    
    webViewRef.current?.injectJavaScript(script);
  }, [markers, isMapReady, selectedPlaceId]);

  const handleMessage = (event: WebViewMessageEvent) => {
    try {
      const data = JSON.parse(event.nativeEvent.data);
      // Defer state updates to avoid React 'setState during render' warnings 
      // when Leaflet fires moveend/ready synchronously on mount
      setTimeout(() => {
        switch (data.type) {
          case 'MAP_READY':
            setIsMapReady(true);
            break;
          case 'MARKER_PRESS':
            onMarkerPress?.(data.place);
            break;
          case 'REGION_CHANGE':
            onRegionChangeComplete?.(data.region);
            break;
          case 'PRESS':
            onPress?.();
            break;
          case 'ERROR':
            console.warn('Leaflet Error:', data.detail);
            break;
        }
      }, 0);
    } catch (e) {
      console.error('Error parsing WebView message', e);
    }
  };

  return (
    <View style={[styles.container, style]}>
      <WebView
        ref={webViewRef}
        originWhitelist={['*']}
        source={{ html: htmlSource }}
        onMessage={handleMessage}
        domStorageEnabled={true}
        javaScriptEnabled={true}
        androidLayerType="software"
        scrollEnabled={true} 
        style={styles.map}
      />
    </View>
  );
});

const styles = StyleSheet.create({
  container: {
    flex: 1,
    overflow: 'hidden',
  },
  map: {
    flex: 1,
  },
});
