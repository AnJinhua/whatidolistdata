import { useState } from "react";
import useSwr from "swr";
import { useCookies } from "react-cookie";
import UserNotifications from "./UserNotifications";
import {
  MdOutlineNotificationsNone,
  MdOutlineNotificationsOff,
} from "react-icons/md";
import ClickAwayListener from "@material-ui/core/ClickAwayListener";
import {
  NotificationOptionsGrard,
  NotificationOptionsContainer,
  Notification,
  MenuNotificationContainer,
  AlertNotification,
  NotificationDropDown,
} from "./styles.component";
import { API_URL } from "../../../constants/api";
import NotificationsAlert from "./NotificationsAlert";
import { IconButton } from "@material-ui/core";

function Notifications() {
  const [{ user }] = useCookies(["user"]);
  const notificationsUrl = `${API_URL}/notifications/${user?.slug}?page=${0}`;
  const { data: notifications } = useSwr(notificationsUrl);
  const [options, setOptions] = useState(false);

  const handleClickAway = () => {
    setOptions(false);
  };

  return (
    <>
      <ClickAwayListener onClickAway={handleClickAway}>
        <NotificationOptionsGrard>
          <IconButton className="icon-btn">
            <MenuNotificationContainer>
              {notifications?.length > 0 ? (
                <div onClick={() => setOptions((prev) => !prev)}>
                  <MdOutlineNotificationsNone className="icon" />
                  <AlertNotification>
                    <NotificationsAlert options={options} />
                  </AlertNotification>
                </div>
              ) : (
                <MdOutlineNotificationsOff className="icon" />
              )}
            </MenuNotificationContainer>
          </IconButton>

          <NotificationOptionsContainer in={options}>
            <Notification>
              {notifications?.map((notification) => (
                <UserNotifications
                  senderSlug={notification.senderSlug}
                  imageUrl={notification.imageUrl}
                  title={notification.title}
                  endUrl={notification.endUrl}
                  time={notification.createdAt}
                  setOptions={setOptions}
                  btnText={notification.btnText}
                  redirectUrl={notification.redirectUrl}
                  mediaId={notification?.mediaId}
                />
              ))}
            </Notification>
          </NotificationOptionsContainer>
        </NotificationOptionsGrard>
      </ClickAwayListener>
      <NotificationDropDown in={options}>
        <Notification>
          {notifications?.map((notification) => (
            <UserNotifications
              senderSlug={notification.senderSlug}
              imageUrl={notification.imageUrl}
              title={notification.title}
              endUrl={notification.endUrl}
              time={notification.createdAt}
              setOptions={setOptions}
              btnText={notification.btnText}
              redirectUrl={notification.redirectUrl}
              mediaId={notification?.mediaId}
            />
          ))}
        </Notification>
      </NotificationDropDown>
    </>
  );
}

export default Notifications;
