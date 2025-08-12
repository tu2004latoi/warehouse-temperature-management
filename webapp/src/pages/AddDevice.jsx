import React, { useState, useEffect } from "react";
import { FiPlus, FiCpu, FiBox } from "react-icons/fi";
import APIs, { authApis, endpoints } from "../configs/APIs";

const AddDevice = () => {
  const [deviceCode, setDeviceCode] = useState("");
  const [selectedWarehouse, setSelectedWarehouse] = useState("");
  const [warehouses, setWarehouses] = useState([]);
  const [fieldErrors, setFieldErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const [loadingWarehouses, setLoadingWarehouses] = useState(true);
  const [msg, setMsg] = useState("");

  useEffect(() => {
    fetchWarehouses();
  }, []);

  const fetchWarehouses = async () => {
    try {
      const token = localStorage.getItem("token");
      const response = await authApis(token).get(endpoints["get-warehouses"]);
      const data = response.data.map((w) => ({
        id: w.warehouseId,
        name: w.name,
        temperature: w.temperature,
      }));
      setWarehouses(data);
    } catch (error) {
      console.error("Error fetching warehouses:", error);
    } finally {
      setLoadingWarehouses(false);
    }
  };

  const validate = () => {
    let errors = {};
    if (!deviceCode) errors.deviceCode = "Mã thiết bị không được để trống";
    if (!selectedWarehouse) errors.warehouse = "Vui lòng chọn kho";
    setFieldErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handleSubmit = async () => {
    setMsg("");
    if (!validate()) return;
    try {
      setLoading(true);
      const token = localStorage.getItem("token");
      if (!token) {
        alert("Không tìm thấy token xác thực");
        return;
      }
      await authApis(token).post(
        `${endpoints["add-device"](deviceCode)}?warehouseId=${selectedWarehouse}`,
        { deviceCode }
      );
      alert("Thiết bị đã được thêm!");
      setDeviceCode("");
      setSelectedWarehouse("");
    } catch (err) {
      console.error("Error adding device:", err);
      setMsg("Có lỗi xảy ra khi thêm thiết bị");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-indigo-50 flex justify-center items-center px-6 py-10">
      <div className="max-w-lg w-full bg-white rounded-3xl shadow-2xl p-8 transition-all hover:shadow-blue-200">
        
        {/* Header */}
        <div className="flex flex-col items-center mb-10">
          <div className="w-20 h-20 bg-gradient-to-tr from-blue-500 to-indigo-600 rounded-3xl flex items-center justify-center mb-5 shadow-lg">
            <FiCpu className="text-white text-4xl" />
          </div>
          <h1 className="text-3xl font-bold text-gray-800 text-center">
            Thêm Thiết Bị Mới
          </h1>
          <p className="text-gray-500 mt-2 text-center">
            Kết nối cảm biến với hệ thống để bắt đầu theo dõi
          </p>
        </div>

        {/* Error message */}
        {msg && (
          <div className="bg-red-50 border border-red-200 rounded-xl p-4 mb-6 text-red-700 text-center font-medium">
            {msg}
          </div>
        )}

        {/* Form */}
        <div className="space-y-6">
          {/* Device code input */}
          <div>
            <label className="text-gray-700 font-semibold mb-2 block">
              Mã thiết bị
            </label>
            <div className="relative">
              <input
                type="text"
                placeholder="Nhập mã thiết bị"
                value={deviceCode}
                onChange={(e) => setDeviceCode(e.target.value)}
                className="w-full bg-gray-50 border border-gray-200 rounded-2xl px-6 py-4 text-gray-800 text-base shadow-sm focus:ring-2 focus:ring-blue-400 focus:outline-none"
              />
              <FiCpu className="absolute right-4 top-4 text-gray-400 text-xl" />
            </div>
            {fieldErrors.deviceCode && (
              <p className="text-red-600 text-sm mt-2">{fieldErrors.deviceCode}</p>
            )}
          </div>

          {/* Warehouse select */}
          <div>
            <label className="text-gray-700 font-semibold mb-2 block">
              Chọn kho
            </label>
            {loadingWarehouses ? (
              <div className="p-4 text-center text-gray-500">
                Đang tải danh sách kho...
              </div>
            ) : warehouses.length === 0 ? (
              <div className="p-4 text-center text-red-600">
                Không có kho nào được tải
              </div>
            ) : (
              <div className="relative">
                <select
                  value={selectedWarehouse}
                  onChange={(e) => setSelectedWarehouse(e.target.value)}
                  className="w-full bg-gray-50 border border-gray-200 rounded-2xl px-6 py-4 text-gray-800 text-base shadow-sm focus:ring-2 focus:ring-blue-400 focus:outline-none"
                >
                  <option value="">Chọn kho</option>
                  {warehouses.map((w) => (
                    <option key={w.id} value={w.id}>
                      {w.name}
                    </option>
                  ))}
                </select>
                <FiBox className="absolute right-4 top-4 text-gray-400 text-xl" />
              </div>
            )}
            {fieldErrors.warehouse && (
              <p className="text-red-600 text-sm mt-2">{fieldErrors.warehouse}</p>
            )}
          </div>

          {/* Submit button */}
          <button
            onClick={handleSubmit}
            disabled={loading}
            className={`w-full flex items-center justify-center gap-2 rounded-2xl py-4 font-bold text-lg text-white shadow-lg transition-all ${
              loading
                ? "bg-gray-300 cursor-not-allowed"
                : "bg-gradient-to-r from-blue-500 to-indigo-600 hover:opacity-90 hover:scale-[1.01]"
            }`}
          >
            {loading ? "Đang thêm..." : <>
              <FiPlus className="text-xl" /> Thêm thiết bị
            </>}
          </button>
        </div>

        {/* Info section */}
        <div className="mt-8 bg-gradient-to-r from-indigo-50 to-blue-50 rounded-2xl p-5 border border-blue-100">
          <div className="flex items-center mb-3">
            <div className="w-12 h-12 bg-blue-500 rounded-xl flex items-center justify-center mr-3">
              <span className="text-white text-xl">ℹ️</span>
            </div>
            <h3 className="text-lg font-bold text-gray-800">Hướng dẫn</h3>
          </div>
          <p className="text-gray-600 leading-6">
            Nhập mã thiết bị và chọn kho lưu trữ để kết nối với hệ thống.
            Thiết bị sẽ bắt đầu theo dõi nhiệt độ, độ ẩm ngay sau khi kết nối.
          </p>
        </div>
      </div>
    </div>
  );
};

export default AddDevice;
