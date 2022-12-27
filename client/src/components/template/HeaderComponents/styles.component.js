import styled from "styled-components";
import { FaAddressBook, FaBars, FaHome, FaUserAlt } from "react-icons/fa";
import { BiBellMinus, BiSearchAlt } from "react-icons/bi";
import { GiRank2 } from "react-icons/gi";
import { BiCaretDown } from "react-icons/bi";
import Collapse from "@material-ui/core/Collapse";
import { Link } from "react-router-dom";
import { GoPrimitiveDot } from "react-icons/go";
import { Modal } from "@material-ui/core";
import { FiChevronLeft } from "react-icons/fi";
import { BiMessageSquareDots } from "react-icons/bi";
import { HiOutlineLightBulb } from "react-icons/hi";

export const Logo = styled(Link)`
  // font-family: 'American Typewriter', serif;
  font-family: "Courier New", monospace;
  font-weight: 700;
  text-transform: lowercase;
  font-size: 30px;

  white-space: nowrap;
  text-decoration: none;
  color: #000;
  margin: 0 !important;
  // line-height: 0;

  &:hover {
    color: #000;
    text-decoration: none;
  }

  &:focus {
    outline: none;
    text-decoration: none;
    color: #000;
  }
  .svh-logo {
    height: 3rem;
  }

  @media screen and (min-width: 639px) {
    font-size: 36px;
    .svh-logo {
      height: 4rem;
    }
  }

  @media screen and (min-width: 1024px) {
    font-size: 42px;
    .svh-logo {
      height: 4rem;
    }
  }
`;
export const SupLogo = styled.sup`
  font-family: "American Typewriter", serif;
  font-style: italic;
  font-size: 45%;
  margin-left: -15px;
  color: red;
`;

export const ProfileIcon = styled(FaUserAlt)`
  flex-shrink: 0;
`;
export const MessagesIcon = styled(BiMessageSquareDots)`
  flex-shrink: 0;
`;

export const InspiringIcon = styled(HiOutlineLightBulb)`
  flex-shrink: 0;
`;

export const NotificationIcon = styled(BiBellMinus)`
  color: red;
`;

export const FlexContainer = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
`;

export const GridContainer = styled.div`
  display: grid;
  grid-gap: 1rem;
  grid-template-columns: ${({ user }) =>
    user ? "repeat(3, 1fr)" : "repeat(6, 1fr)"};
`;
export const MediumScreenContainer = styled.div`
  display: none;
  align-items: center;
  justify-content: space-between;
  flex-grow: 1;

  @media (min-width: 768px) {
    display: flex;
  }
`;

export const OuterContainer = styled.div`
  border-bottom: 1px solid #e6e6e6;
  box-shadow: 0 2px 2px #eee;
  position: sticky;
  top: 0;
  background-color: #fff;
  z-index: 999;
  width: 100vw;
`;
export const DropDownContainer = styled.div`
  display: flex;
  flex-direction: column;
  position: relative;
`;
export const DropDown = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  position: fixed;
  bottom: 0;
  width: 100%;
  background: #fff;
  border-top: 1px solid #e6e6e6;
  border-bottom: 1px solid #e6e6e6;
  box-shadow: 0 2px 2px #eee;

  @media (min-width: 768px) {
    display: none;
  }

  .connect-wallet-btn {
    background-color: var(--primary-color);
    border-radius: 1rem;
    font-size: 2rem;
    font-weight: 600;
    color: #ffffff;
    border: none;
    outline: none;
    padding: 1rem;
  }

  .dropdown-item {
    display: flex;
    align-items: center;
    justify-content: center;
    margin: 5rem auto;
    margin-bottom: 0.3rem;
    padding: 0.5rem;
  }

  .dropdown-container {
    display: flex;
    border: none;
    border-radius: 1.5rem;
    background-color: lightgray;
    padding: 0.5rem;
    margin: 0 1rem;
  }

  .dropdown-noicon {
    margin: 0 !important;
    font-size: 1.6rem;
    white-space: nowrap;
    cursor: pointer;
    border: 2px solid #163256;
    border-radius: 1.5rem;
    outline: none;
    background-color: #172a42;
    color: #fff;
    padding: 1rem;
    font-weight: 600;
  }

  @media screen and (min-width: 475px) {
    .dropdown-item {
      display: none;
    }
  }
`;

