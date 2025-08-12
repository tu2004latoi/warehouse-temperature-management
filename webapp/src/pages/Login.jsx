import React, { useState, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { FaUser, FaLock, FaEye, FaEyeSlash } from 'react-icons/fa';
import { toast } from 'react-toastify';
import { MyDispatchContext } from '../configs/MyContext';
import APIs, { authApis, endpoints } from '../configs/APIs';

const Login = () => {
  const [user, setUser] = useState({ username: '', password: '' });
  const [fieldErrors, setFieldErrors] = useState({});
  const [loading, setLoading] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const dispatch = useContext(MyDispatchContext);
  const navigate = useNavigate();

  const setState = (value, field) => {
    setUser((prev) => ({ ...prev, [field]: value }));
    setFieldErrors((prev) => ({ ...prev, [field]: '' }));
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

      localStorage.setItem('token', token);
      if (rememberMe) {
        localStorage.setItem('rememberMe', 'true');
      } else {
        localStorage.removeItem('rememberMe');
      }

      const userRes = await authApis(token).get(endpoints['current-user']);
      console.log(userRes.data)
      dispatch({ type: 'login', payload: userRes.data });
      toast.success('Đăng nhập thành công');
      navigate('/'); 
    } catch (error) {
        console.log(error);
        
      toast.error('Đăng nhập thất bại. Vui lòng kiểm tra lại tài khoản/mật khẩu.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <div className="w-full max-w-md p-8 bg-white rounded-3xl shadow-lg">
        {/* Logo */}
        <div className="flex flex-col items-center mb-10">
          <div className="bg-blue-600 w-24 h-24 rounded-3xl flex items-center justify-center shadow-lg shadow-blue-600/50">
            <span className="text-4xl">🌡️</span>
          </div>
          <h1 className="mt-4 text-3xl font-bold text-gray-900 text-center">
            Hệ thống bảo quản
          </h1>
          <p className="mt-1 text-base text-gray-600 font-semibold text-center">
            Thực phẩm thông minh
          </p>
        </div>

        {/* Username */}
        <div className="mb-5">
          <label className="block mb-1 font-semibold text-gray-700 text-base">
            Tên đăng nhập
          </label>
          <div
            className={`flex items-center bg-white rounded-full border px-5 py-3 shadow-sm ${
              fieldErrors.username ? 'border-red-400' : 'border-gray-300'
            }`}
          >
            <FaUser className="text-gray-400" size={20} />
            <input
              type="text"
              className="flex-1 ml-3 text-base text-gray-900 outline-none"
              placeholder="Nhập tên đăng nhập"
              value={user.username}
              onChange={(e) => setState(e.target.value, 'username')}
              disabled={loading}
              autoCapitalize="none"
            />
          </div>
          {fieldErrors.username && (
            <p className="text-red-500 text-sm mt-1">{fieldErrors.username}</p>
          )}
        </div>

        {/* Password */}
        <div className="mb-6">
          <label className="block mb-1 font-semibold text-gray-700 text-base">
            Mật khẩu
          </label>
          <div
            className={`flex items-center bg-white rounded-full border px-5 py-3 shadow-sm ${
              fieldErrors.password ? 'border-red-400' : 'border-gray-300'
            }`}
          >
            <FaLock className="text-gray-400" size={20} />
            <input
              type={showPassword ? 'text' : 'password'}
              className="flex-1 ml-3 text-base text-gray-900 outline-none"
              placeholder="Nhập mật khẩu"
              value={user.password}
              onChange={(e) => setState(e.target.value, 'password')}
              disabled={loading}
            />
            <button
              onClick={() => setShowPassword(!showPassword)}
              disabled={loading}
              className="focus:outline-none"
            >
              {showPassword ? (
                <FaEyeSlash className="text-gray-400" size={22} />
              ) : (
                <FaEye className="text-gray-400" size={22} />
              )}
            </button>
          </div>
          {fieldErrors.password && (
            <p className="text-red-500 text-sm mt-1">{fieldErrors.password}</p>
          )}
        </div>

        {/* Remember Me */}
        <div className="flex items-center bg-white rounded-full px-5 py-3 mb-6 shadow-sm justify-between">
          <div className="flex items-center">
            <input
              type="checkbox"
              checked={rememberMe}
              onChange={(e) => setRememberMe(e.target.checked)}
              disabled={loading}
              className="w-5 h-5 text-blue-600 rounded focus:ring-blue-500"
            />
            <label className="ml-3 font-semibold text-gray-700 text-base">
              Ghi nhớ đăng nhập
            </label>
          </div>
        </div>

        {/* Login Button */}
        <button
          onClick={login}
          disabled={loading}
          className="w-full py-4 rounded-full shadow-lg flex items-center justify-center bg-gradient-to-r from-red-600 to-red-800 hover:from-red-700 hover:to-red-900 transition duration-300"
        >
          {loading ? (
            <div className="flex items-center">
              <svg
                className="animate-spin h-5 w-5 mr-3 text-white"
                viewBox="0 0 24 24"
              >
                <circle
                  className="opacity-25"
                  cx="12"
                  cy="12"
                  r="10"
                  stroke="currentColor"
                  strokeWidth="4"
                />
                <path
                  className="opacity-75"
                  fill="currentColor"
                  d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                />
              </svg>
              <span className="text-white font-bold text-lg">
                Đang đăng nhập...
              </span>
            </div>
          ) : (
            <span className="text-white font-bold text-lg tracking-wide">
              Đăng nhập
            </span>
          )}
        </button>

        {/* Footer */}
        <div className="mt-14 text-center">
          <p className="text-gray-500 text-sm font-medium">
            Hệ thống quản lý nhiệt độ và độ ẩm
          </p>
          <p className="text-gray-400 text-xs mt-1">Bảo vệ thực phẩm của bạn</p>
        </div>
      </div>
    </div>
  );
};

export default Login;