import { SHOWSIGNUP } from "../constants/actions";

const INITIAL_STATE = {
  show: false,
};

export default function signupModal(state = INITIAL_STATE, action) {
  switch (action.type) {
    case SHOWSIGNUP:
      return {
        show: action.payload,
      };

    default:
      return state;
  }
}
