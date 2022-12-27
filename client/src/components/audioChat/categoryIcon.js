import React from "react";
// import { SportsFootball, Code, School } from "@material-ui/icons";
import {
  FcSportsMode,
  FcGraduationCap,
  FcBinoculars,
  FcMultipleDevices,
  FcVoicePresentation,
  FcMindMap,
  FcCollaboration,
  FcBusiness,
  FcServices,
} from "react-icons/fc";
import { GiMusicalScore } from "react-icons/gi";
import { FaLanguage } from "react-icons/fa";

const CategoryIcon = ({ category }) => {
  const categoryIcon = {
    "academic-tutoring": <FcGraduationCap></FcGraduationCap>,
    "academic-advising-career-advice": (
      <FcVoicePresentation></FcVoicePresentation>
    ),
    "computer-skills": <FcMultipleDevices></FcMultipleDevices>,
    creative: <FcMindMap></FcMindMap>,
    "discussion-forum": <FcCollaboration></FcCollaboration>,
    languages: <FaLanguage></FaLanguage>,
    "music-lessons": <GiMusicalScore></GiMusicalScore>,
    "sports-fitness": <FcSportsMode></FcSportsMode>,
    "trade-skill": <FcBusiness></FcBusiness>,
    "travel-advice": <FcBinoculars></FcBinoculars>,
  };
  return <span>{categoryIcon[category] || <FcServices></FcServices>}</span>;
};

export default CategoryIcon;