export const HeaderContainer = styled.div`
  display: flex;
  height: 7rem;
  justify-content: space-between;
  align-items: center;
  padding-left: 5.5rem;
  padding-right: 5.5rem;
  box-sizing: border-box;
  max-width: 1280px;
  width: 100%;
  margin: 0 auto;

  @media (max-width: 768px) {
    padding-left: 2rem;
    padding-right: 2rem;
  }
`;

export const MenuContainer = styled.div`
  display: flex;
  align-items: center;
`;
export const LinkContainer = styled(Link)`
  display: flex;
  align-items: center;
  padding-top: 0.5rem;
  padding-bottom: 0.5rem;
  color: #000;
  &.icon-link {
    justify-content: space-around;
    width: 100%;
    align-items: center;

    .icon {
      width: 3rem;
      height: 3rem;
      padding: 4px;
    }
  }

  h3 {
    font-size: 1.6rem;
    white-space: nowrap;
    cursor: pointer;
    margin: 0 !important;

    @media (min-width: 768px) {
      margin: 0 !important;
    }
  }
  .noicon {
    margin: 0 0 0 2.1rem !important;
  }

  .icon {
    color: #000;
  }

  &:hover {
    background-color: #000;
    color: #fff;
  }

  @media (min-width: 768px) {
    margin: 0 !important;
    padding: 0.5rem;
    width: max-content;

    &:hover {
      background-color: #fff;
      color: #000;
    }
  }

  @media (min-width: 1024px) {
    .spaced {
      margin-right: 1rem !important;
    }
  }
`;

export const ProfileOptionsGrard = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  position: relative;
`;

export const NotificationContainer = styled.div`
  display: flex;
  align-items: center;
`;

export const NotificationOptionsGrard = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  position: relative;

  .icon {
    margin-top: 0.5rem;
    height: 2.5rem;
    width: 2.5rem;
    flex-shrink: 0;
    cursor: pointer;
  }

  .icon-btn {
    padding: 0.2rem 0.5rem;
    margin: 0 !important;
    border-radius: 50%;
    color: #262625;
    align-items: center;
    justify-content: center;
    cursor: pointer;
  }
`;

export const NotificationDropDown = styled(Collapse)`
  &&& {
    display: flex;
    flex-direction: column;
    flex-shrink: 0;
    padding: 1rem;
    position: absolute;
    border: 1px solid #e6e6e6;
    top: 7rem;
    right: 0;
    width: 100%;
    background: #fff;
    box-shadow: 0 2px 2px #eee;
    color: #000;
    z-index: 999;
    overflow-y: scroll;

    @media (min-width: 640px) {
      display: none;
    }
  }
`;

export const NotificationOptionsContainer = styled(Collapse)`
  &&& {
    display: none;
  }

  @media (min-width: 640px) {
    &&& {
      display: flex;
      flex-direction: column;
      flex-shrink: 0;
      padding: 1rem;
      position: absolute;
      top: 5.5rem;
      border: 1px solid #e6e6e6;
      width: 60vw;
      right: 0rem;
      background: #fff;
      box-shadow: 0 2px 2px #eee;
      color: #000;
      z-index: 999;
      overflow-y: scroll;
    }
  }

  @media (min-width: 1023px) {
    &&& {
      width: 35vw;
    }
  }
`;

export const AlertIcon = styled(GoPrimitiveDot)`
  height: 1.3rem;
  width: 1.3rem;
  color: #dc2626;
  margin-left: 0.5rem;
`;

export const Notification = styled.div`
  height: max-content;
  max-height: 35vh;

  .div-container {
    display: flex;
    flex-shrink: 0;
    align-items: center;
    justify-content: space-between;
    margin: 1rem auto;
  }

  .name-text {
    text-transform: capitalize;
  }

  .time-text {
    color: gray;
  }

  .view-btn {
    padding: 0.5rem 1rem;
    margin: 0 !important;
    background-color: #337ab7;
    border-radius: 0.5rem;
    box-sizing: border-box;
    display: flex;
    align-items: center;
    justify-content: center;
    cursor: pointer;
  }
  .view-btn-text {
    font-size: 1.2rem;
    text-align: center;
    margin: 0 !important;
    font-weight: 400;
    color: #ffffff;
  }
`;

