import { useState, useEffect } from "react";
import { ComponentsContainer } from "./styles";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import { API_URL } from "../../../constants/api";
import axios from "axios";
import PhoneInput from "react-phone-input-2";
import "react-phone-input-2/lib/style.css";

const EmailCode = ({ handlePage, setValue }) => {
  const [inputCode, setInputCode] = useState("");
  const [emailCodeError, setEmailCodeError] = useState("");
  const [phoneCodeError, setPhoneCodeError] = useState("");
  const [isInputActive, setIsInputActive] = useState(false);
  const [isPhone, setIsPhone] = useState(false);
  const [emailAddress, setEmailAddress] = useState("");
  const [phoneNumber, setPhoneNumber] = useState("");
  const [emailCodeSuccess, setEmailCodeSuccess] = useState("");
  const [phoneCodeSuccess, setPhoneCodeSuccess] = useState("");
  const [otpValidated, setOtpValidated] = useState(false);
  const [otpError, setOtpError] = useState("");
  const [btnLoading, setBtnLoading] = useState(false);

  const schema = yup.object().shape({
    email: yup
      .string()
      .email("email is not valid")
      .required("email is required"),
    code: yup.number().required("enter four digit code"),
  });

  const {
    getValues,
    register,
    reset,
    formState: { errors },
  } = useForm({
    resolver: yupResolver(schema),
    criteriaMode: "all",
    reValidateMode: "onChange",
    mode: "onChange",
  });

  // send otp code to email address
  const handleSendOtp = async () => {
    try {
      if (isPhone) {
        setBtnLoading(true);
        const res = await axios.post(`${API_URL}/auth/phoneOtp`, {
          email: emailAddress,
          number: `+${phoneNumber}`,
        });

        console.log(res);

        if (res?.data?.status === "PENDING") {
          setPhoneCodeError("");
          setPhoneCodeSuccess("A code has been sent to your phone");
        } else if (res?.data?.message === "verification failed to send") {
          setPhoneCodeSuccess("");
          setPhoneCodeError(res?.data?.error || res?.data?.message);
        } else {
          setEmailCodeSuccess("");
          setPhoneCodeSuccess("");
          setEmailCodeError(res?.data?.error || res?.data?.message);
        }
        setBtnLoading(false);
      }

      if (!isPhone) {
        setBtnLoading(true);
        const res = await axios.post(`${API_URL}/auth/otp`, {
          email: emailAddress,
        });

        if (res?.data?.success) {
          setEmailCodeError("");
          setEmailCodeSuccess("A code has been sent to your email");
        } else {
          setEmailCodeSuccess("");
          setEmailCodeError(res?.data?.error);
        }
        setBtnLoading(false);
      }
    } catch (error) {
      setBtnLoading(false);
      return error;
    }
  };

  const handleOtpVerification = async () => {
    try {
      setBtnLoading(true);
      const { email, code } = getValues();
      const data = {
        email,
        otp: code,
      };

      const res = await axios.post(`${API_URL}/auth/otpValidate`, data);

      if (res.data?.code) {
        setValue("email", email);
        setValue("code", res.data?.code);

        setOtpError("");
        setOtpValidated(true);

        handlePage(2);
      }

      if (res.data?.success === false) {
        setOtpValidated(false);
        setOtpError(res.data?.error);
      }
      setBtnLoading(false);
    } catch (error) {
      setBtnLoading(false);
      return error;
    }
  };

  const switchToPhone = () => {
    setIsPhone((prev) => !prev);
  };

  useEffect(() => {
    if (isPhone) {
      if (emailAddress !== "" && phoneNumber !== "") {
        setIsInputActive(true);
      } else {
        setIsInputActive(false);
      }
    }

    if (!isPhone) {
      if (emailAddress !== "") {
        setIsInputActive(true);
      } else {
        setIsInputActive(false);
      }
    }
  }, [emailAddress, phoneNumber, isPhone]);

  return (
    <ComponentsContainer>
      {isPhone && (
        <div className="input-container margin">
          <div className="signup-option-container">
            <span className="input-header">phone*</span>
            <span className="input-links" onClick={switchToPhone}>
              sign up with email
            </span>
          </div>
          <PhoneInput
            inputStyle={{
              width: "100%",
              height: "50px",
              background: "#ededed",
              boxShadow: "none",
            }}
            country={"us"}
            className="marginBottom"
            value={phoneNumber}
            onChange={(phone) => {
              setPhoneNumber(phone);
            }}
          />
          {phoneCodeError && (
            <div className="instruction-error">{phoneCodeError}</div>
          )}
          {phoneCodeSuccess && (
            <div className="instruction-success">{`✔${phoneCodeSuccess}`}</div>
          )}
        </div>
      )}

      <div className="input-container margin">
        <div className="signup-option-container">
          <span className="input-header">email*</span>
          {!isPhone && (
            <span className="input-links" onClick={switchToPhone}>
              sign up with phone
            </span>
          )}
        </div>
        <input
          {...register("email")}
          type="text"
          placeholder="email"
          className="input"
          onChange={(e) => {
            setEmailAddress(e.target.value);
          }}
        />
        {emailCodeError && (
          <div className="instruction-error">{emailCodeError}</div>
        )}

        {emailCodeSuccess && (
          <div className="instruction-success">{`✔${emailCodeSuccess}`}</div>
        )}
      </div>

      <div className="input-container margin">
        <div className="code-container">
          <input
            {...register("code")}
            type="text"
            placeholder="enter 4-digit code"
            className="input no-border"
            onChange={(e) => {
              setInputCode(e.target.value);
            }}
            onFocus={() => {
              setEmailCodeError("");
              setEmailCodeSuccess("");
            }}
          />
          <button
            disabled={isInputActive === false}
            className={
              isInputActive === false || btnLoading
                ? "disabled-code-btn"
                : "code-btn"
            }
            onClick={handleSendOtp}
          >
            Send code
          </button>
        </div>
        {otpError && <span className="instruction-error">{otpError}</span>}
        {otpValidated && (
          <span className="instruction-success">
            ✔your code has been verified
          </span>
        )}
      </div>

      {!otpValidated && (
        <button
          disabled={inputCode === "" || inputCode.length !== 4}
          className={
            inputCode === "" || inputCode.length !== 4 || btnLoading
              ? "disabled disabled-color"
              : "next-btn btn-color"
          }
          onClick={() => handleOtpVerification()}
        >
          Verify
        </button>
      )}
    </ComponentsContainer>
  );
};

export default EmailCode;
