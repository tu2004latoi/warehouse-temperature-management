import React, { useState, useEffect } from 'react';
import {
    View,
    Text,
    TextInput,
    TouchableOpacity,
    Alert,
    StyleSheet,
    ActivityIndicator,
} from 'react-native';
import APIs, { authApis, endpoints } from '../../configs/APIs';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Dropdown } from 'react-native-element-dropdown';

const AddDevice = () => {
    const [deviceCode, setDeviceCode] = useState('');
    const [selectedWarehouse, setSelectedWarehouse] = useState(null);
    const [warehouses, setWarehouses] = useState([]);
    const [fieldErrors, setFieldErrors] = useState({});
    const [loading, setLoading] = useState(false);
    const [loadingWarehouses, setLoadingWarehouses] = useState(true);
    const [msg, setMsg] = useState('');

    useEffect(() => {
        fetchWarehouses();
    }, []);

    const fetchWarehouses = async () => {
        try {
            const token = await AsyncStorage.getItem('token');
            const response = await authApis(token).get(endpoints['get-warehouses']);
            let data = response.data;

            // Chuyển warehouseId => id
            const mappedData = data.map((w) => ({
                id: w.warehouseId,
                name: w.name,
                temperature: w.temperature,
            }));

            setWarehouses(mappedData);
        } catch (error) {
            console.error('Error fetching warehouses:', error);
        }
    };


    const validate = () => {
        let errors = {};
        if (!deviceCode) errors.deviceCode = 'Mã thiết bị không được để trống';
        if (selectedWarehouse === null) errors.warehouse = 'Vui lòng chọn kho';

        setFieldErrors(errors);
        return Object.keys(errors).length === 0;
    };

    const handleSubmit = async () => {
        setMsg('');
        if (!validate()) return;
        try {
            setLoading(true);
            const token = await AsyncStorage.getItem('token');
            if (!token) {
                Alert.alert('Lỗi', 'Không tìm thấy token xác thực');
                return;
            }
            const res = await authApis(token).post(
                `${endpoints['add-device'](deviceCode)}?warehouseId=${selectedWarehouse}`,
                {
                    deviceCode,
                }
            );
            Alert.alert('Thành công', 'Thiết bị đã được thêm!');
            setDeviceCode('');
            setSelectedWarehouse(null);
        } catch (err) {
            console.error('Error adding device:', err);
            setMsg('Có lỗi xảy ra khi thêm thiết bị');
        } finally {
            setLoading(false);
        }
    };

    return (
        <View style={styles.container}>
            <Text style={styles.title}>Thêm thiết bị mới</Text>
            {msg ? <Text style={styles.errorMsg}>{msg}</Text> : null}

            <TextInput
                style={styles.input}
                placeholder="Mã thiết bị"
                value={deviceCode}
                onChangeText={setDeviceCode}
            />
            {fieldErrors.deviceCode && <Text style={styles.error}>{fieldErrors.deviceCode}</Text>}

            <View style={styles.pickerContainer}>
                {loadingWarehouses ? (
                    <ActivityIndicator size="small" color="#2d6cdf" />
                ) : warehouses.length === 0 ? (
                    <Text style={styles.error}>Không có kho nào được tải</Text>
                ) : (
                    <Dropdown
                        style={styles.dropdown}
                        placeholderStyle={styles.placeholderStyle}
                        selectedTextStyle={styles.selectedTextStyle}
                        inputSearchStyle={styles.inputSearchStyle}
                        data={warehouses.map((w) => ({
                            label: w.name,
                            value: w.id,
                        }))}
                        search
                        maxHeight={300}
                        labelField="label"
                        valueField="value"
                        placeholder="Chọn kho"
                        searchPlaceholder="Tìm kho..."
                        value={selectedWarehouse}
                        onChange={(item) => {
                            setSelectedWarehouse(item.value);
                        }}
                    />
                )}
            </View>
            {fieldErrors.warehouse && <Text style={styles.error}>{fieldErrors.warehouse}</Text>}

            <TouchableOpacity onPress={handleSubmit} style={styles.button} disabled={loading}>
                {loading ? (
                    <ActivityIndicator color="#fff" />
                ) : (
                    <Text style={styles.buttonText}>Thêm thiết bị</Text>
                )}
            </TouchableOpacity>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: 24,
        justifyContent: 'center',
        backgroundColor: '#fff',
    },
    title: {
        fontSize: 20,
        fontWeight: 'bold',
        marginBottom: 24,
        textAlign: 'center',
        color: '#2d6cdf',
    },
    input: {
        borderWidth: 1,
        borderColor: '#ccc',
        padding: 12,
        borderRadius: 8,
        marginBottom: 10,
    },
    button: {
        backgroundColor: '#2d6cdf',
        padding: 14,
        borderRadius: 8,
        marginTop: 16,
        alignItems: 'center',
    },
    buttonText: {
        color: '#fff',
        fontWeight: 'bold',
    },
    error: {
        color: 'red',
        marginBottom: 10,
    },
    errorMsg: {
        color: 'red',
        textAlign: 'center',
        marginBottom: 12,
    },
    pickerContainer: {
        borderWidth: 1,
        borderColor: '#ccc',
        borderRadius: 8,
        marginBottom: 10,
        backgroundColor: '#fff',
    },
    picker: {
        height: 50,
        width: '100%',
    },
});

export default AddDevice;