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
import { Client } from '@stomp/stompjs';
import SockJS from 'sockjs-client';
import APIs, { authApis, endpoints } from '../configs/APIs';
import AsyncStorage from '@react-native-async-storage/async-storage';

const DeviceScreen = () => {
  // Khai báo đầy đủ state
  const [devices, setDevices] = useState([]);
  const [loading, setLoading] = useState(true);
  const [relayStates, setRelayStates] = useState({});
  const [conditions, setConditions] = useState({});
  const [alerts, setAlerts] = useState({});
  const [sensorData, setSensorData] = useState({});
  const [defaultTemps, setDefaultTemps] = useState({});
  const [selectedDevice, setSelectedDevice] = useState(null);
  const [defaultTempInput, setDefaultTempInput] = useState('');
  const [stompClient, setStompClient] = useState(null);

  // Hàm tải thiết bị từ API
  const loadDevices = async () => {
    try {
      const token = await AsyncStorage.getItem('token');
      const res = await authApis(token).get(endpoints['my-devices']);
      setDevices(res.data);

      // Khởi tạo các trạng thái ban đầu cho các thiết bị
      const initialRelayStates = {};
      const initialConditions = {};
      const initialAlerts = {};
      const initialSensorData = {};
      const initialDefaultTemps = {};
      res.data.forEach(device => {
        initialRelayStates[device.deviceCode] = false;
        initialConditions[device.deviceCode] = 'normal';
        initialAlerts[device.deviceCode] = false;
        initialSensorData[device.deviceCode] = { temperature: null, humidity: null };
        initialDefaultTemps[device.deviceCode] = null;
      });

      setRelayStates(initialRelayStates);
      setConditions(initialConditions);
      setAlerts(initialAlerts);
      setSensorData(initialSensorData);
      setDefaultTemps(initialDefaultTemps);
    } catch (err) {
      console.error(err);
      Alert.alert('Lỗi', 'Không thể tải danh sách thiết bị');
    }
  };

  // Hàm điều khiển relay
  const handleRelayControl = async (deviceCode, isOn) => {
    if (conditions[deviceCode] !== 'normal') {
      Alert.alert('Lỗi', 'Không thể điều khiển relay: Điều kiện môi trường không bình thường');
      return;
    }
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

  // Kết nối WebSocket, nhận dữ liệu real-time
  useEffect(() => {
    const loadData = async () => {
      await loadDevices();
      setLoading(false);
    };
    loadData();

    const client = new Client({
      webSocketFactory: () => new SockJS('http://<your-backend-url>/ws'),
      reconnectDelay: 5000,
      onConnect: () => {
        client.subscribe('/topic/sensor', (message) => {
          try {
            const data = JSON.parse(message.body);
            const deviceCode = data.device_code;
            setRelayStates(prev => ({ ...prev, [deviceCode]: data.relay === 'on' }));
            setConditions(prev => ({ ...prev, [deviceCode]: data.condition }));
            setAlerts(prev => ({ ...prev, [deviceCode]: data.alert }));
            setSensorData(prev => ({
              ...prev,
              [deviceCode]: { temperature: data.temperature, humidity: data.humidity }
            }));
            setDefaultTemps(prev => ({ ...prev, [deviceCode]: data.default_temperature }));
            if (data.alert && deviceCode === selectedDevice) {
              Alert.alert('Cảnh báo', `Nhiệt độ chênh lệch quá ±5°C so với mặc định (${data.default_temperature}°C) tại thiết bị ${deviceCode}`);
            }
          } catch (err) {
            console.error('Lỗi xử lý dữ liệu WebSocket:', err);
          }
        });
      },
      onStompError: (frame) => {
        console.error('Lỗi WebSocket:', frame);
      },
    });

    client.activate();
    setStompClient(client);

    return () => {
      if (client) client.deactivate();
    };
  }, [selectedDevice]);

  // Render từng thiết bị
  const renderItem = ({ item }) => {
    const isSelected = selectedDevice === item.deviceCode;
    const condition = conditions[item.deviceCode];
    const alertActive = alerts[item.deviceCode];
    const sensor = sensorData[item.deviceCode] || { temperature: '-', humidity: '-' };
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
          <View
            className={`w-3 h-3 rounded-full ${
              condition === 'normal' ? 'bg-green-500' : 'bg-yellow-500'
            }`}
          />
        </View>

        {/* Sensor Data */}
        <View className="flex-row justify-between bg-primary-50 rounded-2xl p-4 mb-4">
          <View className="flex-1 bg-white rounded-xl p-4 items-center mr-3 shadow">
            <Text className="text-4xl">🌡️</Text>
            <Text className="text-xl font-bold text-secondary-800 mt-2">
              {sensor.temperature !== null ? `${sensor.temperature}°C` : '-'}
            </Text>
            <Text className="text-xs text-secondary-500 mt-1">Nhiệt độ</Text>
          </View>
          <View className="flex-1 bg-white rounded-xl p-4 items-center shadow">
            <Text className="text-4xl">💧</Text>
            <Text className="text-xl font-bold text-secondary-800 mt-2">
              {sensor.humidity !== null ? `${sensor.humidity}%` : '-'}
            </Text>
            <Text className="text-xs text-secondary-500 mt-1">Độ ẩm</Text>
          </View>
        </View>

        {/* Alert */}
        {alertActive && (
          <View className="flex-row bg-red-100 border border-red-300 rounded-2xl p-4 mb-4 items-center">
            <Text className="text-2xl mr-3">⚠️</Text>
            <Text className="text-red-700 font-semibold flex-shrink">
              Cảnh báo: Nhiệt độ chênh lệch quá ±5°C so với mặc định ({defaultTemp}°C)
            </Text>
          </View>
        )}

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
        </View>

        {/* Relay Controls */}
        <View className="flex-row space-x-3">
          <TouchableOpacity
            disabled={condition !== 'normal'}
            onPress={() => handleRelayControl(item.deviceCode, true)}
            className={`flex-1 rounded-2xl py-4 items-center ${
              condition === 'normal'
                ? 'bg-green-500 shadow-lg'
                : 'bg-gray-300'
            }`}
            activeOpacity={condition === 'normal' ? 0.8 : 1}
          >
            <Text className="text-white font-bold">Bật Relay</Text>
          </TouchableOpacity>
          <TouchableOpacity
            disabled={condition !== 'normal'}
            onPress={() => handleRelayControl(item.deviceCode, false)}
            className={`flex-1 rounded-2xl py-4 items-center ${
              condition === 'normal'
                ? 'bg-red-500 shadow-lg'
                : 'bg-gray-300'
            }`}
            activeOpacity={condition === 'normal' ? 0.8 : 1}
          >
            <Text className="text-white font-bold">Tắt Relay</Text>
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
