import {
    PROTECTED_TEST,
    CREATE_EXPERT,
  } from "../constants/actions";
  
  const INITIAL_STATE = {
    message: "",
    error: "",
    customer: {},
  };
  
  export default function expertReducer(state = INITIAL_STATE, action) {
    switch (action.type) {
     
      case CREATE_EXPERT:
        console.log("in reducer CREATE_EXPERT " + JSON.stringify(action));
        return {
          ...state,
          message: action.payload.message,
        };
      case PROTECTED_TEST:
        return {
          ...state,
          error: action.payload.message,
        };
      default:
        return state;
    }
  }
  