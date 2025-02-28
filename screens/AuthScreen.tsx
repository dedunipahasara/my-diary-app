import React, { useState } from 'react';
import { View, Image, StyleSheet } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { useDispatch } from 'react-redux';
import { login } from '../reducers/authSlice';
import { TextInput, Button, Text, Card } from 'react-native-paper';

const AuthScreen = () => {
    const navigation = useNavigation();
    const dispatch = useDispatch();
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');

    const handleLogin = () => {
        if (username && password) {
            dispatch(login(username));
            navigation.navigate('Main'); // Redirect to the main app
        }
    };

    return (
        <View style={styles.container}>
            {/* Image Section */}
            <View style={styles.imageContainer}>
                <Image
                    source={require('../assets/diary-login.png')} // Path to your image in the assets folder
                    style={styles.image}
                />
            </View>

            {/* Transparent Card Section */}
            <Card style={styles.card}>
                <Text variant="headlineMedium" style={styles.headerText}>
                    Login
                </Text>
                <TextInput
                    label="Username"
                    value={username}
                    onChangeText={setUsername}
                    mode="outlined"
                    style={styles.input}
                    outlineColor="#F37199" // Outline color
                    activeOutlineColor="#F37199" // Active state outline color
                    textColor="#F37199" // Text color
                />
                <TextInput
                    label="Password"
                    value={password}
                    onChangeText={setPassword}
                    secureTextEntry
                    mode="outlined"
                    style={styles.input}
                    outlineColor="#F37199"
                    activeOutlineColor="#F37199"
                    textColor="#F37199"
                />
                <Button
                    mode="contained"
                    onPress={handleLogin}
                    style={styles.button}
                    labelStyle={{ color: 'white' }} // Ensuring text is visible
                >
                    Login
                </Button>

                <View style={styles.registerContainer}>
                    <Text>Don't have an account?</Text>
                    <Button
                        mode="text"
                        onPress={() => navigation.navigate('Register')}
                        labelStyle={{ color: '#F37199' }} // Text color for the Register button
                    >
                        Register
                    </Button>
                </View>
            </Card>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        padding: 20,
        // backgroundColor: '#F7A8C4', // Updated background color
    },
    imageContainer: {
        alignItems: 'center',
        marginBottom: 20,
    },
    image: {
        width: 200, // Adjust width as per your needs
        height: 200, // Adjust height as per your needs
        resizeMode: 'contain',
    },
    card: {
        padding: 20,
        borderRadius: 10,
        backgroundColor: 'rgba(255, 255, 255, 0.7)', // Transparent card background
    },
    headerText: {
        textAlign: 'center',
        marginBottom: 20,
        color: '#F37199', // Title color matches theme
    },
    input: {
        marginBottom: 10,
        backgroundColor: 'transparent', // Keeps input background clear
    },
    registerContainer: {
        alignItems: 'center',
        marginTop: 15,
    },
    button: {
        backgroundColor: '#F37199',
        marginBottom: 15,
    },
});

export default AuthScreen;
