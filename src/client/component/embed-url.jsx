import React, {Component, PropTypes} from "react";

export const URLTypes = {
  undefined: 0,
  text: 1,
  image: 2
};

export default class EmbedURL extends Component {

  static get propTypes(){
    return {
      url: PropTypes.string.isRequired,
      type: PropTypes.number
    };
  }

  static get defaultProps(){
    return {
      type: URLTypes.undefined
    };
  }

  componentWillMount(){
    this.state = {
      type: this.props.type
    };
  }

  constructor(){
    super();
    this.onImage = this.onImage.bind(this);
  }

  onImage(e){
    this.setState({type: URLTypes.image});
  }

  render(){
    const {url} = this.props;
    switch(this.state.type){
    case URLTypes.undefined: {
      return (
        <x-embed-url>
          <img
             src={url}
             style={{display: "none"}}
             onLoad={this.onImage}
             onError={e => console.error("onerror")}
             />
          <a href={url}>{url}</a>
        </x-embed-url>
      );
    }
    case URLTypes.image: {
      return (
        <x-embed-url>
          <img src={url} />
        </x-embed-url>
      );
    }
    }
  }

}
