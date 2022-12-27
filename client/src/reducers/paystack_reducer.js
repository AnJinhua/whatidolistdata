import { PAYSTACK } from "../constants/actions";

const INITIAL_STATE = {
  show: false,
};

export default function paystackModal(state = INITIAL_STATE, action) {
  switch (action.type) {
    case PAYSTACK:
      return {
        show: action.payload,
      };

    default:
      return state;
  }
}
