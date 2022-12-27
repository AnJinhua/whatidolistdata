import { SHOWLOGIN } from "../constants/actions";

const INITIAL_STATE = {
  show: false,
};

export default function loginModal(state = INITIAL_STATE, action) {
  switch (action.type) {
    case SHOWLOGIN:
      return {
        show: action.payload,
      };

    default:
      return state;
  }
}
