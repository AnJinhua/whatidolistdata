import { FaRegHandPointRight } from "react-icons/fa";
import { MdOutlineExplore } from "react-icons/md";
import { HiOutlineLightBulb } from "react-icons/hi";
import { BiMessageSquareDots } from "react-icons/bi";
import { AiOutlinePlusSquare } from "react-icons/ai";
import { SidebarContainer } from "./styles";
import SideFooter from "./SideFooter";
import UploadMedia from "./UploadMedia";
import { useHistory } from "react-router";
import { useSelector } from "react-redux";
import { useLocation } from "react-router-dom";
import CreateMediaModal from "../modals/CreateMediaModal";
import { useState } from "react";

const Sidebar = () => {
  const history = useHistory();
  const user = useSelector((state) => state.user.profile);
  const [openUPloadModal, setOpenUploadModal] = useState(false);

  const match = useLocation();
  let page = match?.state?.homePage ? match?.state?.homePage : "forYou";

  const goToMessage = () => history.push("/messages/ongoing");

  const clickedForYou = () => {
    history.push({
      state: { homePage: "forYou" },
    });
  };

  const clickedInspiring = () => {
    history.push({
      state: { homePage: "inspiring" },
    });
  };

  const clickedDiscover = () => {
    history.push({
      state: { homePage: "discover" },
    });
  };

  return (
    <SidebarContainer>
      <div className="home-container">
        <div
          className={page === "forYou" ? "home-focused" : "home"}
          onClick={clickedForYou}
        >
          <span className="home-icon">
            <FaRegHandPointRight className="icon you" />
          </span>
          <span className="home-text">for you</span>
        </div>
        <div
          className={page === "inspiring" ? "home-focused" : "home"}
          onClick={clickedInspiring}
        >
          <span className="home-icon">
            <HiOutlineLightBulb className="icon inspiring" />
          </span>
          <span className="home-text">inspiring</span>
        </div>
        {/* <div
          className={page === "discover" ? "home-focused" : "home"}
          onClick={clickedDiscover}
        >
          <span className="home-icon">
            <MdOutlineExplore className="icon explore" />
          </span>
          <span className="home-text">discover</span>
        </div> */}
      </div>

      {user?.slug && (
        <div className="home" onClick={goToMessage}>
          <span className="home-icon">
            <BiMessageSquareDots className="icon explore" />
          </span>
          <span className="home-text">messages</span>
        </div>
      )}

      {user?.slug && (
        <div className="home" onClick={() => setOpenUploadModal(true)}>
          <span className="home-icon">
            <AiOutlinePlusSquare className="icon upload" />
          </span>
        </div>
      )}

      {user?.slug && (
        <CreateMediaModal
          openMediaModal={openUPloadModal}
          setOpenMediaModal={setOpenUploadModal}
        />
      )}
      {user?.slug && <UploadMedia />}

      {/* <Discover />
          <SuggestedAccounts
            fetchAllUsers={fetchAllUsers}
            allUsers={allUsers}
          /> */}
      <SideFooter />
    </SidebarContainer>
  );
};

export default Sidebar;
