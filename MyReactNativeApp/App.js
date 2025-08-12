import React, { useReducer, useState } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import Login from './components/Login';
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
import { Text, View } from 'react-native';
import "./global.css"
import Logout from './components/Logout';

const Stack = createNativeStackNavigator();
const Tab = createBottomTabNavigator();

const TabScreens = () => (
  <Tab.Navigator 
    screenOptions={{ 
      headerShown: false,
      tabBarStyle: {
        backgroundColor: '#ffffff',
        borderTopWidth: 0,
        elevation: 20,
        shadowColor: '#000',
        shadowOffset: {
          width: 0,
          height: -4,
        },
        shadowOpacity: 0.1,
        shadowRadius: 8,
        height: 80,
        paddingBottom: 20,
        paddingTop: 10,
      },
      tabBarActiveTintColor: '#3b82f6',
      tabBarInactiveTintColor: '#64748b',
      tabBarLabelStyle: {
        fontSize: 12,
        fontWeight: '600',
        marginTop: 4,
      },
    }}
  >
    <Tab.Screen 
      name="Tiện ích" 
      component={UtilityScreen}
      options={{
        tabBarIcon: ({ color, size }) => (
          <View className="items-center justify-center">
            <Text style={{ fontSize: size, color }}>🔧</Text>
          </View>
        ),
      }}
    />
    <Tab.Screen 
      name="Thiết bị" 
      component={DeviceScreen}
      options={{
        tabBarIcon: ({ color, size }) => (
          <View className="items-center justify-center">
            <Text style={{ fontSize: size, color }}>📱</Text>
          </View>
        ),
      }}
    />
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
    <MyUserContext.Provider value={[user, dispatch]}>
      <MyDispatchContext.Provider value={dispatch}>
        <NavigationContainer>
          <Stack.Navigator 
            screenOptions={{ 
              headerShown: false,
              contentStyle: {
                backgroundColor: '#f8fafc',
              },
            }}
          >
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
                <Stack.Screen name="MainApp">
                  {props => (
                    <>
                      <NotificationSetup onTokenReceived={handleTokenReceived} />
                      <TabScreens {...props} />
                    </>
                  )}
                </Stack.Screen>
                <Stack.Screen 
                  name="AddDevice" 
                  component={AddDevice}
                  options={{
                    headerShown: true,
                    title: 'Thêm thiết bị',
                    headerStyle: {
                      backgroundColor: '#3b82f6',
                    },
                    headerTintColor: '#ffffff',
                    headerTitleStyle: {
                      fontWeight: 'bold',
                    },
                  }}
                />
                <Stack.Screen name="Logout" component={Logout} />
                <Stack.Screen 
                  name="AddWarehouse" 
                  component={AddWarehouse}
                  options={{
                    headerShown: true,
                    title: 'Thêm kho',
                    headerStyle: {
                      backgroundColor: '#3b82f6',
                    },
                    headerTintColor: '#ffffff',
                    headerTitleStyle: {
                      fontWeight: 'bold',
                    },
                  }}
                />
              </>
            )}
          </Stack.Navigator>
        </NavigationContainer>
      </MyDispatchContext.Provider>
    </MyUserContext.Provider>
  );
};

export default App;

