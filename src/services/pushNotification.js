import { Capacitor } from "@capacitor/core";
import { PushNotifications } from "@capacitor/push-notifications";
import supabase from "../lib/supabase.js";

let initialized = false;

export async function initPushNotification(appName, akun) {
  if (!akun || initialized) return;
  if (!Capacitor.isNativePlatform()) return;

  initialized = true;

  try {
    const perm = await PushNotifications.requestPermissions();

    if (perm.receive !== "granted") {
      console.log("Push notification ditolak");
      return;
    }

    await PushNotifications.register();

    PushNotifications.addListener("registration", async (token) => {
      const userId = akun.id || akun.user_id || akun.email || akun.noHp;

      const { error } = await supabase
        .from("push_tokens")
        .upsert(
          {
            user_id: userId,
            app_name: appName,
            token: token.value,
            platform: Capacitor.getPlatform(),
            updated_at: new Date().toISOString(),
          },
          { onConflict: "token" }
        );

      if (error) console.error("Gagal simpan push token:", error);
    });

    PushNotifications.addListener("registrationError", (error) => {
      console.error("Push registration error:", error);
    });

    PushNotifications.addListener("pushNotificationReceived", (notification) => {
      console.log("Push diterima:", notification);
    });

    PushNotifications.addListener("pushNotificationActionPerformed", (notification) => {
      console.log("Push diklik:", notification);
    });
  } catch (e) {
    console.error("initPushNotification error:", e);
  }
}
