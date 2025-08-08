import React, { useState } from 'react';
import {
    View,
    Text,
    TextInput,
    TouchableOpacity,
    Alert,
    ScrollView,
    KeyboardAvoidingView,
    Platform,
} from 'react-native';
import { authApis, endpoints } from '../../configs/APIs';
import AsyncStorage from '@react-native-async-storage/async-storage';

const AddWarehouse = ({ navigation }) => {
    const [warehouseName, setWarehouseName] = useState('');
    const [temperature, setTemperature] = useState('');
    const [loading, setLoading] = useState(false);

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
            setLoading(true);
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
                        <View className="w-20 h-20 bg-gradient-to-br from-primary-500 to-primary-600 rounded-3xl items-center justify-center mb-6 shadow-large">
                            <Text className="text-white text-3xl">🏭</Text>
                        </View>
                        <Text className="text-3xl font-bold text-secondary-800 text-center mb-2">
                            Thêm kho mới
                        </Text>
                        <Text className="text-lg text-secondary-600 text-center">
                            Tạo kho hàng để quản lý thiết bị
                        </Text>
                    </View>

                    {/* Form */}
                    <View className="space-y-6">
                        {/* Warehouse Name Input */}
                        <View>
                            <Text className="text-secondary-700 font-semibold mb-2 ml-1">
                                Tên kho
                            </Text>
                            <View className="relative">
                                <TextInput
                                    className="bg-white border border-secondary-200 rounded-2xl px-6 py-4 text-secondary-800 text-base shadow-soft"
                                    placeholder="Nhập tên kho"
                                    placeholderTextColor="#94a3b8"
                                    value={warehouseName}
                                    onChangeText={setWarehouseName}
                                    maxLength={100}
                                />
                                <View className="absolute right-4 top-4">
                                    <Text className="text-secondary-400">🏭</Text>
                                </View>
                            </View>
                        </View>

                        {/* Temperature Input */}
                        <View>
                            <Text className="text-secondary-700 font-semibold mb-2 ml-1">
                                Nhiệt độ chuẩn (°C)
                            </Text>
                            <View className="relative">
                                <TextInput
                                    className="bg-white border border-secondary-200 rounded-2xl px-6 py-4 text-secondary-800 text-base shadow-soft"
                                    placeholder="Nhập nhiệt độ (0-100°C)"
                                    placeholderTextColor="#94a3b8"
                                    value={temperature}
                                    onChangeText={setTemperature}
                                    keyboardType="numeric"
                                    maxLength={5}
                                />
                                <View className="absolute right-4 top-4">
                                    <Text className="text-secondary-400">🌡️</Text>
                                </View>
                            </View>
                        </View>

                        {/* Submit Button */}
                        <TouchableOpacity 
                            onPress={handleSubmit} 
                            disabled={loading}
                            className={`rounded-2xl py-4 shadow-medium ${
                                loading 
                                    ? 'bg-secondary-300' 
                                    : 'bg-gradient-to-r from-primary-500 to-primary-600'
                            }`}
                        >
                            {loading ? (
                                <View className="flex-row items-center justify-center">
                                    <Text className="text-white font-bold text-lg">Đang thêm...</Text>
                                </View>
                            ) : (
                                <Text className="text-white font-bold text-lg text-center">Thêm kho</Text>
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
                                Thông tin kho
                            </Text>
                        </View>
                        <View className="space-y-3">
                            <Text className="text-secondary-600 leading-6">
                                • <Text className="font-semibold">Tên kho:</Text> Đặt tên dễ nhớ để phân biệt các kho
                            </Text>
                            <Text className="text-secondary-600 leading-6">
                                • <Text className="font-semibold">Nhiệt độ chuẩn:</Text> Nhiệt độ lý tưởng để bảo quản thực phẩm (0-100°C)
                            </Text>
                            <Text className="text-secondary-600 leading-6">
                                • Hệ thống sẽ cảnh báo khi nhiệt độ chênh lệch ±5°C so với chuẩn
                            </Text>
                        </View>
                    </View>
                </View>
            </ScrollView>
        </KeyboardAvoidingView>
    );
};

export default AddWarehouse;