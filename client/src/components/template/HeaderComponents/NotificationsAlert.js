import { useState, useEffect } from "react";
import { useCookies } from "react-cookie";
import useSWR, { mutate } from "swr";
import { API_URL } from "../../../constants/api";
import axios from "axios";
import { AlertIcon } from "./styles.component";

function NotificationsAlert({ options }) {
  const [notify, setNotify] = useState(0);
  const [{ user }] = useCookies(["user"]);
  const unreadNotificationsUrl = `${API_URL}/notifications/unread/${user.slug}`;
  const { data: unreadNotifications } = useSWR(unreadNotificationsUrl);

  useEffect(() => {
    setNotify(unreadNotifications?.length);
  }, [unreadNotifications]);

  useEffect(() => {
    if (notify > 0) {
      axios.put(`${API_URL}/notifications/${user.slug}`, { read: true });
      mutate(unreadNotificationsUrl, [], false);
    }
  }, [!options]);

  if (notify > 0) {
    return <AlertIcon />;
  } else {
    return null;
  }
}

export default NotificationsAlert;
