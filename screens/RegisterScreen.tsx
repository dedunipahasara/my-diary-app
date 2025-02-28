import React, { useState } from 'react';
import { View } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { TextInput, Button, Text, Card } from 'react-native-paper';

const RegisterScreen = () => {
    const navigation = useNavigation();
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');

    const handleRegister = () => {
        if (username && password && password === confirmPassword) {
            alert('Registration Successful!');
            navigation.navigate('Auth'); // Redirect to login screen after registration
        } else {
            alert('Passwords do not match or fields are empty');
        }
    };

    return (
        <View style={{ flex: 1, justifyContent: 'center', padding: 20, backgroundColor: '#f8f9fa' }}>
            <Card style={{ padding: 20, borderRadius: 10 }}>
                <Text variant="headlineMedium" style={{ textAlign: 'center', marginBottom: 20 }}>
                    Register
                </Text>
                <TextInput
                    label="Username"
                    value={username}
                    onChangeText={setUsername}
                    mode="outlined"
                    style={{ marginBottom: 10 }}
                />
                <TextInput
                    label="Password"
                    value={password}
                    onChangeText={setPassword}
                    secureTextEntry
                    mode="outlined"
                    style={{ marginBottom: 10 }}
                />
                <TextInput
                    label="Confirm Password"
                    value={confirmPassword}
                    onChangeText={setConfirmPassword}
                    secureTextEntry
                    mode="outlined"
                    style={{ marginBottom: 20 }}
                />
                <Button mode="contained" onPress={handleRegister}>
                    Register
                </Button>

                <View style={{ alignItems: 'center', marginTop: 15 }}>
                    <Text>Already have an account?</Text>
                    <Button mode="text" onPress={() => navigation.navigate('Auth')}>
                        Login
                    </Button>
                </View>
            </Card>
        </View>
    );
};

export default RegisterScreen;
