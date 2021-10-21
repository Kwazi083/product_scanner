import 'react-native-gesture-handler';
import React, { useState, useEffect } from 'react';
import {
    SafeAreaView,
    ScrollView,
    StatusBar,
    StyleSheet,
    Text,
    useColorScheme,
    View,
    TextInput,
    Button,
    Alert,
    Pressable
} from 'react-native';

import {
    Colors,
    DebugInstructions,
    Header,
    LearnMoreLinks,
    ReloadInstructions,
} from 'react-native/Libraries/NewAppScreen';
import { KEY_ANDROID } from "@env";
const RNFS = require('react-native-fs')
const Sound = require('react-native-sound')
import Tts from 'react-native-tts';
import firestore from '@react-native-firebase/firestore';
import auth from '@react-native-firebase/auth';
import { BarCodeScanner } from 'expo-barcode-scanner';

const Scan = ({ navigation }) => {
    const isDarkMode = useColorScheme() === 'dark';
    const [barcode, onChangeBarcode] = React.useState('');
    let scannedItem
    let _data
    const displayName = auth().currentUser.email;

    const [hasPermission, setHasPermission] = useState(null);
    const [scanned, setScanned] = useState(false);
    const [text, setText] = useState('Scan Bracode')

    const askForCameraPermission = () => {
        (async () => {
            const { status } = await BarCodeScanner.requestPermissionsAsync();
            setHasPermission(status === 'granted');
        })()
    }

    // Request Camera Permission
    useEffect(() => {
        askForCameraPermission();
    }, []);

    // What happens when we scan the bar code
    const handleBarCodeScanned = ({ type, data }) => {
        setScanned(true);
        setText(data)
        console.log('Type: ' + type + '\nData: ' + data)
    };

    // Check permissions and return the screens
    if (hasPermission === null) {
        return (
            <View style={styles.container}>
                <Text>Requesting for camera permission</Text>
            </View>)
    }

    if (hasPermission === false) {
        return (
            <View style={styles.container}>
                <Text style={{ margin: 10 }}>No access to camera</Text>
                <Button title={'Allow Camera'} onPress={() => askForCameraPermission()} />
            </View>)
    }

    const db = firestore()

    const getProducts = (bar_code) => {
        db.collection('products')
            .doc(bar_code)
            .get()
            .then(documentSnapshot => {
                console.log('Product exists: ', documentSnapshot.exists);

                if (documentSnapshot.exists) {
                    _data = documentSnapshot.data()
                    console.log('Product data: ', _data.productName);
                    scannedItem = _data.productName + ' , ' + _data.size + ' , ' + _data.price + ' ' + 'Rands'
                    console.log("Data: ", scannedItem)
                    Tts.speak(scannedItem)
                }
            });
    }

    Tts.setDefaultLanguage('en-GB')

    const backgroundStyle = {
        backgroundColor: isDarkMode ? Colors.darker : Colors.lighter,
    };

    const signOut = () => {
        auth().signOut().then(() => {
            console.log('User Logged Out Successfully!')
            navigation.navigate('Login')
        })
    }

    return (
        <View style={styles.container}>

            <View style={styles.container}>

                <Text style={styles.textStyle}>
                    Hello, {displayName}
                </Text>

                <Button
                    color="#3740FE"
                    title="Logout"
                    onPress={() => signOut()}
                />

            </View>

            <View style={styles.barcodebox}>
                <BarCodeScanner
                    onBarCodeScanned={scanned ? undefined : handleBarCodeScanned}
                    style={{ height: 400, width: 400 }} />
            </View>
            <Text style={styles.maintext}>{text}</Text>
            {scanned && <Button title={'Scan again?'} onPress={() => setScanned(false)} color='tomato' />}

            <TextInput
                style={styles.input}
                onChangeText={getProducts(text)}
                value={text}
                placeholder="Barcode"
                keyboardType='numeric'
            />

            <View>
                {/* <Pressable style={styles.button} onPress={() => Tts.speak('barcode')}>
                    <Text style={styles.text}>Convert Text</Text>
                </Pressable> */}
                {/* <Pressable style={styles.button} onPress={() => getProducts(text)}>
                    <Text style={styles.text}>Test Reading Data</Text>
                </Pressable> */}
                <Pressable style={styles.button} onPress={() => navigation.navigate("Grocery List")}>
                    <Text style={styles.text}>Go to Grocery List</Text>
                </Pressable>
            </View>
        </View>


    );
};

const styles = StyleSheet.create({
    sectionContainer: {
        marginTop: 32,
        paddingHorizontal: 24,
    },
    sectionTitle: {
        fontSize: 24,
        fontWeight: '600',
    },
    sectionDescription: {
        marginTop: 8,
        fontSize: 18,
        fontWeight: '400',
    },
    highlight: {
        fontWeight: '700',
    },
    input: {
        height: 40,
        marginTop: 30,
        margin: 12,
        borderWidth: 1,
        display: 'none',
    },
    button: {
        margin: 10,
        alignItems: 'center',
        paddingVertical: 12,
        paddingHorizontal: 32,
        elevation: 3,
        borderRadius: 4,
        backgroundColor: '#3740FE',
    },
    text: {
        fontSize: 16,
        lineHeight: 21,
        fontWeight: 'bold',
        letterSpacing: 0.25,
        color: 'white',
    },
    container: {
        flex: 1,
        backgroundColor: '#fff',
        alignItems: 'center',
        justifyContent: 'center',
    },
    maintext: {
        fontSize: 16,
        margin: 20,
    },
    barcodebox: {
        alignItems: 'center',
        justifyContent: 'center',
        height: 300,
        width: 300,
        overflow: 'hidden',
        borderRadius: 30,
        backgroundColor: 'tomato'
    }
});

export default Scan;
