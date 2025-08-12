import React, { useState } from 'react';
import { authApis, endpoints } from '../configs/APIs';
import Cookies from 'js-cookie';
import { useNavigate } from 'react-router-dom';

const AddWarehouse = () => {
  const [warehouseName, setWarehouseName] = useState('');
  const [temperature, setTemperature] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async () => {
    if (!warehouseName.trim()) {
      alert('Vui lòng nhập tên kho');
      return;
    }
    if (!temperature.trim()) {
      alert('Vui lòng nhập nhiệt độ');
      return;
    }

    const temp = parseFloat(temperature);
    if (isNaN(temp) || temp < 0 || temp > 100) {
      alert('Nhiệt độ phải từ 0 đến 100°C');
      return;
    }

    try {
      setLoading(true);
      const token = Cookies.get('token');

      const params = new URLSearchParams();
      params.append('name', warehouseName.trim());
      params.append('temperature', temp.toString());

      const response = await authApis(token).post(
        `${endpoints['add-warehouse']}?${params.toString()}` 
      );

      if (response.status === 200 || response.status === 201) {
        alert('Đã thêm kho thành công');
        navigate(-1);
      }
    } catch (err) {
      console.error(err);
      alert('Không thể thêm kho. Vui lòng thử lại sau.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary-50 via-white to-secondary-50 flex justify-center items-center px-4">
      <div className="w-full max-w-lg bg-white rounded-3xl shadow-lg p-8">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="w-20 h-20 bg-gradient-to-br from-primary-500 to-primary-600 rounded-3xl flex items-center justify-center mb-4 shadow-lg mx-auto">
            <span className="text-white text-3xl">🏭</span>
          </div>
          <h1 className="text-3xl font-bold text-secondary-800 mb-1">Thêm kho mới</h1>
          <p className="text-lg text-secondary-600">Tạo kho hàng để quản lý thiết bị</p>
        </div>

        {/* Form */}
        <div className="space-y-6">
          {/* Warehouse Name */}
          <div>
            <label className="text-secondary-700 font-semibold mb-2 block">Tên kho</label>
            <div className="relative">
              <input
                type="text"
                className="w-full bg-white border border-secondary-200 rounded-2xl px-6 py-4 text-secondary-800 text-base shadow-sm focus:outline-none focus:ring-2 focus:ring-primary-400"
                placeholder="Nhập tên kho"
                value={warehouseName}
                onChange={(e) => setWarehouseName(e.target.value)}
                maxLength={100}
              />
              <span className="absolute right-4 top-4 text-secondary-400">🏭</span>
            </div>
          </div>

          {/* Temperature */}
          <div>
            <label className="text-secondary-700 font-semibold mb-2 block">Nhiệt độ chuẩn (°C)</label>
            <div className="relative">
              <input
                type="number"
                className="w-full bg-white border border-secondary-200 rounded-2xl px-6 py-4 text-secondary-800 text-base shadow-sm focus:outline-none focus:ring-2 focus:ring-primary-400"
                placeholder="Nhập nhiệt độ (0-100°C)"
                value={temperature}
                onChange={(e) => setTemperature(e.target.value)}
                maxLength={5}
              />
              <span className="absolute right-4 top-4 text-secondary-400">🌡️</span>
            </div>
          </div>

          {/* Submit */}
          <button
            onClick={handleSubmit}
            disabled={loading}
            className={`w-full rounded-2xl py-4 text-blue font-bold text-lg shadow-md ${
              loading
                ? 'bg-secondary-300 cursor-not-allowed'
                : 'bg-gradient-to-r from-primary-500 to-primary-600 hover:opacity-90'
            }`}
          >
            {loading ? 'Đang thêm...' : 'Thêm kho'}
          </button>
        </div>

        {/* Info */}
        <div className="mt-8 bg-gradient-to-r from-secondary-50 to-primary-50 rounded-3xl p-6">
          <div className="flex items-center mb-4">
            <div className="w-12 h-12 bg-primary-500 rounded-2xl flex items-center justify-center mr-4">
              <span className="text-white text-xl">ℹ️</span>
            </div>
            <h2 className="text-lg font-bold text-secondary-800">Thông tin kho</h2>
          </div>
          <ul className="text-secondary-600 space-y-2">
            <li><strong>Tên kho:</strong> Đặt tên dễ nhớ để phân biệt các kho</li>
            <li><strong>Nhiệt độ chuẩn:</strong> Nhiệt độ lý tưởng để bảo quản thực phẩm (0-100°C)</li>
            <li>Hệ thống sẽ cảnh báo khi nhiệt độ chênh lệch ±5°C so với chuẩn</li>
          </ul>
        </div>
      </div>
    </div>
  );
};

export default AddWarehouse;
