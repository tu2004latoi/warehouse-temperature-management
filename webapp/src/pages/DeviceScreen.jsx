import React, { useEffect, useState } from 'react';
import APIs, { authApis, endpoints } from '../configs/APIs';
import { toast } from 'react-toastify';
import SensorData from '../components/devices/SensorData';

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
      const token = localStorage.getItem('token');
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
      toast.error('Không thể tải danh sách thiết bị');
    } finally {
      setLoading(false);
    }
  };

  // Hàm điều khiển relay
  const handleRelayControl = async (deviceCode, isOn) => {
    try {
      const token = localStorage.getItem('token');
      const endpoint = isOn
        ? endpoints['relay-on'](deviceCode)
        : endpoints['relay-off'](deviceCode);

      await authApis(token).post(endpoint);
      setRelayStates(prev => ({ ...prev, [deviceCode]: isOn }));
      toast.success(`Đã ${isOn ? 'bật' : 'tắt'} relay của thiết bị ${deviceCode}`);
    } catch (err) {
      console.error(err);
      toast.error('Không thể điều khiển relay. Vui lòng thử lại.');
    }
  };

  // Hàm đặt nhiệt độ mặc định
  const handleSetDefaultTemperature = async (deviceCode) => {
    const temp = parseFloat(defaultTempInput);
    if (isNaN(temp) || temp < 0 || temp > 100) {
      toast.error('Nhiệt độ phải từ 0 đến 100°C');
      return;
    }
    try {
      const token = localStorage.getItem('token');
      await authApis(token).post(
        endpoints['set-default-temperature'](deviceCode),
        {},
        { params: { temperature: temp } }
      );
      setDefaultTemps(prev => ({ ...prev, [deviceCode]: temp }));
      toast.success(`Đã đặt nhiệt độ mặc định ${temp}°C cho thiết bị ${deviceCode}`);
      setDefaultTempInput('');
    } catch (err) {
      console.error(err);
      toast.error('Không thể đặt nhiệt độ mặc định');
    }
  };

  // Tải danh sách thiết bị khi component mount
  useEffect(() => {
    loadDevices();
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-blue-50">
        <div className="bg-white rounded-3xl p-8 shadow-lg flex flex-col items-center">
          <svg
            className="animate-spin h-8 w-8 text-blue-600 mb-4"
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
          >
            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
          </svg>
          <p className="text-gray-600 font-medium">Đang tải thiết bị...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-blue-50 p-8">
      <div className="max-w-7xl mx-auto">
        <div className="mb-6">
          <h1 className="text-2xl font-bold text-gray-800 mb-2">Thiết bị của bạn</h1>
          <p className="text-gray-600">Quản lý và điều khiển các thiết bị cảm biến</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {devices.length === 0 ? (
            <div className="bg-white rounded-3xl p-8 flex flex-col items-center shadow-md col-span-full">
              <span className="text-6xl mb-4">📱</span>
              <h2 className="text-gray-800 text-lg font-semibold mb-2">Chưa có thiết bị nào</h2>
              <p className="text-gray-500 text-center">Bạn chưa có thiết bị nào được kết nối.</p>
            </div>
          ) : (
            devices.map((item) => {
              const isSelected = selectedDevice === item.deviceCode;
              const defaultTemp = defaultTemps[item.deviceCode];

              return (
                <div
                  key={item.deviceId}
                  onClick={() => setSelectedDevice(item.deviceCode)}
                  className={`bg-white rounded-3xl p-6 cursor-pointer transition-shadow duration-200 ${
                    isSelected ? 'border-2 border-blue-500 shadow-xl' : 'border border-gray-200 shadow-md hover:shadow-lg'
                  }`}
                >
                  {/* Header */}
                  <div className="flex justify-between mb-4 items-center">
                    <div className="flex items-center">
                      <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-blue-500 to-blue-600 mr-3 flex items-center justify-center shadow-lg">
                        <span className="text-white text-2xl">📱</span>
                      </div>
                      <div>
                        <h3 className="text-lg font-bold text-gray-800">
                          {item.deviceName || '(Không có tên)'}
                        </h3>
                        <p className="text-sm text-gray-500">Mã: {item.deviceCode}</p>
                      </div>
                    </div>
                  </div>

                  {/* Sensor Data */}
                  <SensorData
                    deviceCode={item.deviceCode}
                    sensorData={null} // Dữ liệu cảm biến được xử lý ở SensorData
                  />

                  {/* Temperature Input & Button */}
                  <div className="bg-gray-100 rounded-2xl p-4 mb-4">
                    <label className="block text-gray-700 font-semibold mb-3">
                      Cài đặt nhiệt độ mặc định
                    </label>
                    <div className="flex space-x-3">
                      <input
                        type="number"
                        className="flex-1 bg-white border border-gray-300 rounded-xl px-4 py-3 text-gray-800 outline-none focus:border-blue-500"
                        placeholder="Nhiệt độ (°C)"
                        value={defaultTempInput}
                        onChange={(e) => setDefaultTempInput(e.target.value)}
                      />
                      <button
                        className="bg-blue-500 rounded-xl px-6 py-3 text-white font-semibold shadow-md hover:bg-blue-600 transition duration-200"
                        onClick={() => handleSetDefaultTemperature(item.deviceCode)}
                      >
                        Đặt
                      </button>
                    </div>
                    {defaultTemp && (
                      <p className="text-gray-600 mt-2">
                        Nhiệt độ mặc định hiện tại: {defaultTemp}°C
                      </p>
                    )}
                  </div>

                  {/* Relay Controls */}
                  <div className="flex space-x-3">
                    <button
                      onClick={() => handleRelayControl(item.deviceCode, true)}
                      className="flex-1 rounded-2xl py-4 text-white font-bold shadow-lg transition duration-200 bg-green-500 hover:bg-green-600"
                    >
                      Bật Relay
                    </button>
                    <button
                      onClick={() => handleRelayControl(item.deviceCode, false)}
                      className="flex-1 rounded-2xl py-4 text-white font-bold shadow-lg transition duration-200 bg-red-500 hover:bg-red-600"
                    >
                      Tắt Relay
                    </button>
                  </div>
                </div>
              );
            })
          )}
        </div>
      </div>
    </div>
  );
};

export default DeviceScreen;