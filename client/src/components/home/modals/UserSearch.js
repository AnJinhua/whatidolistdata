import { FindUserContainer } from "./styles";
// import { ElipsDot } from "../../messenger/chatList/List/styles";
import { IoMdClose } from "react-icons/io";

import { useState, useCallback, useEffect } from "react";
import axios from "axios";
import { API_URL } from "../../../constants/api";
import useSWR from "swr";
import { useCookies } from "react-cookie";

const UserCard = ({ searchUser, setSelectedUser, selectedUser }) => {
  const selected = selectedUser.find((slug) => slug === searchUser.slug);

  const select = () => {
    !selected
      ? setSelectedUser((prev) => [...prev, searchUser.slug])
      : setSelectedUser((prev) => [
          ...prev.filter((unSelect) => unSelect !== searchUser.slug),
        ]);
  };

  return (
    <div className="user-container" onClick={select}>
      <div className="user-flex">
        <img
          loading="lazy"
          className="avatar-img"
          src={
            searchUser?.imageUrl?.cdnUrl
              ? searchUser?.imageUrl?.cdnUrl
              : "/img/profile.png"
          }
          alt="profile "
        />

        {/* {!user ? (
            <ElipsDot>
              <div></div>
              <div></div>
              <div></div>
              <div></div>
            </ElipsDot>
          ) : ( */}
        <div className="user-name">
          <p className="text-lg">
            {searchUser.profile.firstName}
            {"  "}
            {searchUser.profile.lastName}
          </p>
          <p className="text-sm">
            {" "}
            expert in {searchUser?.expertCategories[0]}
          </p>
        </div>
        {/* )} */}
      </div>

      <input type="checkbox" checked={selected} className="select" readOnly />
    </div>
  );
};

const UserTag = ({ userSelect, setSelectedUser }) => {
  return (
    <div
      className="user-tag"
      onClick={() =>
        setSelectedUser((prev) => [
          ...prev.filter((unSelect) => unSelect !== userSelect),
        ])
      }
    >
      <p>{userSelect}</p>
      <IoMdClose className="tag-icon" />
    </div>
  );
};

function UserSearch({ setSelectedUser, selectedUser }) {
  const [search, setSearch] = useState([]);
  const [cookies] = useCookies(["user"]);
  const slug = cookies?.user?.slug;
  const url = `${API_URL}/feed/recent-messaged-users/${slug}`;
  const { data: conversationUsers } = useSWR(url);

  const conversationUser = useCallback(() => {
    conversationUsers?.forEach((friendSlug) => {
      const userUrl = `${API_URL}/getExpertDetail/${friendSlug}`;
      axios.get(userUrl).then((convUser) => {
        setSearch((prev) => {
          const index = prev.findIndex(
            (object) => object.slug === convUser.data.data.slug
          );
          if (index === -1) {
            return [...prev, convUser.data.data];
          } else {
            return prev;
          }
        });
      });
    });
  }, [conversationUsers]);

  const CancelToken = axios.CancelToken;
  let cancel;

  const searchInvoke = async (e) => {
    if (cancel) {
      cancel("Operations cancelled due to new request");
    }

    let results;

    try {
      if (e.target.value && e.target.value.length >= 1) {
        results = await axios.get(
          `${API_URL}/getExpertsListingByKeyword/&${e.target.value}`,
          {
            cancelToken: new CancelToken(function executor(c) {
              cancel = c;
            }),
          }
        );
      } else {
        setSearch([]);
        conversationUser();
      }
    } catch (e) {}

    if (results?.data.length > 0) {
      setSearch(results?.data);
    } else {
      setSearch([]);
      conversationUser();
    }
  };

  useEffect(() => {
    conversationUser();
  }, [conversationUser]);

  return (
    <FindUserContainer>
      <div className="user-search-container">
        <p className="share-text">to: </p>
        <div className="search-tag-container">
          {selectedUser.map((userSelect) => (
            <UserTag
              userSelect={userSelect}
              setSelectedUser={setSelectedUser}
            />
          ))}
          <input
            type="text"
            className="share-search-input"
            placeholder="search..."
            onChange={searchInvoke}
          />
        </div>
      </div>
      <div className="user-list-container">
        {search.map((searchUser) => (
          <UserCard
            searchUser={searchUser}
            setSelectedUser={setSelectedUser}
            selectedUser={selectedUser}
          />
        ))}
      </div>
    </FindUserContainer>
  );
}

export default UserSearch;
