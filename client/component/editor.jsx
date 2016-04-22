import React from "react";
import {Component, store} from "../store";
import EditorLine from "./editorline";

export default class Editor extends Component {

  constructor(){
    super();
    this.startEdit = this.startEdit.bind(this);
    this.onKeyDown = this.onKeyDown.bind(this);
  }

  mapState(state){
    return {page: state.page, user: state.user};
  }

  render(){
    let lis;
    if(this.state.page.lines.length < 1 && !this.state.page.editline){
      lis = [(
        <li key={0}>
          <EditorLine value="(empty)" onStartEdit={() => this.startEdit(0)} />
        </li>
      )];
      this.debug(lis);
    }
    else{
      lis = Object.keys(this.state.page.lines).map(i => {
        i = parseInt(i);
        let line = this.state.page.lines[i];
        return (
          <li key={i} style={{marginLeft: line.indent*20}}>
            <EditorLine
               value={line.value}
               edit={this.state.page.editline === i}
               onStartEdit={() => this.startEdit(i)}
               onChange={value => store.dispatch({type: "updateLine", value})}
               onKeyDown={e => this.onKeyDown(e)}
              />
          </li>
        );
      });
    }
    return (
      <div className="editor">
        <ul>{lis}</ul>
      </div>
    );
  }

  startEdit(editline){
    this.debug(`start edit line:${editline}`);
    store.dispatch({type: "editline", value: editline});
  }

  onKeyDown(e){
    this.debug("keyCode = " + e.keyCode);
    switch(e.keyCode){
    case 13: // enter
      store.dispatch({type: "insertNewLine"});
      break;
    case 40: // down
      if(e.ctrlKey) store.dispatch({type: "swapLine:down"});
      else if(e.shiftKey) store.dispatch({type: "swapBlock:down"});
      else store.dispatch({type: "editline:down"});
      break;
    case 38: // up
      if(e.ctrlKey) store.dispatch({type: "swapLine:up"});
      else if(e.shiftKey) store.dispatch({type: "swapBlock:up"});
      else store.dispatch({type: "editline:up"});
      break;
    case 78: // ctrl + N
      if(e.ctrlKey) store.dispatch({type: "editline:down"});
      break;
    case 80:// ctrl + P
      if(e.ctrlKey) store.dispatch({type: "editline:up"});
      break;
    case 37: // left
      if(e.ctrlKey) store.dispatch({type: "indent:decrement"});
      else if(e.shiftKey) store.dispatch({type: "indentBlock:decrement"});
      break;
    case 39: // right
      if(e.ctrlKey) store.dispatch({type: "indent:increment"});
      else if(e.shiftKey) store.dispatch({type: "indentBlock:increment"});
      break;
    case 32: // space
      if(e.target.selectionStart !== 0 ||
         e.target.selectionEnd !== 0) break;
      e.preventDefault();
      store.dispatch({type: "indent:increment"});
      break;
    case 8: // backspace
      if(e.target.selectionStart !== 0 ||
         e.target.selectionEnd !== 0) break;
      e.preventDefault();
      store.dispatch({type: "indent:decrement"});
      break;
    }
  }

}
