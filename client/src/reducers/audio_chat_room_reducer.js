import {
  ADD_PARTICIPANT,
  CREATE_ROOM,
  CREATING_ROOM,
  ROOM_CREATED,
  PARTICIPANT_LEFT,
  ATTACH_MEDIA_STREAM,
  TOGGLE_USER_MUTE_AUDIO,
  RAISE_HAND,
  TOGGLE_MUTE_AUDIO,
  UPDATE_USER_AUDIO_ROOM_ROLE,
  UPDATE_HOST_CONTROLS,
  ADD_TO_WAITLIST,
  REMOVE_FROM_WAITLIST,
  LOAD_ROOMS_LIST,
  SET_CONNECTING,
  CLEAR_ROOM,
  UPDATE_SOCKET_ID,
  TOGGLE_RECORDING,
  UPDATE_ROOMS_LIST,
  SET_RECORDING_URL,
  SET_SHOW_RECORDING_MINIPLAYER,
  //SHOW_CALL_NOTIFICATION,
} from "../constants/actions";

const INITIAL_STATE = {
  room: {
    id: "",
    title: "",
    topics: [], //a topic looks lke { name: "Another Topic", slug: "another-topic" },
    hosts: [], // a participant looks like {firstName: "", lastName: "", audioRoomRole: "", "profileImage: ""}
    speakers: [],
    otherUsers: [],
  },
  waitList: [],
  muted: false,
  hostControls: false,
  socketId: undefined,
  isOpen: false,
  connecting: false,
  isRecording: false,
  roomsList: [],
  showRecordingMiniplayer: false,
  recordingUrl: "",
};

