import { View, Text, Image, Modal } from 'react-native'
import React, { useEffect, useState } from 'react'
import { logEvent } from '../../utils/logger';

const Splash = () => {
    const [ShowSplash, setShowSplash] = useState(true);

    useEffect(() => {
        logEvent("home_splash_tapped", { screen: "Splash", action: "show_splash" });

        setTimeout(() => {
            setShowSplash(false);
            logEvent("home_splash_tapped", { screen: "Splash", action: "hide_splash" });

        }, 2000);
    }, []);
    return (
        <Modal visible={ShowSplash} animationType="fade" style={{ backgroundColor: "#fff" }}>
            <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
                <Image source={require('../../assets/splash.png')} style={{ width: 300, height: 600, resizeMode: 'contain' }} />
            </View>
        </Modal>
    )
}

export default Splash