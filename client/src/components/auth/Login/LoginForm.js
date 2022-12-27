import React from "react";
import { loginUser } from "../../../actions/auth";
import { useDispatch } from "react-redux";
import { useHistory } from "react-router";
import { Link } from "react-router-dom";
import OutlinedInput from "@mui/material/OutlinedInput";
import InputLabel from "@mui/material/InputLabel";
import InputAdornment from "@mui/material/InputAdornment";
import IconButton from "@mui/material/IconButton";
import { Button } from "@material-ui/core";
import FormControl from "@mui/material/FormControl";
import TextField from "@mui/material/TextField";
import Visibility from "@mui/icons-material/Visibility";
import VisibilityOff from "@mui/icons-material/VisibilityOff";
import { useForm } from "react-hook-form";

const LoginForm = ({ unsetUserLogin, setUserSignup }) => {
  const dispatch = useDispatch();
  const history = useHistory();
  const [values, setValues] = React.useState({
    amount: "",
    // password: '',
    weight: "",
    weightRange: "",
    showPassword: false,
  });

  const default_props = {
    errorMessage: "",
    message: "",
  };

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm();
  const [state, setState] = React.useState(default_props);

  // const handleChange = (prop) => (event) => {
  //   setValues({ ...values, [prop]: event.target.value })
  // }

  const handleClickShowPassword = () => {
    setValues({
      ...values,
      showPassword: !values.showPassword,
    });
  };

  const handleMouseDownPassword = (event) => {
    event.preventDefault();
  };

  const onSubmit = (data) => {
    dispatch(loginUser(data, history))
      .then((response) => {
        if (
          response.errorMessage &&
          response.errorMessage !== null &&
          response.errorMessage !== undefined &&
          response.errorMessage !== ""
        ) {
          setState({ ...state, errorMessage: response.errorMessage });
        } else {
          unsetUserLogin();
        }
      })
      .catch((err) => {
        console.log("[ERROR]:", err);
      });
  };

  return (
    <div className="login-wapper">
      {state.errorMessage &&
        state.errorMessage !== null &&
        state.errorMessage !== undefined &&
        state.errorMessage !== "" && (
          <div className="alert alert-danger">
            <i
              className="fa fa-exclamation-circle"
              aria-hidden="true"
              style={{ marginRight: "5px" }}
            ></i>
            {state.errorMessage}
          </div>
        )}
      <form onSubmit={handleSubmit(onSubmit)} style={{ margin: "0 6rem" }}>
        <TextField
          sx={{ my: 1 }}
          fullWidth
          label="Email"
          id="fullWidth"
          variant="outlined"
          inputProps={{ style: { fontSize: 16 } }}
          InputLabelProps={{ style: { fontSize: 11 } }}
          color="primary"
          {...register("email", {
            required: "Required field",
            pattern: {
              value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
              message: "Invalid email address",
            },
          })}
          error={!!errors?.email}
          helperText={errors?.email ? errors.email.message : null}
        />

        <FormControl sx={{ my: 1, width: "100%" }} variant="outlined">
          <InputLabel htmlFor="outlined-adornment-password">
            Password
          </InputLabel>
          <OutlinedInput
            inputProps={{ style: { fontSize: 16 } }}
            InputLabelProps={{ style: { fontSize: 11 } }}
            id="outlined-adornment-password"
            {...register("password", {
              required: "Required field",
            })}
            error={!!errors?.password}
            type={values.showPassword ? "text" : "password"}
            // value={values.password}
            required={true}
            // onChange={handleChange('password')}
            endAdornment={
              <InputAdornment position="end">
                <IconButton
                  aria-label="toggle password visibility"
                  onClick={handleClickShowPassword}
                  onMouseDown={handleMouseDownPassword}
                  edge="end"
                >
                  {values.showPassword ? <VisibilityOff /> : <Visibility />}
                </IconButton>
              </InputAdornment>
            }
            label="Password"
          />
        </FormControl>

        <div className="seperate">
          <div className="lgn-btn">
            {" "}
            <Button
              type="submit"
              variant="contained"
              color="primary"
              size="large"
              fullWidth
              style={{ padding: "1.5rem" }}
            >
              Login
            </Button>
          </div>
          <Link
            to="/forgot-password"
            onClick={() => {
              unsetUserLogin();
            }}
          >
            Forgot Password?
          </Link>
        </div>
      </form>
    </div>
  );
};

export default LoginForm;
