import React, { useContext, useEffect, useReducer, useState } from "react";
import "./App.css";
import cookie from "js-cookie";
import myUserReducer from "./configs/MyAccountReducer";
import { authApis, endpoints } from "./configs/APIs";
import LoadingSpinner from "./components/layouts/LoadingSpinner";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";

import Login from "./pages/Login";
import { MyDispatchContext, MyUserContext } from "./configs/MyContext";
import UtilityScreen from "./components/UtilityScreen";
import AddWarehouse from "./pages/AddWarehouse";
import AddDevice from "./pages/AddDevice";
import DeviceScreenWeb from "./pages/DeviceScreen";

const PrivateRoute = ({ children }) => {
  const user = useContext(MyUserContext);
  return user ? children : <Navigate to="/login" replace />;
};
function App() {
  const [user, dispatch] = useReducer(myUserReducer, null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const handleTokenReceived = async () => {

      try {
        setLoading(true);
        const token = localStorage.getItem('token');
        if (token) {
          try {
            let res = await authApis().get(endpoints["current-user"]);
            console.log(res.data)
            dispatch({
              type: "login",
              payload: res.data,
            });
          } catch (err) {
            console.error("Lỗi load user từ token:", err);
            cookie.remove("token");
          }
        }
      } catch (err) {
        console.error("Failed to send token:", err);
      } finally {
        setLoading(false);
      }
    };
    handleTokenReceived();
  }, []);

  if (loading) return <LoadingSpinner />;
  return (
    <MyUserContext.Provider value={user}>
      <MyDispatchContext.Provider value={dispatch}>
        <Router>
          <Routes>
            <Route path="/login" element={<Login />} />
            <Route
              path="/"
              element={
                <PrivateRoute>
                  <UtilityScreen />
                </PrivateRoute>
              }
            />
            <Route
              path="/AddWarehouse"
              element={
                <PrivateRoute>
                  <AddWarehouse />
                </PrivateRoute>
              }
            />
            <Route
              path="/AddDevice"
              element={
                <PrivateRoute>
                  <AddDevice />
                </PrivateRoute>
              }
            />
            <Route
              path="/Devices"
              element={
                <PrivateRoute>
                  <DeviceScreenWeb />
                </PrivateRoute>
              }
            />
          </Routes>
        </Router>
      </MyDispatchContext.Provider>
    </MyUserContext.Provider>
  );
}

export default App;
