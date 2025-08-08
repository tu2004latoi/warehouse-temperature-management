import { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import './Login.css';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';

const Login = () => {
  const navigate = useNavigate();
  const { login } = useAuth();
  const [credentials, setCredentials] = useState({
    username: '',
    password: '',
  });

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await login(credentials);
      toast.success('Đăng nhập thành công!');
      navigate('/products'); // Chuyển trang sau khi đăng nhập
    } catch (error) {
      toast.error('Sai tên đăng nhập hoặc mật khẩu!');
      console.log("Đăng nhập thất bại", error);
    }
  };

  return (
    <div className="body flex">
      <div className="login-container">
        <div className="slogan">
          Nhận diện nhanh – Nhắc hạn kịp thời.<br />
          Quản lý thực phẩm chưa bao giờ dễ đến thế.
        </div>
        <div className="flex">
          <form className="login-form flex" onSubmit={handleSubmit}>
            <h2 className="login-title">Đăng nhập ngay tại đây.</h2>
            <input
              type="text"
              placeholder="Tên đăng nhập"
              value={credentials.username}
              onChange={(e) => setCredentials({ ...credentials, username: e.target.value })}
              required
              className="login-input"
            />
            <input
              type="password"
              placeholder="Mật khẩu"
              value={credentials.password}
              onChange={(e) => setCredentials({ ...credentials, password: e.target.value })}
              required
              className="login-input"
            />
            <button type="submit" className="login-button">Đăng nhập</button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Login;
