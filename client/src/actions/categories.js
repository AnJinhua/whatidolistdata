import axios from "axios";
import { FETCH_CATEGORIES_SUCCESS } from "../constants/actions";
import { API_URL } from "../constants/api";

const fetchCategories = async () => {
  const _res = await axios.get(`${API_URL}/getExpertsCategoryList`);
  return { type: FETCH_CATEGORIES_SUCCESS, categories: _res.data };
};

export const loadCategories = () => fetchCategories();
