// AdminDashboardScreen.js
// Screen for bank admin to view all users and their bank accounts

import React, { useEffect, useState } from 'react';
import { View, Text, FlatList, StyleSheet, Button } from 'react-native';
import axios from 'axios';
import { BASE_URL } from '../constants';

export default function AdminDashboardScreen({ route, navigation }) {
    // JWT token passed from login
    const { token } = route.params;

    // State for users & accounts
    const [users, setUsers] = useState([]);
    const [accounts, setAccounts] = useState([]);

    // Fetch on mount
    useEffect(() => {
        fetchUsers();
        fetchAccounts();
    }, []);

    // Fetch all users from Strapi
    const fetchUsers = async () => {
        const url = `${BASE_URL}/api/users`;
        console.log('🔍 [Admin] Fetching users:', url);
        console.log('🔑 [Admin] Token:', token);

        try {
            const response = await axios.get(url, { headers: { Authorization: `Bearer ${token}` } });
            console.log('✅ [Admin] Users fetched:', JSON.stringify(response.data, null, 2));
            setUsers(response.data);
        } catch (err) {
            if (err.response) {
                console.error(`❌ [Admin] Fetch users failed (status ${err.response.status}):`, err.response.data);
            } else if (err.request) {
                console.error('❌ [Admin] No response when fetching users:', err.request);
            } else {
                console.error('❌ [Admin] Users request error:', err.message);
            }
        }
    };

    // Fetch all bank accounts with user relations
    const fetchAccounts = async () => {
        const url = `${BASE_URL}/api/bank-accounts?populate=users_permissions_user`;
        console.log('🔍 [Admin] Fetching accounts:', url);
        console.log('🔑 [Admin] Token:', token);

        try {
            const response = await axios.get(url, { headers: { Authorization: `Bearer ${token}` } });
            console.log('✅ [Admin] Accounts fetched raw:', JSON.stringify(response.data, null, 2));
            // Strapi v4 nests the data under response.data.data
            setAccounts(response.data.data || []);
        } catch (err) {
            if (err.response) {
                console.error(`❌ [Admin] Fetch accounts failed (status ${err.response.status}):`, err.response.data);
                if (err.response.status === 403) {
                    console.warn('⚠️ [Admin] Forbidden: check token permissions.');
                }
            } else if (err.request) {
                console.error('❌ [Admin] No response when fetching accounts:', err.request);
            } else {
                console.error('❌ [Admin] Accounts request error:', err.message);
            }
        }
    };

    // Render list of users and their accounts
    return (
        <View style={styles.container}>
            <Text style={styles.title}>👤 All Users</Text>

            <Button
                title="➕ Create Bank Account"
                onPress={() => navigation.navigate('CreateAccount', { token })}
            />

            <FlatList
                data={users}
                keyExtractor={(user) => user.id.toString()}
                renderItem={({ item: user }) => (
                    <View style={styles.userBlock}>
                        <Text style={styles.userTitle}>{user.username} ({user.email})</Text>

                        {/* Filter accounts safely with optional chaining */}
                        <FlatList
                            data={accounts.filter((acc) => {
                                const rel = acc.attributes?.users_permissions_user;
                                const relId = rel?.data?.id;
                                console.log(`🔍 [Admin] Checking account ${acc.id} owner ID:`, relId);
                                return relId === user.id;
                            })}
                            keyExtractor={(acc) => acc.id.toString()}
                            renderItem={({ item: acc }) => (
                                <View style={styles.accountItem}>
                                    <Text>💳 IBAN: {acc.attributes.IBAN}</Text>
                                    <Text>💰 Balance: {acc.attributes.balance}</Text>

                                    <Button
                                        title="✏️ Edit"
                                        onPress={() => navigation.navigate('EditAccount', { account: acc, token })}
                                    />
                                </View>
                            )}
                        />
                    </View>
                )}
            />
        </View>
    );
}

const styles = StyleSheet.create({
    container: { padding: 20, backgroundColor: '#111', flex: 1 },
    title: { fontSize: 22, color: '#fff', marginBottom: 10, textAlign: 'center' },
    userBlock: { marginBottom: 20, padding: 10, backgroundColor: '#222', borderRadius: 10 },
    userTitle: { fontSize: 18, fontWeight: 'bold', color: '#f0f0f0', marginBottom: 5 },
    accountItem: { backgroundColor: '#333', padding: 10, marginTop: 10, borderRadius: 8 },
});
