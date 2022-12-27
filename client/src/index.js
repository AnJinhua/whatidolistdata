import React from "react";
import ReactDOM from "react-dom";
import store from "./store";
import { Provider } from "react-redux";
import { CookiesProvider } from "react-cookie";
import * as serviceWorker from "./serviceWorker";
import { SWRConfig } from "swr";
import axios from "axios";
import { TransactionProvider } from "./context/TransactionContext";

import App from "./App";

if (navigator.mediaDevices === undefined) {
  navigator.mediaDevices = {};
}
if (navigator.mediaDevices.getUserMedia === undefined) {
  navigator.mediaDevices.getUserMedia = function (constraints) {
    var getUserMedia =
      navigator.webkitGetUserMedia || navigator.mozGetUserMedia;
    if (!getUserMedia) {
      return Promise.reject(
        new Error("getUserMedia is not implemented in this browser")
      );
    }
    return new Promise(function (resolve, reject) {
      getUserMedia.call(navigator, constraints, resolve, reject);
    });
  };
}

const fetcher = (...args) => {
  return axios(...args).then((res) => res.data);
};

ReactDOM.render(
  <TransactionProvider>
    <CookiesProvider>
      <Provider store={store}>
        <SWRConfig value={{ fetcher }}>
          <App />
        </SWRConfig>
      </Provider>
    </CookiesProvider>
  </TransactionProvider>,

  document.querySelector(".wrapper")
);

serviceWorker.register();
