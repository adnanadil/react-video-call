import React from "react";
import { Route, Routes } from "react-router-dom";
import MainPage from "./MainPage";
import FirstPage from "./FirstPage";
import store from "./redux/store";
import { Provider } from "react-redux";

function App(props) {
  return (
    <Provider store={store}>
      <Routes>
        {/* <Route path="/" element={<FirstPage />} /> */}
        <Route path="/" element={<MainPage />} />
      </Routes>
    </Provider>
  );
}

export default App;
