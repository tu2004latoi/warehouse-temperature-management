import React, { useEffect, useState } from 'react';
import {
    View,
    Text,
    FlatList,
    StyleSheet,
    ActivityIndicator,
    Alert,
    TouchableOpacity,
    TextInput,
} from 'react-native';
import { Client } from '@stomp/stompjs';
import SockJS from 'sockjs-client';
import APIs, { authApis, endpoints } from '../configs/APIs';
import AsyncStorage from '@react-native-async-storage/async-storage';
import SensorData from './devices/SensorData';

const DeviceScreen = () => {
    const [devices, setDevices] = useState([]);
    const [loading, setLoading] = useState(true);
    const [relayStates, setRelayStates] = useState({});
    const [conditions, setConditions] = useState({});
    const [alerts, setAlerts] = useState({});
    const [sensorData, setSensorData] = useState({});
    const [defaultTemps, setDefaultTemps] = useState({}); // State cho default_temperature
    const [selectedDevice, setSelectedDevice] = useState(null);
    const [defaultTempInput, setDefaultTempInput] = useState('');
    const [stompClient, setStompClient] = useState(null);

    const loadDevices = async () => {
        try {
            const token = await AsyncStorage.getItem('token');
            const res = await authApis(token).get(endpoints['my-devices']);
            setDevices(res.data);
            const initialRelayStates = {};
            const initialConditions = {};
            const initialAlerts = {};
            const initialSensorData = {};
            const initialDefaultTemps = {};
            res.data.forEach(device => {
                initialRelayStates[device.deviceCode] = false;
                initialConditions[device.deviceCode] = 'normal';
                initialAlerts[device.deviceCode] = false;
                initialSensorData[device.deviceCode] = { temperature: null, humidity: null };
                initialDefaultTemps[device.deviceCode] = null; // Khởi tạo default_temperature
            });
            setRelayStates(initialRelayStates);
            setConditions(initialConditions);
            setAlerts(initialAlerts);
            setSensorData(initialSensorData);
            setDefaultTemps(initialDefaultTemps);
        } catch (err) {
            console.error(err);
            Alert.alert("Lỗi", "Không thể tải danh sách thiết bị");
        }
    };

    const handleRelayControl = async (deviceCode, isOn) => {
        if (conditions[deviceCode] !== 'normal') {
            Alert.alert('Lỗi', 'Không thể điều khiển relay: Điều kiện môi trường không bình thường');
            return;
        }
        try {
            const token = await AsyncStorage.getItem('token');
            const endpoint = isOn 
                ? endpoints['relay-on'](deviceCode) 
                : endpoints['relay-off'](deviceCode);
            
            const res = await authApis(token).post(endpoint);
            setRelayStates(prev => ({ ...prev, [deviceCode]: isOn }));
            Alert.alert('Thành công', `Đã ${isOn ? 'bật' : 'tắt'} relay của thiết bị ${deviceCode}`);
        } catch (err) {
            console.error(err);
            const errorMessage = err.message === 'Network Error'
                ? 'Không thể kết nối đến máy chủ. Vui lòng kiểm tra kết nối mạng.'
                : 'Không thể điều khiển relay. Vui lòng thử lại sau.';
            Alert.alert('Lỗi', errorMessage);
        }
    };

    const handleSetDefaultTemperature = async (deviceCode) => {
        const temp = parseFloat(defaultTempInput);
        if (isNaN(temp) || temp < 0 || temp > 100) {
            Alert.alert('Lỗi', 'Nhiệt độ phải từ 0 đến 100°C');
            return;
        }
        try {
            const token = await AsyncStorage.getItem('token');
            const res = await authApis(token).post(
                endpoints['set-default-temperature'](deviceCode),
                {},
                { params: { temperature: temp } }
            );
            setDefaultTemps(prev => ({ ...prev, [deviceCode]: temp }));
            Alert.alert('Thành công', `Đã đặt nhiệt độ mặc định ${temp}°C cho thiết bị ${deviceCode}`);
            setDefaultTempInput('');
        } catch (err) {
            console.error(err);
            Alert.alert('Lỗi', 'Không thể đặt nhiệt độ mặc định');
        }
    };

    const getRelayState = async () => {
        try {
            const token = await AsyncStorage.getItem('token');
            const res = await authApis(token).get(endpoints['relay-state']);
            const state = res.data.includes('ON');
            if (selectedDevice) {
                setRelayStates(prev => ({ ...prev, [selectedDevice]: state }));
            }
        } catch (err) {
            console.error(err);
        }
    };

    useEffect(() => {
        const loadData = async () => {
            try {
                await loadDevices();
                await getRelayState();
            } finally {
                setLoading(false);
            }
        };
        loadData();

        // Thiết lập kết nối WebSocket
        const client = new Client({
            webSocketFactory: () => new SockJS('http://<your-backend-url>/ws'),
            reconnectDelay: 5000,
            onConnect: () => {
                console.log('Connected to WebSocket');
                client.subscribe('/topic/sensor', (message) => {
                    try {
                        const data = JSON.parse(message.body);
                        const deviceCode = data.device_code;
                        const relayState = data.relay === 'on';
                        const condition = data.condition;
                        const alert = data.alert;
                        const temperature = data.temperature;
                        const humidity = data.humidity;
                        const defaultTemperature = data.default_temperature; // Nhận default_temperature
                        setRelayStates(prev => ({ ...prev, [deviceCode]: relayState }));
                        setConditions(prev => ({ ...prev, [deviceCode]: condition }));
                        setAlerts(prev => ({ ...prev, [deviceCode]: alert }));
                        setSensorData(prev => ({
                            ...prev,
                            [deviceCode]: { temperature, humidity }
                        }));
                        setDefaultTemps(prev => ({ ...prev, [deviceCode]: defaultTemperature }));
                        if (alert && deviceCode === selectedDevice) {
                            Alert.alert('Cảnh báo', `Nhiệt độ chênh lệch quá ±5°C so với mặc định (${defaultTemperature}°C) tại thiết bị ${deviceCode}`);
                        }
                    } catch (err) {
                        console.error('Error parsing WebSocket message:', err);
                    }
                });
            },
            onStompError: (frame) => {
                console.error('WebSocket error:', frame);
            },
        });
        client.activate();
        setStompClient(client);

        return () => {
            if (client) client.deactivate();
        };
    }, [selectedDevice]);

    const renderItem = ({ item }) => (
        <TouchableOpacity 
            onPress={() => setSelectedDevice(item.deviceCode)}
            style={[
                styles.item,
                selectedDevice === item.deviceCode && styles.selectedItem
            ]}
        >
            <Text style={styles.title}>📱 {item.deviceName || '(Không có tên)'}</Text>

            {sensorData[item.deviceCode]?.temperature && (
                <View style={styles.infoContainer}>
                    <Text style={styles.infoLabel}>Nhiệt độ:</Text>
                    <Text style={styles.infoValue}>{sensorData[item.deviceCode].temperature}°C</Text>
                </View>
            )}
            {sensorData[item.deviceCode]?.humidity && (
                <View style={styles.infoContainer}>
                    <Text style={styles.infoLabel}>Độ ẩm:</Text>
                    <Text style={styles.infoValue}>{sensorData[item.deviceCode].humidity}%</Text>
                </View>
            )}
            {alerts[item.deviceCode] && (
                <Text style={styles.alertText}>
                    Cảnh báo: Nhiệt độ chênh lệch quá ±5°C so với mặc định
                </Text>
            )}

            <SensorData 
                deviceCode={item.deviceCode} 
                sensorData={sensorData[item.deviceCode]} 
            />

            <View style={styles.inputContainer}>
                <TextInput
                    style={styles.input}
                    placeholder="Nhập nhiệt độ mặc định (°C)"
                    keyboardType="numeric"
                    value={defaultTempInput}
                    onChangeText={setDefaultTempInput}
                    placeholderTextColor="#888"
                />
                <TouchableOpacity
                    style={[styles.button, styles.buttonConfig]}
                    onPress={() => handleSetDefaultTemperature(item.deviceCode)}
                >
                    <Text style={styles.buttonText}>Đặt nhiệt độ</Text>
                </TouchableOpacity>
            </View>

            <View style={styles.buttonContainer}>
                <TouchableOpacity 
                    style={[
                        styles.button, 
                        styles.buttonOn, 
                        conditions[item.deviceCode] !== 'normal' && styles.buttonDisabled
                    ]}
                    onPress={() => handleRelayControl(item.deviceCode, true)}
                    disabled={conditions[item.deviceCode] !== 'normal'}
                >
                    <Text style={styles.buttonText}>Bật Relay</Text>
                </TouchableOpacity>
                <TouchableOpacity 
                    style={[
                        styles.button, 
                        styles.buttonOff, 
                        conditions[item.deviceCode] !== 'normal' && styles.buttonDisabled
                    ]}
                    onPress={() => handleRelayControl(item.deviceCode, false)}
                    disabled={conditions[item.deviceCode] !== 'normal'}
                >
                    <Text style={styles.buttonText}>Tắt Relay</Text>
                </TouchableOpacity>
            </View>
        </TouchableOpacity>
    );

    if (loading) {
        return (
            <View style={styles.center}>
                <ActivityIndicator size="large" color="#2d6cdf" />
                <Text>Đang tải thiết bị...</Text>
            </View>
        );
    }

    return (
        <View style={styles.container}>
            <FlatList
                data={devices}
                keyExtractor={(item) => item.deviceId.toString()}
                renderItem={renderItem}
                contentContainerStyle={styles.list}
                ListEmptyComponent={<Text style={styles.empty}>Bạn chưa có thiết bị nào.</Text>}
            />
        </View>
    );
};

