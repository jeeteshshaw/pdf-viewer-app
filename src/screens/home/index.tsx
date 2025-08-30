import React, { useEffect, useState, useRef } from 'react';
import {
    View,
    Text,
    StyleSheet,
    ScrollView,
    TouchableOpacity,
    TextInput,
    Image,
    StatusBar,
    Alert,
    Dimensions,
} from 'react-native';
import Icon from 'react-native-vector-icons/MaterialIcons';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import { SafeAreaView } from 'react-native-safe-area-context';
import { normalize } from '../../utils/normalize';
import {
    horizontalScale,
    verticalScale,
    moderateScale,
    fontScale,
    spacing,
    borderRadius
} from '../../utils/metrics';
import { getCurrentLocation } from '../../utils/location';
import { StackActions, useNavigation } from '@react-navigation/native';

const Home = () => {
    const services = [
        { id: 1, name: 'Vehicle\nService', icon: 'car-repair', color: '#4285F4' },
        { id: 2, name: 'Tyres &\nWheel Care', icon: 'tire', color: '#4285F4' },
        { id: 3, name: 'Denting &\nPainting', icon: 'car-side', color: '#4285F4' },
        { id: 4, name: 'AC Service\n& Repair', icon: 'air-conditioner', color: '#4285F4' },
        { id: 5, name: 'Vehicle Spa\n& Cleaning', icon: 'car-wash', color: '#4285F4' },
        { id: 6, name: 'Batteries', icon: 'car-battery', color: '#4285F4' },
        { id: 7, name: 'Insurance\nClaims', icon: 'shield-plus', color: '#4285F4' },
        { id: 8, name: 'Windshield\n& Lights', icon: 'car-light-high', color: '#4285F4' },
        { id: 9, name: 'Clutch &\nBrakes', icon: 'car-brake-abs', color: '#4285F4' },
        { id: 10, name: 'Dryclean', icon: 'car-wash', color: '#4285F4' },
        { id: 11, name: 'Vehicle Wash', icon: 'car-wash', color: '#4285F4' },
        { id: 12, name: 'Oiling', icon: 'oil', color: '#4285F4' },
    ];

    const bannerData = [
        {
            title: 'BASIC SERVICE',
            subtitle: '& MAINTENANCE',
            startPrice: '₹199',
            image: 'https://via.placeholder.com/200x100',
            services: ['build', 'tire', 'oil', 'car-wash']
        },
        {
            title: 'PREMIUM SERVICE',
            subtitle: '& DETAILING',
            startPrice: '₹399',
            image: 'https://via.placeholder.com/200x100',
            services: ['car-repair', 'car-brake-abs', 'car-battery', 'car-wash']
        },
        {
            title: 'FULL SERVICE',
            subtitle: '& INSPECTION',
            startPrice: '₹599',
            image: 'https://via.placeholder.com/200x100',
            services: ['air-conditioner', 'car-side', 'shield-plus', 'car-light-high']
        },
    ];

    const [location, setLocation] = useState({
        city: 'Loading...',
        principalSubdivision: 'Loading...'
    });

    const [activeBannerIndex, setActiveBannerIndex] = useState(0);
    const scrollViewRef = useRef(null);
    const screenWidth = Dimensions.get('window').width;

    const navigation = useNavigation();

    useEffect(() => {
        const getLocation = async () => {
            try {
                const locationData = await getCurrentLocation();
                console.log('Location data:', locationData);
                setLocation({
                    city: locationData.city,
                    principalSubdivision: locationData.principalSubdivision
                });
            } catch (error) {
                Alert.alert(
                    'Location Error',
                    'Unable to get your location. Please check your permissions.',
                    [{ text: 'OK' }]
                );
            }
        };

        getLocation();
    }, []);

    return (
        <SafeAreaView style={styles.container}>
            <StatusBar barStyle="dark-content" backgroundColor="#F5F5F5" />

            {/* Header */}
            <View style={styles.header}>
                <View style={styles.headerLeft}>
                    <Text style={styles.greeting}>Hello Kamal</Text>
                    <View style={styles.locationContainer}>
                        <Text style={styles.location}>
                            {location.city}, {location.principalSubdivision}
                        </Text>
                        <Icon name="keyboard-arrow-down" size={20} color="#666" />
                    </View>
                </View>
                <View style={styles.profileContainer}>
                    <Image
                        source={{ uri: 'https://via.placeholder.com/50' }}
                        style={styles.profileImage}
                    />
                </View>
            </View>

            <ScrollView showsVerticalScrollIndicator={false}>
                {/* Search Bar */}
                <View style={styles.searchContainer}>
                    <Icon name="search" size={24} color="#999" style={styles.searchIcon} />
                    <TextInput
                        style={styles.searchInput}
                        placeholder="Search for a car service"
                        placeholderTextColor="#999"
                    />
                </View>

                {/* Banner Carousel */}
                <View style={styles.bannerContainer}>
                    <ScrollView
                        ref={scrollViewRef}
                        horizontal
                        pagingEnabled
                        showsHorizontalScrollIndicator={false}
                        onMomentumScrollEnd={(event) => {
                            const slideIndex = Math.round(
                                event.nativeEvent.contentOffset.x / (screenWidth - 40)
                            );
                            setActiveBannerIndex(slideIndex);
                        }}
                    >
                        {bannerData.map((banner, index) => (
                            <View key={index} style={[styles.banner, { width: screenWidth - 40 }]}>
                                <View style={styles.bannerContent}>
                                    <Text style={styles.bannerTitle}>
                                        {banner.title} <Text style={styles.bannerSubtitle}>{'\n'}{banner.subtitle}</Text>
                                    </Text>
                                    <Text style={styles.bannerPrice}>
                                        START FROM <Text style={styles.priceText}>{banner.startPrice}</Text>
                                    </Text>
                                    <TouchableOpacity style={styles.bookButton}>
                                        <Text style={styles.bookButtonText}>BOOK NOW</Text>
                                    </TouchableOpacity>
                                </View>
                                <View style={styles.bannerImageContainer}>
                                    <Image
                                        source={{ uri: banner.image }}
                                        style={styles.bannerImage}
                                    />
                                    <View style={styles.serviceIcons}>
                                        {banner.services.map((service, idx) => (
                                            <View key={idx} style={styles.serviceIcon}>
                                                <MaterialCommunityIcons name={service} size={16} color="#4285F4" />
                                            </View>
                                        ))}
                                    </View>
                                </View>
                            </View>
                        ))}
                    </ScrollView>

                    {/* Banner Dots */}
                    <View style={styles.dotsContainer}>
                        {bannerData.map((_, index) => (
                            <View
                                key={index}
                                style={[
                                    styles.dot,
                                    index === activeBannerIndex && styles.activeDot
                                ]}
                            />
                        ))}
                    </View>
                </View>

                {/* Select Service Section */}
                <View style={styles.servicesSection}>
                    <Text style={styles.sectionTitle}>Select Service</Text>
                    <View style={styles.servicesGrid}>
                        {services.map((service) => (
                            <TouchableOpacity key={service.id} style={styles.serviceCard} onPress={() => navigation.navigate('IssueSelection', { service })}>
                                <View style={styles.serviceIconContainer}>
                                    <MaterialCommunityIcons
                                        name={service.icon}
                                        size={32}
                                        color={service.color}
                                    />
                                </View>
                                <Text style={styles.serviceName}>{service.name}</Text>
                            </TouchableOpacity>
                        ))}
                    </View>
                </View>
            </ScrollView>

            {/* Bottom Navigation */}
            <View style={styles.bottomNav}>
                <TouchableOpacity style={styles.navItem}>
                    <Icon name="home" size={24} color="#4285F4" />
                    <Text style={[styles.navText, styles.activeNavText]}>Home</Text>
                </TouchableOpacity>
                <TouchableOpacity style={styles.navItem}>
                    <Icon name="directions-car" size={24} color="#999" />
                    <Text style={styles.navText}>Vehicles</Text>
                </TouchableOpacity>
                <TouchableOpacity style={styles.navItem} onPress={() => navigation.dispatch(StackActions.push('Orders'))}>
                    <Icon name="description" size={24} color="#999" />
                    <Text style={styles.navText}>Records</Text>
                </TouchableOpacity>
            </View>
        </SafeAreaView>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#F5F5F5',
    },
    header: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingHorizontal: spacing.m,
        paddingVertical: spacing.s,
        backgroundColor: '#F5F5F5',
    },
    headerLeft: {
        flex: 1,
    },
    greeting: {
        fontSize: fontScale(24),
        fontWeight: '600',
        color: '#333',
        marginBottom: verticalScale(4),
    },
    locationContainer: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    location: {
        fontSize: fontScale(16),
        color: '#666',
        marginRight: horizontalScale(4),
    },
    profileContainer: {
        width: horizontalScale(50),
        height: horizontalScale(50),
        borderRadius: horizontalScale(25),
        overflow: 'hidden',
    },
    profileImage: {
        width: '100%',
        height: '100%',
        backgroundColor: '#4285F4',
    },
    searchContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: '#FFF',
        marginHorizontal: spacing.m,
        marginVertical: spacing.s,
        paddingHorizontal: spacing.s,
        paddingVertical: spacing.s,
        borderRadius: borderRadius.m,
        elevation: 2,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.1,
        shadowRadius: 2,
    },
    searchIcon: {
        marginRight: 10,
    },
    searchInput: {
        flex: 1,
        fontSize: normalize(16),
        color: '#333',
    },
    bannerContainer: {
        marginHorizontal: 20,
        marginBottom: 20,
    },
    banner: {
        backgroundColor: '#1a237e',
        borderRadius: 15,
        padding: 20,
        flexDirection: 'row',
        overflow: 'hidden',
        height: 180,
    },
    bannerContent: {
        flex: 1,
        justifyContent: 'space-between',
    },
    bannerTitle: {
        color: '#FFF',
        fontSize: normalize(18),
        fontWeight: '700',
        lineHeight: normalize(24),
    },
    bannerSubtitle: {
        color: '#FF4444',
    },
    bannerPrice: {
        color: '#FFF',
        fontSize: normalize(14),
        marginVertical: 10,
    },
    priceText: {
        fontSize: normalize(18),
        fontWeight: '700',
    },
    bookButton: {
        backgroundColor: '#FF4444',
        paddingHorizontal: 20,
        paddingVertical: 8,
        borderRadius: 5,
        alignSelf: 'flex-start',
    },
    bookButtonText: {
        color: '#FFF',
        fontWeight: '600',
        fontSize: normalize(12),
    },
    bannerImageContainer: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
    },
    bannerImage: {
        width: 150,
        height: 80,
        resizeMode: 'contain',
    },
    serviceIcons: {
        flexDirection: 'row',
        marginTop: 10,
    },
    serviceIcon: {
        backgroundColor: '#FFF',
        borderRadius: 20,
        padding: 8,
        marginHorizontal: 2,
    },
    dotsContainer: {
        flexDirection: 'row',
        justifyContent: 'center',
        marginTop: 15,
    },
    dot: {
        width: 8,
        height: 8,
        borderRadius: 4,
        backgroundColor: '#CCC',
        marginHorizontal: 4,
    },
    activeDot: {
        backgroundColor: '#4285F4',
    },
    servicesSection: {
        paddingHorizontal: 20,
        paddingBottom: 100,
    },
    sectionTitle: {
        fontSize: normalize(20),
        fontWeight: '600',
        color: '#333',
        marginBottom: 20,
    },
    servicesGrid: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        justifyContent: 'space-between',
    },
    serviceCard: {
        width: `${30.6}%`,
        backgroundColor: '#FFF',
        borderRadius: borderRadius.m,
        padding: spacing.s,
        marginBottom: spacing.s,
        alignItems: 'center',
        elevation: 2,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.1,
        shadowRadius: 2,
    },
    serviceIconContainer: {
        marginBottom: 8,
    },
    serviceName: {
        fontSize: fontScale(12),
        color: '#333',
        textAlign: 'center',
        lineHeight: verticalScale(16),
    },
    bottomNav: {
        flexDirection: 'row',
        backgroundColor: '#FFF',
        paddingVertical: 10,
        paddingHorizontal: 20,
        borderTopWidth: 1,
        borderTopColor: '#E0E0E0',
        position: 'absolute',
        bottom: 0,
        left: 0,
        right: 0,
    },
    navItem: {
        flex: 1,
        alignItems: 'center',
        paddingVertical: 5,
    },
    navText: {
        fontSize: 12,
        color: '#999',
        marginTop: 4,
    },
    activeNavText: {
        color: '#4285F4',
    },
});

export default Home;
