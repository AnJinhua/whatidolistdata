import { useContext } from "react";
import { MdOutlineAccountBalanceWallet } from "react-icons/md";
import { IconButton } from "@material-ui/core";
import { WalletOptionsGrard } from "./styles.component";
import WalletSidebar from "./WalletSidebar";
import Drawer from "@mui/material/Drawer";
import useMediaQuery from "@mui/material/useMediaQuery";
import { TransactionContext } from "../../../context/TransactionContext";

const Wallet = () => {
  const { toggleSidebar, setToggleSidebar } = useContext(TransactionContext);

  const largeScreen = useMediaQuery("(min-width:640px)");

  const handleClick = () => {
    setToggleSidebar(!toggleSidebar);
  };

  return (
    <>
      <WalletOptionsGrard>
        {/* <ClickAwayListener onClickAway={() => setToggleSidebar(false)}> */}
        <IconButton className="icon-btn" onClick={handleClick}>
          <MdOutlineAccountBalanceWallet className="icon" />
        </IconButton>
        {/* </ClickAwayListener> */}
      </WalletOptionsGrard>
      <Drawer
        style={{
          zIndex: 888,
          backgroundColor: "rgba(0,0,0,.1)",
        }}
        ModalProps={{
          keepMounted: true,
        }}
        PaperProps={
          largeScreen
            ? {
                sx: {
                  width: 425,
                  boxSizing: "border-box",
                  top: "7rem",
                },
              }
            : {
                sx: {
                  width: "100%",
                  boxSizing: "border-box",
                  top: "7rem",
                },
              }
        }
        variant="temporary"
        anchor="right"
        open={toggleSidebar}
        onClose={() => setToggleSidebar(false)}
      >
        <div className="wallet-option">
          <WalletSidebar />
        </div>
      </Drawer>
    </>
  );
};

export default Wallet;
