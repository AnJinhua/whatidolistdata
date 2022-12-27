import { StoryViewerContainer } from "./styles";
import { useHistory } from "react-router-dom";
import { ElipsDot } from "../messenger/chatList/List/styles";
import { API_URL } from "../../constants/api";
import useSWR from "swr";

function StoryViewer({ userSlug }) {
  const history = useHistory();
  const storyUserUrl = `${API_URL}/getExpertDetail/${userSlug}`;
  const { data: storyUserRequest } = useSWR(storyUserUrl);
  const user = storyUserRequest?.data;

  const goProfile = () => {
    user && history.push(`/expert/${user.expertCategories[0]}/${user.slug}`);
  };

  return (
    <StoryViewerContainer>
      <div className="flex">
        <div className="viewer-image-container" onClick={goProfile}>
          <img
            loading="lazy"
            style={{
              height: "100%",
              width: "100%",
              objectFit: "cover",
            }}
            src={
              user?.imageUrl?.cdnUrl
                ? user?.imageUrl?.cdnUrl
                : "/img/profile.png"
            }
            alt="profile "
          />
        </div>
        {!user ? (
          <ElipsDot>
            <div></div>
            <div></div>
            <div></div>
            <div></div>
          </ElipsDot>
        ) : (
          <div className="" onClick={goProfile}>
            <p className="text-lg">
              {" "}
              {user?.profile?.firstName + "  " + user?.profile?.lastName}
            </p>
            <p className="text-sm"> {user?.expertCategories[0]}</p>
          </div>
        )}
      </div>
      <div className="view-btn" onClick={goProfile}>
        <p className="view-btn-text">view expert</p>
      </div>
    </StoryViewerContainer>
  );
}

export default StoryViewer;
