import { useState, useEffect } from "react";
import { ShareModalContainer } from "./styles";
import UserSearch from "./UserSearch";
import { IconButton } from "@material-ui/core";
import { CancelIcon } from "../../expertDonation/styles";
import { useHistory } from "react-router";
import { useLocation } from "react-router-dom";
import { TextArea } from "../../messenger/messageScreen/messageForm/styles";
import { API_URL, CLIENT_ROOT_URL } from "../../../constants/api";
import axios from "axios";
import { useCookies } from "react-cookie";
import { getRedirectUrl, sendMessageToUser } from "../../../actions/messenger";
import { useDispatch } from "react-redux";
import { toast } from "react-toastify";
import useSWR, { mutate } from "swr";

function ShareModal() {
  const [openMediaModal, setOpenMediaModal] = useState(true);
  const [selectedUser, setSelectedUser] = useState([]);
  const history = useHistory();
  const dispatch = useDispatch();
  const match = useLocation();
  const [cookies] = useCookies(["user"]);

  const onShare = match?.state?.share;
  const mediaID = match?.state?.mediaId;

  const mediaUrl = `${API_URL}/media/fetch/${mediaID}`;
  const { data: mediaPost } = useSWR(mediaUrl);
  const mediaShares = mediaPost?.shares;

  useEffect(() => {
    if (onShare) {
      setOpenMediaModal(true);
    } else {
      setOpenMediaModal(false);
    }
  }, [onShare]);

  const handleClose = () => {
    history.goBack();
    setOpenMediaModal(false);
  };

  const sharePost = (inputVal, setInputMessage) => {
    if (selectedUser.length > 0) {
      selectedUser.forEach((friendSlug) => {
        const userUrl = `${API_URL}/getExpertDetail/${friendSlug}`;
        axios.get(userUrl).then((convUser) => {
          const profileOfUser = convUser.data.data;

          const shareMediaMessage = async () => {
            let engagementStarter = {
              recieverSlug: profileOfUser.slug,
              senderSlug: cookies?.user?.slug,
              firstName: cookies?.user?.firstName,
              lastName: cookies?.user?.lastName,
              text: inputVal,
              link: null,
              quote: null,
              share: match?.state?.mediaId,

              emailNotificationData: {
                recieverName: `${profileOfUser?.profile?.firstName} ${profileOfUser.profile?.lastName}`,
                message: "shared a post",
                senderName: `${cookies?.user?.firstName} ${cookies?.user?.lastName}`,
                recieverEmail: profileOfUser.email,
                url:
                  CLIENT_ROOT_URL +
                  (await getRedirectUrl(
                    profileOfUser.slug,
                    cookies?.user?.slug
                  )),
                baseUrl: CLIENT_ROOT_URL,
              },
            };
            dispatch(sendMessageToUser(engagementStarter));
            //updateshare count
            axios.put(`${API_URL}/media/share/${mediaID}`, {
              shares: [...mediaShares, profileOfUser.slug],
            });

            mutate(mediaUrl);
          };

          shareMediaMessage();
        });
      });

      setSelectedUser([]);
      setInputMessage("");

      toast.success("shared post", {
        position: "top-center",
        theme: "dark",
        autoClose: 2000,
        hideProgressBar: true,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
      });
    }
  };

  const Header = () => {
    return (
      <div className="share-header">
        <p className="header-text share-text">share</p>
        <IconButton onClick={handleClose}>
          <CancelIcon />
        </IconButton>
      </div>
    );
  };

  const MessageForm = () => {
    const [inputVal, setInputVal] = useState("");

    return (
      <div className="share-footer">
        <TextArea
          placeholder="write a message"
          value={inputVal}
          onChange={(e) => {
            setInputVal(e.target.value);
          }}
        />
        <div
          className={`share-btn ${
            selectedUser.length > 0 ? "active-bg" : "unActive-bg"
          }`}
          onClick={() => sharePost(inputVal, setInputVal)}
        >
          <p>send</p>
        </div>
      </div>
    );
  };

  return (
    <ShareModalContainer
      open={openMediaModal}
      onClose={handleClose}
      aria-labelledby="simple-modal-title"
      aria-describedby="simple-modal-description"
    >
      <div className="share-container">
        <Header />
        <UserSearch
          selectedUser={selectedUser}
          setSelectedUser={setSelectedUser}
        />
        <MessageForm />
      </div>
    </ShareModalContainer>
  );
}

export default ShareModal;
