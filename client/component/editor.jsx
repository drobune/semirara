import React from "react";
import {Component, getStore} from "../store";
const store = getStore();

export default class Editor extends Component {

  constructor(){
    super();
    this.onChange = this.onChange.bind(this);
  }

  mapState(state){
    return {page: state.page, user: state.user};
  }

  render(){
    this.debug("render()");
    return (
      <div>
        <h1>editor</h1>
        <textarea rows="10" cols="100" onChange={this.onChange} value={this.state.page.text} />
      </div>
    );
  }

  onChange(e){
    store.dispatch({type: "editor:text", value: e.target.value});
  }

}
