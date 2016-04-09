const debug = require("debug")("semirara:socket");

import ioreq from "socket.io-request";

import mongoose from "mongoose";
const Page = mongoose.model("Page");

import PageRoom from "./pageroom";
import {diffpatch, clone} from "../../../lib/diffpatch";

export function use(app){

  const io = app.context.io;

  io.on("connection", (socket) => {
    const pageRoom = new PageRoom(socket);

    socket.on("page:lines:diff", async (data) => {
      debug("page:lines:diff");
      debug(data);
      const {title, wiki, diff} = data;
      if(!title || !wiki || !diff) return;
      pageRoom.join({title, wiki});
      socket.broadcast.to(pageRoom.name).emit("page:lines:diff", {diff});
    });

    ioreq(socket).response("getpage", async (req, res) => {
      const {wiki, title} = req;
      pageRoom.join({title, wiki});
      const page = await Page.findOne({wiki, title}) || new Page({wiki, title});
      res(page);
    })
  });
}
