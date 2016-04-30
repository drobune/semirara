const debug = require("debug")("semirara:socket:urltype");

import mongoose from "mongoose";
const URLType = mongoose.model("URLType");

export default function use(app){

  const io = app.context.io;

  io.on("connection", (socket) => {
    socket.on("urltype", ({url, type}) => {
      debug({url, type});
      const urlType = new URLType({url, type});
      urlType.save();
    });
  });
}
