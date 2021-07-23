import "antd/dist/antd.css";
import ReactDOM from "react-dom";
import { Provider } from "react-redux";
import App from "./App";
import { PersistGate } from "redux-persist/es/integration/react";
import { persistor, store } from "./utils";
import "./styles/index.css";


ReactDOM.render(
  <Provider store={store}>
    <PersistGate persistor={persistor}>
      <App />
    </PersistGate>
  </Provider>,
  document.getElementById("root")
);
