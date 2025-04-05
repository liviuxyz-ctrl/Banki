import React, { useEffect, useState } from 'react';
import {
    View,
    Text,
    StyleSheet,
    FlatList,
    ActivityIndicator,
    SafeAreaView,
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { BASE_URL } from '../constants';
import { useNavigation } from '@react-navigation/native';

const DashboardScreen = () => {
    const [accounts, setAccounts] = useState([]);
    const [loading, setLoading] = useState(true);
    const navigation = useNavigation();

    useEffect(() => {
        const fetchAccounts = async () => {
            try {
                const token = await AsyncStorage.getItem('token');
                const userData = await AsyncStorage.getItem('user');

                console.log('🔐 Token:', token);
                console.log('👤 User:', userData);

                if (!token || !userData) {
                    console.log('❌ No token or user found. Redirecting to Login...');
                    navigation.replace('Login');
                    return;
                }

                const user = JSON.parse(userData);

                const url = `${BASE_URL}/api/bank-accounts?filter[user][id][$eq]=${user.id}&populate=*`; // 🙌 untouched

                console.log('📡 Fetch URL:', url);

                const response = await fetch(url, {
                    method: 'GET',
                    headers: {
                        Authorization: `Bearer ${token}`,
                        'Content-Type': 'application/json',
                    },
                });

                const json = await response.json();
                console.log('✅ API Response:', JSON.stringify(json, null, 2));

                if (json.data && Array.isArray(json.data)) {
                    setAccounts(json.data);
                } else {
                    console.warn('⚠️ No data array found in response');
                    setAccounts([]);
                }
            } catch (err) {
                console.error('🔥 Fetch error:', err);
            } finally {
                setLoading(false);
            }
        };

        fetchAccounts();
    }, []);

    const renderItem = ({ item }) => {
        const { IBAN, balance } = item; // ✅ FIXED HERE
        return (
            <View style={styles.card}>
                <Text style={styles.iban}>{IBAN}</Text>
                <Text style={styles.balance}>💰 {balance.toFixed(2)} RON</Text>
            </View>
        );
    };

    return (
        <SafeAreaView style={styles.container}>
            <Text style={styles.header}>💼 My Bank Accounts</Text>

            {loading ? (
                <ActivityIndicator size="large" color="#007AFF" />
            ) : accounts.length === 0 ? (
                <Text style={styles.noData}>No accounts found for this user.</Text>
            ) : (
                <FlatList
                    data={accounts}
                    keyExtractor={(item) => item.id.toString()}
                    renderItem={renderItem}
                    contentContainerStyle={styles.list}
                />
            )}
        </SafeAreaView>
    );
};

export default DashboardScreen;

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#f5f6fa',
        padding: 20,
        paddingTop: 50,
    },
    header: {
        fontSize: 22,
        fontWeight: 'bold',
        marginBottom: 16,
        color: '#2f3640',
    },
    card: {
        backgroundColor: '#ffffff',
        padding: 16,
        borderRadius: 12,
        marginBottom: 12,
        shadowColor: '#000',
        shadowOpacity: 0.1,
        shadowRadius: 6,
        elevation: 3,
    },
    iban: {
        fontSize: 16,
        fontWeight: 'bold',
        color: '#192a56',
        marginBottom: 4,
    },
    balance: {
        fontSize: 16,
        color: '#27ae60',
    },
    noData: {
        fontSize: 16,
        color: '#aaa',
        textAlign: 'center',
        marginTop: 40,
    },
    list: {
        paddingBottom: 30,
    },
});
