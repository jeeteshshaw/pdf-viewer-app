import { useNavigation } from '@react-navigation/native';
import React, { useEffect } from 'react';
import { View, StyleSheet, Dimensions } from 'react-native';
import Animated, {
    useSharedValue,
    useAnimatedStyle,
    withTiming,
    withRepeat,
    interpolate,
    Extrapolate,
    Easing,
} from 'react-native-reanimated';

const { width } = Dimensions.get('window');
const SIZE = width * 0.7; // Radar size relative to screen width
const CENTER = SIZE / 2;
const DURATION = 3000; // time for one wave expansion (ms)
const NUM_WAVES = 3;
const WAVE_DELAY = DURATION / NUM_WAVES;

const RadarWave = ({ delay }) => {
    const progress = useSharedValue(0);

    React.useEffect(() => {
        progress.value = withRepeat(
            withTiming(1, { duration: DURATION, easing: Easing.out(Easing.ease) }),
            -1,
            false,
            (finished) => { }
        );
    }, []);

    const animatedStyle = useAnimatedStyle(() => {
        // Interpolate radius from 0 to max (half size)
        const radius = interpolate(progress.value, [0, 1], [0, CENTER]);
        // Opacity fades from 0.5 to 0
        const opacity = interpolate(progress.value, [0, 0.7, 1], [0.5, 0.1, 0], Extrapolate.CLAMP);

        return {
            width: radius * 2,
            height: radius * 2,
            borderRadius: radius,
            opacity,
            position: 'absolute',
            top: CENTER - radius,
            left: CENTER - radius,
            borderWidth: 3,
            borderColor: '#2979FF',
            transform: [{ scale: 1 }],
        };
    }, []);

    // Start animation with delay
    React.useEffect(() => {
        const timeout = setTimeout(() => {
            progress.value = withRepeat(
                withTiming(1, { duration: DURATION, easing: Easing.out(Easing.ease) }),
                -1,
                false
            );
        }, delay);
        return () => clearTimeout(timeout);
    }, []);

    return <Animated.View style={animatedStyle} />;
};

export default function Search() {
    const navigation = useNavigation();
    useEffect(() => {
        setTimeout(() => {
            navigation.navigate('OfferList');
        }, 1000 * 15);
        // This effect runs once when the component mounts
        // You can add any initialization logic here if needed
    }, []);
    return (
        <View style={styles.container}>
            <View style={styles.radar}>
                {[...Array(NUM_WAVES)].map((_, i) => (
                    <RadarWave key={i} delay={i * WAVE_DELAY} />
                ))}

                {/* Center small dot */}
                <View style={styles.centerDot} />
            </View>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: '#0D1B2A', // Dark blue background for contrast
    },
    radar: {
        width: SIZE,
        height: SIZE,
        justifyContent: 'center',
        alignItems: 'center',
    },
    centerDot: {
        width: 16,
        height: 16,
        backgroundColor: '#2979FF',
        borderRadius: 8,
        position: 'absolute',
    },
});
