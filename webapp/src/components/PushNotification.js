import { useEffect } from "react";
import { messaging } from "../configs/firebase";
import { getToken, onMessage } from "firebase/messaging";

const PushNotification = () => {
  useEffect(() => {
    const requestPermission = async () => {
      try {
        const permission = await Notification.requestPermission();
        if (permission === "granted") {
          console.log("✅ Notification permission granted.");

          // Lấy FCM token của client
          const token = await getToken(messaging, {
            vapidKey: "BD8QXIpDEH6TZ0NM1r-bCpz85-H_4QRJs4npTMH4HWzynFn0yQ7-mGH1ydcZlDGDP-050LHuozYX98DmXNWOZR0", // lấy từ Firebase Console
          });

          if (token) {
            console.log("📲 FCM Token:", token);
            // Gửi token này về backend nếu cần để gửi thông báo từ server
          } else {
            console.warn("⚠️ Không lấy được FCM token.");
          }
        } else {
          console.warn("❌ Notification permission denied.");
        }
      } catch (error) {
        console.error("🔥 Error getting permission or token:", error);
      }
    };

    // Gọi hàm xin quyền và lấy token khi component mount
    requestPermission();

    // Lắng nghe thông báo khi ứng dụng đang mở
    const unsubscribe = onMessage(messaging, (payload) => {
      console.log("📨 Thông báo nhận được:", payload);

      // Hiển thị thông báo ngay lập tức
      if (Notification.permission === "granted") {
        const { title, body } = payload.notification;
        new Notification(title, {
          body,
          icon: "/logo192.png", // đường dẫn icon
        });
      }
    });

    // Dọn dẹp listener khi component unmount
    return () => unsubscribe();
  }, []);

  return null; // Component không hiển thị gì
};

export default PushNotification;

