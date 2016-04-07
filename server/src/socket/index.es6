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
      const diff = data.diff;
      if(!diff) return;
      socket.broadcast.emit("page:lines:diff", {diff});
    });
  });
}
