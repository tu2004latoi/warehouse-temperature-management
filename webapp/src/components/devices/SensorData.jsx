import React, { useEffect, useState } from 'react';
import { toast } from 'react-toastify';
import { Client } from '@stomp/stompjs';
import SockJS from 'sockjs-client';

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
            toast.error('Lỗi phân tích dữ liệu cảm biến');
          }
        });
      },
      onStompError: (frame) => {
        console.error('❌ STOMP error: ' + frame.headers['message']);
        toast.error('Lỗi kết nối WebSocket');
      },
    });

    client.activate();

    return () => {
      client.deactivate();
    };
  }, [deviceCode]);

  if (!sensorData) {
    return (
      <div className="bg-gradient-to-r from-gray-50 to-blue-50 rounded-2xl p-4 mb-4">
        <div className="flex items-center justify-center">
          <span className="text-2xl mr-2">⏳</span>
          <p className="text-gray-600 font-medium">Đang chờ dữ liệu...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-gradient-to-r from-blue-50 to-gray-50 rounded-2xl p-4 mb-4">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-bold text-gray-800">📊 Dữ liệu chi tiết</h3>
        <span
          className={`px-3 py-1 rounded-full ${
            sensorData.condition === 'abnormal' ? 'bg-red-100' : 'bg-green-100'
          }`}
        >
          <span
            className={`text-xs font-semibold ${
              sensorData.condition === 'abnormal' ? 'text-red-700' : 'text-green-700'
            }`}
          >
            {sensorData.condition === 'abnormal' ? '⚠️ Bất thường' : '✅ Bình thường'}
          </span>
        </span>
      </div>

      <div className="space-y-3">
        {/* Device Info */}
        <div className="bg-white rounded-xl p-3">
          <div className="flex items-center justify-between">
            <span className="text-gray-600 font-medium">📟 Thiết bị</span>
            <span className="text-gray-800 font-semibold">{sensorData.deviceCode}</span>
          </div>
        </div>

        {/* Temperature and Humidity */}
        <div className="flex space-x-3">
          <div className="flex-1 bg-white rounded-xl p-3">
            <div className="flex items-center justify-between mb-1">
              <span className="text-gray-600 font-medium">🌡️ Nhiệt độ</span>
              <span className="text-lg font-bold text-gray-800">{sensorData.temperature}°C</span>
            </div>
            <div className="w-full bg-gray-100 rounded-full h-2">
              <div
                className="bg-gradient-to-r from-blue-400 to-blue-600 h-2 rounded-full"
                style={{ width: `${Math.min((sensorData.temperature / 50) * 100, 100)}%` }}
              />
            </div>
          </div>

          <div className="flex-1 bg-white rounded-xl p-3">
            <div className="flex items-center justify-between mb-1">
              <span className="text-gray-600 font-medium">💧 Độ ẩm</span>
              <span className="text-lg font-bold text-gray-800">{sensorData.humidity}%</span>
            </div>
            <div className="w-full bg-gray-100 rounded-full h-2">
              <div
                className="bg-gradient-to-r from-green-400 to-green-600 h-2 rounded-full"
                style={{ width: `${sensorData.humidity}%` }}
              />
            </div>
          </div>
        </div>

        {/* Relay Status */}
        <div className="bg-white rounded-xl p-3">
          <div className="flex items-center justify-between">
            <span className="text-gray-600 font-medium">🔥 Trạng thái rơ-le</span>
            <span
              className={`px-3 py-1 rounded-full ${
                sensorData.relay === 'on' ? 'bg-green-100' : 'bg-gray-100'
              }`}
            >
              <span
                className={`font-semibold ${
                  sensorData.relay === 'on' ? 'text-green-700' : 'text-gray-600'
                }`}
              >
                {sensorData.relay === 'on' ? '🟢 Bật' : '🔴 Tắt'}
              </span>
            </span>
          </div>
        </div>

        {/* Default Temperature */}
        <div className="bg-white rounded-xl p-3">
          <div className="flex items-center justify-between">
            <span className="text-gray-600 font-medium">🎯 Nhiệt độ chuẩn</span>
            <span className="text-lg font-bold text-blue-600">{sensorData.defaultTemperature}°C</span>
          </div>
        </div>

        {/* Timestamp */}
        <div className="bg-white rounded-xl p-3">
          <div className="flex items-center justify-between">
            <span className="text-gray-600 font-medium">⏰ Thời gian</span>
            <span className="text-sm text-gray-500">{sensorData.timestamp}</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SensorData;