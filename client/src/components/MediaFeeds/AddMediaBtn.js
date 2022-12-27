function AddMediaBtn({ clearMediaData, handleNewMediaUpload }) {
  return (
    <div className="btn-container">
      <button className="btn" onClick={clearMediaData}>
        Cancel
      </button>
      <button className="btn" onClick={handleNewMediaUpload}>
        Post
      </button>
    </div>
  );
}

export default AddMediaBtn;
