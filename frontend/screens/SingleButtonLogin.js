import React, { useState } from 'react';
import { View, Button, Text, StyleSheet, Modal, TouchableOpacity } from 'react-native';
import axios from 'axios';
import { AUTH_ENDPOINT } from '../constants';

export default function SingleButtonLogin() {
    const [modalVisible, setModalVisible] = useState(false);
    const [modalType, setModalType] = useState(''); // 'success' or 'error'
    const [modalMessage, setModalMessage] = useState('');

    const handleRequest = () => {
        // Reset previous modal
        setModalVisible(false);
        console.log('Starting axios POST request...');
        console.log('Request URL:', AUTH_ENDPOINT);
        console.log('Request payload:', {
            identifier: 'liviu2002liviu@gmail.com',
            password: '123456',
        });

        axios
            .post(AUTH_ENDPOINT, {
                identifier: 'liviu2002liviu@gmail.com',
                password: '1234566',
            })
            .then((response) => {
                console.log('Response received:');
                console.log('Response data:', response.data);
                console.log('Response status:', response.status);
                console.log('Response headers:', response.headers);
                setModalType('success');
                setModalMessage('You have been logged in successfully!');
                setModalVisible(true);
            })
            .catch((err) => {
                console.error('Axios encountered an error:', err);
                let errorMsg;
                if (err.response) {
                    console.error('Error response data:', err.response.data);
                    console.error('Error response status:', err.response.status);
                    console.error('Error response headers:', err.response.headers);
                    errorMsg = `Server responded with status ${err.response.status}: ${JSON.stringify(err.response.data)}`;
                } else if (err.request) {
                    console.error('Error request (no response):', err.request);
                    errorMsg = 'Network error: No response received from the server.';
                } else {
                    console.error('Error message:', err.message);
                    errorMsg = `Error setting up request: ${err.message}`;
                }
                console.error('Error as JSON:', JSON.stringify(err, null, 2));
                setModalType('error');
                setModalMessage(errorMsg);
                setModalVisible(true);
            });
    };

    return (
        <View style={styles.container}>
            <Button title="Send Request" onPress={handleRequest} />

            <Modal
                visible={modalVisible}
                transparent={true}
                animationType="slide"
                onRequestClose={() => setModalVisible(false)}
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
                        <TouchableOpacity
                            style={
                                modalType === 'success'
                                    ? styles.modalButtonSuccess
                                    : styles.modalButtonError
                            }
                            onPress={() => setModalVisible(false)}
                        >
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
        justifyContent: 'center',
        alignItems: 'center',
        padding: 20,
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
