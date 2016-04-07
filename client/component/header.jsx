import React from "react";
import {Component} from "../store";

import Login from "./login";

export default class Header extends Component{

  mapState(state){
    return {page: state.page};
  }

  render(){
    return(
      <div>
        <h1>{this.state.page.wiki}::{this.state.page.name}</h1>
        <Login />
      </div>
    );
  }
}
