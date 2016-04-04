const debug = require("debug")("semirara:socket");

import mongoose from "mongoose";
import {isValidPageId} from "../model/page";
const Page = mongoose.model("Page");

import {diffpatch, clone} from "../../../lib/diffpatch";

export function use(app){

  const io = app.context.io;

  io.on("connection", (socket) => {
    const pageRoom = new PageRoom(socket);

    socket.on("page:get", async (data) => {
      const _id = data._id;
      debug(`page:get ${_id}`);
      const page = await Page.findOne({_id});
      if(!page){
        return socket.emit("page:get:result", {error: "notfound", _id});
      }
      pageRoom.join(_id);
      socket.emit("page:get:result", page);
    });

    socket.on("page:lines:diff", async (data) => {
      debug("page:lines:diff");
      debug(data);
      const diff = data.diff;
      const _id = data._id;
      if(!diff) return;
      const page = await Page.findOne({_id}) || new Page();
      debug(page);
      page.lines = diffpatch.patch(clone(page.lines), diff);
      const saveRes = await page.save();
      debug(saveRes);
      // debug(page);
      if(!_id) socket.emit("page:_id", {_id: page._id});
      pageRoom.join(page._id);
      socket.broadcast.to(pageRoom.name).emit("page:lines:diff", {diff, _id: page._id});
    });
  });
}

class PageRoom{
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
