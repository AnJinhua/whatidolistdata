import React from "react";
import { BiSearchAlt } from "react-icons/bi";

const SearchBar = ({ children }) => {
  return (
    <div className="audiochat-search-container">
      <BiSearchAlt className="" />
      {children}
    </div>
  );
};


export default SearchBar;
