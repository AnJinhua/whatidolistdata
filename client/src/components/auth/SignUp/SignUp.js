import * as React from "react";
import { useState, useEffect } from "react";
import Avatar from "@mui/material/Avatar";
import Button from "@mui/material/Button";
import CssBaseline from "@mui/material/CssBaseline";
import TextField from "@mui/material/TextField";
import FormControlLabel from "@mui/material/FormControlLabel";
import Checkbox from "@mui/material/Checkbox";
import Link from "@mui/material/Link";
import Paper from "@mui/material/Paper";
import Box from "@mui/material/Box";
import Grid from "@mui/material/Grid";
import LockOutlinedIcon from "@mui/icons-material/LockOutlined";
import Typography from "@mui/material/Typography";
import { createTheme, ThemeProvider } from "@mui/material/styles";
import Connect from "../../../assets/connect.jpg";
import Logo from "../../../assets/logo-icon.png";
import { registerUser } from "../../../actions/auth";
import { API_URL, CLIENT_ROOT_URL } from "../../../constants/api";
import { useDispatch } from "react-redux";
import { useHistory } from "react-router";
import axios from "axios";
import MenuItem from "@mui/material/MenuItem";
import { SHOWLOGIN } from "../../../constants/actions";
function Copyright(props) {
  return (
    <Typography
      variant="body2"
      color="text.secondary"
      align="center"
      {...props}
    >
      {"Copyright © "}
      <Link color="inherit" href={CLIENT_ROOT_URL}>
        whatido.app
      </Link>{" "}
      {new Date().getFullYear()}
      {"."}
    </Typography>
  );
}
const theme = createTheme();

