import { useState, useEffect, useContext } from "react";
import { useCookies } from "react-cookie";
import { useDispatch, useSelector } from "react-redux";
import { useHistory } from "react-router-dom";
import { SEARCH_VISIBILITY } from "../../constants/actions";
import {
  HeaderContainer,
  MenuContainer,
  MenuIcon,
  MediumScreenContainer,
  OuterContainer,
  DropDownContainer,
  DropDown,
  MobieSearchCon,
  SearchContainer,
  Cancel,
  SearchInput,
  SearchIcon,
  SearchBtn,
  SearchBtnContainer,
  LinkContainer,
  HomeIcon,
  FlexContainer,
  Logo,
  ProfileIcon,
  MessagesIcon,
  NotificationIcon,
} from "./HeaderComponents/styles.component";
import OptionLink from "./HeaderComponents/OptionLink";
import ClickAwayListener from "@material-ui/core/ClickAwayListener";
import { connect } from "react-redux";
import { setSearch } from "../../actions/searchAction";
import axios from "axios";
import { API_URL } from "../../constants/api";
import { storeOnlineUser, socket } from "../../actions/messenger";
import logo from "../../assets/logo.svg";

import { useSWRConfig } from "swr";
import Search from "./SearchComponet/Search";
import { TransactionContext } from "../../context/TransactionContext";

