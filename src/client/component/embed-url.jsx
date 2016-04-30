import React, {Component, PropTypes} from "react";
import md5 from "md5";
import hasDom from "has-dom";

export const URLTypes = {
  unknown: 0b1111,
  text:    0b0001,
  image:   0b0010,
  video:   0b0100,
  audio:   0b1000
};

function getLocalStorageKey(url){
  if(!(/^https?:\/\/[^\s]+$/.test(url))) throw new Error(`${url} is not URL`);
  return `url-type:${md5(url)}`;
}

function getTypeFromLocalStorage(url){
  if(hasDom() && localStorage) return parseInt(localStorage[getLocalStorageKey(url)]);
  return null;
}

function saveTypeToLocalStorage(url, type){
  if(!hasDom() || !localStorage) return;
  if(typeof type !== "number") throw new Error('"type" must be number');
  localStorage[getLocalStorageKey(url)] = type;
}

export default class EmbedURL extends Component {

  static get propTypes(){
    return {
      url: PropTypes.string.isRequired,
      type: PropTypes.number
    };
  }

  componentWillMount(){
    let type;
    if(this.props.type){
      type = this.props.type;
    }
    else{
      type = getTypeFromLocalStorage(this.props.url) || URLTypes.unknown;
    }
    this.state = { type };
  }

  shouldComponentUpdate(nextProps, nextStates){
    return this.state.type !== nextStates.type;
  }

  componentDidUpdate(){
    saveTypeToLocalStorage(this.props.url, this.state.type);
  }

  constructor(){
    super();
    this.onImage = this.onImage.bind(this);
    this.onNotImage = this.onNotImage.bind(this);
  }

  onImage(e){
    this.setState({type: URLTypes.image});
  }

  onNotImage(e){
    this.setState({type: URLTypes.text});
  }

  render(){
    const {url} = this.props;
    switch(this.state.type){
    case URLTypes.image: {
      return (
        <x-embed-url>
          <img src={url} />
        </x-embed-url>
      );
    }
    case URLTypes.text: {
      return (
        <x-embed-url>
          <a href={url}>{url}</a>
        </x-embed-url>
      );
    }
    case URLTypes.unknown:
    default: {
      return (
        <x-embed-url>
          <img
             src={url}
             style={{display: "none"}}
             onLoad={this.onImage}
             onError={this.onNotImage}
             />
          <a href={url}>{url}</a>
        </x-embed-url>
      );
    }
    }
  }

}
