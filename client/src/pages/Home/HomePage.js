import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import Skeleton from "react-loading-skeleton";
import { useHistory } from "react-router-dom";
import Masonry from "react-masonry-component";
import { useCookies } from "react-cookie";
import { fetchList } from "../../actions/list";
import { setPage } from "../../actions/setPage";
import Home from "../../components/home/index";

import useSWR from "swr";
import { API_URL } from "../../constants/api";
import MobileSearch from "../../components/template/SearchComponet/MobileSearch";

const HomePage = () => {
  const [windowSize, setWindowSize] = useState({
    width: undefined,
    height: undefined,
  });

  const catigoryList = useSelector((state) => state.list);
  const searchvalue = useSelector((state) => state.searchvalue.searchval);
  const { List, loading } = catigoryList;
  const profile = useSelector((state) => state.user.profile);
  const dispatch = useDispatch();
  const history = useHistory();
  const masonryOptions = {
    transitionDuration: 0,
  };

  const { data, error } = useSWR(`${API_URL}/getExpertsCategoryList`);
  const { data: stripeAccount } = useSWR(
    `${API_URL}/stripe-connect/accounts/${profile?.slug}`
  );

  useEffect(() => {
    // Handler to call on window resize
    function handleResize() {
      // Set window width/height to state
      setWindowSize({
        width: window.innerWidth,
        height: window.innerHeight,
      });
    }

    // Add event listener
    window.addEventListener("resize", handleResize);
    // Call handler right away so state gets updated with initial window size
    handleResize();
    // Remove event listener on cleanup
    return () => window.removeEventListener("resize", handleResize);
  }, []); // Empty array ensures that effect is only run on mount

  useEffect(() => {
    setPage("HOME");
    if (data) {
      dispatch(fetchList(data));
    }
  }, [dispatch, data]);

  const renderloading = () => {
    return (
      <img
        loading="lazy"
        height="100"
        width="60"
        style={{
          marginTop: "20px",
          marginBottom: "20px",
        }}
        className="loader-center"
        src="/img/Pulse-sm.svg"
        alt="loader"
      />
      // <Skeleton style={{ width: 60, height: 100 }} />
    );
  };

  const renderError = () => {
    return (
      <div className="error-message">
        An Error has occured Check your network: {error}
      </div>
    );
  };

  const getClassName = (categoryName) => {
    return "col-md-3 cat-visible";
  };
  const getCategoryLink = (categorySlug, categoryName, expertNumbers) => {
    if (categorySlug === "forum") {
      return (
        <Link to={`/${categoryName}`}>
          {categoryName} {expertNumbers > 0 ? "(" + expertNumbers + ")" : ""}
        </Link>
      );
    } else {
      return (
        <Link to={`/list/${categorySlug}`}>
          {categoryName} {expertNumbers > 0 ? "(" + expertNumbers + ")" : ""}
        </Link>
      );
    }
  };

  const renderPosts = () => {
    return <Home />;
  };

  const render = () => {
    if (error != null) {
      return renderError();
    }
    if (loading) {
      return renderloading();
    }

    if (List) {
      return renderPosts();
    }

    return renderError();
  };

  return render();
};

export default HomePage;
