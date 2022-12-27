import React from "react";
import { AutoCompleteContainer } from "./styles";

function AutoComplete({ universityList, setValue, setShowUniversities }) {
  return (
    <AutoCompleteContainer>
      {universityList.map((university) => (
        <p
          onClick={() => {
            setValue("university", university.name);
            setShowUniversities(false);
          }}
          className="university"
        >
          {university.name}
        </p>
      ))}
    </AutoCompleteContainer>
  );
}

export default AutoComplete;
