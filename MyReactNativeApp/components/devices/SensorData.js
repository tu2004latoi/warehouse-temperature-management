import React, { useEffect, useState } from 'react';
import { View, Text } from 'react-native';
import SockJS from 'sockjs-client';
import { Client } from '@stomp/stompjs';

const SensorData = ({ deviceCode }) => {
  const [sensorData, setSensorData] = useState(null);

  useEffect(() => {
    if (!deviceCode) return;

    const socket = new SockJS('http://192.168.1.2:8080/ws');
    const client = new Client({
      webSocketFactory: () => socket,
      reconnectDelay: 5000,
      onConnect: () => {
        console.log(`✅ WebSocket connected to ${deviceCode}`);
        client.subscribe(`/topic/esp32/${deviceCode}`, (message) => {
          try {
            const data = JSON.parse(message.body);
            setSensorData(data);
            console.log('📊 Dữ liệu cảm biến:', data);
          } catch (err) {
            console.error('❌ Lỗi phân tích JSON:', err);
          }
        });
      },
      onStompError: (frame) => {
        console.error('❌ STOMP error: ' + frame.headers['message']);
      },
    });

    client.activate();

    return () => {
      client.deactivate();
    };
  }, [deviceCode]);

  if (!sensorData) {
    return (
      <View className="bg-gradient-to-r from-secondary-50 to-primary-50 rounded-2xl p-4 mb-4">
        <View className="flex-row items-center justify-center">
          <Text className="text-2xl mr-2">⏳</Text>
          <Text className="text-secondary-600 font-medium">Đang chờ dữ liệu...</Text>
        </View>
      </View>
    );
  }

  return (
    <View className="bg-gradient-to-r from-primary-50 to-secondary-50 rounded-2xl p-4 mb-4">
      <View className="flex-row items-center justify-between mb-4">
        <Text className="text-lg font-bold text-secondary-800">📊 Dữ liệu chi tiết</Text>
        <View className={`px-3 py-1 rounded-full ${
          sensorData.condition === 'abnormal' 
            ? 'bg-danger-100' 
            : 'bg-success-100'
        }`}>
          <Text className={`text-xs font-semibold ${
            sensorData.condition === 'abnormal' 
              ? 'text-danger-700' 
              : 'text-success-700'
          }`}>
            {sensorData.condition === 'abnormal' ? '⚠️ Bất thường' : '✅ Bình thường'}
          </Text>
        </View>
      </View>

      <View className="space-y-3">
        {/* Device Info */}
        <View className="bg-white rounded-xl p-3">
          <View className="flex-row items-center justify-between">
            <Text className="text-secondary-600 font-medium">📟 Thiết bị</Text>
            <Text className="text-secondary-800 font-semibold">{sensorData.deviceCode}</Text>
          </View>
        </View>

        {/* Temperature and Humidity */}
        <View className="flex-row space-x-3">
          <View className="flex-1 bg-white rounded-xl p-3">
            <View className="flex-row items-center justify-between mb-1">
              <Text className="text-secondary-600 font-medium">🌡️ Nhiệt độ</Text>
              <Text className="text-lg font-bold text-secondary-800">{sensorData.temperature}°C</Text>
            </View>
            <View className="w-full bg-secondary-100 rounded-full h-2">
              <View 
                className="bg-gradient-to-r from-blue-400 to-blue-600 h-2 rounded-full"
                style={{ width: `${Math.min((sensorData.temperature / 50) * 100, 100)}%` }}
              />
            </View>
          </View>

          <View className="flex-1 bg-white rounded-xl p-3">
            <View className="flex-row items-center justify-between mb-1">
              <Text className="text-secondary-600 font-medium">💧 Độ ẩm</Text>
              <Text className="text-lg font-bold text-secondary-800">{sensorData.humidity}%</Text>
            </View>
            <View className="w-full bg-secondary-100 rounded-full h-2">
              <View 
                className="bg-gradient-to-r from-green-400 to-green-600 h-2 rounded-full"
                style={{ width: `${sensorData.humidity}%` }}
              />
            </View>
          </View>
        </View>

        {/* Relay Status */}
        <View className="bg-white rounded-xl p-3">
          <View className="flex-row items-center justify-between">
            <Text className="text-secondary-600 font-medium">🔥 Trạng thái rơ-le</Text>
            <View className={`px-3 py-1 rounded-full ${
              sensorData.relay === 'on' 
                ? 'bg-success-100' 
                : 'bg-secondary-100'
            }`}>
              <Text className={`font-semibold ${
                sensorData.relay === 'on' 
                  ? 'text-success-700' 
                  : 'text-secondary-600'
              }`}>
                {sensorData.relay === 'on' ? '🟢 Bật' : '🔴 Tắt'}
              </Text>
            </View>
          </View>
        </View>

        {/* Default Temperature */}
        <View className="bg-white rounded-xl p-3">
          <View className="flex-row items-center justify-between">
            <Text className="text-secondary-600 font-medium">🎯 Nhiệt độ chuẩn</Text>
            <Text className="text-lg font-bold text-primary-600">{sensorData.defaultTemperature}°C</Text>
          </View>
        </View>

        {/* Timestamp */}
        <View className="bg-white rounded-xl p-3">
          <View className="flex-row items-center justify-between">
            <Text className="text-secondary-600 font-medium">⏰ Thời gian</Text>
            <Text className="text-sm text-secondary-500">{sensorData.timestamp}</Text>
          </View>
        </View>
      </View>
    </View>
  );
};

export default SensorData;
