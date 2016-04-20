import React, {Component} from "react";

export default class ClickHold extends Component{

  static get propTypes(){
    return {
      children: React.PropTypes.node.isRequired,
      interval: React.PropTypes.number.isRequired,
      onClickHold: React.PropTypes.func.isRequired
    };
  }

  constructor(){
    super();
    this.start = this.start.bind(this);
    this.stop = this.stop.bind(this);
    this.timeout = null;
  }

  render(){
    return (
      <span
         onMouseDown={this.start}
         onMouseUp={this.stop}
         onMouseOut={this.stop}>
        {this.props.children}
        </span>);
  }

  start(e){
    this.stop();
    this.timeout = setTimeout(this.props.onClickHold, this.props.interval);
  }

  stop(e){
    if(!this.timeout) return;
    clearTimeout(this.timeout);
    this.timeout = null;
  }

}
