import React, { useState, useContext } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  Alert,
  ActivityIndicator,
  Switch,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { MyDispatchContext } from '../configs/MyContext';
import APIs, { authApis, endpoints } from '../configs/APIs';
import { Ionicons } from '@expo/vector-icons';
import { LinearGradient } from 'expo-linear-gradient';

const Login = ({ onLoginSuccess }) => {
  const [user, setUser] = useState({ username: '', password: '' });
  const [fieldErrors, setFieldErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const dispatch = useContext(MyDispatchContext);

  const setState = (value, field) => {
    setUser((prev) => ({ ...prev, [field]: value }));
  };

  const validate = () => {
    const errors = {};
    if (!user.username.trim()) errors.username = 'Tên đăng nhập không được để trống';
    if (!user.password.trim()) errors.password = 'Mật khẩu không được để trống';
    setFieldErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const login = async () => {
    if (!validate()) return;

    setLoading(true);
    try {
      const res = await APIs.post(endpoints['login'], user);
      const token = res?.data?.token;

      if (!token) throw new Error('Không nhận được token từ server');

      await AsyncStorage.setItem('token', token);
      if (rememberMe) {
        await AsyncStorage.setItem('rememberMe', 'true');
      } else {
        await AsyncStorage.removeItem('rememberMe');
      }

      const userRes = await authApis(token).get(endpoints['current-user']);
      dispatch({ type: 'login', payload: userRes.data });
      onLoginSuccess();
    } catch (error) {
      Alert.alert('Lỗi', 'Đăng nhập thất bại. Vui lòng kiểm tra lại tài khoản/mật khẩu.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      className="flex-1 bg-slate-100"
    >
      <ScrollView contentContainerStyle={{ flexGrow: 1 }}>
        <View className="flex-1 px-8 py-10 justify-center">
          {/* Logo */}
          <View className="items-center mb-10">
            <View className="bg-blue-600 w-24 h-24 rounded-3xl justify-center items-center shadow-lg shadow-blue-600/50">
              <Text className="text-4xl">🌡️</Text>
            </View>
            <Text className="mt-4 text-3xl font-bold text-slate-900 text-center">
              Hệ thống bảo quản
            </Text>
            <Text className="mt-1 text-base text-slate-600 font-semibold text-center">
              Thực phẩm thông minh
            </Text>
          </View>

          {/* Username */}
          <View className="mb-5">
            <Text className="mb-1 font-semibold text-slate-700 text-base">Tên đăng nhập</Text>
            <View
              className={`flex-row items-center bg-white rounded-full border px-5 shadow-sm ${fieldErrors.username ? 'border-red-400' : 'border-slate-300'
                }`}
            >
              <Ionicons name="person-outline" size={20} color="#94a3b8" />
              <TextInput
                className="flex-1 py-3 ml-3 text-base text-slate-900"
                placeholder="Nhập tên đăng nhập"
                placeholderTextColor="#94a3b8"
                autoCapitalize="none"
                value={user.username}
                onChangeText={(text) => setState(text, 'username')}
                editable={!loading}
              />
            </View>
            {fieldErrors.username && (
              <Text className="text-red-500 mt-1">{fieldErrors.username}</Text>
            )}
          </View>

          {/* Password */}
          <View className="mb-6">
            <Text className="mb-1 font-semibold text-slate-700 text-base">Mật khẩu</Text>
            <View
              className={`flex-row items-center bg-white rounded-full border px-5 shadow-sm ${fieldErrors.password ? 'border-red-400' : 'border-slate-300'
                }`}
            >
              <Ionicons name="lock-closed-outline" size={20} color="#94a3b8" />
              <TextInput
                className="flex-1 py-3 ml-3 text-base text-slate-900"
                placeholder="Nhập mật khẩu"
                placeholderTextColor="#94a3b8"
                secureTextEntry={!showPassword}
                value={user.password}
                onChangeText={(text) => setState(text, 'password')}
                editable={!loading}
              />
              <TouchableOpacity onPress={() => setShowPassword((p) => !p)} disabled={loading}>
                <Ionicons
                  name={showPassword ? 'eye-outline' : 'eye-off-outline'}
                  size={22}
                  color="#94a3b8"
                />
              </TouchableOpacity>
            </View>
            {fieldErrors.password && (
              <Text className="text-red-500 mt-1">{fieldErrors.password}</Text>
            )}
          </View>

          {/* Remember Me */}
          <View className="flex-row items-center bg-white rounded-full px-5 py-3 mb-6 justify-between shadow-sm">
            <View className="flex-row items-center">
              <Switch
                value={rememberMe}
                onValueChange={setRememberMe}
                trackColor={{ false: '#e2e8f0', true: '#3b82f6' }}
                thumbColor={rememberMe ? '#fff' : '#fff'}
                disabled={loading}
              />
              <Text className="ml-3 font-semibold text-slate-700 text-base">Ghi nhớ đăng nhập</Text>
            </View>
          </View>

          {/* Login Button */}
          <TouchableOpacity
            onPress={login}
            disabled={loading}
            activeOpacity={0.8}
            className="rounded-full py-4 justify-center items-center shadow-lg"
          >
            {loading ? (
              <View className="flex-row items-center">
                <ActivityIndicator size="small" color="#fff" />
                <Text className="ml-3 text-white font-bold text-lg">Đang đăng nhập...</Text>
              </View>
            ) : (
              <LinearGradient
                colors={['#dc2626', '#7f1d1d']} // đỏ đậm gradient
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 0 }}
                className="w-full py-4 rounded-full justify-center items-center"
              >
                <Text className="text-white text-lg font-bold tracking-wide">Đăng nhập</Text>
              </LinearGradient>
            )}
          </TouchableOpacity>



          {/* Footer */}
          <View className="mt-14 items-center">
            <Text className="text-slate-500 text-sm font-medium">
              Hệ thống quản lý nhiệt độ và độ ẩm
            </Text>
            <Text className="text-slate-400 text-xs mt-1">Bảo vệ thực phẩm của bạn</Text>
          </View>
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
};

export default Login;