function HeaderTemplate({
  setSearch,
  authenticated,
  setUserLogin,
  setUserSignup,
}) {
  const [{ user }] = useCookies();
  const [isNavOpen, setIsNavOpen] = useState(false);
  const [username, setUsername] = useState();
  const { searchshow } = useSelector((state) => state.searchvalue);
  const dispatch = useDispatch();
  const history = useHistory();
  const { mutate } = useSWRConfig();

  const unreadUrl = `${API_URL}/message/unread/user/${user?.slug}`;

  const { connectWallet, currentAccount, walletBalance, setToggleSidebar } =
    useContext(TransactionContext);

  // const checkEthereum = () => {
  //   if (!window.ethereum) {
  //     return window.open("https://metamask.io/download/", "_blank");
  //   } else {
  //     connectWallet();
  //   }
  // };

  useEffect(() => {
    setUsername(
      `${currentAccount?.slice(0, 5)}...${currentAccount?.slice(-4)}`
    );
  }, [currentAccount]);

  //useEffect for socket connection
  useEffect(() => {
    socket.on("connect", () => {
      //add new user
      socket.emit("addUser", user?.slug);
    });

    //store a user when a user comes online
    socket.on("getUsers", (allUsers) => {
      dispatch(storeOnlineUser(allUsers));
    });

    socket.on("getMessage", () => {
      mutate(unreadUrl, { reload: true });
    });
  }, [dispatch, mutate, unreadUrl, user?.slug]);

  let cancelToken;

  const handleClickAway = async () => {
    setIsNavOpen(false);
  };

  useEffect(() => {
    return history.listen(() => {
      setSearch([]);
      cancelSearch();
    });
  }, [history, setSearch]);

  const searchInvoke = async (e) => {
    if (cancelToken) {
      cancelToken.cancel("Operations cancelled due to new request");
    }
    history.listen((location) => {
      e.target.value = "";
    });

    cancelToken = axios.CancelToken.source();
    let results;

    try {
      if (e.target.value && e.target.value.length >= 1) {
        results = await axios.get(
          `${API_URL}/getExpertsListingByKeyword/&${e.target.value}`,
          {
            cancelToken: cancelToken.token,
          }
        );
      } else {
        setSearch([]);
      }
    } catch (e) {}

    if (results?.data.length > 0) {
      setSearch(results?.data);
    } else {
      setSearch([]);
    }
  };

  const showSearch = () => {
    dispatch({
      type: SEARCH_VISIBILITY,
      payload: true,
    });
  };
  const cancelSearch = () => {
    dispatch({
      type: SEARCH_VISIBILITY,
      payload: false,
    });
    setSearch([]);
  };

  useEffect(() => {
    // Handler to call on window resize
    function handleResize() {
      // Set window width/height to state
      if (window.innerWidth > 786) {
        cancelSearch();
      }
    }

    // Add event listener
    window.addEventListener("resize", handleResize);
    // Call handler right away so state gets updated with initial window size
    handleResize();
    // Remove event listener on cleanup
    return () => window.removeEventListener("resize", handleResize);
  }, []); // Empty array ensures that effect is only run on mount

  if (window.location.pathname.split("/")[1] === "finishsignUp") {
    return null;
  }

  if (window.location.pathname.split("/")[1] === "register") {
    return null;
  }

  return (
    <>
      <OuterContainer>
        <ClickAwayListener onClickAway={handleClickAway}>
          <div>
            {searchshow && (
              <MobieSearchCon>
                <SearchContainer>
                  <SearchIcon />
                  <SearchInput
                    placeholder="search"
                    type="text"
                    onChange={(e) => searchInvoke(e)}
                  />
                </SearchContainer>
                <Cancel onClick={cancelSearch}>Cancel</Cancel>
              </MobieSearchCon>
            )}
            {!searchshow && (
              <DropDownContainer>
                <HeaderContainer>
                  <Logo to="/">
                    <img
                      loading="lazy"
                      className="svh-logo"
                      src={logo}
                      alt="logo"
                    />
                  </Logo>

                  <MediumScreenContainer>
                    <Search setSearch={setSearch} />

                    <FlexContainer>
                      <LinkContainer to="/">
                        <HomeIcon className="icon" />
                        <h3 className="spaced">home</h3>
                      </LinkContainer>
                      {!authenticated && (
                        <LinkContainer to="/" onClick={setUserLogin}>
                          <h3 className="spaced">login</h3>
                        </LinkContainer>
                      )}
                      {!authenticated && (
                        <LinkContainer to="/" onClick={setUserSignup}>
                          <h3 className="spaced">join</h3>
                        </LinkContainer>
                      )}
                      <LinkContainer to="/map">
                        <h3 className="spaced">map</h3>
                      </LinkContainer>

                      {authenticated && (
                        <LinkContainer to="/rooms">
                          <h3 className="spaced">audio rooms</h3>
                        </LinkContainer>
                      )}

                      {!authenticated && (
                        <LinkContainer to="/how-it-works">
                          <h3 className="spaced">support</h3>
                        </LinkContainer>
                      )}

                      {!authenticated && (
                        <LinkContainer to="/contact-us">
                          <h3>contact</h3>
                        </LinkContainer>
                      )}
                    </FlexContainer>
                  </MediumScreenContainer>

                  <MenuContainer>
                    <SearchBtnContainer onClick={showSearch}>
                      <SearchBtn />
                    </SearchBtnContainer>

                    {authenticated && <OptionLink />}
                  </MenuContainer>
                </HeaderContainer>

                <DropDown>
                  <LinkContainer
                    className="icon-link"
                    to="/"
                    onClick={handleClickAway}
                  >
                    <HomeIcon className="icon" />
                  </LinkContainer>
                  {/* {!authenticated && (
                    <LinkContainer className="icon-link" onClick={setUserLogin}>
                      <HomeIcon className="icon" />
                    </LinkContainer>
                  )}
                  {!authenticated && (
                    <LinkContainer className="icon-link"
                      onClick={() => {
                        handleClickAway();
                        setUserSignup();
                      }}
                    >
                      <HomeIcon className="icon" />
                    </LinkContainer>
                  )} */}

                  {authenticated && (
                    <LinkContainer
                      className="icon-link"
                      to="/messages/ongoing/"
                      onClick={handleClickAway}
                    >
                      <MessagesIcon className="icon" />
                    </LinkContainer>
                  )}
                  <LinkContainer
                    className="icon-link"
                    onClick={handleClickAway}
                    to="/notifications"
                  >
                    <NotificationIcon className="icon" />
                  </LinkContainer>
                  <LinkContainer
                    className="icon-link"
                    onClick={handleClickAway}
                    to="/profile"
                  >
                    <ProfileIcon className="icon" />
                  </LinkContainer>

                  {/* {!authenticated && (
                    <LinkContainer
                      className="icon-link"
                      to="/inspired"
                      onClick={handleClickAway}
                    >
                      <HomeIcon className="icon" />
                    </LinkContainer>
                  )} */}
                  {/* {!authenticated && (
                    <LinkContainer
                      className="icon-link"
                      onClick={handleClickAway}
                      to="/contact-us"
                    >
                      <HomeIcon className="icon" />
                    </LinkContainer>
                  )} */}

                  {/* {authenticated && (
                    <div
                      onClick={() => {
                        setIsNavOpen(false);
                        setToggleSidebar(true);
                      }}
                      className="dropdown-item"
                    >
                      <button className="connect-wallet-btn">
                        connect wallet
                      </button>
                    </div>
                  )} */}
                </DropDown>
              </DropDownContainer>
            )}
          </div>
        </ClickAwayListener>
      </OuterContainer>
    </>
  );
}

const mapStateToProps = (state) => ({
  authenticated: state.auth.authenticated,
});

export default connect(mapStateToProps, { setSearch })(HeaderTemplate);
