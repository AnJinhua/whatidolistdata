import { useSelector } from "react-redux";
import { HomeContainer } from "./styles";
import Sidebar from "./newCard/Sidebar";
import VideoContent from "./newCard/VideoContent";
import Inspiring from "./newCard/Inspiring";
import Discover from "./newCard/Discover";
import { useLocation } from "react-router-dom";

function Home() {
  const match = useLocation();
  const page = match?.state?.homePage;

  return (
    <HomeContainer>
      <Sidebar />

      {!page && <VideoContent />}
      {page === "forYou" && <VideoContent />}
      {page === "inspiring" && <Inspiring />}
      {page === "discover" && <Discover />}
    </HomeContainer>
  );
}

export default Home;
