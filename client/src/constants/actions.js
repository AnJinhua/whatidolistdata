/* AudioCall actions */
export const START_AUDIO_CALL_RINGER = "start_audio_call_ringer",
  END_AUDIO_CALL_RINGER = "end_audio_call_ringer",
  START_AUDIO_CALL_SESSION = "start_audio_call_session",
  END_AUDIO_CALL_SESSION = "end_audio_call_session",
  SET_PEER_ID = "set_peer_id",
  SETUP_PEERJS = "setup_peerjs";
/* Auth actions */
export const AUTH_USER = "auth_user",
  UNAUTH_USER = "unauth_user",
  AUTH_ERROR = "auth_error",
  RESET_PASSWORD_REQUEST = "reset_password_request",
  PROTECTED_TEST = "protected_test",
  EXPERT_SIGNUP_LINK_REQUEST = "expert_signup_link_request",
  UPDATE_EXPERT_VISIBILITY = "update_expert_visibility",
  UPDATE_EXPERT_LOCATION = "update_expert_loction";
/* User profile actions */
export const USER_FETCH_REQUEST = "user_fetch_request";
export const USER_FETCH_SUCESS = "user_fetch_success";
export const USER_FETCH_FAIL = "user_fetch_fail";
export const USER_PROFILE_REMOVE = "user_profile_remove";
export const CURRENT_USER = "CURRENT_USER";
export const IMAGE_CHANGE = "IMAGE_CHANGE";
export const VIDEOCALL_CHANGE = "VIDEOCALL_CHANGE";
export const PAYMENT_OPTIONS = "PAYMENT_OPTIONS";
export const DONATION_CHANGE = "DONATION_CHANGE";
export const ETH_DONATION = "ETH_DONATION";
export const PAYSTACK = "PAYSTACK";

/* User Image update */
export const IMAGE_UPDATE_REQUEST = "image_update_request";
export const IMAGE_UPDATE_SUCESS = "image_update_success";
export const IMAGE_UPDATE_FAIL = "image_update_fail";

/* User profile update */
export const USER_UPDATE_REQUEST = "user_update_request";
export const USER_UPDATE_SUCESS = "user_update_success";
export const USER_UPDATE_FAIL = "user_update_fail";

export const SEARCH_VISIBILITY = "search_visibility";
export const TOGGLE_SIGNUP_STEP = "toggle_signup_step";

/* Messaging actions */
export const FETCH_CONVERSATIONS = "fetch_conversations",
  FETCH_RECIPIENTS = "fetch_recipients",
  START_CONVERSATION = "start_conversation",
  FETCH_SINGLE_CONVERSATION = "fetch_single_conversation",
  FETCH_EXPERT_SINGLE_CONVERSATION = "fetch_expert_single_conversation",
  CHAT_ERROR = "chat_error",
  SEND_REPLY = "send_reply";

//Messager Conversation actions
export const ADD_ALL_CONVERSATION = "add_all_conversation",
  FETCH_ALL_CONVERSATIONS = "fetch_all_conversation",
  DELETE_All_CONVERSATION = "delete_all_conversation";

//Messenger actions
export const STORE_ONLINE_USER = "store_online_user",
  SET_XMPP_CLIENT = "set_xmpp_client",
  ADD_CONVERSATION_MESSAGE = "add_conversation_message",
  ADD_SENDING_MESSAGE = "add_sending_message",
  REMOVE_SENDING_MESSAGE = "remove_sending_message",
  ADD_MESSAGE_FILE = "add_message_file",
  REMOVE_MESSAGE_FILE = "remove_message_file",
  FETCH_CONVERSATION_MESSAGE = "fetch_conversation_message",
  GET_CONVERSATION_MESSAGE = "get_conversation_message",
  DELETE_CONVERSATION_MESSAGE = "delete_conversation_message",
  QUOTE_MESSAGE = "quote_message",
  MESSENGER_ERROR = "messenger_error";