export const MenuNotificationContainer = styled.div`
  position: relative;
`;

export const AlertNotification = styled.div`
  top: 1px;
  right: -2px;
  position: absolute;
`;

export const NotificationLink = styled.div`
  padding: 0.5rem 0;
  display: flex;
  align-items: center;
  color: #000;
  text-decoration: none;
  cursor: pointer;

  &:focus,
  &:hover,
  &:visited,
  &:link,
  &:active {
    color: #000;
    text-decoration: none;
  }
`;

export const WalletOptionsGrard = styled.div`
  display: none;
  align-items: center;
  position: relative;

  .icon {
    margin-top: 0;
    margin-left: 0.5rem;
    height: 2.5rem;
    width: 2.5rem;
    flex-shrink: 0;
    cursor: pointer;
  }

  .icon-btn {
    padding: 0.7rem 0.5rem;
    margin: 0 !important;
    border-radius: 50%;
    color: #262625;
    align-items: center;
    justify-content: center;
    cursor: pointer;
  }

  @media screen and (min-width: 475px) {
    display: flex;
    flex-direction: column;
  }
`;

export const WalletDropDown = styled(Collapse)`
  &&& {
    display: none;
    flex-direction: column;
    flex-shrink: 0;
    padding: 1rem;
    position: absolute;
    top: 7rem;
    border: 1px solid #e6e6e6;
    width: 100%;
    background: #fff;
    box-shadow: 0 2px 2px #eee;
    color: #000;
    z-index: 999;
    right: 0;
    overflow: hidden;

    @media (min-width: 475px) {
      display: flex;
      flex-direction: column;
    }

    @media (min-width: 1023px) {
      width: 27vw;
    }
  }

  .wallet-option {
    height: 100vh;
  }
`;

export const WalletSidebarContainer = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: center;

  .wallet-option {
    display: flex;
    justify-content: space-between;
  }

  .close-icon-container {
    display: flex;
    align-items: center;
  }

  .wallet-header {
    font-size: 1.6rem;
    font-weight: 600;
    margin: 1.5rem 1rem;
  }

  .wallet-address {
    padding: 0.8rem 0.2rem;
    font-size: 1.6rem;
    font-weight: 400;
    color: gray;
  }

  .connect-wallet-container {
    margin: 7rem auto;
    padding: 1rem 0;
  }

  .connect-wallet-header {
    font-size: 2rem;
    font-weight: 600;
    padding: 0.5rem 0.2rem;
  }

  .connect-wallet-btn {
    padding: 1.5rem 2rem;
    background-color: var(--primary-color);
    border-radius: 1rem;
    font-size: 2rem;
    margin: 1rem auto !important;
    font-weight: 600;
    color: #ffffff;
    border: none;
    outline: none;
  }

  .wallet-list {
    border: 1px solid #e6e6e6;
    border-radius: 0.5rem;
  }

  .wallet-list-item {
    display: flex;
    border-bottom: 1px solid #e6e6e6;
    padding: 1rem;

    &:hover {
      box-shadow: 2px 2px 2px 2px #eee;
    }
  }

  .wallet-avatar {
    width: 3rem;
    height: 3rem;
    border-radius: 50%;
  }

  .wallet-name {
    font-size: 1.7rem;
    padding-top: 0.3rem;
    font-weight: 600;
    margin-left: 1rem;
    justify-content: center;
    align-items: center;
  }

  .horizontal-divider {
    margin: 0 !important;
    border: solid 1px #e6e6e6;
  }

  .header-text {
    font-size: 1.7rem;
    font-weight: 500;
    color: #262625;
    margin: 2rem;
    margin-bottom: -1rem;
  }

  .wallet-sidebar-list {
    border: 1px solid #e6e6e6;
    border-radius: 10px;
    margin: 2rem;

    li {
      list-style-type: none;
      height: 100%;
    }
  }

  .wallet-sidebar-list-btn {
    display: flex;
    align-items: center;
    background: transparent;
    border: none;
    width: 100%;
    padding: 2rem 1rem;
    transition: all 0.5s ease-in-out;

    &:hover {
      box-shadow: 0 1px 2px 0 rgba(0, 0, 0, 0.2),
        0 2px 10px 0 rgba(0, 0, 0, 0.19);
    }

    img {
      width: 2.5rem;
      height: 2.5rem;
      margin-right: 1.5rem;
    }
  }

  .bottom-radius {
    border: none;
    &:hover {
      border-radius: 0 0 10px 10px;
    }
  }

  .top-radius {
    border: none;
    &:hover {
      border-radius: 10px 10px 0 0;
    }
  }

  .sidebar-div {
    display: flex;
    align-items: center;
  }

  .sidebar-info-div {
    margin: 0 2rem 0 1rem;
    padding: 0.7rem 1rem;
    border: none;
    border-radius: 1rem;
    background: var(--primary-color);
    color: #fff;
  }

  .sidebar-check {
    color: var(--primary-color);
    margin: 0 2rem;
  }

  .border-radius {
    border-radius: 50%;
  }

  .line {
    border-bottom: 1px solid #e6e6e6;
  }

  .info-box-container {
    position: relative;
  }

  .info-box {
    display: none;
    position: absolute;
    color: #262625;
    background: #fff;
    border: none;
    border-radius: 0.3rem;
    padding: 1rem;
    margin: 1rem 0;
  }

  .info-box-container:hover .info-box {
    display: block;
    box-shadow: 0 1px 2px 0 rgba(0, 0, 0, 0.2), 0 2px 10px 0 rgba(0, 0, 0, 0.19);
  }

  .options-btn {
    display: flex;
    align-items: center;
    justify-content: flex-start;
    padding: 1rem;
    margin: 2rem;
    border: 1px solid #ededed;
    border-radius: 0.5rem;
    cursor: pointer;
    transition: all 0.5s ease-in-out;

    &:hover {
      background-color: #f5f5f5;
    }
  }

  .options-text {
    font-weight: 600;
    font-size: 16px;
  }
