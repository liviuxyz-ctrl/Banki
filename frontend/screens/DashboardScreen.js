import React from 'react';
import { View, Text, Button, StyleSheet } from 'react-native';

export default function DashboardScreen({ navigation }) {
    const handleLogout = () => {
        // You could add logic here to clear auth state.
        navigation.navigate('Login');
    };

    return (
        <View style={styles.container}>
            <Text style={styles.title}>Dashboard</Text>
            <Text>Welcome to your banking dashboard!</Text>
            {/* You might want to add more elements like a balance display and transaction history */}
            <Button title="Log Out" onPress={handleLogout} />
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center'
    },
    title: {
        fontSize: 24,
        marginBottom: 20
    }
});