//story actions
export const ADD_NEW_STORY = "add_new_story",
  ADD_MANY_STORIES = "add_many_stories",
  ADD_SENDING_STORIES = "add_sending_stories",
  REMOVE_SENDING_STORIES = "add_remove_stories",
  ADD_STORY_FILE = "add_story_file",
  TOGGLE_STORY_MODAL = "toggle_story_modal",
  TOGGLE_PREVIEW_COMPONENT = "toggle_preview_component",
  SET_VIDEO_PRESET = "set_video_preset",
  REMOVE_STORY_FILE = "remove_story_file",
  SET_CURRENT_COMMUNITY_STORY = "set_current_community_story",
  DELETE_STORY = "delete_story",
  TOGGLE_STORY_OPTION = "toggle_story_option";

//media actions
export const ADD_MANY_MEDIA = "add_many_media",
  ADD_NEW_MEDIA = "add_new_media",
  ADD_SENDING_MEDIA = "add_sending_media",
  REMOVE_SENDING_MEDIA = "remove_sending_media",
  ADD_MEDIA_FILE = "add_media_file",
  REMOVE_MEDIA_FILE = "remove_media_file",
  TOGGLE_MEDIA_MODAL = "toggle_media_modal",
  ADD_MANY_MEDIA_COMMENTS = "add_many_media_comments";

/* Page actions */
export const SEND_CONTACT_FORM = "send_contact_form",
  STATIC_ERROR = "static_error";

/* Customer actions */
export const CREATE_CUSTOMER = "create_customer",
  FETCH_CUSTOMER = "fetch_customer",
  CANCEL_SUBSCRIPTION = "cancel_subscription",
  UPDATE_BILLING = "update_billing",
  BILLING_ERROR = "billing_error",
  CHANGE_SUBSCRIPTION = "change_subscription";

/* Expert actions */
export const SEND_EXPERT_TEXT_MESSAGE = "send_expert_text_message",
  CREATE_EXPERT = "create_expert",
  GET_EXPERT_EMAIL_TOKEN = "get_expert_email_token";

export const LIST_REQUEST = "LIST_REQUEST";
export const LIST_SUCCESS = "LIST_SUCCESS";
export const LIST_FAIL = "LIST_FAIL";

/* Audio Chat Room actions*/
export const FETCH_CATEGORIES_SUCCESS = "FETCH_CATEGORIES_SUCCESS",
  CREATE_ROOM = "CREATE_ROOM",
  ADD_PARTICIPANT = "ADD_PARTICIPANT",
  PARTICIPANT_LEFT = "PARTICIPANT_LEFT",
  ROOM_CREATED = "ROOM_CREATED",
  CREATING_ROOM = "CREATING_ROOM",
  ATTACH_MEDIA_STREAM = "ATTACH_MEDIA_STREAM",
  RAISE_HAND = "RAISE_HAND",
  CLEAR_ROOM = "CLEAR_ROOM",
  TOGGLE_MUTE_AUDIO = "TOGGLE_MUTE_AUDIO",
  TOGGLE_USER_MUTE_AUDIO = "TOGGLE_USER_MUTE_AUDIO",
  UPDATE_USER_AUDIO_ROOM_ROLE = "UPDATE_USER_AUDIO_ROOM_ROLE",
  UPDATE_HOST_CONTROLS = "UPDATE_HOST_CONTROLS",
  ADD_TO_WAITLIST = "ADD_TO_WAITLIST",
  REMOVE_FROM_WAITLIST = "REMOVE_FROM_WAITLIST",
  UPDATE_SOCKET_ID = "UPDATE_SOCKET_ID",
  SET_CONNECTING = "SET_CONNECTING",
  TOGGLE_RECORDING = "TOGGLE_RECORDING",
  SET_RECORDING_URL = "SET_RECORDING_URL",
  SET_SHOW_RECORDING_MINIPLAYER = "SET_SHOW_RECORDING_MINIPLAYER",
  UPDATE_ROOMS_LIST = "UPDATE_ROOMS_LIST";
//SHOW_CALL_NOTIFICATION = "SHOW_CALL_NOTIFICATION";

export const REVIEW = "REVIEW";
export const SHOWLOGIN = "SHOWLOGIN";
export const SHOWSIGNUP = "SHOWSIGNUP";
