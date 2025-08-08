import React, { useState, useContext } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  Alert,
  StyleSheet,
  ActivityIndicator,
  Switch,
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { MyDispatchContext } from '../configs/MyContext';
import APIs, { authApis, endpoints } from '../configs/APIs';

const Login = ({ onLoginSuccess }) => {
  const [user, setUser] = useState({ username: '', password: '' });
  const [msg, setMsg] = useState('');
  const [loading, setLoading] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);
  const [fieldErrors, setFieldErrors] = useState({});
  const dispatch = useContext(MyDispatchContext);

  const setState = (value, field) => {
    setUser({ ...user, [field]: value });
  };

  const validate = () => {
    let errors = {};
    if (!user.username) errors.username = 'Tên đăng nhập không được để trống';
    if (!user.password) errors.password = 'Mật khẩu không được để trống';

    setFieldErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const login = async () => {
    setMsg('');
    if (!validate()) return;

    try {
      setLoading(true);
      const res = await APIs.post(endpoints['login'], user);

      const token = res?.data?.token;
      if (!token) throw new Error('Không nhận được token từ server');

      await AsyncStorage.setItem('token', token);
      if (rememberMe) {
        await AsyncStorage.setItem('rememberMe', 'true');
      }

      const userRes = await authApis(token).get(endpoints['current-user']);

      dispatch({
        type: 'login',
        payload: userRes.data,
      });

      onLoginSuccess(); // Callback để chuyển sang MainApp
    } catch (err) {
      console.error(err);
      Alert.alert('Lỗi', 'Đăng nhập thất bại. Vui lòng kiểm tra lại tài khoản/mật khẩu.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Hệ thống bảo quản thực phẩm</Text>
      {msg ? <Text style={styles.errorMsg}>{msg}</Text> : null}

      <TextInput
        style={styles.input}
        placeholder="Tên đăng nhập"
        value={user.username}
        onChangeText={(t) => setState(t, 'username')}
      />
      {fieldErrors.username && <Text style={styles.error}>{fieldErrors.username}</Text>}

      <TextInput
        style={styles.input}
        placeholder="Mật khẩu"
        secureTextEntry
        value={user.password}
        onChangeText={(p) => setState(p, 'password')}
      />
      {fieldErrors.password && <Text style={styles.error}>{fieldErrors.password}</Text>}

      <View style={styles.rememberRow}>
        <Switch
          value={rememberMe}
          onValueChange={setRememberMe}
        />
        <Text style={styles.rememberText}>Ghi nhớ đăng nhập</Text>
      </View>

      <TouchableOpacity onPress={login} style={styles.button} disabled={loading}>
        {loading ? (
          <ActivityIndicator color="#fff" />
        ) : (
          <Text style={styles.buttonText}>Đăng nhập</Text>
        )}
      </TouchableOpacity>
    </View>
  );
};
const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 24,
    justifyContent: 'center',
    backgroundColor: '#fff',
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 24,
    textAlign: 'center',
    color: '#2d6cdf',
  },
  input: {
    borderWidth: 1,
    borderColor: '#ccc',
    padding: 12,
    borderRadius: 8,
    marginBottom: 10,
  },
  button: {
    backgroundColor: '#2d6cdf',
    padding: 14,
    borderRadius: 8,
    marginTop: 16,
    alignItems: 'center',
  },
  buttonText: {
    color: '#fff',
    fontWeight: 'bold',
  },
  error: {
    color: 'red',
    marginBottom: 10,
  },
  errorMsg: {
    color: 'red',
    textAlign: 'center',
    marginBottom: 12,
  },
  rememberRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 10,
  },
  rememberText: {
    marginLeft: 8,
  },
});

export default Login;
