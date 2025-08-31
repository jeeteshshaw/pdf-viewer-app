import { View, Text, Image, Modal } from 'react-native'
import React, { useEffect, useState } from 'react'

const Splash = () => {
    const [ShowSplash, setShowSplash] = useState(true);

    useEffect(() => {
        setTimeout(() => {
            setShowSplash(false);
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