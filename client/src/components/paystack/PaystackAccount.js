import { useForm } from "react-hook-form";
import * as yup from "yup";
import { yupResolver } from "@hookform/resolvers/yup";
import axios from "axios";
import { toast } from "react-toastify";

import { PaystackForm } from "./styles";
import { API_URL } from "../../constants/api";
import { useDispatch } from "react-redux";
import { PAYSTACK } from "../../constants/actions";

const PaystackAccount = ({ firstName, lastName, userSlug, status }) => {
  const dispatch = useDispatch();

  const schema = yup.object().shape({
    bank_account: yup
      .string()
      .required("*this field is required")
      .min(10, "Your bank account must have at least ten digits")
      .max(10, "Your bank account must have at most ten digits"),
    bank_code: yup
      .string()
      .required("*this field is required")
      .min(3, "Your bank code must have at least ten digits")
      .max(3, "Your bank code must have at most ten digits."),
  });

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    resolver: yupResolver(schema),
    criteriaMode: "all",
    reValidateMode: "onChange",
    mode: "onChange",
  });

  const onSubmit = async (data) => {
    const values = {
      bank_account: data?.bank_account,
      bank_code: data?.bank_code,
      firstName,
      lastName,
      userSlug,
    };

    const url = status
      ? `${API_URL}/paystack/update`
      : `${API_URL}/paystack/create`;

    try {
      const response = await axios.post(url, values);

      if (response?.data?.status) {
        dispatch({
          type: PAYSTACK,
          payload: false,
        });

        toast.success(
          status
            ? "Your paystack account has been updated successfully"
            : "Your paystack account has been created successfully",
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
      } else if (response?.data?.message === "Account already exists") {
        toast.error(response?.data?.message, {
          position: "top-center",
          theme: "light",
          autoClose: 4000,
          hideProgressBar: true,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          progress: undefined,
        });
      } else {
        toast.error("Account number is incorrect", {
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
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <PaystackForm onSubmit={handleSubmit(onSubmit)}>
      <div className="input-container">
        <p className="input-title">Bank account*</p>
        <input
          type="number"
          placeholder="enter bank account"
          {...register("bank_account")}
          className={errors?.bank_account?.message ? "border-error" : "input"}
        />
        {errors?.bank_account?.message && (
          <span className="instruction-error">
            {errors?.bank_account?.message}
          </span>
        )}
      </div>

      <div className="input-container">
        <p className="input-title">Bank code*</p>
        <input
          type="number"
          placeholder="enter 3 digit bank code"
          {...register("bank_code")}
          className={errors?.bank_code?.message ? "border-error" : "input"}
        />
        {errors?.bank_code?.message && (
          <span className="instruction-error">
            {errors?.bank_code?.message}
          </span>
        )}
      </div>

      <div style={{ width: "100%" }}>
        <button className="confirm-btn" type="submit">
          {status ? "Update account" : "Create account"}
        </button>
      </div>
    </PaystackForm>
  );
};

export default PaystackAccount;
