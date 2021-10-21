import React from 'react';
import { Button, View, Text, StyleSheet, TextInput, Alert } from 'react-native';
import auth from '@react-native-firebase/auth';

const Login = ({ navigation }) => {

    const [email, setEmail] = React.useState('');
    const [password, setPassword] = React.useState('');
    const [isLoading, setIsLoading] = React.useState(false);

    const userLogin = () => {
        if (email === '' && password === '') {
            Alert.alert("Enter Login Details!")
        } else {
            setIsLoading(true);
            auth()
                .signInWithEmailAndPassword(email, password)
                .then((res) => {
                    console.log(res)
                    console.log('User Logged In Successfully!')
                    setEmail('')
                    setPassword('')
                    setIsLoading(false)
                    navigation.navigate('Scan')
                })
            // .catch(error => this.setState({ errorMessage: error.message }))
        }
    }

    return (
        <View style={{ flex: 1, justifyContent: 'center' }}>

            <View style={styles.container}>
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
                    title="Signin"
                    onPress={() => userLogin()}
                />

                <Text
                    style={styles.loginText}
                    onPress={() => navigation.navigate('Register')}>
                    Don't have account? Click here to signup
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

export default Login;
