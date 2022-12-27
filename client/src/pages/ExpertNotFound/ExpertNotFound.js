import React from "react";
import img404 from "../../assets/404-error.png";
import { Link } from "react-router-dom";
import "./ExpertNotFound.css";
const ExpertNotFound = () => {
  return (
    <div className="con-404">
      <img loading="lazy" className="img-404" src={img404} alt="404" />

      <div className="text-404">
        This users profile has been deleted or doesn't exist
      </div>
      <Link to="/" className="link-404" style={{ textDecoration: "none" }}>
        <div className="btn-404">HOME</div>
      </Link>
    </div>
  );
};

export default ExpertNotFound;
