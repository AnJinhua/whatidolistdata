import { PAYMENT_OPTIONS } from "../constants/actions";

const INITIAL_STATE = {
  show: false,
};

export default function paymentOptionsModal(state = INITIAL_STATE, action) {
  switch (action.type) {
    case PAYMENT_OPTIONS:
      return {
        show: action.payload,
      };

    default:
      return state;
  }
}
