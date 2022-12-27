import { combineReducers } from "redux";
import { reducer as formReducer } from "redux-form";

import authReducer from "./auth_reducer";
import audioReducer from "./audio_reducer";
import audioChatRoomReducer from "./audio_chat_room_reducer";
import userReducer from "./user_reducer";
import communicationReducer from "./communication_reducer";
import customerReducer from "./customer_reducer";
import expertReducer from "./expert_reducer";
import pageRouteReducer from "./page_route_reducer";
import searchValueReducer from "./search_value_reducer";
import messengerReducer from "./messenger_reducer";
import storyReducer from "./story_reducer";
import mediaReducer from "./media_reducer";
import imageModal from "./imageModal";
import videoCallModal from "./videoCallModal";
import { listReducer } from "./list_reducer";
import categoriesReducer from "./categories_reducer";
import reviewReducer from "./review_reducer";
import loginReducer from "./loginModal";
import signupReducer from "./signupModal";
import conversationReducer from "./conversation_reducer";
import donationReducer from "./donation_reducer";
import ethReducer from "./eth_reducer";
import paymentOptionsReducer from "./payment_options_reducer";
import paystackReducer from "./paystack_reducer";

const rootReducer = combineReducers({
  audio: audioReducer,
  audioRoom: audioChatRoomReducer,
  form: formReducer,
  list: listReducer,
  auth: authReducer,
  user: userReducer,
  communication: communicationReducer,
  messenger: messengerReducer,
  conversation: conversationReducer,
  customer: customerReducer,
  expert: expertReducer,
  pageroute: pageRouteReducer,
  searchvalue: searchValueReducer,
  stories: storyReducer,
  media: mediaReducer,
  imageModal: imageModal,
  videoCallModal,
  login: loginReducer,
  signup: signupReducer,
  categories: categoriesReducer,
  review: reviewReducer,
  donation: donationReducer,
  ethDonation: ethReducer,
  paymentOptions: paymentOptionsReducer,
  paystack: paystackReducer,
});

export default rootReducer;