`;

export const TransactionModal = styled(Modal)`
  display: flex;
  align-items: center;
  justify-content: center;
  height: 100vh;
  width: 100vw;
  height: -webkit-fill-available;

  .modal-container {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    padding: 1rem;
    background: #fafafa;
    height: 50vh;
    width: 68vw;
    border: none;
    border-radius: 0.5rem;
    outline: none;
    font-family: "Helvetica Neue", Helvetica, Arial, sans-serif;
    font-size: 2rem;
    line-height: 2rem;
    font-weight: 500;
    color: #63625f;

    @media screen and (min-width: 639px) {
      height: 55vh;
      width: 50vw;
    }

    @media screen and (min-width: 767px) {
      height: 55vh;
      width: 40vw;
    }

    @media screen and (min-width: 1023px) {
      height: 52vh;
      width: 30vw;
    }

    @media screen and (min-width: 1279px) {
      height: 53vh;
      width: 22vw;
    }
  }
`;

export const WalletSidebarOption = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 0 1rem;
`;

export const WalletSidebarList = styled.div`
  border: 1px solid #e6e6e6;
  border-radius: 1rem;
  display: flex;
  flex-direction: column;
  align-items: center;
  margin: 2rem;
  padding: 0 !important;
  transition: all 0.5s ease-in-out;

  &:hover {
    box-shadow: 0 1px 2px 0 rgba(0, 0, 0, 0.2), 0 2px 10px 0 rgba(0, 0, 0, 0.19);
  }

  .wallet-price-container {
    display: flex;
    flex-direction: column;
    align-items: center;
    text-align: center;
    margin: 0 auto;
  }

  .wallet-price-text {
    font-size: 1.5rem;
    font-weight: 600;
    color: gray;
    padding-top: 1.5rem;
    margin: auto;
  }

  .wallet-price-value {
    font-weight: bold;
    font-size: 22px;
    margin: auto;
    padding-bottom: 1.5rem;
  }

  .wallet-disconnect-btn {
    background: #db0d1b;
    border: none;
    color: #fff;
    width: 100%;
    padding: 2rem 1rem;
    margin: 0 !important;
    border-radius: 0 0 1rem 1rem;
    font-weight: 600;
    font-size: 1.7rem;
  }

  .stripe-btn-container {
    display: flex;
    justify-content: space-around;
    width: 100%;
  }

  .stripe-disconnect-btn {
    background: #db0d1b;
    border: none;
    color: #fff;
    width: 100%;
    padding: 2rem 1rem;
    margin: 0 !important;
    font-weight: 600;
    font-size: 1.7rem;
    border-radius: 0 0 0 1rem;
  }

  .stripe-withdraw-btn {
    background: var(--primary-color);
    border: none;
    color: #fff;
    width: 100%;
    padding: 2rem 1rem;
    margin: 0 !important;
    font-weight: 600;
    font-size: 1.7rem;
    border-radius: 0 0 1rem 0;
  }
`;

