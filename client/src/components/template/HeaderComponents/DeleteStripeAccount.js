const DeleteStripeAccount = ({
  setOpenDelModal,
  handleDeleteStripeConnect,
}) => {
  return (
    <>
      <div className="modal-container">
        <p className="del-header">Delete your account</p>
        <span className="del-modal-header">
          this action will delete your stripe account and prevent you from
          receiving payments; ensure that you withdraw all of your funds before
          disconnecting your account.
        </span>
        <div className="del-btn-container">
          <button className="cancel-btn" onClick={() => setOpenDelModal(false)}>
            cancel
          </button>
          <button className="del-btn" onClick={handleDeleteStripeConnect}>
            disconnect
          </button>
        </div>
      </div>
    </>
  );
};

export default DeleteStripeAccount;
