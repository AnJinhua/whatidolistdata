import { FETCH_CATEGORIES_SUCCESS } from "../constants/actions";

export default function categoriesReducer(state = [], action) {
  switch (action.type) {
    case FETCH_CATEGORIES_SUCCESS:
      return action.categories;
    default:
      return state;
  }
}