export const ProfileOptionsContainer = styled(Collapse)`
  &&& {
    display: flex;
    flex-direction: column;
    padding: 1rem;
    position: absolute;
    top: 5rem;
    border: 1px solid #e6e6e6;
    width: max-content;
    background: #fff;
    box-shadow: 0 2px 2px #eee;
    color: #000;
    z-index: 999;
    right: 0;
  }
`;
export const ProfileLinkContainer = styled.div`
  display: flex;
  flex-direction: column;
  padding-top: 0.5rem;
  padding-right: 0.5rem;
  padding-left: 0.5rem;

  .icon {
    height: 1.6rem;
    width: 1.6rem;
    margin-right: 0.6rem;
    flex-shrink: 0;
  }
  .location {
    font-weight: 500;
    margin-right: 0.5rem !important;
  }
`;
export const ExpertIcon = styled(GiRank2)`
  height: 1.4rem;
  width: 1.4rem;
  margin-right: 0.6rem;
  flex-shrink: 0;
  color: rgb(255, 3, 3);
`;
export const ProfileLink = styled(Link)`
  padding: 0.5rem 0;
  display: flex;
  align-items: center;
  color: #000;
  text-decoration: none;
  cursor: pointer;
`;
export const SwitchFlex = styled.div`
  padding: 0.5rem 0;
  display: flex;
  align-items: center;
`;
export const ExpertProfile = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;

  .role-sign {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    margin-top: -3px;
    margin-inline: 0.5px;
  }
  .role-sign-con {
    margin-top: 2px;
  }
  .name-text {
    font-weight: 500;
  }
`;

export const ProfileText = styled.p`
  margin: 0 !important;
  font-size: 1.4rem;
`;
export const SubProfileText = styled.h5`
  margin: 0 !important;
  font-size: 1.2rem;
`;

export const SearchContainer = styled.div`
  display: flex;
  align-items: center;
  padding: 0.5rem 1rem;
  background: rgb(247, 249, 250);
  height: 40px;
  width: 100%;
  border: 1px solid #fff;
  border-color: black;
  margin-right: 1rem;
  border-radius: 42px;
  margin-left: 1rem;
  margin-top: 1rem;
  margin-bottom: 1rem;
  &:hover {
    border: 1px solid #3bb9ff;
  }

  @media (min-width: 768px) {
    max-width: 60rem;
    margin: 1rem;
    width: 100%;
  }
`;
export const SearchInput = styled.input`
  border: none;
  outline: none;
  width: 100%;
  padding-left: 1rem;
  padding-right: 0.7rem;
  font-size: 1.6rem;
  background: none;
  display: flex;
  justify-content: center;
  align-items: center;
  margin-top: -3px;
  @media (max-width: 600px) {
    font-size: 1.2rem;
  }
`;
export const MobieSearchCon = styled.div`
  display: flex;
  align-items: center;
  margin: 1rem;
  /* flex: 1; */
  justify-content: space-between;
  /* width: 100%; */
  @media (min-width: 768px) {
    display: none;
  }
`;
export const Cancel = styled.div`
  display: flex;
  align-items: center;
  font-size: 16px;
  margin-right: 2rem;
  cursor: pointer;
  font-weight: 600;
  color: black;
  &:hover {
    opacity: 0.7;
  }
`;

export const SearchIcon = styled(BiSearchAlt)`
  height: 1.5rem;
  width: 1.5rem;
  color: #6b7280;
  flex-shrink: 0;
`;

export const SearchBtnContainer = styled.div`
  display: none;

  @media (max-width: 768px) {
    display: flex;
    cursor: pointer;
    padding: 0.8rem;
    background: rgb(227, 230, 234);
    border-radius: 50%;
    &:hover {
      background-color: rgb(247, 249, 250);
      border-radius: 50%;
    }
  }
