import React, { useEffect, useState } from "react";
import { ArrowBackIos } from "@material-ui/icons";
import { BriefUserDetails, LiveRoomFooter } from "./liveRoom";
import { inviteParticipant } from "../../webRTC";
import axios from "axios";
import { API_URL } from "../../constants/api";
import store from "../../store";
import SearchBar from "./searchBar";
import { ElipsDot } from "../messenger/gen.styles";
import { toast } from "react-toastify";

export const toggleInviteLoader = (loading, id) => {
  // show loader while waiting for user to accept call
  if (loading) {
    document
      .getElementById("invite-loader" + id)
      .classList.remove("hide-invite");
    document.getElementById("invite-btn" + id).classList.add("hide-invite");
  } else {
    document.getElementById("invite-loader" + id).classList.add("hide-invite");
    document.getElementById("invite-btn" + id).classList.remove("hide-invite");
  }
};

const InvitePeople = ({ setSegment, user, animate }) => {
  const [searchInvoked, setSearchInvoked] = useState(false);
  const [searchResults, setSearchResults] = useState([]);
  const [searching, setSearching] = useState(false);
  const room = store.getState().audioRoom.room;

  const searchInvoke = async (event) => {
    // TODO: implement search functionality
    axios
      .get(`${API_URL}/experts/search?query=${event.target.value}`)
      .then((_results) => {
        setSearchResults(_results.data);
      });
  };

  const _invite = async (_invitedUser) => {
    try {
      const audioElement = document.getElementById("audio-chatroom-element");
      toggleInviteLoader(true, _invitedUser._id);
      await inviteParticipant(room, _invitedUser, "Audience", false);
    } catch (error) {
      toast.error(error.message);
    }
  };

  const _goBack = () => {
    setSegment("live");
  };

  useEffect(() => {
    // fetch experts from the db
  }, []);

  return (
    <section className="audio-chat-segment invite-segment">
      <div className="audio-chat-header2 invite-participants-header">
        <ArrowBackIos onClick={_goBack}></ArrowBackIos>
        <div>
          <h2 className="">Invite People</h2>
          <p className="audio-chat-instructions">
            People will join as listeners first
          </p>
        </div>
      </div>
      <div className="audio-chat-body invite-participants-body">
        <SearchBar>
          <input
            placeholder="Search for people"
            type="text"
            onFocus={() => setSearchInvoked(true)}
            onChange={(e) => searchInvoke(e)}
          />
        </SearchBar>

        {!searchInvoked ? (
          <div className="audio-chat-inner-body invite-participants-list">
            {searching ? (
              <ElipsDot className="mt-10">
                <div></div>
                <div></div>
                <div></div>
                <div></div>
              </ElipsDot>
            ) : (
              <p className="text-center ">
                Type hint in searchbar to find users.
              </p>
            )}
          </div>
        ) : (
          <>
            <button
              className="btn chatroom-close-search"
              onClick={() => {
                setSearchInvoked(false);
              }}
            >
              Back to List
            </button>
            <div className="audio-chat-inner-body invite-participants-list">
              {searchResults.map((_user) => (
                <div key={_user._id}>
                  <BriefUserDetails user={_user} />
                  <button
                    id={"invite-btn" + _user._id}
                    className="btn participant-invite-btn"
                    onClick={() => _invite(_user)}
                  >
                    INVITE
                  </button>
                  <ElipsDot
                    className="mt-10 hide-invite"
                    id={"invite-loader" + _user._id}
                  >
                    <div></div>
                    <div></div>
                    <div></div>
                    <div></div>
                  </ElipsDot>
                </div>
              ))}
            </div>
          </>
        )}
      </div>
      <LiveRoomFooter animate={animate} setSegment={setSegment} />
    </section>
  );
};

export default InvitePeople;
