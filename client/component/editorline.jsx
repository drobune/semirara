import React, {Component} from "react";
import ReactDOM from "react-dom";

import ClickHold from "./clickhold";
import compile from "../syntax";

export default class EditorLine extends Component{

  static get propTypes(){
    return {
      value: React.PropTypes.string.isRequired,
      edit: React.PropTypes.bool,
      onStartEdit: React.PropTypes.func,
      onChange: React.PropTypes.func,
      onKeyDown: React.PropTypes.func
    };
  }

  render(){
    if(this.props.edit){
      return (
        <input
           ref="input"
           value={this.props.value}
           onChange={e => this.props.onChange(e.target.value)}
           onClick={e => e.stopPropagation()}
           onKeyDown={this.props.onKeyDown}
          />
      );
    }
    else{
      return (
        <ClickHold onClickHold={this.props.onStartEdit} interval={500}>
          {compile(this.props.value)}
        </ClickHold>
      );
    }
  }

  componentDidUpdate(){
    if(!this.props.edit) return;
    ReactDOM.findDOMNode(this.refs.input).focus();
  }

}
