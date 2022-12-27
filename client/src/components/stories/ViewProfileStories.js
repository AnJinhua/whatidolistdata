import { useState, memo } from "react";
import { useDispatch, useSelector } from "react-redux";
import { BsThreeDots } from "react-icons/bs";
import Stories from "react-insta-stories";
import { ElipsDot } from "../messenger/chatList/List/styles";
import { format } from "timeago.js";
import { useCookies } from "react-cookie";
import { API_URL } from "../../constants/api";
import ExpandedMore from "./storiesElements/ExpandedMore";
import StoryElement from "./storiesElements/StoryElement";
import SeeMore from "./storiesElements/SeeMore";
import useSWR from "swr";
import { useHistory } from "react-router-dom";
import { StoryPage, OptionContainer, OptionalText } from "./styles";
import { CgCloseO } from "react-icons/cg";
import { IconButton } from "@mui/material";
import ClickAwayListener from "@material-ui/core/ClickAwayListener";
import { deleteNewStory } from "../../actions/stories";
import { useLocation } from "react-router-dom";
import { TOGGLE_STORY_OPTION } from "../../constants/actions";

function ViewProfileStories() {
  const [options, setOptions] = useState(false);
  const dispatch = useDispatch();
  const toggle = useSelector((state) => state);
  const storyToggle = toggle?.stories?.toggleStory;
  const [cookies] = useCookies(["user"]);
  const history = useHistory();
  const [{ token }] = useCookies(["token"]);
  const match = useLocation();
  const userSlug = match.pathname.split("/")[3];
  let storyIndex;

  if (match.search) {
    const index = match.search.split("=")[1];
    if (index) {
      storyIndex = parseInt(index);
    }
  }

  const userStoriesUrl = `${API_URL}/stories/${userSlug}`;
  const storyUserUrl = `${API_URL}/getExpertDetail/${userSlug}`;
  const { data: userStories } = useSWR(userStoriesUrl);
  const { data: userProfile } = useSWR(storyUserUrl);
  const user = userProfile?.data;

  const myStory = cookies?.user?.slug === userSlug;

  const handleClose = () => {
    let closeUrl =
      cookies?.user?.slug === userSlug
        ? "/profile"
        : `/expert/${user?.expertCategories[0]}/${user.slug}`;
    history.push(closeUrl);
  };

  const handleClick = () => {
    setOptions((prev) => !prev);

    // if (storyToggle === true) {
    //   dispatch({
    //     type: TOGGLE_STORY_OPTION,
    //     payload: false,
    //   });
    // } else {
    //   dispatch({
    //     type: TOGGLE_STORY_OPTION,
    //     payload: true,
    //   });
    // }
  };

  const handleClickAway = () => {
    if (options === true) {
      setOptions(false);
    }
  };

  const filteredStories = userStories?.sort((a, b) => {
    return new Date(b.createdAt) - new Date(a.createdAt);
  });

  const handleDeleteStories = async () => {
    handleClose();
    deleteNewStory(filteredStories[storyIndex]?._id, token);
  };

  const stories = filteredStories?.map((storie) => {
    return {
      ...((storie?.storyType === "video" ||
        storie?.storyType === "videoText") && {
        url: storie?.file?.cdnUrl,
        type: "video",
      }),
      ...((storie?.storyType === "image" ||
        storie?.storyType === "imageText" ||
        storie?.storyType === "text") && {
        content: ({ story, action }) => (
          <StoryElement storie={storie} action={action} story={story} />
        ),
      }),

      seeMoreCollapsed: ({ toggleMore }) => (
        <SeeMore
          cookies={cookies}
          profile={user}
          toggleMore={toggleMore}
          story={storie}
        />
      ),
      seeMore: ({ close }) => (
        <ExpandedMore
          close={close}
          story={storie}
          profile={user}
          cookies={cookies}
        />
      ),
    };
  });

  return (
    <StoryPage>
      <div className="wrap-container">
        {userStories && (
          <Stories
            stories={stories}
            defaultInterval={5000}
            width={"100%"}
            height={"100%"}
            currentIndex={storyIndex}
            onStoryStart={(index) => {
              history.push(`/profile/story/${userSlug}?index=${index}`);
            }}
            onStoryEnd={(index) => {
              history.push(`/profile/story/${userSlug}?index=${index}`);
            }}
            onAllStoriesEnd={handleClose}
            keyboardNavigation={true}
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
              style={{
                height: "4rem",
                width: "4rem",
                borderRadius: "50%",
                objectFit: "cover",
                cursor: "pointer",
                marginRight: "0.5rem",
                border: "2px solid #780206",
                border:
                  "2px solid -webkit-linear-gradient(to right, #061161, #780206)",
                border: "2px solid linear-gradient(to right, #061161, #780206)",
              }}
              src={
                user?.imageUrl?.cdnUrl
                  ? user?.imageUrl?.cdnUrl
                  : "/img/profile.png"
              }
              alt="profile"
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
                <p className="text-md point">
                  {user?.profile?.firstName + "  " + user?.profile?.lastName}{" "}
                </p>
              )}
              <p className="text-sm">{format()}</p>
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
                    {myStory ? (
                      <OptionalText onClick={handleDeleteStories}>
                        delete
                      </OptionalText>
                    ) : (
                      <OptionalText> report a concern</OptionalText>
                    )}
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

export default memo(ViewProfileStories);
