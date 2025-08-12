import React from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { toast } from 'react-toastify';

const UtilityScreen = () => {
  const navigate = useNavigate();

  const utilities = [
    {
      title: 'Thêm kho',
      description: 'Tạo kho hàng mới để quản lý',
      icon: '🏭',
      colorFrom: 'from-blue-500',
      colorTo: 'to-blue-700',
      onClick: () => navigate('/AddWarehouse'),
    },
    {
      title: 'Thêm thiết bị',
      description: 'Kết nối thiết bị cảm biến mới',
      icon: '📱',
      colorFrom: 'from-green-500',
      colorTo: 'to-green-700',
      onClick: () => navigate('/AddDevice'),
    },
    {
      title: 'Quản lý thiết bị',
      description: 'Quản lý các thiết bị',
      icon: '📱',
      colorFrom: 'from-red-500',
      colorTo: 'to-red-700',
      onClick: () => navigate('/Devices'),
    },
  ];

  const handleLogout = () => {
    localStorage.removeItem('token');
    toast.success('Đăng xuất thành công');
    navigate('/login', { replace: true });
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-gray-100 px-6 py-8">
      {/* Header */}
      <motion.header
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="mb-8 text-center"
      >
        <h1 className="text-4xl md:text-5xl font-extrabold bg-gradient-to-r from-indigo-600 to-blue-500 bg-clip-text text-transparent mb-2">
          Tiện ích
        </h1>
        <p className="text-lg text-gray-600 font-medium max-w-md mx-auto">
          Quản lý kho và thiết bị cảm biến một cách dễ dàng và hiệu quả
        </p>
      </motion.header>

      {/* Utilities */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5, delay: 0.2 }}
        className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-12 max-w-7xl mx-auto"
      >
        {utilities.map((item, idx) => (
          <motion.button
            key={idx}
            onClick={item.onClick}
            whileHover={{ scale: 1.03, boxShadow: '0 10px 20px rgba(0,0,0,0.1)' }}
            whileTap={{ scale: 0.98 }}
            className="flex items-center bg-white rounded-3xl p-6 shadow-lg hover:shadow-xl transition-all duration-300"
          >
            {/* Icon */}
            <motion.div
              initial={{ rotate: 0 }}
              whileHover={{ rotate: 360 }}
              transition={{ duration: 0.5 }}
              className={`bg-gradient-to-br ${item.colorFrom} ${item.colorTo} w-16 h-16 rounded-2xl flex justify-center items-center mr-5 shadow-md`}
            >
              <span className="text-3xl">{item.icon}</span>
            </motion.div>

            {/* Text */}
            <div className="flex-1 text-left">
              <h2 className="text-xl font-bold text-gray-900 mb-1">{item.title}</h2>
              <p className="text-sm text-gray-500">{item.description}</p>
            </div>

            {/* Arrow */}
            <div className="w-8 h-8 bg-gray-100 rounded-full flex justify-center items-center ml-3">
              <span className="text-gray-400 text-lg font-semibold">→</span>
            </div>
          </motion.button>
        ))}
      </motion.div>

      {/* Info section */}
      <motion.section
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.4 }}
        whileHover={{ scale: 1.02 }}
        className="bg-gradient-to-r from-indigo-100 to-blue-100 rounded-3xl p-8 shadow-lg mb-12 max-w-3xl mx-auto"
      >
        <div className="flex items-center mb-4">
          <div className="w-12 h-12 bg-indigo-600 rounded-xl flex justify-center items-center mr-4">
            <span className="text-white text-2xl">ℹ️</span>
          </div>
          <h3 className="text-xl font-bold text-gray-900">Hướng dẫn sử dụng</h3>
        </div>
        <p className="text-base leading-7 text-indigo-900">
          Sử dụng các tiện ích bên trên để thêm kho hàng và thiết bị cảm biến vào hệ thống. Mỗi thiết bị sẽ giúp bạn theo dõi nhiệt độ và độ ẩm trong thời gian thực, đảm bảo điều kiện bảo quản tối ưu.
        </p>
      </motion.section>

      {/* Logout */}
      <motion.button
        onClick={handleLogout}
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        className="mx-auto block rounded-full py-3 px-8 bg-gradient-to-r from-red-500 to-red-700 text-white font-bold text-base shadow-lg hover:shadow-xl transition-all duration-300 animate-pulse"
      >
        Đăng xuất
      </motion.button>
    </div>
  );
};

export default UtilityScreen;