export default function audioRoomReducer(state = INITIAL_STATE, action) {
  let key = "hosts";

  switch (action.type) {
    case CREATE_ROOM:
      state = { ...state, room: action.payload, isOpen: true };

      return state;
    case CLEAR_ROOM:
      state = {
        ...state,
        room: INITIAL_STATE.room,
        waitList: [],
        muted: false,
        hostControls: false,
        isOpen: false,
      };
      return state;
    case ADD_PARTICIPANT:
      const allParticipants = [
        ...state.room.hosts,
        ...state.room.speakers,
        ...state.room.otherUsers,
      ];

      if (
        allParticipants.some((participant) => {
          console.log(
            `compare users  in room ${action.payload.id}, ${participant.id}, ${participant.id}`
          );
          return participant.id === action.payload.id;
        })
      ) {
        console.log("found user");
        return state;
      }

      switch (action.payload.audioRoomRole) {
        case "Host":
          state = {
            ...state,
            room: {
              ...state.room,
              hosts: [...state.room.hosts, action.payload],
            },
          };
          break;
        case "Co-host":
          state = {
            ...state,
            room: {
              ...state.room,
              hosts: [...state.room.hosts, action.payload],
            },
          };
          break;
        case "Speaker":
          state = {
            ...state,
            room: {
              ...state.room,
              speakers: [...state.room.speakers, action.payload],
            },
          };
          break;
        case "Audience":
          state = {
            ...state,
            room: {
              ...state.room,
              otherUsers: [...state.room.otherUsers, action.payload],
            },
          };
          break;
        default:
          state = {
            ...state,
            room: {
              ...state.room,
              otherUsers: [...state.room.otherUsers, action.payload],
            },
          };
      }

      return state;

    case PARTICIPANT_LEFT:
      key = findUserKey(state, action.payload);

      state.room[key] = state.room[key].filter(
        (participant) => action.payload !== participant.id
      );

      state = { ...state, room: { ...state.room, [key]: state.room[key] } };

      return state;

    case ROOM_CREATED:
      state = { ...state, roomCreated: action.payload };

      return state;
    case CREATING_ROOM:
      state = { ...state, creatingRoom: action.payload };
      return state;
    case RAISE_HAND:
      key = findUserKey(state, action.payload.userId);

      state.room[key] = state.room[key].map((participant) => {
        return participant.id === action.payload.userId
          ? { ...participant, handRaised: action.payload.handRaised }
          : participant;
      });

      state = { ...state, room: { ...state.room, [key]: state.room[key] } };

      // if the id on he payload is of currently logged in user, then also set the root property handRaised
      if (action.payload.self) {
        state = {
          ...state,
          handRaised: action.payload.handRaised,
        };
      }

      return state;
    case TOGGLE_MUTE_AUDIO:
      state = { ...state, muted: !state.muted };
      return state;
    case TOGGLE_USER_MUTE_AUDIO:
      key = findUserKey(state, action.payload.userId);

      state.room[key] = state.room[key].map((participant) => {
        return participant.id === action.payload.userId ||
          participant.id === action.payload.userId
          ? { ...participant, isMuted: action.payload.isMuted }
          : participant;
      });

      state = { ...state, room: { ...state.room, [key]: state.room[key] } };

      return state;
    case UPDATE_USER_AUDIO_ROOM_ROLE:
      console.log("try change role", action);
      key = findUserKey(state, action.payload.userId);
      let updatedParticipant;
      console.log("current user role", key);

      state.room[key] = state.room[key].filter((participant) => {
        if (participant.id === action.payload.userId) {
          updatedParticipant = {
            ...participant,
            audioRoomRole: action.payload.role,
          };

          console.log("updated participant", updatedParticipant);

          updateRoleInState(state, updatedParticipant);
          return false;
        }
        return true;
      });

      state = { ...state, room: { ...state.room, [key]: state.room[key] } };
      return state;
    case UPDATE_HOST_CONTROLS:
      state = { ...state, hostControls: action.payload.isEnabled };
      return state;
    case UPDATE_SOCKET_ID:
      state = { ...state, socketId: action.payload };
      return state;
    case ADD_TO_WAITLIST:
      if (
        state.waitList.some((participant) => {
          console.log(
            `compare users  in waitlist ${action.payload.id}, ${participant.id}, ${participant.id}`
          );
          return participant.id === action.payload.id;
        })
      ) {
        console.log("found user");
        return state;
      }
      state = { ...state, waitList: [...state.waitList, action.payload] };
      return state;
    case REMOVE_FROM_WAITLIST:
      console.log("try to remove from waitlist", action);
      const newWaitList = state.waitList.filter(
        (user) => user.id !== action.payload.id
      );
      console.log("new waitlist", newWaitList);
      state = {
        ...state,
        waitList: newWaitList,
      };
      console.log("new waitlist from store", state.waitList);
      return state;
    case SET_CONNECTING:
      state = { ...state, connecting: action.payload };
      return state;
    case TOGGLE_RECORDING:
      state = { ...state, isRecording: action.payload };
      return state;
    case UPDATE_ROOMS_LIST:
      if (state.roomsList.some((room) => room.id === action.payload[0].id)) {
        console.log(
          "duplicate room found so not adding " + action.payload[0].title
        );
        return state;
      }
      state = { ...state, roomsList: [...state.roomsList, ...action.payload] };
      return state;
    case SET_RECORDING_URL:
      state = { ...state, recordingUrl: action.payload };
      return state;
    case SET_SHOW_RECORDING_MINIPLAYER:
      state = { ...state, showRecordingMiniplayer: action.payload };
      return state;
    default:
      return state;
  }
}

function findUserKey(state, userId) {
  let participant = state.room.hosts.find(
    (participant) => participant.id === userId
  );
  let key = "hosts";

  if (participant === undefined) {
    participant = state.room.speakers.find(
      (participant) => participant.id === userId
    );
    key = "speakers";
  }
  if (participant === undefined) {
    participant = state.room.otherUsers.find(
      (participant) => participant.id === userId
    );
    key = "otherUsers";
  }

  return key;
}

function updateRoleInState(state, participant) {
  switch (participant.audioRoomRole) {
    case "Host":
      state.room["hosts"] = [...state.room.hosts, participant];
      break;
    case "Co-host":
      state.room["hosts"] = [...state.room.hosts, participant];
      break;
    case "Speaker":
      state.room["speakers"] = [...state.room.speakers, participant];
      break;
    case "Audeince":
      state.room["otherUsers"] = [...state.room.otherUsers, participant];
      break;
    default:
      state.room["otherUsers"] = [...state.room.otherUsers, participant];
      break;
  }
}
