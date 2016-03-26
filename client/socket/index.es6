const debug = require("debug")("semirara:socket");

import SocketIO from "socket.io-client";
import {getStore} from "../store";
const store = getStore();

const io = SocketIO();
io.on("connect", () => {
  debug("connect");
});

io.on("page:text:diff", (data) => {
  if(!data.diff) return;
  store.dispatch({type: "page:text:patch", value: data.diff});
});

store.subscribe(() => {
  const state = store.getState();
  if(state.page.diff){
    io.emit("page:text:diff", {diff: state.page.diff});
  }
});
