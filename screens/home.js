// import React from 'react';
// import { Button, View, Text, StyleSheet } from 'react-native';
// import auth from '@react-native-firebase/auth';
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

const Section = ({ children, title }) => {
    const isDarkMode = useColorScheme() === 'dark';
    return (
        <View style={styles.sectionContainer}>
            <Text
                style={[
                    styles.sectionTitle,
                    {
                        color: isDarkMode ? Colors.white : Colors.black,
                    },
                ]}>
                {title}
            </Text>
            <Text
                style={[
                    styles.sectionDescription,
                    {
                        color: isDarkMode ? Colors.light : Colors.dark,
                    },
                ]}>
                {children}
            </Text>
        </View>
    );
};

const Home = ({ navigation }) => {

    // const displayName = auth().currentUser.email;

    const isDarkMode = useColorScheme() === 'dark';
    const [barcode, onChangeBarcode] = React.useState('');
    let scannedItem
    let _data

    const [hasPermission, setHasPermission] = useState(null);
    const [scanned, setScanned] = useState(false);
    const [text, setText] = useState('Scan Bracode')

    const askForCameraPermission = () => {
        (async () => {
            const { status } = await BarCodeScanner.requestPermissionsAsync();
            setHasPermission(status === 'granted');
        })()
    }

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

    // Request Camera Permission
    useEffect(() => {
        askForCameraPermission();
    }, []);

    return (
        // <View style={styles.container}>

        //     <Text style={styles.textStyle}>
        //         Hello, {displayName}
        //     </Text>

        //     <Button
        //         color="#3740FE"
        //         title="Logout"
        //         onPress={() => signOut()}
        //     />

        // </View>
        <SafeAreaView style={backgroundStyle}>
            <StatusBar barStyle={isDarkMode ? 'light-content' : 'dark-content'} />
            <ScrollView
                contentInsetAdjustmentBehavior="automatic"
                style={backgroundStyle}>
                <Header />

                <View style={styles.container}>

                    <Text style={styles.textStyle}>
                        Hello, Kwazi
                    </Text>

                    <Button
                        color="#3740FE"
                        title="Logout"
                        onPress={() => signOut()}
                    />

                </View>

                <View
                    style={{
                        backgroundColor: isDarkMode ? Colors.black : Colors.white,
                    }}>
                    <Section title="Kwazikwakhe Buthelezi">
                        <Text style={styles.highlight}>I'm The Goat</Text>
                    </Section>

                    {/* Return the view */}

                    <View style={styles.container}>
                        <View style={styles.barcodebox}>
                            <BarCodeScanner
                                onBarCodeScanned={scanned ? undefined : handleBarCodeScanned}
                                style={{ height: 400, width: 400 }} />
                        </View>
                        <Text style={styles.maintext}>{text}</Text>
                        {scanned && <Button title={'Scan again?'} onPress={() => setScanned(false)} color='tomato' />}

                    </View>

                    <TextInput
                        style={styles.input}
                        onChangeText={onChangeBarcode}
                        value={text}
                        placeholder="Barcode"
                    // keyboardType='numeric'
                    />
                    <View>
                        <Pressable style={styles.button} onPress={() => Tts.speak('barcode')}>
                            <Text style={styles.text}>Convert Text</Text>
                        </Pressable>
                        <Pressable style={styles.button} onPress={() => getProducts(text)}>
                            <Text style={styles.text}>Test Reading Data</Text>
                        </Pressable>
                    </View>
                    {/* onChangeText={Tts.speak(productData)} */}
                    {/* <Text>{productData}</Text> */}
                    {/* <Section title="See Your Changes">
                <ReloadInstructions />
            </Section> */}
                    {/* <Section title="Debug">
                <DebugInstructions />
            </Section> */}
                    {/* <Section title="Learn More">
                Read more Kwazi's coming blog post
            </Section>
            <LearnMoreLinks /> */}

                    {/* Voice API Key */}
                    {/* AIzaSyBQwzwlVpdEgBadrdcbG2ncD3TX3uqqueM */}
                </View>
            </ScrollView>
        </SafeAreaView>
    )
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        display: "flex",
        justifyContent: 'center',
        alignItems: 'center',
        padding: 35,
        backgroundColor: '#fff'
    },
    textStyle: {
        fontSize: 15,
        marginBottom: 20
    },
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
    },
    button: {
        margin: 10,
        alignItems: 'center',
        paddingVertical: 12,
        paddingHorizontal: 32,
        elevation: 3,
        borderRadius: 4,
        backgroundColor: '#209e65',
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

export default Home;
