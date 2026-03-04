import React, { useEffect, useState } from 'react';
import {
    View,
    Text,
    ScrollView,
    TouchableOpacity,
    TextInput,
    Image,
    StyleSheet,
    StatusBar,
} from 'react-native';
import MapView, { Marker, UrlTile } from 'react-native-maps';
import * as Location from 'expo-location';
import { colors } from '../../constants/colors';
import { BackIcon } from '../../components/icons/BackIcon';
import { MapScreenProps } from '../../types/navigation';

const FILTER_CHIPS = ['All', 'Entrance', 'Toilet', 'Elevator', 'Parking'];
const FALLBACK_REGION = {
    latitude: 36.7538,
    longitude: 3.0588,
    latitudeDelta: 0.02,
    longitudeDelta: 0.02,
};

const MOCK_NEARBY_PLACES = [
    {
        id: '1',
        name: 'Coffee VI',
        distance: '0.7Km',
        rating: 4.8,
        reviews: 74,
        image: 'https://images.unsplash.com/photo-1554118811-1e0d58224f24?w=100&h=100&fit=crop',
    },
    {
        id: '2',
        name: 'Coffee VI',
        distance: '0.7Km',
        rating: 4.8,
        reviews: 74,
        image: 'https://images.unsplash.com/photo-1554118811-1e0d58224f24?w=100&h=100&fit=crop',
    },
];

const MOCK_REPORTS = [
    {
        id: '1',
        status: 'Accessible',
        statusColor: '#10B981',
        statusBg: '#D1FAE5',
        name: 'Hotel st Julian',
        time: 'Submitted 2 Days ago',
        distance: '350 ft away',
    },
    {
        id: '2',
        status: 'Partially Accessible',
        statusColor: '#F59E0B',
        statusBg: '#FEF3C7',
        name: 'Hotel st Julian',
        time: 'Submitted 2 Days ago',
        distance: '350 ft away',
    },
    {
        id: '3',
        status: 'Not Accessible',
        statusColor: '#EF4444',
        statusBg: '#FEE2E2',
        name: 'Hotel st Julian',
        time: 'Submitted 2 Days ago',
        distance: '350 ft away',
    },
];

