import React from "react";
import { Route, Redirect } from "react-router";

const PrivateRoute: React.FC<any> = ({ component: Component, ...rest }) => {
  return (
    <Route
      {...rest}
      render={(props) => {
        if (!localStorage.getItem("token")) {
          // not logged in so redirect to login page with the return url
          return (
            <Redirect
              to={{ pathname: "/login", state: { from: props.location } }}
            />
          );
        }
        // logged in so return the prop component
        return <Component {...props} />;
      }}
    />
  );
};

export default PrivateRoute;
