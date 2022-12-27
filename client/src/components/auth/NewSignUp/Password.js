import { useState } from "react";
import { FormContainer } from "./styles";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import { API_URL } from "../../../constants/api";
import axios from "axios";
import { useDispatch } from "react-redux";
import { useHistory } from "react-router";
import { loginUser } from "../../../actions/auth";
import { toast } from "react-toastify";

const Password = ({ setValue, getAllValues, resetUserSignup }) => {
  const [btnLoading, setBtnLoading] = useState(false);
  const dispatch = useDispatch();
  const history = useHistory();

  const schema = yup.object().shape({
    password: yup
      .string()
      .required("password is required")
      .min(6, "at least 6 characters")
      .matches(RegExp("(.*[a-z].*)"), "at least one lowercase letter")
      .matches(RegExp("(.*[A-Z].*)"), "at least one uppercase letter")
      .matches(RegExp("(.*\\d.*)"), "at least one number")
      .matches(
        RegExp('[!@#$%^&*(),.?":{}|<>]'),
        "at least one special character"
      ),
    confirm_password: yup
      .string()
      .required("confirm your password")
      .oneOf([yup.ref("password"), null], "password must match"),
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
    setBtnLoading(true);
    setValue("password", data?.password);
    setValue("confirm_password", data?.confirm_password);
    const formValues = getAllValues();

    try {
      const response = await axios.post(
        `${API_URL}/auth/register2`,
        formValues
      );

      if (response.data.success) {
        resetUserSignup();

        toast.success("your whatido account has been created successfully", {
          position: "top-center",
          theme: "light",
          autoClose: 4000,
          hideProgressBar: true,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
          progress: undefined,
        });

        // log user in
        const data = {
          email: formValues?.email,
          password: formValues?.password,
        };

        dispatch(loginUser(data, history));
      } else {
        return toast.error(`error creating account; ${response?.data?.error}`, {
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
      setBtnLoading(false);
    } catch (error) {
      setBtnLoading(false);
      return error;
    }
  };

  return (
    <FormContainer onSubmit={handleSubmit(onSubmit)}>
      <div className="input-container margin">
        <span className="input-header">Password*</span>
        <input
          type="password"
          placeholder="enter password"
          {...register("password")}
          className="input"
        />

        {errors?.password?.message && (
          <div className="password-instruction">
            {errors?.password?.message !== "password is required" && (
              <span className="instruction-header">
                Your password must have:
              </span>
            )}
            <span className="instruction-error">
              {`✔${errors?.password?.message}`}
            </span>
          </div>
        )}
      </div>

      <div className="input-container margin">
        <span className="input-header">Confirm password*</span>
        <input
          type="password"
          placeholder="confirm password"
          {...register("confirm_password")}
          className="input"
        />

        {errors?.confirm_password?.message && (
          <div className="password-instruction">
            <span className="instruction-error">
              {`✔${errors?.confirm_password?.message}`}
            </span>
          </div>
        )}
      </div>

      <button
        disabled={false}
        className={btnLoading ? "disabled" : "next-btn"}
        type="submit"
      >
        Sign Up
      </button>
    </FormContainer>
  );
};

export default Password;
