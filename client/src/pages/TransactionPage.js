import { Cookies } from "react-cookie";
import UserTransactions from "../components/Transactions/UserTransactions";
import { LgContainer } from "../components/Transactions/styles";
import { Link } from "react-router-dom";

const TransactionPage = () => {
  const cookies = new Cookies();
  const userSlug = cookies.get("user")?.slug;

  if (!userSlug) {
    return window.open("/login", "_self");
  }

  return (
    <LgContainer>
      <UserTransactions />
    </LgContainer>
  );
};

export default TransactionPage;
