import React, { useState } from 'react';
import { View, Text, TextInput, Button, StyleSheet, ActivityIndicator, Modal, TouchableOpacity } from 'react-native';
import axios from 'axios';
import { AUTH_ENDPOINT } from '../constants';

export default function LoginScreen({ navigation }) {
    const [identifier, setIdentifier] = useState('');
    const [password, setPassword] = useState('');
    const [loading, setLoading] = useState(false);

    // Modal state variables
    const [modalVisible, setModalVisible] = useState(false);
    const [modalType, setModalType] = useState(''); // "success" or "error"
    const [modalMessage, setModalMessage] = useState('');

    const handleLogin = async () => {
        if (!identifier || !password) {
            // Directly show an error modal if fields are missing
            setModalType('error');
            setModalMessage('Please enter both identifier and password.');
            setModalVisible(true);
            return;
        }

        setLoading(true);
        console.log('Attempting login with identifier:', identifier);

        try {
            const response = await axios.post(AUTH_ENDPOINT, {
                identifier,
                password,
            });

            console.log('Login response:', response.data);
            const { jwt, user } = response.data;
            console.log('JWT:', jwt);
            console.log('User:', user);

            // On success, set up a success modal.
            setModalType('success');
            setModalMessage('You have been logged in successfully!');
            setModalVisible(true);
        } catch (error) {
            console.error('Login error:', error);
            let errorMsg;

            if (error.response) {
                console.error('Error Response Data:', error.response.data);
                console.error('Error Response Status:', error.response.status);
                console.error('Error Response Headers:', error.response.headers);
                errorMsg = `Server responded with status ${error.response.status}: ${JSON.stringify(error.response.data)}`;
            } else if (error.request) {
                console.error('Error Request:', error.request);
                errorMsg = 'Network error: No response received from the server.';
            } else {
                console.error('Error Message:', error.message);
                errorMsg = `Error setting up request: ${error.message}`;
            }
            console.error('Error as JSON:', JSON.stringify(error, null, 2));

            setModalType('error');
            setModalMessage(errorMsg);
            setModalVisible(true);
        } finally {
            setLoading(false);
        }
    };

    // Handler for modal OK button. If success, navigate; otherwise just close the modal.
    const handleModalClose = () => {
        setModalVisible(false);
        if (modalType === 'success') {
            navigation.navigate('Dashboard');
        }
    };

    return (
        <View style={styles.container}>
            <Text style={styles.title}>Login</Text>
            <TextInput
                style={styles.input}
                placeholder="Email or Username"
                autoCapitalize="none"
                onChangeText={setIdentifier}
                value={identifier}
            />
            <TextInput
                style={styles.input}
                placeholder="Password"
                secureTextEntry
                onChangeText={setPassword}
                value={password}
            />
            {loading ? (
                <ActivityIndicator size="large" />
            ) : (
                <Button title="Log In" onPress={handleLogin} />
            )}

            {/* Modal for success and error messages */}
            <Modal
                visible={modalVisible}
                transparent={true}
                animationType="slide"
                onRequestClose={handleModalClose}
            >
                <View style={styles.modalContainer}>
                    <View
                        style={[
                            styles.modalContent,
                            modalType === 'success' ? styles.successModal : styles.errorModal,
                        ]}
                    >
                        <Text style={styles.modalTitle}>
                            {modalType === 'success' ? 'Login Successful' : 'Login Failed'}
                        </Text>
                        <Text style={styles.modalMessage}>{modalMessage}</Text>
                        <TouchableOpacity style={modalType === 'success' ? styles.modalButtonSuccess : styles.modalButtonError} onPress={handleModalClose}>
                            <Text style={styles.modalButtonText}>OK</Text>
                        </TouchableOpacity>
                    </View>
                </View>
            </Modal>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: 20,
        justifyContent: 'center',
        backgroundColor: '#f9f9f9',
    },
    title: {
        fontSize: 28,
        marginBottom: 30,
        textAlign: 'center',
    },
    input: {
        height: 50,
        borderColor: '#ccc',
        borderWidth: 1,
        paddingHorizontal: 10,
        marginBottom: 20,
        borderRadius: 5,
        backgroundColor: '#fff',
    },
    modalContainer: {
        flex: 1,
        backgroundColor: 'rgba(0,0,0,0.5)', // semi-transparent background
        justifyContent: 'center',
        alignItems: 'center',
    },
    modalContent: {
        width: '80%',
        borderRadius: 10,
        padding: 20,
        alignItems: 'center',
    },
    successModal: {
        backgroundColor: 'white',
        borderColor: 'green',
        borderWidth: 2,
    },
    errorModal: {
        backgroundColor: 'white',
        borderColor: 'red',
        borderWidth: 2,
    },
    modalTitle: {
        fontSize: 24,
        marginBottom: 10,
    },
    modalMessage: {
        fontSize: 16,
        textAlign: 'center',
        marginBottom: 20,
    },
    modalButtonSuccess: {
        backgroundColor: 'green',
        paddingVertical: 10,
        paddingHorizontal: 20,
        borderRadius: 5,
    },
    modalButtonError: {
        backgroundColor: 'red',
        paddingVertical: 10,
        paddingHorizontal: 20,
        borderRadius: 5,
    },
    modalButtonText: {
        color: 'white',
        fontSize: 16,
    },
});
