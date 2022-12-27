import { useEffect } from "react";
import { useDispatch } from "react-redux";
import { useCookies } from "react-cookie";
import { useHistory, useParams } from "react-router";
import { SHOWSIGNUP, TOGGLE_SIGNUP_STEP } from "../../constants/actions";
import undraw_certification from "../../assets/undraw_certification.svg";

const Signup = () => {
  const [cookies] = useCookies();
  const params = useParams();
  console.log(params);
  console.log(cookies);
  const dispatch = useDispatch();
  const history = useHistory();

  useEffect(() => {
    if (cookies.user) {
      history.push("/profile");
    } else {
      dispatch({ type: TOGGLE_SIGNUP_STEP, payload: 2 });
      dispatch({
        type: SHOWSIGNUP,
        payload: true,
      });
    }
  }, [cookies, history]);

  return (
    <div className="col-sm-6 mtop100 col-sm-offset-3">
      <div className="page-title text-center">
        {" "}
        <img
          loading="lazy"
          src={undraw_certification}
          alt="account created"
          style={{
            width: "30vw",
            height: "25vh",
            margin: "-5rem",
          }}
        />
      </div>
    </div>
  );
};

export default Signup;
