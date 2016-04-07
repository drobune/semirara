const debug = require("debug")("semirara:socket:pageroom");

import {isValidPageId} from "../model/page";

export default class PageRoom{
  constructor(socket){
    this.socket = socket;
    this._id = null;
    socket.once("disconnect", () => {
      this.leave();
      this.socket = null;
    });
  }

  get name(){
    return `page:${this._id}`;
  }

  join(_id){
    if(_id === this._id) return;
    if(!isValidPageId(_id)){
      debug("Invalid page id: " + _id)
      return;
    }
    this.leave();
    this._id = _id;
    this.socket.join(this.name);
    debug(`${this.socket.id} joins room ${this.name}`);
  }

  leave(){
    if(!this._id) return;
    debug(`${this.socket.id} leaves room ${this.name}`);
    this.socket.leave(this.name);
    this._id = null;
  }
}
