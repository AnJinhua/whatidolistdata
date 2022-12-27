console.log("Service Worker Loaded...");

self.addEventListener("push", (event) => {
  const data = event.data.json();
  // handle the push notification
  event.waitUntil(
    self.registration.showNotification(data.title, {
      body: data.description,
      icon: "https://res.cloudinary.com/dqzqilslm/image/upload/v1652741185/story/images/Ngwu-Stephen%20-62212a0a-0824-4c78-8710-c2896662cb1c/zhb7vjojsfjkmjbt0khp.ico",
      image: data.image,
      requireInteraction: false,
      vibrate: 400,
      data: data.destinationUrl,
      actions: [
        {
          action: `${data.action}`,
          title: `${data.action}`,
        },
      ],
    })
  );
});

// self.addEventListener(
//   "notificationclick",
//   function (event) {
//     console.log("notificationclick", event.data);
//     event.notification.close();
//     if (event.action === "view") {
//       // User selected the view action.
//       clients.openWindow("https://whatido.app");
//     } else {
//       // User selected (e.g., clicked in) the main body of notification.
//       clients.openWindow("/");
//     }
//   },
//   false
// );

self.addEventListener(
  "notificationclick",
  function (event) {
    if (!event.action) {
      // Was a normal notification click
      clients.openWindow(event.notification.data);
      return;
    }

    if (event.action) {
      event.notification.close();
      clients.openWindow(event.notification.data);
    }
  },
  false
);
