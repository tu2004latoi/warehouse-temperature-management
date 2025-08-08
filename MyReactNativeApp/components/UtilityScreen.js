import React from 'react';
import { View, Text, TouchableOpacity, ScrollView } from 'react-native';
import { useNavigation } from '@react-navigation/native';

// NativeWind cho phép dùng className như web Tailwind
const UtilityScreen = () => {
  const navigation = useNavigation();

  const utilities = [
    {
      title: 'Thêm kho',
      description: 'Tạo kho hàng mới để quản lý',
      icon: '🏭',
      colorFrom: 'from-blue-500',
      colorTo: 'to-blue-600',
      onPress: () => navigation.navigate('AddWarehouse'),
    },
    {
      title: 'Thêm thiết bị',
      description: 'Kết nối thiết bị cảm biến mới',
      icon: '📱',
      colorFrom: 'from-green-500',
      colorTo: 'to-green-600',
      onPress: () => navigation.navigate('AddDevice'),
    },
  ];

  // Hàm xử lý đăng xuất
  const handleLogout = () => {
    // Xử lý logic đăng xuất ở đây nếu cần (ví dụ: xóa token, reset state, ...)
    navigation.replace('Login');
  };

  return (
    <ScrollView
      className="flex-1 bg-gray-50 px-6 py-6"
      contentContainerStyle={{ paddingBottom: 40 }}
    >
      {/* Header */}
      <View className="mb-6">
        <Text className="text-4xl font-extrabold text-slate-900 mb-1">Tiện ích</Text>
        <Text className="text-lg text-slate-600">Quản lý hệ thống và thiết bị</Text>
      </View>

      {/* Utilities List */}
      <View className="mb-8">
        {utilities.map((item, idx) => (
          <TouchableOpacity
            key={idx}
            onPress={item.onPress}
            activeOpacity={0.85}
            className="flex-row items-center bg-white rounded-3xl px-5 py-6 mb-4 shadow-md"
          >
            {/* Icon with gradient background */}
            <View
              className={`${item.colorFrom} ${item.colorTo} bg-gradient-to-br w-16 h-16 rounded-2xl justify-center items-center mr-5 shadow-lg`}
            >
              <Text className="text-3xl">{item.icon}</Text>
            </View>

            {/* Text Content */}
            <View className="flex-1">
              <Text className="text-xl font-bold text-slate-900 mb-1">{item.title}</Text>
              <Text className="text-sm text-slate-500">{item.description}</Text>
            </View>

            {/* Arrow */}
            <View className="w-8 h-8 bg-gray-200 rounded-full justify-center items-center ml-3">
              <Text className="text-gray-400 text-lg font-semibold">→</Text>
            </View>
          </TouchableOpacity>
        ))}
      </View>

      {/* Info Section */}
      <View className="bg-indigo-100 rounded-3xl p-6 shadow-lg mb-8">
        <View className="flex-row items-center mb-4">
          <View className="w-12 h-12 bg-indigo-600 rounded-xl justify-center items-center mr-4">
            <Text className="text-white text-2xl">ℹ️</Text>
          </View>
          <Text className="text-xl font-bold text-slate-900">Hướng dẫn sử dụng</Text>
        </View>
        <Text className="text-base leading-7 text-indigo-900">
          Sử dụng các tiện ích bên trên để thêm kho hàng và thiết bị cảm biến vào hệ thống.
          Mỗi thiết bị sẽ giúp bạn theo dõi nhiệt độ và độ ẩm trong thời gian thực.
        </Text>
      </View>

      {/* Nút Đăng xuất */}
      <TouchableOpacity
        onPress={handleLogout}
        className="mt-2 rounded-full py-3 px-8 bg-red-500 items-center"
      >
        <Text className="text-white font-bold text-base">Đăng xuất</Text>
      </TouchableOpacity>
    </ScrollView>
  );
};

export default UtilityScreen;
