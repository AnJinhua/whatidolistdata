import { useCookies } from "react-cookie";
import { useForm } from "react-hook-form";
import { toast } from "react-toastify";
import { createPayout } from "../../../actions/stripeConnect";

const WithdrawFund = ({ account, userSlug, setOpenModal, setIsLoading }) => {
  const [{ token }] = useCookies(["token"]);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm();

  const onSubmit = async (data) => {
    setOpenModal(false);
    setIsLoading(true);
    const postData = {
      ...data,
      currency: account?.currency,
      account_id: account?.data?.stripe_acct_id,
      enabled: account?.enabled,
      userSlug: userSlug,
    };

    try {
      await createPayout(postData, token);
      setIsLoading(false);
      toast.success(
        "your money has been successfully withdrawn and is in transit to your bank.",
        {
          position: "top-center",
          theme: "light",
          autoClose: 4000,
          hideProgressBar: true,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          progress: undefined,
        }
      );
    } catch (error) {
      setIsLoading(false);
      toast.error("the fund has not yet been made available for withdrawal.", {
        position: "top-center",
        theme: "light",
        autoClose: 4000,
        hideProgressBar: true,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
      });
    }
  };

  return (
    <>
      <div className="modal-container">
        <span className="modal-header">{`make a withdraw of at least 10 ${account?.currency.toLocaleUpperCase()} into your bank`}</span>

        <form onSubmit={handleSubmit(onSubmit)} className="modal-form">
          <input
            type="number"
            min="10"
            className="modal-input"
            {...register("amount", {
              required: "Required field",
              min: 10,
            })}
          />
          <button type="submit" className="modal-btn">
            withdraw
          </button>
        </form>
      </div>
    </>
  );
};

export default WithdrawFund;
