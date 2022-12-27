import { NotificationLink } from "./styles.component";
import Image from "../../../components/common/ImageHandler/Image";
import { API_URL } from "../../../constants/api";
import { format } from "timeago.js";
import { useHistory } from "react-router";
import useSwr from "swr";

const UserNotifications = ({
  senderSlug,
  imageUrl,
  title,
  endUrl,
  time,
  setOptions,
  btnText,
  redirectUrl,
  mediaId,
}) => {
  const senderDetailsUrl = `${API_URL}/getExpertDetail/${senderSlug}`;
  const { data: senderDetails } = useSwr(senderDetailsUrl);
  const sender = senderDetails?.data;
  const history = useHistory();

  const viewNotification = () => {
    setOptions(false);
    if (title.includes("media post")) {
      history.push({
        state: { media: true, mediaId: mediaId },
      });
    } else {
      redirectUrl
        ? window.open(redirectUrl, "_blank")
        : history.push({
            pathname: endUrl,
          });
    }
  };

  return (
    <div className="div-container" onClick={viewNotification}>
      <NotificationLink>
        <img
          loading="lazy"
          style={{
            border: "1px solid #e5e7eb",
            borderRadius: "50%",
            marginRight: "10px",
            height: "40px",
            width: "40px",
            flexShrink: "0",
            objectFit: "cover",
          }}
          src={
            sender?.imageUrl?.cdnUrl
              ? sender?.imageUrl?.cdnUrl
              : "/img/profile.png"
          }
          alt="profile"
        />
        <div>
          {`${title}.`}&nbsp;
          <span className="time-text">{format(time, "h:mm a")}</span>
        </div>
      </NotificationLink>

      {imageUrl && imageUrl !== "null" ? (
        <img
          loading="lazy"
          style={{
            border: "1px solid #e5e7eb",
            borderRadius: "0.5rem",
            height: "40px",
            width: "40px",
            flexShrink: "0",
            objectFit: "cover",
          }}
          src={imageUrl}
          placeholder=""
          alt="pic"
        />
      ) : (
        <div className="view-btn">
          <p className="view-btn-text">{btnText ? btnText : "view"}</p>
        </div>
      )}
    </div>
  );
};

export default UserNotifications;
