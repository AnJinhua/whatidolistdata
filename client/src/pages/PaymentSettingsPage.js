import { Cookies } from "react-cookie";
import { PaymentPageContainer } from "../components/Payments/styles";
import Payments from "../components/Payments/Payments";

const PaymentSettingsPage = () => {
  const cookies = new Cookies();
  const userSlug = cookies.get("user")?.slug;

  if (!userSlug) {
    return window.open("/login", "_self");
  }

  return (
    <PaymentPageContainer>
      <Payments />
    </PaymentPageContainer>
  );
};

export default PaymentSettingsPage;
