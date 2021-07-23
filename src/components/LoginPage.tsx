import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { getAuth } from "../selectors";
import { logout } from "../slices/auth";
import { ReactMouseEvent, ReactSubmitEvent } from "../types";
import { login, history } from "../utils";

function LoginPage() {
  //state
  const [inputs, setInputs] = useState({
    username: "",
    password: "",
    remember: false,
  });
  const { username, password, remember } = inputs;
  const [submitted, setSubmitted] = useState(false);

  const loggingIn = useSelector(getAuth).loggingIn;
  const loggedIn = useSelector(getAuth).loggedIn;
  const dispatch = useDispatch();

  // reset login status
  useEffect(() => {
    // if user has logged in, redirect to the home page
    if (loggedIn && localStorage.getItem("token")) {
      history.push({ pathname: "/" });
    } else {
      localStorage.removeItem("token");
      dispatch(logout());
    }

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  function handleChange(event: ReactMouseEvent) {
    const { name, value } = event.target;
    setInputs((data) => ({ ...data, [name.toString()]: value }));
  }

  function handleSubmit(event: ReactSubmitEvent) {
    event.preventDefault();
    setSubmitted(true);
    if (username && password) {
      login(username, password, remember);
    }
  }

  return (
    <div className='col-lg-8 offset-lg-2'>
      <h2>Login</h2>
      <form name='form' onSubmit={handleSubmit}>
        <div className='form-group'>
          <label>Username</label>
          <input
            type='text'
            name='username'
            onChange={handleChange}
            className={
              "form-control" + (submitted && !username ? " is-invalid" : "")
            }
          />
          {submitted && !username && (
            <div className='invalid-feedback'>Username is required</div>
          )}
        </div>
        <div className='form-group'>
          <label>Password</label>
          <input
            type='password'
            name='password'
            onChange={handleChange}
            className={
              "form-control" + (submitted && !password ? " is-invalid" : "")
            }
          />
          {submitted && !password && (
            <div className='invalid-feedback'>Password is required</div>
          )}
        </div>
        <div className='form-check'>
          <input
            className='form-check-input'
            type='checkbox'
            name='remember'
            onChange={handleChange}
            id='flexCheckDefault'
          />
          <label className='form-check-label' htmlFor='flexCheckDefault'>
            Remember me for 30 days
          </label>
        </div>
        <br />
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

export { LoginPage };
