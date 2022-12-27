function YoutubePreview({ viewedMedia }) {
  function getId(url) {
    const regExp =
      /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|&v=)([^#&?]*).*/;
    const match = url?.match(regExp);

    return match && match[2].length === 11 ? match[2] : null;
  }

  const videoId = getId(viewedMedia?.youtubeLink);

  return (
    <iframe
      style={{ background: "grey" }}
      width="100%"
      height="100%"
      src={`//www.youtube.com/embed/${videoId}#t=0.1`}
      title="YouTube video player"
      frameBorder="0"
      allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
      allowFullScreen
    ></iframe>
  );
}

export default YoutubePreview;
