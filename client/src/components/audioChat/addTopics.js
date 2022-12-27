import React, { useEffect, useState } from "react";
import {
  ArrowBackIos,
  ArrowForwardIos,
  KeyboardArrowDown,
  Add,
} from "@material-ui/icons";
import CategoryIcon from "./categoryIcon";
import { ElipsDot } from "../messenger/gen.styles";
import { loadCategories } from "../../actions/categories";
import SearchBar from "./searchBar";
import store from "../../store";
import { useSelector } from "react-redux";

export const TopicsList = ({
  list,
  setRoom,
  room,
  addOption,
  addTopics,
  setError,
  noClick,
}) => {
  const toggleAddTopic = (event) => {
    const _topic = JSON.parse(event.target.dataset.item);
    // check if topic is already on list
    const _topicIndex = room.topics.findIndex(
      (_value) => _value.name === _topic.name
    );
    if (_topicIndex === -1) {
      // check if topics have reached 3 before adding
      if (room.topics.length < 3) {
        // add if not in list of topics
        setRoom({ ...room, topics: [...room.topics, _topic] });
      } else {
        //   TODO:
        if (!addOption) setError("Sorry! Maximum allowed topics is 3");
      }
    } else {
      // remove topic from list
      const _newTopics = room.topics;
      _newTopics.splice(_topicIndex, 1);
      setRoom({ ...room, topics: _newTopics });

      if (!addOption) setError("");
      // TODO: rerender subcategories to update ui
    }
  };

  // highlight selected topic buttons
  const highlightButton = (_topic) => {
    if (room) {
      return room.topics.find((_value) => _value.slug === _topic)
        ? "highlighted-sub-category"
        : "";
    }
  };

  return (
    <div className="sub-categories-list">
      {addOption ? (
        <button className="add-topic sub-category-btn" onClick={addTopics}>
          <Add></Add>
        </button>
      ) : null}
      {list.map((_sub) => (
        <button
          className={`sub-category-btn ${highlightButton(_sub.slug)}`}
          data-item={JSON.stringify(_sub)}
          key={_sub.slug || _sub.name}
          onClick={noClick ? () => {} : toggleAddTopic}
        >
          {_sub.name}
        </button>
      ))}
    </div>
  );
};

const AddTopics = ({ room, animate, setRoom, setSegment }) => {
  const [showSubCategories, setShowSubCategories] = useState(false);
  const [error, setError] = useState("");
  const [searchInvoked, setSearchInvoked] = useState(false);
  const [searchResults, setSearchResults] = useState([]);
  const [fetching, setFetching] = useState(false);
  const categoriesList = useSelector((state) => state.categories);

  //if catgories list and empty and fetching hasn't started yet
  if (categoriesList.length < 1 && fetching === false) {
    setFetching(true);
    loadCategories().then((categories) => {
      store.dispatch(categories);
      setFetching(false);
    });
  }

  const searchInvoke = (evt) => {
    // TODO: implement search functionality
    const _searchValue = evt.target.value;
    const _searchResults = categoriesList.reduce((initialValue, _category) => {
      return initialValue.concat(
        _category.subcategories.filter((_sub) =>
          _sub.name.includes(_searchValue)
        )
      );
    }, []);

    setSearchResults(_searchResults);
  };

  const _saveTopics = () => {
    //  TODO: saved successfully notifications
    setSegment("create");
  };

  const toggleShowSubCategories = (_category) => {
    setShowSubCategories(
      _category === showSubCategories ? !_category : _category
    );
  };

  // useEffect(() => {
  //   // check if categories list is in store
  //   (async () => {
  //     if (store.getState().categories.length) return;
  //     store.dispatch(await loadCategories());
  //   })();

  //   store.subscribe(() => {
  //     const storeCategories = store.getState().categories;
  //     if (storeCategories) {
  //       setCategoriesList(storeCategories);
  //       setFetching(false);
  //     }
  //   });
  // }, []);

  return (
    <section className="audio-chat-segment add-topics-segment">
      <div className="audio-chat-header2 add-topics-header">
        <ArrowBackIos onClick={_saveTopics}></ArrowBackIos>
        <h2 className="">add topics</h2>
      </div>
      <div className="audio-chat-body">
        <p className="audio-chat-instructions text-center">
          Help people dicover your room by adding relevant topics. Select upto 3
        </p>
        <SearchBar>
          <input
            placeholder="Search topics..."
            type="text"
            onFocus={() => setSearchInvoked(true)}
            onChange={(e) => searchInvoke(e)}
          />
        </SearchBar>
        {!searchInvoked ? (
          <div className="audio-chat-inner-body">
            <h3>Categories</h3>
            {fetching ? (
              <div className="minimized-room-loader-container">
                <ElipsDot className="mt-10">
                  <div></div>
                  <div></div>
                  <div></div>
                  <div></div>
                </ElipsDot>
              </div>
            ) : (
              categoriesList.map((_category) => (
                <div className="category-item" key={_category.slug}>
                  <button
                    className="category-dropdown-btn btn"
                    onClick={() => toggleShowSubCategories(_category.slug)}
                  >
                    <CategoryIcon
                      key={_category.slug}
                      category={_category.slug}
                    />
                    <p>
                      <span>{_category.name}</span>
                      {showSubCategories === _category.slug &&
                      room.topics.length > 0 ? (
                        <span className="topics-selected-count">
                          {room.topics.length}
                        </span>
                      ) : null}
                    </p>
                    {showSubCategories === _category.slug ? (
                      <KeyboardArrowDown className="down-arrow-svg"></KeyboardArrowDown>
                    ) : (
                      <ArrowForwardIos></ArrowForwardIos>
                    )}
                  </button>
                  {showSubCategories === _category.slug ? (
                    <TopicsList
                      list={_category.subcategories}
                      room={room}
                      setRoom={setRoom}
                      setError={setError}
                    />
                  ) : null}
                </div>
              ))
            )}
          </div>
        ) : (
          <div className="audio-chat-inner-body">
            <button
              className="btn chatroom-close-search"
              onClick={() => {
                setSearchInvoked(false);
              }}
            >
              Back to categories
            </button>

            {searchResults.length ? (
              <TopicsList
                list={searchResults}
                room={room}
                setRoom={setRoom}
                setError={setError}
              />
            ) : null}
          </div>
        )}
      </div>
      <div className="audio-chat-body-foot">
        <p className="audio-chat-instructions">
          {error ? (
            <span className="chatroom-error-message">{error}</span>
          ) : (
            <span>{`${room.topics.length} Selected (max 3)`}</span>
          )}
        </p>
        <button className="btn save-topics-btn" onClick={_saveTopics}>
          Save
        </button>
      </div>
    </section>
  );
};

export default AddTopics;
