import React, { useState } from 'react';
import { View, Text, TextInput, Button, StyleSheet } from 'react-native';
import axios from 'axios';
import { BASE_URL } from '../constants';

export default function EditAccountScreen({ route, navigation }) {
    const { account, token } = route.params;

    const [balance, setBalance] = useState(String(account.attributes.balance));

    const updateBalance = async () => {
        try {
            await axios.put(`${BASE_URL}/api/bank-accounts/${account.id}`, {
                data: { balance: parseFloat(balance) }
            }, {
                headers: { Authorization: `Bearer ${token}` }
            });

            navigation.goBack();
        } catch (err) {
            console.error("Failed to update account", err);
        }
    };

    return (
        <View style={styles.container}>
            <Text style={styles.title}>✏️ Edit Account</Text>
            <Text style={styles.label}>IBAN:</Text>
            <Text style={styles.readOnly}>{account.attributes.IBAN}</Text>

            <Text style={styles.label}>Balance:</Text>
            <TextInput
                style={styles.input}
                value={balance}
                onChangeText={setBalance}
                keyboardType="numeric"
            />

            <Button title="Save Changes" onPress={updateBalance} />
        </View>
    );
}

const styles = StyleSheet.create({
    container: { padding: 20, backgroundColor: '#111', flex: 1 },
    title: { fontSize: 22, color: '#fff', marginBottom: 20 },
    label: { color: '#ccc', marginTop: 10 },
    input: { backgroundColor: '#fff', padding: 10, borderRadius: 6, marginVertical: 5 },
    readOnly: { color: '#aaa', padding: 10, backgroundColor: '#333', borderRadius: 6 }
});
