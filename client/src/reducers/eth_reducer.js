import { ETH_DONATION } from "../constants/actions";

const INITIAL_STATE = {
  show: false,
};

export default function ethModal(state = INITIAL_STATE, action) {
  switch (action.type) {
    case ETH_DONATION:
      return {
        show: action.payload,
      };

    default:
      return state;
  }
}
