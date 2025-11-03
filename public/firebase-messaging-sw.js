// Import Firebase scripts
importScripts(
  "https://www.gstatic.com/firebasejs/10.7.1/firebase-app-compat.js"
);
importScripts(
  "https://www.gstatic.com/firebasejs/10.7.1/firebase-messaging-compat.js"
);

console.log("[SW] Service worker loaded");

// Firebase config
const firebaseConfig = {
  apiKey: "AIzaSyC88qAilHqJD0XdOlSvwtNZfNwtVq27FR8",
  authDomain: "queue-in-88.firebaseapp.com",
  projectId: "queue-in-88",
  storageBucket: "queue-in-88.firebasestorage.app",
  messagingSenderId: "838543402509",
  appId: "1:838543402509:web:49d93e3110439443961744",
  measurementId: "G-PL0TKQ8XLD",
};

// Initialize Firebase
firebase.initializeApp(firebaseConfig);
const messaging = firebase.messaging();

// Handle push events (when app is closed)
self.addEventListener("push", (event) => {
  try {
    let payload = {};

    if (event.data) {
      payload = event.data.json();
    }

    const innerData = payload.data || {};

    const title = innerData.title || "Queue Notification";
    const body = innerData.body || "Your turn is coming up!";

    const options = {
      body: body,
      icon: "/Q-logo.svg",
      badge: "/Q-logo.svg",
      tag: "queue-notification",
      requireInteraction: true,
      vibrate: [200, 100, 200, 200, 100, 200],
      data: { url: innerData.url || "/" },
    };

    const promise = self.registration
      .showNotification(title, options)
      .then(() => {
        console.log("[SW] ✅ Notification displayed successfully");
      })
      .catch((error) => {
        console.error("[SW] ❌ Failed to display notification:", error);
      });

    event.waitUntil(promise);
  } catch (error) {
    console.error("[SW] ❌ Critical error in push handler:", error);
    console.error("[SW] Error stack:", error.stack);

    // Emergency notification
    event.waitUntil(
      self.registration.showNotification("Push Error", {
        body: `Error: ${error.message}`,
        icon: "/Q-logo.svg",
        tag: "error-notification",
      })
    );
  }
});
