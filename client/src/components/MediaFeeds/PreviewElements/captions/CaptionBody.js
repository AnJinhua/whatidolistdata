import { CaptionBodyContainer } from "./caption.styles";
import Comment from "./Comment";
import useSWR from "swr";
import { API_URL } from "../../../../constants/api";

function CaptionBody({ sendingMediaComment, viewedMedia }) {
  const commentUrl = `${API_URL}/media/page/comment/${
    viewedMedia?._id
  }?page=${0}`;
  const { data: mediaComments } = useSWR(commentUrl);

  return (
    <CaptionBodyContainer>
      <div className="comment-container">
        {sendingMediaComment?.map((comment) => (
          <Comment comment={comment} mediaId={viewedMedia?._id} />
        ))}

        {mediaComments?.map((comment) => (
          <Comment comment={comment} mediaId={viewedMedia?._id} />
        ))}
      </div>
    </CaptionBodyContainer>
  );
}

export default CaptionBody;