const styles = StyleSheet.create({
    list: {
        padding: 16,
        backgroundColor: '#fff',
    },
    item: {
        backgroundColor: '#f0f4ff',
        padding: 16,
        borderRadius: 10,
        marginBottom: 12,
        elevation: 2,
    },
    title: {
        fontSize: 18,
        fontWeight: 'bold',
        marginBottom: 12,
        color: '#2d6cdf',
    },
    infoContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginBottom: 6,
    },
    infoLabel: {
        fontSize: 14,
        color: '#333',
        fontWeight: '600',
    },
    infoValue: {
        fontSize: 14,
        color: '#333',
    },
    center: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    empty: {
        textAlign: 'center',
        marginTop: 20,
        color: '#888',
        fontSize: 16,
    },
    buttonContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginTop: 10,
        paddingTop: 10,
        borderTopWidth: 1,
        borderTopColor: '#ddd',
    },
    inputContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        marginTop: 10,
        marginBottom: 10,
    },
    input: {
        flex: 1,
        borderWidth: 1,
        borderColor: '#ddd',
        borderRadius: 5,
        padding: 10,
        marginRight: 10,
        backgroundColor: '#fff',
        fontSize: 14,
    },
    button: {
        flex: 1,
        padding: 12,
        borderRadius: 5,
        marginHorizontal: 5,
        alignItems: 'center',
    },
    buttonOn: {
        backgroundColor: '#4CAF50',
    },
    buttonOff: {
        backgroundColor: '#f44336',
    },
    buttonConfig: {
        backgroundColor: '#2d6cdf',
        flex: 0.5,
    },
    buttonDisabled: {
        backgroundColor: '#cccccc',
    },
    buttonText: {
        color: 'white',
        fontWeight: 'bold',
        fontSize: 14,
    },
    alertText: {
        color: 'red',
        fontWeight: 'bold',
        marginTop: 8,
        marginBottom: 8,
        fontSize: 14,
        textAlign: 'center',
    },
    container: {
        flex: 1,
        backgroundColor: '#fff',
    },
    selectedItem: {
        borderWidth: 2,
        borderColor: '#2d6cdf',
    },
});

export default DeviceScreen;