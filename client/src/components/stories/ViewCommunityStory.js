import { useEffect, useState } from "react";
import { CgCloseO } from "react-icons/cg";
import { BsThreeDots } from "react-icons/bs";
import Stories from "react-insta-stories";
import { ElipsDot } from "../messenger/chatList/List/styles";
import { format } from "timeago.js";
import { useCookies } from "react-cookie";
import { API_URL } from "../../constants/api";
import axios from "axios";
import { useHistory } from "react-router-dom";
import StoryElement from "./storiesElements/StoryElement";
import SeeMore from "./storiesElements/SeeMore";
import ExpandedMore from "./storiesElements/ExpandedMore";
import useSWR from "swr";
import { useLocation } from "react-router-dom";
import { StoryPage, OptionContainer, OptionalText } from "./styles";
import { IconButton } from "@mui/material";
import ClickAwayListener from "@material-ui/core/ClickAwayListener";

function ViewCommunityStory() {
  const [options, setOptions] = useState(false);
  const [cookies] = useCookies(["user"]);
  const history = useHistory();

  const match = useLocation();
  const storyId = match.pathname.split("/")[3];
  const url = `${API_URL}/stories/story/${storyId}`;
  const { data: communityStory } = useSWR(url);

  const storyUserUrl = `${API_URL}/getExpertDetail/${communityStory?.userSlug}`;
  const { data: storyUserRequest } = useSWR(storyUserUrl);
  const user = storyUserRequest?.data;

  const myStory = cookies?.user?.slug === communityStory?.userSlug;

  const goProfile = () => {
    history.push(`/expert/${user?.expertCategories[0]}/${user.slug}`);
  };

  const handleClose = () => {
    history.push({
      pathname: "/community-stories/" + communityStory?.community,
    });
  };

  const handleClick = () => {
    setOptions((prev) => !prev);
  };

  const handleClickAway = () => {
    if (options === true) {
      setOptions(false);
    }
  };

  useEffect(() => {
    const viewUserStory = async (id) => {
      axios
        .put(`${API_URL}/stories/view/${id}`, {
          view: cookies?.user?.slug,
        })
        .then((res) => {
          //mutate
        })
        .catch((err) => {
          console.log(err);
        });
    };

    if (cookies?.user?.slug !== user?.slug) {
      //check if storie.view contains cookies.user.slug
      if (!communityStory?.views.includes(cookies?.user?.slug)) {
        viewUserStory(communityStory?._id);
      }
    }
  }, [
    communityStory?._id,
    communityStory?.views,
    cookies?.user?.slug,
    user?.slug,
  ]);

  const storyView = [
    {
      ...((communityStory?.storyType === "video" ||
        communityStory?.storyType === "videoText") && {
        url: communityStory?.file?.cdnUrl,
        type: "video",
      }),
      ...((communityStory?.storyType === "image" ||
        communityStory?.storyType === "imageText" ||
        communityStory?.storyType === "text") && {
        content: ({ story, action }) => (
          <StoryElement storie={communityStory} action={action} story={story} />
        ),
      }),
      seeMoreCollapsed: ({ toggleMore }) => (
        <SeeMore
          cookies={cookies}
          profile={user}
          toggleMore={toggleMore}
          story={communityStory}
        />
      ),
      seeMore: ({ close }) => (
        <ExpandedMore
          close={close}
          story={communityStory}
          profile={user}
          cookies={cookies}
        />
      ),
    },
  ];

  return (
    <StoryPage>
      <div className="wrap-container">
        {communityStory && (
          <Stories
            stories={storyView}
            defaultInterval={5000}
            width={"100%"}
            height={"100%"}
            onAllStoriesEnd={handleClose}
            storyStyles={{
              height: "100%",
              width: "100%",
            }}
          />
        )}

        <div className="story-flex-container">
          <div className="avatar-container">
            <IconButton className="iconsBtn right" onClick={handleClose}>
              <CgCloseO className="close-icon-btn" />
            </IconButton>
            <img
              loading="lazy"
              width="40"
              height="40"
              style={{
                height: "3.5rem",
                width: "3.5rem",
                borderRadius: "50%",
                objectFit: "cover",
                cursor: "pointer",
                marginRight: "1rem",
              }}
              alt="profile "
              onClick={goProfile}
              className="avatar-img pointer"
              src={
                user?.imageUrl?.cdnUrl
                  ? user.imageUrl?.cdnUrl
                  : "/img/profile.png"
              }
            />
            <div className="text">
              {" "}
              {!user ? (
                <ElipsDot>
                  <div></div>
                  <div></div>
                  <div></div>
                  <div></div>
                </ElipsDot>
              ) : (
                <p className="text-md pointer" onClick={goProfile}>
                  {user?.profile?.firstName + "  " + user?.profile?.lastName}{" "}
                </p>
              )}
              <p className="text-sm">{format(communityStory?.createdAt)}</p>
            </div>
          </div>
          <div className="controls-flex-container">
            <ClickAwayListener onClickAway={handleClickAway}>
              <div>
                <IconButton className="iconsBtn">
                  <BsThreeDots onClick={handleClick} className="icon-btn" />
                </IconButton>
                {options && (
                  <OptionContainer>
                    {!myStory && <OptionalText> Report a concern</OptionalText>}
                  </OptionContainer>
                )}
              </div>
            </ClickAwayListener>
          </div>
        </div>
      </div>
    </StoryPage>
  );
}

export default ViewCommunityStory;
