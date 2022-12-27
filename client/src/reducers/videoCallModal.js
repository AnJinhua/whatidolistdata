import { VIDEOCALL_CHANGE } from "../constants/actions";

const INITIAL_STATE = {
  show: false,
  expert: {},
};

export default function imageModal(state = INITIAL_STATE, action) {
  switch (action.type) {
    case VIDEOCALL_CHANGE:
      return {
        ...action.payload,
      };

    default:
      return state;
  }
}
