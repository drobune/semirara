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
    case URLTypes.undefined: {
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
    }
  }

}