`;
export const SearchBtn = styled(BiSearchAlt)`
  display: none;

  @media (max-width: 768px) {
    display: flex;

    height: 2rem;
    width: 2rem;
    color: black;
    cursor: pointer;

    &:hover {
      display: flex;
      color: black;
      background-color: rgb(247, 249, 250);
    }
  }
`;
export const HomeIcon = styled(FaHome)`
  height: 1.6rem;
  width: 1.6rem;
  flex-shrink: 0;
`;
export const CaretDownIcon = styled(BiCaretDown)`
  height: 1.4rem;
  width: 1.4rem;
  flex-shrink: 0;
  color: #6b7280;
  margin-left: 0.4rem;
  cursor: pointer;
`;

export const MenuIcon = styled(FaBars)`
  height: 2rem;
  width: 2rem;
  color: #6b7280;
  margin-left: 1rem;
  cursor: pointer;

  @media (min-width: 768px) {
    display: none;
  }
`;

export const MenuAvatarContainer = styled.div`
  position: relative;
`;
export const MenuNotification = styled.div`
  top: -10px;
  right: 0;
  position: absolute;
`;

export const CloseIcon = styled(FiChevronLeft)`
  height: 2rem;
  width: 2rem;
  cursor: pointer;
  font-weight: 500;
  flex-shrink: 0;
  margin: 0 !important;
`;

export const WithdrawModal = styled(Modal)`
  display: flex;
  position: relative;
  align-items: center;
  justify-content: center;
  height: 100vh;
  width: 100vw;
  height: -webkit-fill-available;
  // background: rgba(0, 0, 0, 0.7);

  .modal-container {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    padding: 1rem;
    background: #ffffff;
    height: 40vh;
    width: 68vw;
    border: none;
    outline: none;
    border-radius: 0.5rem;
    font-family: "Helvetica Neue", Helvetica, Arial, sans-serif;

    @media screen and (min-width: 639px) {
      width: 50vw;
      box-shadow: 0px 0px 10px rgba(0, 0, 0, 0.1);
    }

    @media screen and (min-width: 767px) {
      width: 40vw;
    }

    @media screen and (min-width: 1023px) {
      width: 30vw;
    }

    @media screen and (min-width: 1279px) {
      width: 22vw;
    }
  }

  .modal-header {
    font-size: 2rem;
    font-weight: 500;
    text-align: center;
    margin: 0 1rem;
    color: #5c5b5b;
    border: none;
  }

  .modal-form {
    display: flex;
    flex-direction: column;
    width: 100%;
    align-items: center;
    justify-content: center;
  }

  .modal-input {
    width: 70%;
    height: 5rem;
    border-radius: 0.8rem;
    border: 2px solid #e6e6e6;
    outline: none;
    padding: 0.5rem;
    margin: 1rem 5rem;
    font-size: 1.5rem;
  }

  .modal-btn {
    width: 70%;
    height: 5rem;
    border-radius: 0.8rem;
    align-self: center;
    border: none;
    outline: none;
    color: #fff;
    background-color: var(--primary-color);
    font-size: 2rem;
  }

  .del-header {
    font-size: 2rem;
    font-weight: 600;
    text-align: center;
    margin: 0 !important;
  }

  .del-modal-header {
    font-size: 16px;
    font-weight: 500;
    margin: 1rem;
    color: #5c5b5b;
    border: none;
    text-align: center;
  }

  .del-btn-container {
    display: flex;
    flex-direction: row;
    justify-content: space-evenly;
    align-items: center;
    width: 100%;
    margin: 1rem 0;
  }

  .del-btn {
    height: 5rem;
    border-radius: 0.8rem;
    align-self: center;
    border: 2px solid #db0d1b;
    outline: none;
    color: #fff;
    background-color: #db0d1b;
    font-size: 2rem;
    padding: 1rem;

    @media screen and (min-width: 1279px) {
      width: 9vw;
    }
  }

  .cancel-btn {
    height: 5rem;
    border-radius: 0.8rem;
    align-self: center;
    border: 2px solid #e6e6e6;
    outline: none;
    color: gray;
    background-color: #fafafa;
    font-size: 2rem;
    padding: 1rem;
    transition: all 0.5s ease-in-out;

    &:hover {
      background-color: white;
      color: #5c5b5b;
    }

    @media screen and (min-width: 1279px) {
      width: 8vw;
    }
  }
`;
