import { AddStrories } from "./styles";
import { useDispatch } from "react-redux";
import { TOGGLE_STORY_MODAL } from "../../constants/actions";

function AddStoriesBtn() {
  const dispatch = useDispatch();
  return (
    <AddStrories
      onClick={() => {
        dispatch({
          type: TOGGLE_STORY_MODAL,
          payload: true,
        });
      }}
    >
      <div className="AddBulb"></div>
      <p className="small-text">add story</p>
    </AddStrories>
  );
}

export default AddStoriesBtn;
