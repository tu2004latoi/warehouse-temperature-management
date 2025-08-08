// public/firebase-messaging-sw.js
importScripts('https://www.gstatic.com/firebasejs/10.12.2/firebase-app-compat.js');
importScripts('https://www.gstatic.com/firebasejs/10.12.2/firebase-messaging-compat.js');

firebase.initializeApp({
  apiKey: "AIzaSyARu-Le4B0_lTg81hHmq-eQqmmyhuDDCoE",
  authDomain: "iot-monitoring-foot-system.firebaseapp.com",
  projectId: "iot-monitoring-foot-system",
  storageBucket: "iot-monitoring-foot-system.firebasestorage.app",
  messagingSenderId: "973398625069",
  appId: "1:973398625069:web:64fba82e734bb6ccfda1a4",
  measurementId: "G-M6TVKJ8H1G"
});

// Lấy instance của messaging
const messaging = firebase.messaging();

messaging.onBackgroundMessage(function(payload) {
  console.log('[firebase-messaging-sw.js] Received background message ', payload);

  const { title, body } = payload.notification;

  self.registration.showNotification(title, {
    body: body,
    icon: '/logo.png' // đường dẫn icon nếu có
  });
});

