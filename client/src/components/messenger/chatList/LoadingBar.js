function LoadingBar() {
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
  );
}

export default LoadingBar;
