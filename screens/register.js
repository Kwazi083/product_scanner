import React from 'react';
import { Button, View, Text, StyleSheet, TextInput, Alert } from 'react-native';
import auth from '@react-native-firebase/auth';

export default function Register({ navigation }) {

    const [displayName, setDisplayName] = React.useState('');
    const [email, setEmail] = React.useState('');
    const [password, setPassword] = React.useState('');
    const [isLoading, setIsLoading] = React.useState(false);

    const registerUser = () => {

        if (displayName === '' && email === '' && password === '') {
            Alert.alert('Enter Sign Up Details!')
        } else {
            setIsLoading(true);
            auth()
                .createUserWithEmailAndPassword(email, password)
                .then(() => {
                    console.log('User account created & signed in!');
                    setDisplayName('')
                    setEmail('')
                    setPassword('')
                    setIsLoading(false)
                    navigation.navigate('Login')
                })
                .catch(error => {
                    if (error.code === 'auth/email-already-in-use') {
                        console.log('That email address is already in use!');
                    }

                    if (error.code === 'auth/invalid-email') {
                        console.log('That email address is invalid!');
                    }

                    console.error(error);
                });
        }
    }

    return (
        <View style={{ flex: 1, justifyContent: 'center' }}>

            <View style={styles.container}>
                <TextInput
                    style={styles.inputStyle}
                    placeholder="Name"
                    value={displayName}
                    onChangeText={(displayName) => setDisplayName(displayName)}
                />
                <TextInput
                    style={styles.inputStyle}
                    placeholder="Email"
                    value={email}
                    onChangeText={(email) => setEmail(email)}
                />
                <TextInput
                    style={styles.inputStyle}
                    placeholder="Password"
                    value={password}
                    onChangeText={(password) => setPassword(password)}
                    maxLength={15}
                    secureTextEntry={true}
                />
                <Button
                    color="#3740FE"
                    title="Signup"
                    onPress={() => registerUser()}
                />

                <Text
                    style={styles.loginText}
                    onPress={() => navigation.navigate('Login')}>
                    Already Registered? Click here to login
                </Text>
            </View>

        </View>
    )
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        display: "flex",
        flexDirection: "column",
        justifyContent: "center",
        padding: 35,
        backgroundColor: '#fff'
    },
    inputStyle: {
        width: '100%',
        marginBottom: 15,
        paddingBottom: 15,
        alignSelf: "center",
        borderColor: "#ccc",
        borderBottomWidth: 1
    },
    loginText: {
        color: '#3740FE',
        marginTop: 25,
        textAlign: 'center'
    },
    preloader: {
        left: 0,
        right: 0,
        top: 0,
        bottom: 0,
        position: 'absolute',
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: '#fff'
    }
});