export default function SignUp(props) {
  const default_props = {
    errorMessage: "",
    message: "",
  };
  const [state, setState] = useState(default_props);
  const [subCategories, setSubCategories] = useState([]);
  const [subCategory, setSubCategory] = useState();
  const [updated_area_of_experties, setUpdated_area_of_experties] =
    useState("");
  const [categories, setCategories] = useState([]);
  const dispatch = useDispatch();
  const history = useHistory();

  const handleSubmit = (event) => {
    event.preventDefault();
    const data = new FormData(event.currentTarget);

    console.log({
      firstName: data.get("firstName"),
      lastName: data.get("lastName"),
      password: data.get("password"),
      password2: data.get("password2"),
      updated_area_of_experties,
      subCategory,
    });

    const newData = {
      firstName: data.get("firstName"),
      lastName: data.get("lastName"),
      password: data.get("password"),
      expertise: subCategory,
      email: data.get("email"),
    };

    var regex =
      /^(?=.*?[A-Z])(?=.*?[a-z])(?=.*?[0-9])(?=.*?[#?!@$%^&*-]).{8,20}$/;
    if (!regex.test(newData.password)) {
      const errMsg =
        "Password must be in rage of 8-20 characters and contain at least 1 uppercase 1 lowercase,  1 digit and 1 special character (#?!@$%^&*-).";
      setState({ ...state, errorMessage: errMsg });
      return false;
    }
    if (newData.password !== data.get("password2")) {
      const errMsg = "Password must match with confirmation password";
      setState({ ...state, errorMessage: errMsg });
      return false;
    }

    dispatch(registerUser(newData)).then((res) => {
      if (
        res.data.error &&
        res.data.error !== null &&
        res.data.error !== undefined &&
        res.data.error !== ""
      ) {
        setState({ ...state, errorMessage: res.data.error });
      }
      if (res.data.success && res.data.success === true) {
        setState({
          ...state,
          successMessage:
            "Successfully Created Account. Check your Email for verification message You Will be redirected to Login in 4 seconds.",
        });

        setTimeout(function () {
          history.push("login");
        }, 4000);
      }
    });
  };

  useEffect(() => {
    axios.get(`${API_URL}/getExpertsCategoryList`).then((res) => {
      setCategories(res.data);
    });
  }, []);

  const handleChange = (event) => {
    setUpdated_area_of_experties(event.target.value);
    axios
      .get(`${API_URL}/getExpertsSubCategoryList/` + event.target.value)
      .then((res) => {
        setSubCategories(res.data["0"].subcategory);
      });
  };

  const handleChange2 = (event) => {
    setSubCategory(event.target.value);
  };

  const handelLogin = () => {
    history.push("/");
    dispatch({
      type: SHOWLOGIN,
      payload: true,
    });
  };
  return (
    <ThemeProvider theme={theme}>
      <Grid container component="main" sx={{ height: "100vh" }}>
        <CssBaseline />
        <Grid
          item
          xs={false}
          sm={4}
          md={7}
          sx={{
            backgroundImage: `url(${Connect})`,
            backgroundRepeat: "no-repeat",
            backgroundColor: (t) =>
              t.palette.mode === "light"
                ? t.palette.grey[50]
                : t.palette.grey[900],
            backgroundSize: "cover",
            backgroundPosition: "center",
          }}
        />
        <Grid item xs={12} sm={8} md={5} component={Paper} elevation={6} square>
          <Box
            sx={{
              my: 8,
              mx: 4,
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
            }}
          >
            <Avatar
              src={Logo}
              component="button"
              sx={{ m: 1, bgcolor: "secondary.main", border: 0 }}
              onClick={() => {
                history.push("/");
              }}
            >
              <LockOutlinedIcon />
            </Avatar>
            <Typography component="h1" variant="h5">
              Sign Up
            </Typography>

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
                  {` ${state.errorMessage} `}
                </div>
              )}
            {state.successMessage &&
              state.successMessage !== null &&
              state.successMessage !== undefined &&
              state.successMessage !== "" && (
                <div className="alert alert-success">
                  {state.successMessage}
                </div>
              )}
            <Box component="form" onSubmit={handleSubmit} sx={{ mt: 2, mx: 4 }}>
              <Grid container spacing={3}>
                <Grid item xs={12} sm={6}>
                  <TextField
                    autoComplete="given-name"
                    name="firstName"
                    required={true}
                    fullWidth
                    id="firstName"
                    label="First Name"
                    autoFocus
                  />
                </Grid>
                <Grid item xs={12} sm={6}>
                  <TextField
                    required={true}
                    fullWidth
                    id="lastName"
                    label="Last Name"
                    name="lastName"
                    autoComplete="family-name"
                  />
                </Grid>
                <Grid item xs={12}>
                  <TextField
                    required={true}
                    fullWidth
                    id="email"
                    label="Email Address"
                    name="email"
                    autoComplete="email"
                  />
                </Grid>

                <Grid item xs={12}>
                  <TextField
                    id="outlined-select-category"
                    select
                    label="Category"
                    fullWidth
                    value={updated_area_of_experties}
                    onChange={handleChange}
                    helperText="Please select Category"
                    required={true}
                  >
                    {categories &&
                      categories?.map((option) => (
                        <MenuItem key={option._id} value={option._id}>
                          {option.name}
                        </MenuItem>
                      ))}
                  </TextField>
                </Grid>
                <Grid item xs={12}>
                  <TextField
                    id="outlined-select-subcategory"
                    select
                    label="Subcategory"
                    fullWidth
                    value={subCategory}
                    onChange={handleChange2}
                    helperText="Please select Subcategory"
                    required={true}
                  >
                    {subCategories &&
                      subCategories?.map((option, i) => (
                        <MenuItem
                          key={i}
                          value={option.slug}
                          sx={{
                            textTransform: "capitalize",
                          }}
                        >
                          {option.name}
                        </MenuItem>
                      ))}
                  </TextField>
                </Grid>
                <Grid item xs={12} sm={6}>
                  <TextField
                    required
                    fullWidth
                    name="password"
                    label="Password"
                    type="password"
                    id="password"
                    autoComplete="new-password"
                  />
                </Grid>
                <Grid item xs={12} sm={6}>
                  <TextField
                    name="password2"
                    label="Confirm Password"
                    type="password"
                    id="password2"
                    required
                    fullWidth
                    autoComplete="Confirm Password"
                  />
                </Grid>
                <Grid item xs={12}>
                  <FormControlLabel
                    control={
                      <Checkbox value="allowExtraEmails" color="primary" />
                    }
                    label="I want to receive inspiration, marketing promotions and updates via email."
                  />
                </Grid>
              </Grid>
              <Button
                type="submit"
                fullWidth
                variant="contained"
                sx={{ mt: 3, mb: 2 }}
              >
                Sign Up
              </Button>
              <Grid container justifyContent="flex-end">
                <Grid item>
                  <Link
                    component="button"
                    to={CLIENT_ROOT_URL}
                    variant="body2"
                    onClick={handelLogin}
                  >
                    Already have an account? Sign in
                  </Link>
                </Grid>
              </Grid>
              <Copyright sx={{ mt: 5 }} />
            </Box>
          </Box>
        </Grid>
      </Grid>
    </ThemeProvider>
  );
}
