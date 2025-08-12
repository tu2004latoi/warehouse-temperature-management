import React, { useState, useEffect } from 'react';
import {
    View,
    Text,
    TextInput,
    TouchableOpacity,
    Alert,
    ActivityIndicator,
    ScrollView,
    KeyboardAvoidingView,
    Platform,
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

            const mappedData = data.map((w) => ({
                id: w.warehouseId,
                name: w.name,
                temperature: w.temperature,
            }));

            setWarehouses(mappedData);
        } catch (error) {
            console.error('Error fetching warehouses:', error);
        } finally {
            setLoadingWarehouses(false);
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
        <KeyboardAvoidingView 
            behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
            className="flex-1"
        >
            <ScrollView 
                contentContainerStyle={{ flexGrow: 1 }}
                className="bg-gradient-to-br from-primary-50 via-white to-secondary-50"
            >
                <View className="flex-1 justify-center px-8 py-12">
                    {/* Header */}
                    <View className="items-center mb-12">
                        <View className="w-20 h-20 bg-gradient-to-br from-success-500 to-success-600 rounded-3xl items-center justify-center mb-6 shadow-large">
                            <Text className="text-white text-3xl">📱</Text>
                        </View>
                        <Text className="text-3xl font-bold text-secondary-800 text-center mb-2">
                            Thêm thiết bị mới
                        </Text>
                        <Text className="text-lg text-secondary-600 text-center">
                            Kết nối thiết bị cảm biến với hệ thống
                        </Text>
                    </View>

                    {/* Error Message */}
                    {msg ? (
                        <View className="bg-danger-50 border border-danger-200 rounded-xl p-4 mb-6">
                            <Text className="text-danger-700 text-center font-medium">{msg}</Text>
                        </View>
                    ) : null}

                    {/* Form */}
                    <View className="space-y-6">
                        {/* Device Code Input */}
                        <View>
                            <Text className="text-secondary-700 font-semibold mb-2 ml-1">
                                Mã thiết bị
                            </Text>
                            <View className="relative">
                                <TextInput
                                    className="bg-white border border-secondary-200 rounded-2xl px-6 py-4 text-secondary-800 text-base shadow-soft"
                                    placeholder="Nhập mã thiết bị"
                                    placeholderTextColor="#94a3b8"
                                    value={deviceCode}
                                    onChangeText={setDeviceCode}
                                    autoCapitalize="none"
                                />
                                <View className="absolute right-4 top-4">
                                    <Text className="text-secondary-400">🔢</Text>
                                </View>
                            </View>
                            {fieldErrors.deviceCode && (
                                <Text className="text-danger-600 text-sm mt-2 ml-1">{fieldErrors.deviceCode}</Text>
                            )}
                        </View>

                        {/* Warehouse Selection */}
                        <View>
                            <Text className="text-secondary-700 font-semibold mb-2 ml-1">
                                Chọn kho
                            </Text>
                            <View className="bg-white border border-secondary-200 rounded-2xl shadow-soft">
                                {loadingWarehouses ? (
                                    <View className="p-4 items-center">
                                        <ActivityIndicator size="small" color="#3b82f6" />
                                        <Text className="text-secondary-600 mt-2">Đang tải danh sách kho...</Text>
                                    </View>
                                ) : warehouses.length === 0 ? (
                                    <View className="p-4 items-center">
                                        <Text className="text-danger-600">Không có kho nào được tải</Text>
                                    </View>
                                ) : (
                                    <Dropdown
                                        className="px-6 py-4"
                                        placeholderStyle={{ color: '#94a3b8', fontSize: 16 }}
                                        selectedTextStyle={{ color: '#1e293b', fontSize: 16, fontWeight: '600' }}
                                        inputSearchStyle={{ color: '#1e293b', fontSize: 16 }}
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
                            {fieldErrors.warehouse && (
                                <Text className="text-danger-600 text-sm mt-2 ml-1">{fieldErrors.warehouse}</Text>
                            )}
                        </View>

                        {/* Submit Button */}
                        <TouchableOpacity 
                            onPress={handleSubmit} 
                            disabled={loading}
                            className={`rounded-2xl py-4 shadow-medium ${
                                loading 
                                    ? 'bg-secondary-300' 
                                    : 'bg-gradient-to-r from-success-500 to-success-600'
                            }`}
                        >
                            {loading ? (
                                <View className="flex-row items-center justify-center">
                                    <ActivityIndicator color="#ffffff" size="small" />
                                    <Text className="text-black font-bold text-lg ml-3">Đang thêm...</Text>
                                </View>
                            ) : (
                                <Text className="text-black font-bold text-lg text-center">Thêm thiết bị</Text>
                            )}
                        </TouchableOpacity>
                    </View>

                    {/* Info Section */}
                    <View className="mt-8 bg-gradient-to-r from-secondary-50 to-primary-50 rounded-3xl p-6">
                        <View className="flex-row items-center mb-4">
                            <View className="w-12 h-12 bg-primary-500 rounded-2xl items-center justify-center mr-4">
                                <Text className="text-white text-xl">ℹ️</Text>
                            </View>
                            <Text className="text-lg font-bold text-secondary-800">
                                Hướng dẫn
                            </Text>
                        </View>
                        <Text className="text-secondary-600 leading-6">
                            Nhập mã thiết bị cảm biến và chọn kho để kết nối. 
                            Thiết bị sẽ được thêm vào hệ thống và bắt đầu theo dõi nhiệt độ, độ ẩm.
                        </Text>
                    </View>
                </View>
            </ScrollView>
        </KeyboardAvoidingView>
    );
};

export default AddDevice;