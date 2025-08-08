import React, { useReducer, useState } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import Login from './components/Login';
import SensorData from './components/devices/SensorData';
import UtilityScreen from './components/UtilityScreen';
import DeviceScreen from './components/DeviceScreen';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { MyDispatchContext, MyUserContext } from './configs/MyContext';
import MyAccountReducer from './configs/MyAccountReducer';
import AddDevice from './components/utilities/AddDevice';
import AddWarehouse from './components/utilities/AddWarehouse';
import { authApis, endpoints } from './configs/APIs';
import NotificationSetup from './components/NotificationSetup';
import AsyncStorage from '@react-native-async-storage/async-storage';

const Stack = createNativeStackNavigator();
const Tab = createBottomTabNavigator();

const TabScreens = () => (
  <Tab.Navigator screenOptions={{ headerShown: false }}>
    <Tab.Screen name="Tiện ích" component={UtilityScreen} />
    <Tab.Screen name="Thiết bị" component={DeviceScreen} />
  </Tab.Navigator>
);

const App = () => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [user, dispatch] = useReducer(MyAccountReducer, null);

  const handleTokenReceived = async (token) => {
    console.log("Received token in App:", token);

    try {
      console.log("Token saved:", token);
      const tokenData = await AsyncStorage.getItem('token');
      const res = await authApis(tokenData).post(endpoints['save-token'], {
        token: token,
      })

      const result = await res.data;
    } catch (err) {
      console.error("Failed to send token:", err);
    }
  };


  return (
    <MyUserContext.Provider value={user}>
      <MyDispatchContext.Provider value={dispatch}>
        <NavigationContainer>
          <Stack.Navigator screenOptions={{ headerShown: false }}>
            {!isLoggedIn ? (
              <Stack.Screen name="Login">
                {props => (
                  <Login
                    {...props}
                    onLoginSuccess={() => setIsLoggedIn(true)}
                  />
                )}
              </Stack.Screen>
            ) : (
              <>
                {/* 🔔 Chỉ gọi NotificationSetup sau khi đăng nhập */}
                <Stack.Screen name="MainApp">
                  {props => (
                    <>
                      <NotificationSetup onTokenReceived={handleTokenReceived} />
                      <TabScreens {...props} />
                    </>
                  )}
                </Stack.Screen>
                <Stack.Screen name="AddDevice" component={AddDevice} />
                <Stack.Screen name="AddWarehouse" component={AddWarehouse} />
              </>
            )}
          </Stack.Navigator>
        </NavigationContainer>
      </MyDispatchContext.Provider>
    </MyUserContext.Provider>
  );

};

export default App;

