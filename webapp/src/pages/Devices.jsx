
import "./Devices.css";
import SockJS from 'sockjs-client';
import { Client } from '@stomp/stompjs';
import { useEffect, useState } from "react";

const Devices = ({ devices }) => {
  const [sensorData, setSensorData] = useState(null);
  const [selectedDeviceId, setSelectedDeviceId] = useState(null);
  const [inputCode, setInputCode] = useState("");
  const [authenticatedDevices, setAuthenticatedDevices] = useState({}); // Lưu các device đã xác thực

  useEffect(() => {
    const socket = new SockJS('http://10.0.2.2:8080/ws');
    const client = new Client({
      webSocketFactory: () => socket,
      reconnectDelay: 5000,
      onConnect: () => {
        console.log('✅ WebSocket connected');
        client.subscribe('/topic/esp32', (message) => {
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
  }, []);

  const handleSelectDevice = (deviceId) => {
    setSelectedDeviceId(deviceId);
    setInputCode("");
  };

  const handleSubmitCode = (deviceId, correctCode) => {
    if (inputCode === correctCode) {
      setAuthenticatedDevices((prev) => ({ ...prev, [deviceId]: true }));
    } else {
      alert("❌ Mã code không đúng!");
    }
  };

  return (
    <div className="dashboard-container p-6">
      <h1 className="text-3xl font-bold text-blue-600 mb-6">📦 Thiết bị của bạn</h1>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
        {devices.map((device) => (
          <div
            key={device.deviceId}
            className="bg-white p-4 rounded-xl shadow-md border hover:shadow-lg transition duration-300"
          >
            <h3 className="text-lg font-semibold text-gray-800 mb-2">
              {device.deviceName}
            </h3>

            {!authenticatedDevices[device.deviceId] ? (
              <>
                {selectedDeviceId === device.deviceId ? (
                  <div>
                    <input
                      type="text"
                      placeholder="Nhập mã thiết bị"
                      value={inputCode}
                      onChange={(e) => setInputCode(e.target.value)}
                      className="border rounded px-3 py-1 w-full mb-2"
                    />
                    <button
                      onClick={() => handleSubmitCode(device.deviceId, device.deviceCode)}
                      className="bg-blue-500 text-white px-4 py-1 rounded hover:bg-blue-600"
                    >
                      Xác nhận
                    </button>
                  </div>
                ) : (
                  <button
                    onClick={() => handleSelectDevice(device.deviceId)}
                    className="bg-gray-200 text-gray-700 px-4 py-1 rounded hover:bg-gray-300"
                  >
                    👉 Nhập mã để xem chi tiết
                  </button>
                )}
              </>
            ) : (
              <div className="mt-2 text-sm text-gray-700">
                {sensorData ? (
                  <>
                    <p>🌡️ Nhiệt độ: {sensorData.temperature}°C</p>
                    <p>💧 Độ ẩm: {sensorData.humidity}%</p>
                    <p>⏱️ Thời gian: {sensorData.timestamp}</p>
                  </>
                ) : (
                  <p>⏳ Đang chờ dữ liệu từ cảm biến...</p>
                )}
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

export default Devices;
