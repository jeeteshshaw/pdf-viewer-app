import { Dimensions, PixelRatio } from 'react-native';

const { width: SCREEN_WIDTH } = Dimensions.get('window');

// Base width used for design
const baseWidth = 375;

export const normalize = (size: number): number => {
    const scale = SCREEN_WIDTH / baseWidth;
    const newSize = size * scale;

    return Math.round(PixelRatio.roundToNearestPixel(newSize));
};