import React, { useState } from 'react';
import {
    View,
    Text,
    TextInput,
    StyleSheet,
    TouchableOpacity,
    Alert,
} from 'react-native';
import { authApis, endpoints } from '../../configs/APIs';
import AsyncStorage from '@react-native-async-storage/async-storage';

const AddWarehouse = ({ navigation }) => {
    const [warehouseName, setWarehouseName] = useState('');
    const [temperature, setTemperature] = useState('');

    const handleSubmit = async () => {
        // Validate warehouse name
        if (!warehouseName || !warehouseName.trim()) {
            Alert.alert('Lỗi', 'Vui lòng nhập tên kho');
            return;
        }

        // Validate temperature
        if (!temperature || !temperature.trim()) {
            Alert.alert('Lỗi', 'Vui lòng nhập nhiệt độ');
            return;
        }

        const temp = parseFloat(temperature);
        if (isNaN(temp) || temp < 0 || temp > 100) {
            Alert.alert('Lỗi', 'Nhiệt độ phải từ 0 đến 100°C');
            return;
        }

        console.log('Submitting warehouse:', {
            name: warehouseName.trim(),
            temperature: temp
        });

        try {
            const token = await AsyncStorage.getItem('token');
            
            // Create URLSearchParams for request parameters
            const params = new URLSearchParams();
            params.append('name', warehouseName.trim());
            params.append('temperature', temp.toString());

            const response = await authApis(token).post(
                `${endpoints['add-warehouse']}?${params.toString()}`
            );

            if (response.status === 200 || response.status === 201) {
                Alert.alert(
                    'Thành công', 
                    'Đã thêm kho thành công',
                    [{ text: 'OK', onPress: () => navigation.goBack() }]
                );
            }
        } catch (err) {
            console.error(err);
            const errorMsg = err.response?.data?.message || 'Không thể thêm kho. Vui lòng thử lại sau.';
            Alert.alert('Lỗi', errorMsg);
        }
    };

    return (
        <View style={styles.container}>
            <Text style={styles.heading}>Thêm kho mới</Text>
            
            <View style={styles.inputContainer}>
                <Text style={styles.label}>Tên kho:</Text>
                <TextInput
                    style={styles.input}
                    value={warehouseName}
                    onChangeText={setWarehouseName}
                    placeholder="Nhập tên kho"
                    maxLength={100}
                />
            </View>

            <View style={styles.inputContainer}>
                <Text style={styles.label}>Nhiệt độ (°C):</Text>
                <TextInput
                    style={styles.input}
                    value={temperature}
                    onChangeText={setTemperature}
                    placeholder="Nhập nhiệt độ"
                    keyboardType="numeric"
                    maxLength={5}
                />
            </View>

            <TouchableOpacity 
                style={styles.button}
                onPress={handleSubmit}
            >
                <Text style={styles.buttonText}>Thêm kho</Text>
            </TouchableOpacity>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: 20,
        backgroundColor: '#fff',
    },
    heading: {
        fontSize: 24,
        fontWeight: 'bold',
        marginBottom: 30,
        textAlign: 'center',
    },
    inputContainer: {
        marginBottom: 20,
    },
    label: {
        fontSize: 16,
        marginBottom: 8,
        color: '#333',
    },
    input: {
        borderWidth: 1,
        borderColor: '#ddd',
        borderRadius: 8,
        padding: 12,
        fontSize: 16,
    },
    button: {
        backgroundColor: '#007AFF',
        padding: 15,
        borderRadius: 8,
        alignItems: 'center',
        marginTop: 20,
    },
    buttonText: {
        color: 'white',
        fontSize: 18,
        fontWeight: 'bold',
    },
});

export default AddWarehouse;