const debug = require("debug")("semirara:socket");

import mongoose from "mongoose";
import {isValidPageNumber} from "../model/page";
const Page = mongoose.model("Page");

import {diffpatch, clone} from "../../../lib/diffpatch";

export function use(app){

  const io = app.context.io;

  io.on("connection", (socket) => {
    socket.on("page:get", async (data) => {
      const number = data.number;
      if(typeof number !== "number") return;
      const page = await Page.findOne({number}) || new Page({number});
      socket.emit("page:get:result", page.toHash());
    });

    socket.on("page:lines:diff", async (data) => {
      debug(data);
      const diff = data.diff;
      const number = data.number;
      if(!diff || typeof number !== "number") return;
      socket.broadcast.emit("page:lines:diff", {diff, number});
      const page = await Page.findOne({number}) || new Page({number});
      debug(page);
      page.lines = diffpatch.patch(clone(page.lines), diff);
      page.save();
    });
  });
}
