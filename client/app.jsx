const debug = require("debug")("semirara:app");

import React, {Component} from "react";
import Header from "./component/header";
import Editor from "./component/editor";
import "./socket";

export default class App extends Component{

  render(){
    debug("render()");
    return (
      <div>
        <Header />
        <Editor />
      </div>
    );
  }
}

import {getStore} from "./store";
const store = getStore();

store.subscribe(() => {
  const state = store.getState();
  if(location.pageId === state.page._id) return;
  history.pushState(null, null, "/"+(state.page._id || ""));
});
