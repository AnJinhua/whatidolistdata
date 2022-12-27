import useSWR from "swr";
import { API_URL } from "../../../../constants/api";
import UserHead from "../../../home/modals/UserHead";
import { MediaContainer } from "./styles";
import { useHistory } from "react-router";
import { IconButton } from "@material-ui/core";
import { FaPlayCircle } from "react-icons/fa";

function MediaComponent({ mediaID }) {
  const history = useHistory();
  const mediaUrl = `${API_URL}/media/fetch/${mediaID}`;
  const { data: mediaPost } = useSWR(mediaUrl);
  const userUrl = `${API_URL}/getExpertDetail/${mediaPost?.userSlug}`;
  const { data: searchUser } = useSWR(userUrl);

  const goMedia = () => {
    history.push({
      state: { media: true, mediaId: mediaID },
    });
  };

  return (
    <MediaContainer onClick={goMedia}>
      <UserHead searchUser={searchUser?.data} />

      <div className="thumbnail-container">
        <img
          loading="lazy"
          src={mediaPost?.thumbnail[0]?.location}
          alt="media post"
          className="thumbnail"
        />

        <IconButton className="icon-btn">
          <FaPlayCircle className="icon-play" />
        </IconButton>
      </div>
    </MediaContainer>
  );
}

export default MediaComponent;
