import React, { useState, useEffect } from "react";
import { API_URL, googleMapsApiKey } from "../../constants/api";
import { useHistory } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { setLocation } from "../../actions/user";
import { useCookies } from "react-cookie";

import axios from "axios";

import {
  useLoadScript,
  GoogleMap,
  InfoWindow,
  Marker,
} from "@react-google-maps/api";

function Map() {
  const [activeMarker, setActiveMarker] = useState(null);
  const [center, setCenter] = useState({});
  const { isLoaded } = useLoadScript({
    googleMapsApiKey: googleMapsApiKey, // Add your API key
  });
  const dispatch = useDispatch();
  const history = useHistory();
  const [loggedInUsers2, setloggedInUsers2] = useState([]);
  const state = useSelector((state) => state.auth);
  const [cookies] = useCookies(["user"]);

  const exampleMapStyles = [];

  useEffect(() => {
    (async () => {
      //set expert current location
      if (state.authenticated) {
        dispatch(setLocation(cookies.user.email));
      }

      //get logged in users with visiblity on
      const { data } = await axios.get(`${API_URL}/loggedIn`);
      setloggedInUsers2(data);
    })();
    console.log(loggedInUsers2);
    if ("geolocation" in navigator) {
      const geoId = navigator.geolocation.watchPosition(
        (position) => {
          setCenter({
            lat: position.coords.longitude,
            lng: position.coords.latitude,
          });
        },
        (e) => {
          console.log(e);
        },
        { enableHighAccuracy: true, maximumAge: 0, timeout: 5000 }
      );
      return () => {
        console.log("Clear watch called");
        window.navigator.geolocation.clearWatch(geoId);
      };
    } else {
      navigator.permissions
        .query({ name: "geolocation" })
        .then(function (result) {
          if (result.state === "granted") {
            console.log(result.state);
          } else if (result.state === "prompt") {
            console.log(result.state);
          } else if (result.state === "denied") {
            console.log("denied");
          }
          result.onchange = function () {
            console.log(result.state);
          };
        });
    }
  }, [
    cookies?.user?.email,
    dispatch,
    state.authenticated,
    setloggedInUsers2,
    state.visibility,
  ]);

  const handleActiveMarker = (marker) => {
    if (marker === activeMarker) {
      return;
    }
    setActiveMarker(marker);
  };
  console.log(loggedInUsers2);
  return isLoaded ? (
    <GoogleMap
      options={{
        styles: exampleMapStyles,
      }}
      center={{
        lat: -3.745,
        lng: -38.523,
      }}
      zoom={2}
      onClick={() => setActiveMarker(null)}
      mapContainerStyle={{ width: "100vw", height: "90vh" }}
    >
      {loggedInUsers2 !== []
        ? loggedInUsers2.map(
            ({
              _id,
              profile,
              locationLat,
              locationLng,
              expertCategories,
              slug,
              imageCloudinaryRef,
              imageUrl,
            }) =>
              locationLat ? (
                <Marker
                  key={_id}
                  position={{
                    lat: locationLat,
                    lng: locationLng,
                  }}
                  onClick={() => {
                    history.push(`/expert/${expertCategories[0]}/${slug}`);
                  }}
                  onMouseOver={() => handleActiveMarker(_id)}
                >
                  {activeMarker === _id ? (
                    <InfoWindow
                      position={{
                        lat: locationLat,
                        lng: locationLng,
                      }}
                      onCloseClick={() => setActiveMarker(null)}
                    >
                      <div>
                        {" "}
                        {imageUrl?.cdnUrl ? (
                          <img
                            loading="lazy"
                            height="25"
                            width="25"
                            src={
                              imageUrl.cdnUrl
                                ? imageUrl.cdnUrl
                                : "/img/profile.png"
                            }
                            style={{ borderRadius: "50%", marginRight: "5px" }}
                            alt="profile"
                          />
                        ) : (
                          <img
                            loading="lazy"
                            height="25px"
                            width="25.5px"
                            style={{ borderRadius: "50%", marginRight: "5px" }}
                            src="/img/profile.png"
                            alt=""
                          />
                        )}
                        <strong>{profile.firstName}</strong>{" "}
                        <div style={{ fontWeight: "400", fontSize: "12.5px" }}>
                          {` (${expertCategories[0]})`}
                        </div>
                      </div>
                    </InfoWindow>
                  ) : null}
                </Marker>
              ) : null
          )
        : null}

      {center.lat ? (
        <Marker
          key={center.lat}
          position={center}
          icon="https://img.icons8.com/nolan/1x/marker.png"
          onMouseOver={() => handleActiveMarker(center.lat)}
        >
          {activeMarker === center.lat ? (
            <InfoWindow
              position={center}
              onCloseClick={() => setActiveMarker(null)}
            >
              <strong>Me</strong>
            </InfoWindow>
          ) : null}
        </Marker>
      ) : null}
    </GoogleMap>
  ) : (
    <></>
  );
}

export default Map;
