import { useEffect } from "react";
import { useDispatch} from "react-redux";
import { Redirect, Route, Router, Switch } from "react-router-dom";
import {
  ActionPage,
  CloudConfigPage,
  CloudManagerDetailPage,
  CloudPage,
  CloudServiceDetailPage,
  DevicePage,
  LocationPage,
  LoginPage,
  OtpPage,
  PositionPage,
  ProfileDetailPage,
  ProfilePage,
} from "./components";
import HeaderBar from "./components/HeaderBar";
import { ChangePswd } from "./components/settingsSubPages/ChangePswd";
import { Enable2FA } from "./components/settingsSubPages/Enable2FA";
import { NewSettingItem } from "./components/settingsSubPages/NewSettingItem";
import { UserProfile } from "./components/settingsSubPages/UserProfile";
import { UserPage } from "./components/users/UserPage";
import PrivateRoute from "./routers/PrivateRoute";
// import { getAlert } from "./selectors";
import { clear } from "./slices/alert";
import "./styles/App.css";
import { history } from "./utils";

function App() {
  // const alert = useSelector(getAlert);
  const dispatch = useDispatch();

  useEffect(() => {
    history.listen((location, action) => {
      // clear alert on location change
      dispatch(clear());
    });
    dispatch(clear());
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []); //[]表示加载组件后只运行一次

  return (
    <div className='h-screen'>
      <HeaderBar />
      <div className='container h-screen'>
        <br />
        <br />
        <br />
        <br />
        <div className='offset-md-0'>
          {/* {alert.message && (
            <div className={`alert ${alert.type}`}>{alert.message}</div>
          )} */}
          <Router history={history}>
            <Switch>
              <PrivateRoute exact path='/' component={CloudPage} />
              <PrivateRoute exact path='/location' component={LocationPage} />
              <PrivateRoute exact path='/profile' component={ProfilePage} />
              <PrivateRoute exact path='/users' component={UserPage} />
              <PrivateRoute
                exact
                path='/settings/profile'
                component={UserProfile}
              />
              <PrivateRoute
                exact
                path='/settings/password'
                component={ChangePswd}
              />
              <PrivateRoute
                exact
                path='/settings/enable2FA'
                component={Enable2FA}
              />
              <PrivateRoute
                exact
                path='/settings/newSettingItem'
                component={NewSettingItem}
              />
              <PrivateRoute
                exact
                path={"/location/:uuid"}
                component={DevicePage}
              />
              <PrivateRoute
                exact
                path={"/device/:uuid"}
                component={ActionPage}
              />
              <PrivateRoute
                exact
                path={"/profile/:uuid"}
                component={ProfileDetailPage}
              />
              <PrivateRoute
                exact
                path={"/manager/:uuid"}
                component={CloudManagerDetailPage}
              />
              <PrivateRoute
                exact
                path={"/service/:uuid"}
                component={CloudServiceDetailPage}
              />
              <PrivateRoute
                exact
                path={"/config/:uuid"}
                component={CloudConfigPage}
              />
              <PrivateRoute
                exact
                path={"/camera/:uuid"}
                component={PositionPage}
              />
              <Route path='/login' component={LoginPage} />
              <Route path='/otp' component={OtpPage} />
              <Redirect from='*' to='/' />
            </Switch>
          </Router>
        </div>
      </div>
    </div>
  );
}

export default App;
