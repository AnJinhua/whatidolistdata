import {
  notify,
  subscribe,
  notifyAllSubscribers,
} from "./actions/pushNotification";
import { WEBPUSH_PUBLIC_KEY } from "./constants/webpush";

// NOTE: Please don't use this key. Create a new one and use it.
const convertedVapidKey = urlBase64ToUint8Array(WEBPUSH_PUBLIC_KEY);

function urlBase64ToUint8Array(base64String) {
  const padding = "=".repeat((4 - (base64String.length % 4)) % 4);
  // eslint-disable-next-line
  const base64 = (base64String + padding)
    .replace(/\-/g, "+")
    .replace(/_/g, "/");

  const rawData = window.atob(base64);
  const outputArray = new Uint8Array(rawData.length);

  for (let i = 0; i < rawData.length; ++i) {
    outputArray[i] = rawData.charCodeAt(i);
  }
  return outputArray;
}

const sendSubscription = (subscription, userSlug) => {
  const subData = {
    subscription,
    userSlug,
  };

  try {
    subscribe(subData);
  } catch (error) {
    console.log(error);
  }
};

export const sendNotification = (data) => {
  try {
    notify(data);
  } catch (error) {
    console.log(error);
  }
};

export const sendMassNotification = (data) => {
  try {
    notifyAllSubscribers(data);
  } catch (error) {
    console.log(error);
  }
};

//conditional render
let clicked = true;

export function subscribeUser(userSlug) {
  if (clicked) {
    if ("serviceWorker" in navigator) {
      navigator.serviceWorker.ready
        .then(function (registration) {
          if (!registration.pushManager) {
            console.log("Push manager unavailable.");
            return;
          }

          registration.pushManager
            .getSubscription()
            .then(function (existedSubscription) {
              if (existedSubscription === null) {
                console.log("No subscription detected, make a request.");
                registration.pushManager
                  .subscribe({
                    applicationServerKey: convertedVapidKey,
                    userVisibleOnly: true,
                  })
                  .then(function (newSubscription) {
                    sendSubscription(newSubscription, userSlug);
                  })
                  .catch(function (e) {
                    if (Notification.permission !== "granted") {
                      console.log("Permission was not granted.");
                    } else {
                      console.error(
                        "An error ocurred during the subscription process.",
                        e
                      );
                    }
                  });
              } else {
                sendSubscription(existedSubscription, userSlug);
              }
            });
        })
        .catch(function (e) {
          console.error(
            "An error ocurred during Service Worker registration.",
            e
          );
        });
    }
  } else {
    console.log("Can not reachable to the service worker");
  }
}
