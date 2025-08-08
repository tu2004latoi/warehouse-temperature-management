import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet } from 'react-native';
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

  return (
    <View style={styles.sensorContainer}>
      <Text style={styles.title}>🌡️ Dữ liệu cảm biến</Text>
      {sensorData ? (
        <>
          <Text style={styles.label}>📟 Thiết bị: <Text style={styles.value}>{sensorData.deviceCode}</Text></Text>
          <Text style={styles.label}>🌡️ Nhiệt độ: <Text style={styles.value}>{sensorData.temperature}°C</Text></Text>
          <Text style={styles.label}>💧 Độ ẩm: <Text style={styles.value}>{sensorData.humidity}%</Text></Text>
          <Text style={styles.label}>🔥 Trạng thái rơ-le: <Text style={styles.value}>{sensorData.relay}</Text></Text>
          <Text style={styles.label}>⚠️ Điều kiện: <Text style={[styles.value, sensorData.condition === 'abnormal' ? styles.abnormal : styles.normal]}>{sensorData.condition}</Text></Text>
          <Text style={styles.label}>🎯 Nhiệt độ chuẩn: <Text style={styles.value}>{sensorData.defaultTemperature}°C</Text></Text>
          <Text style={styles.label}>⏰ Thời gian: <Text style={styles.value}>{sensorData.timestamp}</Text></Text>
        </>
      ) : (
        <Text>⏳ Đang chờ dữ liệu...</Text>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  sensorContainer: {
    marginTop: 10,
    padding: 12,
    backgroundColor: '#f0f8ff',
    borderRadius: 10,
    borderWidth: 1,
    borderColor: '#cce0ff',
  },
  title: {
    fontWeight: 'bold',
    fontSize: 18,
    marginBottom: 8,
    color: '#003366',
  },
  label: {
    fontSize: 15,
    marginVertical: 2,
    color: '#333',
  },
  value: {
    fontWeight: '600',
  },
  abnormal: {
    color: 'red',
  },
  normal: {
    color: 'green',
  },
});

export default SensorData;
