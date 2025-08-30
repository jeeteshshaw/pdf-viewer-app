import { Dimensions, PixelRatio, Platform } from 'react-native';

const { width: SCREEN_WIDTH, height: SCREEN_HEIGHT } = Dimensions.get('window');

// Base dimensions used for design
const baseWidth = 375;
const baseHeight = 812;

// Scaling functions
export const horizontalScale = (size: number): number => {
    const scale = SCREEN_WIDTH / baseWidth;
    const newSize = size * scale;
    return Math.round(PixelRatio.roundToNearestPixel(newSize));
};

export const verticalScale = (size: number): number => {
    const scale = SCREEN_HEIGHT / baseHeight;
    const newSize = size * scale;
    return Math.round(PixelRatio.roundToNearestPixel(newSize));
};

// Moderate scale for fonts and elements that shouldn't scale too dramatically
export const moderateScale = (size: number, factor = 0.5): number => {
    const scale = SCREEN_WIDTH / baseWidth;
    const newSize = size + (scale - 1) * size * factor;
    return Math.round(PixelRatio.roundToNearestPixel(newSize));
};

// Font scaling with platform-specific adjustments
export const fontScale = (size: number): number => {
    const scale = Math.min(SCREEN_WIDTH / baseWidth, SCREEN_HEIGHT / baseHeight);
    const newSize = Platform.OS === 'ios' ? size * scale : size * scale * 0.9;
    return Math.round(PixelRatio.roundToNearestPixel(newSize));
};

// Margin and padding scaling
export const spacing = {
    xs: horizontalScale(4),
    s: horizontalScale(8),
    m: horizontalScale(16),
    l: horizontalScale(24),
    xl: horizontalScale(32),
    xxl: horizontalScale(40),
};

// Border radius scaling
export const borderRadius = {
    xs: horizontalScale(4),
    s: horizontalScale(8),
    m: horizontalScale(12),
    l: horizontalScale(16),
    xl: horizontalScale(20),
};