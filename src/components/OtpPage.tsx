import { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { getAuth } from "../selectors";
import { loginRequest } from "../slices/auth";
import { history } from "../utils";

function OtpPage() {
  //set state
  const [inputs, setInputs] = useState({
    username: "",
    code: "",
    otp_uuid: "",
  });
  const { code, username, otp_uuid } = inputs;
  const [submitted, setSubmitted] = useState(false);
  //get state from store

  const loggingIn = useSelector(getAuth).loggingIn;
  const user = useSelector(getAuth).user;
  //const otp_uuid = user.otp_uuid;

  const dispatch = useDispatch();
  //const location = useLocation<any>();

  useEffect(() => {
    if (user.otp_uuid === "") {
      history.push({ pathname: "/login" });
    }
    setInputs((inputs1) => ({ ...inputs1, username: user.username }));
    setInputs((inputs2) => ({ ...inputs2, otp_uuid: user.otp_uuid }));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  function handleChange(e: any) {
    const { name, value } = e.target;
    setInputs((data) => ({ ...data, [name]: value }));
  }

  function handleSubmit(e: any) {
    e.preventDefault();
    setSubmitted(true);
    if (code) {
      // get return url from location state or default to home/otp page
      dispatch(loginRequest({ username, otp_uuid, code }));
    }
  }

  return (
    <div className='col-lg-8 offset-lg-2'>
      <h2>OTP Code Authentication</h2>
      <form name='form' onSubmit={handleSubmit}>
        <div className='form-group'>
          <label>Input Otp code:</label>
          <input
            type='text'
            name='code'
            value={code}
            onChange={handleChange}
            className={
              "form-control" + (submitted && !code ? " is-invalid" : "")
            }
          />
          {submitted && !code && (
            <div className='invalid-feedback'>Otp code required!</div>
          )}
        </div>
        <div className='form-group'>
          <button className='btn btn-primary'>
            {loggingIn && (
              <span className='spinner-border spinner-border-sm mr-1'></span>
            )}
            Login
          </button>
        </div>
      </form>
    </div>
  );
}

export { OtpPage };
