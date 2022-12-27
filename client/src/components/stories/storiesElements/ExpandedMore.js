import { StoryExpanded, StoryText } from "../styles";
import { IconButton } from "@material-ui/core";
import { BiSend } from "react-icons/bi";
import { CLIENT_ROOT_URL } from "../../../constants/api";
import { useState, useRef } from "react";
import { getRedirectUrl, sendMessageToUser } from "../../../actions/messenger";
import { useDispatch, useSelector } from "react-redux";
import { toast } from "react-toastify";
import { sendNotification } from "../../../subscription";
import { SHOWLOGIN } from "../../../constants/actions";

function ExpandedMore({ close, story, profile, cookies }) {
  const [storyText, setStoryText] = useState("");
  const storyInput = useRef(null);
  const dispatch = useDispatch();
  const reduxUser = useSelector(({ user }) => user.profile);

  const handleStoryReply = async () => {
    let engagementStarter = {
      recieverSlug: profile.slug,
      senderSlug: cookies?.user?.slug,
      firstName: cookies?.user?.firstName,
      lastName: cookies?.user?.lastName,
      text: storyText,
      link: null,
      quote: {
        text: story?.text,
        imageUrl: story?.thumbnail?.cdnUrl,
        storyId: story._id,
        senderName: `${cookies?.user?.firstName} ${cookies?.user?.lastName}`,
        time: story?.createdAt,
      },
      share: null,

      emailNotificationData: {
        recieverName: `${profile?.profile?.firstName} ${profile.profile?.lastName}`,
        message: story?.text,
        senderName: `${cookies?.user?.firstName} ${cookies?.user?.lastName}`,
        recieverEmail: profile.email,
        url:
          CLIENT_ROOT_URL +
          (await getRedirectUrl(profile.slug, cookies?.user?.slug)),
        baseUrl: CLIENT_ROOT_URL,
      },
    };

    if (reduxUser?.profile) {
      if (storyText !== "") {
        dispatch(sendMessageToUser(engagementStarter));
        let pushNotificationData = {
          title: `${engagementStarter.firstName} replied to your story`,
          description: engagementStarter.text,
          userSlug: engagementStarter.recieverSlug,
          action: "view reply",
          senderSlug: engagementStarter.senderSlug,
          imageUrl: engagementStarter.quote.imageUrl,
          endUrl: await getRedirectUrl(
            engagementStarter.recieverSlug,
            engagementStarter.senderSlug
          ),

          redirectUrl: engagementStarter.link,
        };

        sendNotification(pushNotificationData);
        close();
        toast.success("sent reply", {
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
    } else {
      close();
      dispatch({
        type: SHOWLOGIN,
        payload: true,
      });
    }
  };

  return (
    <StoryExpanded>
      <div className="story-expanded-container">
        {story.storyType === "imageText" && (
          <StoryText>{story?.text}</StoryText>
        )}

        <div className="reply-story-container">
          {cookies?.user?.slug !== profile.slug && (
            <div className="reply-flex-container">
              <div className="input-container">
                <textarea
                  ref={storyInput}
                  value={storyText}
                  onChange={(e) => setStoryText(e.target.value)}
                  className="reply-story-input"
                  placeholder={`reply to ${profile?.profile?.firstName}'s story`}
                />
              </div>

              <IconButton className="iconBtn left" onClick={handleStoryReply}>
                <BiSend className="icon" />
              </IconButton>
            </div>
          )}

          <p onClick={close} className="close-story-text">
            close
          </p>
        </div>
      </div>
    </StoryExpanded>
  );
}

export default ExpandedMore;
