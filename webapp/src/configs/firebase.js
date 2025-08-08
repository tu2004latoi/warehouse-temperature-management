import { initializeApp } from 'firebase/app';
import { getMessaging, getToken, onMessage } from 'firebase/messaging';

const firebaseConfig = {
  apiKey: "AIzaSyARu-Le4B0_lTg81hHmq-eQqmmyhuDDCoE",
  authDomain: "iot-monitoring-foot-system.firebaseapp.com",
  projectId: "iot-monitoring-foot-system",
  storageBucket: "iot-monitoring-foot-system.firebasestorage.app",
  messagingSenderId: "973398625069",
  appId: "1:973398625069:web:64fba82e734bb6ccfda1a4",
  measurementId: "G-M6TVKJ8H1G"
};

const app = initializeApp(firebaseConfig);
const messaging = getMessaging(app);

export { messaging, getToken, onMessage };

