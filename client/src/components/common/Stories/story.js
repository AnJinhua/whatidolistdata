import Zuck from "zuck.js";
import React from "react";

function storyBuilder(story) {
  return Zuck.buildTimelineItem(
    story._id + story.timestamp,
    story.thumbnail,
    "",
    "",
    story.timestamp,
    [
      [
        story._id,
        story.storyType,
        story.timeLimit,
        story.link,
        "",
        "",
        false,
        false,
        story.timestamp,
      ],
      // ["storyID", "storyType", timelimit, "Image/Video Link", "", 'Link to the web', 'Text for the Link', false, "timestamp"]
    ]
  );
}

class Stories extends React.Component {
  constructor(props) {
    super(props);

    // React ^16.3
    // this.storiesElement = React.createRef();

    this.storiesElement = null;
    this.storiesApi = null;
    var stories = [];
    for (let key in this.props.stories) {
      stories = [storyBuilder(this.props.stories[key])].concat(stories);
    }
    this.state = {
      stories: stories,
    };
  }

  componentDidMount() {
    this.storiesApi = new Zuck("stories-donnyslist", {
      backNative: true,
      previousTap: true,
      skin: "Snapgram",
      avatars: true,
      list: false,
      autoFullScreen: true,
      cubeEffect: true,
      paginationArrows: false,
      localStorage: true,
      stories: this.state.stories,
      reactive: true,
      callbacks: {
        onDataUpdate: function (currentState, callback) {
          this.setState(
            (state) => {
              state.stories = currentState;

              return state;
            },
            () => {
              callback();
            }
          );
        }.bind(this),
      },
    });
  }

  render() {
    const timelineItems = [];

    this.state.stories.forEach((story, storyId) => {
      const storyItems = [];

      story.items.forEach((storyItem) => {
        storyItems.push(
          <li
            key={storyItem.id}
            data-id={storyItem.id}
            data-time={storyItem.time}
            className={storyItem.seen ? "seen" : ""}
          >
            <a
              href={storyItem.src}
              data-type={storyItem.type}
              data-length={storyItem.length}
              data-link={storyItem.link}
              data-linkText={storyItem.linkText}
            >
              <img loading="lazy" src={storyItem.preview} alt="preview" />
            </a>
          </li>
        );
      });

      let arrayFunc = story.seen ? "push" : "unshift";
      timelineItems[arrayFunc](
        <div
          className={story.seen ? "story seen" : "story"}
          key={storyId}
          data-id={storyId}
          data-last-updated={story.lastUpdated}
          data-photo={story.photo}
        >
          <a className="item-link" href={story.link}>
            <span className="item-preview">
              <img loading="lazy" src={story.photo} alt="preview" />
            </span>
            <span
              className="info"
              itemProp="author"
              itemScope=""
              itemType="http://schema.org/Person"
            >
              <strong className="name" itemProp="name">
                {story.name}
              </strong>
              <span className="time">{story.lastUpdated}</span>
            </span>
          </a>

          <ul className="items">{storyItems}</ul>
        </div>
      );
    });

    return (
      <div>
        <div
          ref={(node) => (this.storiesElement = node)}
          id="stories-donnyslist"
          className="storiesWrapper"
        >
          {timelineItems}
        </div>
      </div>
    );
  }
}

export default Stories;