export default function MapScreen({ navigation }: MapScreenProps<'MapMain'>) {
    const [activeFilter, setActiveFilter] = useState('All');
    const [mapRegion, setMapRegion] = useState(FALLBACK_REGION);

    useEffect(() => {
        let isMounted = true;

        const resolveUserLocation = async () => {
            try {
                const { status } = await Location.requestForegroundPermissionsAsync();

                if (status !== 'granted') {
                    return;
                }

                const currentPosition = await Location.getCurrentPositionAsync({});
                if (!isMounted) {
                    return;
                }

                setMapRegion({
                    latitude: currentPosition.coords.latitude,
                    longitude: currentPosition.coords.longitude,
                    latitudeDelta: 0.02,
                    longitudeDelta: 0.02,
                });
            } catch {
            }
        };

        resolveUserLocation();

        return () => {
            isMounted = false;
        };
    }, []);

    return (
        <View style={styles.container}>
            <StatusBar barStyle="dark-content" />

            {/* Interactive Map */}
            <View style={styles.mapContainer}>
                <MapView
                    style={styles.map}
                    region={mapRegion}
                    onRegionChangeComplete={setMapRegion}
                    showsUserLocation
                    showsMyLocationButton={false}
                    mapType="none"
                >
                    <UrlTile
                        urlTemplate="https://tile.openstreetmap.org/{z}/{x}/{y}.png"
                        maximumZ={19}
                        flipY={false}
                    />
                    <Marker
                        coordinate={{ latitude: 36.7538, longitude: 3.0588 }}
                        title="Coffee VI"
                        description="0.7Km away"
                    />
                </MapView>

                {/* Back button */}
                <TouchableOpacity onPress={() => navigation.goBack()} style={[styles.floatingButton, { position: 'absolute', top: 45, left: 16, zIndex: 10 }]}>
                          <BackIcon color={colors.gray900} />
                </TouchableOpacity>

                {/* Bookmark */}
                <TouchableOpacity style={styles.mapBookmarkBtn}>
                    <Text style={styles.bookmarkIcon}>🔖</Text>
                </TouchableOpacity>

                {/* Locate button */}
                <TouchableOpacity style={styles.locateBtn}>
                    <Text style={styles.locateIcon}>◎</Text>
                </TouchableOpacity>

                {/* Report button */}
                <TouchableOpacity
                    style={styles.reportBtn}
                    onPress={() => navigation.navigate('AddReport')}
                >
                    <Text style={styles.reportBtnText}>+ Report</Text>
                </TouchableOpacity>

                <View style={styles.attributionWrap}>
                    <Text style={styles.attributionText}>© OpenStreetMap contributors</Text>
                </View>
            </View>

            {/* Drag handle */}
            <View style={styles.handleRow}>
                <View style={styles.handle} />
            </View>

            {/* Bottom Panel */}
            <ScrollView style={styles.bottomPanel} showsVerticalScrollIndicator={false}>
                {/* Search */}
                <View style={styles.searchRow}>
                    <View style={styles.searchBar}>
                        <Text style={styles.searchIcon}>🔍</Text>
                        <TextInput
                            style={styles.searchInput}
                            placeholder="Search"
                            placeholderTextColor={colors.gray400}
                        />
                        <TouchableOpacity>
                            <Text style={{ fontSize: 18, color: colors.gray400 }}>🎤</Text>
                        </TouchableOpacity>
                    </View>
                    <TouchableOpacity style={styles.filterButton}>
                        <Text style={{ color: colors.white, fontSize: 16 }}>☰</Text>
                    </TouchableOpacity>
                </View>

                {/* Filter Chips */}
                <ScrollView
                    horizontal
                    showsHorizontalScrollIndicator={false}
                    style={{ marginBottom: 16 }}
                    contentContainerStyle={{ paddingHorizontal: 16 }}
                >
                    {FILTER_CHIPS.map((chip) => (
                        <TouchableOpacity
                            key={chip}
                            style={[styles.chip, activeFilter === chip && styles.chipActive]}
                            onPress={() => setActiveFilter(chip)}
                        >
                            {chip === 'All' && <Text style={{ fontSize: 10, marginRight: 4 }}>⊞</Text>}
                            <Text style={[styles.chipText, activeFilter === chip && styles.chipTextActive]}>
                                {chip}
                            </Text>
                        </TouchableOpacity>
                    ))}
                </ScrollView>

                {/* Nearby Accessible Places */}
                <View style={styles.sectionHeader}>
                    <Text style={styles.sectionTitle}>Nearby Accessible Places</Text>
                    <TouchableOpacity>
                        <Text style={styles.seeAll}>See all</Text>
                    </TouchableOpacity>
                </View>

                {MOCK_NEARBY_PLACES.map((place) => (
                    <TouchableOpacity
                        key={place.id}
                        style={styles.placeRow}
                        onPress={() => navigation.navigate('PlaceDetails', { place })}
                    >
                        <Image source={{ uri: place.image }} style={styles.placeThumb} />
                        <View style={styles.placeRowInfo}>
                            <Text style={styles.placeRowName}>{place.name}</Text>
                            <View style={styles.placeRowMeta}>
                                <Text style={styles.placeRowDistance}>{place.distance}</Text>
                                <Text style={styles.placeRowRating}>{place.rating}</Text>
                                <Text style={{ color: '#F59E0B', fontSize: 12 }}>★</Text>
                                <Text style={styles.placeRowReviews}>({place.reviews})</Text>
                            </View>
                        </View>
                        <TouchableOpacity>
                            <Text style={{ color: colors.primary, fontSize: 18 }}>♡</Text>
                        </TouchableOpacity>
                    </TouchableOpacity>
                ))}

                {/* Reports Nearby */}
                <View style={[styles.sectionHeader, { marginTop: 20 }]}>
                    <Text style={styles.sectionTitle}>Reports Nearby</Text>
                    <TouchableOpacity>
                        <Text style={styles.seeAll}>See all</Text>
                    </TouchableOpacity>
                </View>

                {MOCK_REPORTS.map((report) => (
                    <TouchableOpacity
                        key={report.id}
                        style={styles.reportCard}
                        onPress={() => navigation.navigate('ReportDetails', { report })}
                    >
                        <View style={[styles.statusBadge, { backgroundColor: report.statusBg }]}>
                            <Text style={{ fontSize: 12, marginRight: 4 }}>♿</Text>
                            <Text style={[styles.statusText, { color: report.statusColor }]}>
                                {report.status}
                            </Text>
                        </View>
                        <Text style={styles.reportName}>{report.name}</Text>
                        <Text style={styles.reportMeta}>
                            {report.time} • {report.distance}
                        </Text>
                    </TouchableOpacity>
                ))}

                <View style={{ height: 30 }} />
            </ScrollView>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: colors.white,
    },
    // ─── Map ───
    mapContainer: {
        height: '42%',
        position: 'relative' as const,
    },
    map: {
        width: '100%',
        height: '100%',
    },
     floatingButton: {
  backgroundColor: '#fff',       // make sure button has background
  padding: 10,
  borderRadius: 25,
  shadowColor: '#000',
  shadowOffset: { width: 0, height: 2 },
  shadowOpacity: 0.3,
  shadowRadius: 3,
  elevation: 5,                  // for Android
},
    mapBackBtn: {
        position: 'absolute',
        top: 50,
        left: 16,
        width: 36,
        height: 36,
        borderRadius: 18,
        backgroundColor: colors.white,
        alignItems: 'center',
        justifyContent: 'center',
        shadowColor: '#000',
        shadowOpacity: 0.1,
        shadowRadius: 4,
        elevation: 3,
    },
    mapBookmarkBtn: {
        position: 'absolute',
        top: 50,
        right: 16,
        width: 36,
        height: 36,
        borderRadius: 18,
        backgroundColor: colors.white,
        alignItems: 'center',
        justifyContent: 'center',
        shadowColor: '#000',
        shadowOpacity: 0.1,
        shadowRadius: 4,
        elevation: 3,
    },
    navIcon: { fontSize: 18 },
    bookmarkIcon: { fontSize: 16 },
    locateIcon: { fontSize: 16 },
    locateBtn: {
        position: 'absolute',
        right: 16,
        bottom: 50,
        width: 36,
        height: 36,
        borderRadius: 18,
        backgroundColor: colors.white,
        alignItems: 'center',
        justifyContent: 'center',
        shadowColor: '#000',
        shadowOpacity: 0.1,
        shadowRadius: 4,
        elevation: 3,
    },
    reportBtn: {
        position: 'absolute',
        right: 16,
        bottom: 10,
        backgroundColor: colors.primary,
        paddingHorizontal: 14,
        paddingVertical: 8,
        borderRadius: 8,
    },
    reportBtnText: {
        color: colors.white,
        fontWeight: '600',
        fontSize: 13,
    },
    attributionWrap: {
        position: 'absolute',
        left: 12,
        bottom: 10,
        backgroundColor: 'rgba(255,255,255,0.92)',
        paddingHorizontal: 8,
        paddingVertical: 4,
        borderRadius: 6,
    },
    attributionText: {
        color: colors.gray700,
        fontSize: 10,
        fontWeight: '500',
    },
    // Handle
    handleRow: {
        alignItems: 'center',
        paddingVertical: 10,
    },
    handle: {
        width: 40,
        height: 4,
        borderRadius: 2,
        backgroundColor: colors.gray300,
    },
    // Bottom panel
    bottomPanel: {
        flex: 1,
    },
    // Search
    searchRow: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingHorizontal: 16,
        marginBottom: 12,
    },
    searchBar: {
        flex: 1,
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: colors.gray100,
        borderRadius: 12,
        paddingHorizontal: 12,
        height: 44,
        marginRight: 10,
    },
    searchIcon: {
        fontSize: 16,
        marginRight: 8,
        color: colors.gray400,
    },
    searchInput: {
        flex: 1,
        fontSize: 15,
        color: colors.gray800,
    },
    filterButton: {
        width: 44,
        height: 44,
        borderRadius: 12,
        backgroundColor: '#1B3A4B',
        alignItems: 'center',
        justifyContent: 'center',
    },
    // Chips
    chip: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingHorizontal: 14,
        paddingVertical: 8,
        borderRadius: 20,
        backgroundColor: colors.white,
        borderWidth: 1,
        borderColor: colors.gray200,
        marginRight: 8,
    },
    chipActive: {
        backgroundColor: '#1B3A4B',
        borderColor: '#1B3A4B',
    },
    chipText: {
        fontSize: 13,
        color: colors.gray600,
        fontWeight: '500',
    },
    chipTextActive: {
        color: colors.white,
    },
    // Section
    sectionHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingHorizontal: 16,
        marginBottom: 10,
    },
    sectionTitle: {
        fontSize: 16,
        fontWeight: '700',
        color: colors.gray900,
    },
    seeAll: {
        fontSize: 14,
        color: colors.primary,
        fontWeight: '500',
    },
    // Place Row
    placeRow: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingHorizontal: 16,
        paddingVertical: 10,
        borderBottomWidth: 1,
        borderBottomColor: colors.gray100,
    },
    placeThumb: {
        width: 50,
        height: 50,
        borderRadius: 10,
        marginRight: 12,
    },
    placeRowInfo: {
        flex: 1,
    },
    placeRowName: {
        fontSize: 15,
        fontWeight: '600',
        color: colors.gray900,
    },
    placeRowMeta: {
        flexDirection: 'row',
        alignItems: 'center',
        marginTop: 2,
        gap: 4,
    },
    placeRowDistance: {
        fontSize: 12,
        color: colors.gray500,
    },
    placeRowRating: {
        fontSize: 12,
        fontWeight: '600',
        color: colors.gray800,
    },
    placeRowReviews: {
        fontSize: 12,
        color: colors.gray400,
    },
    // Report
    reportCard: {
        marginHorizontal: 16,
        marginBottom: 12,
        padding: 14,
        borderRadius: 12,
        borderWidth: 1,
        borderColor: colors.gray100,
        backgroundColor: colors.white,
    },
    statusBadge: {
        flexDirection: 'row',
        alignItems: 'center',
        alignSelf: 'flex-start',
        paddingHorizontal: 10,
        paddingVertical: 4,
        borderRadius: 12,
        marginBottom: 8,
    },
    statusText: {
        fontSize: 12,
        fontWeight: '600',
    },
    reportName: {
        fontSize: 15,
        fontWeight: '600',
        color: colors.gray900,
        marginBottom: 4,
    },
    reportMeta: {
        fontSize: 12,
        color: colors.gray500,
    },
});
