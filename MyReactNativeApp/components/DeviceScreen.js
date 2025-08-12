import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  FlatList,
  ActivityIndicator,
  Alert,
  TouchableOpacity,
  TextInput,
  ScrollView,
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import APIs, { authApis, endpoints } from '../configs/APIs';
import SensorData from './devices/SensorData';

const DeviceScreen = () => {
  // Khai báo state
  const [devices, setDevices] = useState([]);
  const [loading, setLoading] = useState(true);
  const [relayStates, setRelayStates] = useState({});
  const [defaultTemps, setDefaultTemps] = useState({});
  const [selectedDevice, setSelectedDevice] = useState(null);
  const [defaultTempInput, setDefaultTempInput] = useState('');

  // Hàm tải thiết bị từ API
  const loadDevices = async () => {
    try {
      const token = await AsyncStorage.getItem('token');
      const res = await authApis(token).get(endpoints['my-devices']);
      setDevices(res.data);

      // Khởi tạo trạng thái ban đầu cho các thiết bị
      const initialRelayStates = {};
      const initialDefaultTemps = {};
      res.data.forEach(device => {
        initialRelayStates[device.deviceCode] = false;
        initialDefaultTemps[device.deviceCode] = null;
      });

      setRelayStates(initialRelayStates);
      setDefaultTemps(initialDefaultTemps);
    } catch (err) {
      console.error(err);
      Alert.alert('Lỗi', 'Không thể tải danh sách thiết bị');
    } finally {
      setLoading(false);
    }
  };

  // Hàm điều khiển relay
  const handleRelayControl = async (deviceCode, isOn) => {
    try {
      const token = await AsyncStorage.getItem('token');
      const endpoint = isOn
        ? endpoints['relay-on'](deviceCode)
        : endpoints['relay-off'](deviceCode);

      await authApis(token).post(endpoint);
      setRelayStates(prev => ({ ...prev, [deviceCode]: isOn }));
      Alert.alert('Thành công', `Đã ${isOn ? 'bật' : 'tắt'} relay của thiết bị ${deviceCode}`);
    } catch (err) {
      console.error(err);
      Alert.alert('Lỗi', 'Không thể điều khiển relay. Vui lòng thử lại.');
    }
  };

  // Hàm đặt nhiệt độ mặc định
  const handleSetDefaultTemperature = async (deviceCode) => {
    const temp = parseFloat(defaultTempInput);
    if (isNaN(temp) || temp < 0 || temp > 100) {
      Alert.alert('Lỗi', 'Nhiệt độ phải từ 0 đến 100°C');
      return;
    }
    try {
      const token = await AsyncStorage.getItem('token');
      await authApis(token).post(
        endpoints['set-default-temperature'](deviceCode),
        {},
        { params: { temperature: temp } }
      );
      setDefaultTemps(prev => ({ ...prev, [deviceCode]: temp }));
      Alert.alert('Thành công', `Đã đặt nhiệt độ mặc định ${temp}°C cho thiết bị ${deviceCode}`);
      setDefaultTempInput('');
    } catch (err) {
      console.error(err);
      Alert.alert('Lỗi', 'Không thể đặt nhiệt độ mặc định');
    }
  };

  // Tải danh sách thiết bị khi component mount
  useEffect(() => {
    loadDevices();
  }, []);

  // Render từng thiết bị
  const renderItem = ({ item }) => {
    const isSelected = selectedDevice === item.deviceCode;
    const defaultTemp = defaultTemps[item.deviceCode];

    return (
      <TouchableOpacity
        onPress={() => setSelectedDevice(item.deviceCode)}
        activeOpacity={0.9}
        className={`
          bg-white rounded-3xl p-6 mb-4
          ${isSelected ? 'border-2 border-primary-500' : 'border border-gray-200'}
          shadow-md
        `}
      >
        {/* Header */}
        <View className="flex-row justify-between mb-4 items-center">
          <View className="flex-row items-center">
            <View className="w-12 h-12 rounded-2xl bg-gradient-to-br from-primary-500 to-primary-600 mr-3 items-center justify-center shadow-lg">
              <Text className="text-white text-2xl">📱</Text>
            </View>
            <View>
              <Text className="text-lg font-bold text-secondary-800">
                {item.deviceName || '(Không có tên)'}
              </Text>
              <Text className="text-sm text-secondary-500">
                Mã: {item.deviceCode}
              </Text>
            </View>
          </View>
        </View>

        {/* Sensor Data */}
        <SensorData
          deviceCode={item.deviceCode}
          sensorData={null} // Dữ liệu cảm biến được xử lý ở trang SensorData
        />

        {/* Temperature Input & Button */}
        <View className="bg-secondary-100 rounded-2xl p-4 mb-4">
          <Text className="text-secondary-700 font-semibold mb-3">
            Cài đặt nhiệt độ mặc định
          </Text>
          <View className="flex-row space-x-3">
            <TextInput
              className="flex-1 bg-white border border-secondary-300 rounded-xl px-4 py-3 text-secondary-800"
              placeholder="Nhiệt độ (°C)"
              placeholderTextColor="#94a3b8"
              keyboardType="numeric"
              value={defaultTempInput}
              onChangeText={setDefaultTempInput}
            />
            <TouchableOpacity
              className="bg-primary-500 rounded-xl px-6 py-3 items-center justify-center shadow-md"
              onPress={() => handleSetDefaultTemperature(item.deviceCode)}
              activeOpacity={0.8}
            >
              <Text className="text-white font-semibold">Đặt</Text>
            </TouchableOpacity>
          </View>
          {defaultTemp && (
            <Text className="text-secondary-600 mt-2">
              Nhiệt độ mặc định hiện tại: {defaultTemp}°C
            </Text>
          )}
        </View>

        {/* Relay Controls */}
        <View className="flex-row space-x-3">
          <TouchableOpacity
            onPress={() => handleRelayControl(item.deviceCode, true)}
            className="flex-1 rounded-2xl py-4 items-center bg-green-500 shadow-lg"
            activeOpacity={0.8}
          >
            <Text className="text-white font-bold">Bật Quạt</Text>
          </TouchableOpacity>
          <TouchableOpacity
            onPress={() => handleRelayControl(item.deviceCode, false)}
            className="flex-1 rounded-2xl py-4 items-center bg-red-500 shadow-lg"
            activeOpacity={0.8}
          >
            <Text className="text-white font-bold">Tắt Quạt</Text>
          </TouchableOpacity>
        </View>
      </TouchableOpacity>
    );
  };

  if (loading) {
    return (
      <View className="flex-1 justify-center items-center bg-primary-50">
        <View className="bg-white rounded-3xl p-8 shadow-lg items-center">
          <ActivityIndicator size="large" color="#3b82f6" />
          <Text className="text-secondary-600 font-medium mt-4">Đang tải thiết bị...</Text>
        </View>
      </View>
    );
  }

  return (
    <View className="flex-1 bg-primary-50">
      <ScrollView
        contentContainerStyle={{ padding: 16 }}
        showsVerticalScrollIndicator={false}
      >
        <View className="mb-6">
          <Text className="text-2xl font-bold text-secondary-800 mb-2">
            Thiết bị của bạn
          </Text>
          <Text className="text-secondary-600">
            Quản lý và điều khiển các thiết bị cảm biến
          </Text>
        </View>

        <FlatList
          data={devices}
          keyExtractor={(item) => item.deviceId.toString()}
          renderItem={renderItem}
          scrollEnabled={false}
          ListEmptyComponent={
            <View className="bg-white rounded-3xl p-8 items-center shadow-md">
              <Text className="text-6xl mb-4">📱</Text>
              <Text className="text-secondary-800 text-lg font-semibold mb-2">
                Chưa có thiết bị nào
              </Text>
              <Text className="text-secondary-500 text-center">
                Bạn chưa có thiết bị nào được kết nối.
              </Text>
            </View>
          }
        />
      </ScrollView>
    </View>
  );
};

export default DeviceScreen;