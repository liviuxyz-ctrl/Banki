import React, { useEffect, useState } from 'react';
import { View, Text, TextInput, StyleSheet, Button, FlatList, TouchableOpacity } from 'react-native';
import axios from 'axios';
import { BASE_URL } from '../constants';

export default function CreateAccountScreen({ route, navigation }) {
    const { token } = route.params;
    const [users, setUsers] = useState([]);
    const [selectedUser, setSelectedUser] = useState(null);
    const [balance, setBalance] = useState('');
    const [iban, setIban] = useState('');

    useEffect(() => {
        fetchUsers();
    }, []);

    const fetchUsers = async () => {
        try {
            const response = await axios.get(`${BASE_URL}/api/users`, {
                headers: { Authorization: `Bearer ${token}` },
            });
            setUsers(response.data);
        } catch (err) {
            console.error("Failed to load users", err);
        }
    };

    const createAccount = async () => {
        try {
            await axios.post(`${BASE_URL}/api/bank-accounts`, {
                data: {
                    balance: parseFloat(balance),
                    IBAN: iban,
                    users_permissions_user: selectedUser.id,
                }
            }, {
                headers: { Authorization: `Bearer ${token}` }
            });

            navigation.goBack();
        } catch (err) {
            console.error("Failed to create account", err);
        }
    };

    return (
        <View style={styles.container}>
            <Text style={styles.title}>➕ Create New Bank Account</Text>

            <Text style={styles.label}>1. Select User:</Text>
            <FlatList
                data={users}
                keyExtractor={(item) => item.id.toString()}
                renderItem={({ item }) => (
                    <TouchableOpacity
                        style={[
                            styles.userItem,
                            selectedUser?.id === item.id && styles.selected
                        ]}
                        onPress={() => setSelectedUser(item)}
                    >
                        <Text>{item.username} ({item.email})</Text>
                    </TouchableOpacity>
                )}
            />

            <Text style={styles.label}>2. Enter IBAN:</Text>
            <TextInput
                value={iban}
                onChangeText={setIban}
                style={styles.input}
                placeholder="IBAN"
            />

            <Text style={styles.label}>3. Set Balance:</Text>
            <TextInput
                value={balance}
                onChangeText={setBalance}
                style={styles.input}
                placeholder="Balance"
                keyboardType="numeric"
            />

            <Button
                title="Create Bank Account"
                onPress={createAccount}
                disabled={!selectedUser || !balance || !iban}
            />
        </View>
    );
}

const styles = StyleSheet.create({
    container: { flex: 1, padding: 20, backgroundColor: '#111' },
    title: { fontSize: 20, color: '#fff', marginBottom: 10 },
    label: { color: '#ccc', marginTop: 10 },
    input: { backgroundColor: '#fff', padding: 10, borderRadius: 6, marginVertical: 5 },
    userItem: {
        padding: 10,
        marginVertical: 4,
        backgroundColor: '#222',
        borderRadius: 6
    },
    selected: {
        backgroundColor: '#444'
    }
});
