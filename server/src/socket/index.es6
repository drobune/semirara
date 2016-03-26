const debug = require("debug")("semirara:socket");

import mongoose from "mongoose";
import {isValidPageNumber} from "../model/page";
const Page = mongoose.model("Page");

import {diffpatch, clone} from "../../../lib/diffpatch";

export function use(app){

  const io = app.context.io;

  io.on("connection", (socket) => {
    socket.on("page:get", async (data) => {
      const _id = data._id;
      debug(`page:get ${_id}`);
      const page = await Page.findOne({_id});
      if(!page){
        return socket.emit("page:get:result", {error: "notfound", _id});
      }
      socket.emit("page:get:result", page);
    });

    socket.on("page:lines:diff", async (data) => {
      debug(data);
      const diff = data.diff;
      const _id = data._id;
      if(!diff) return;
      const page = await Page.findOne({_id}) || new Page();
      page.lines = diffpatch.patch(clone(page.lines), diff);
      await page.save();
      debug(page);
      if(!_id) socket.emit("page:_id", {_id: page._id});
      socket.broadcast.emit("page:lines:diff", {diff, _id: page._id});
    });
  });
}
