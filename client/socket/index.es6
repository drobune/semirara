const debug = require("debug")("semirara:socket");

import SocketIO from "socket.io-client";
import {getStore} from "../store";
const store = getStore();

const io = SocketIO();
io.on("connect", () => {
  debug("connect");
});

io.on("page:text", (data) => {
  debug(data);
  store.dispatch({type: "page:text", value: data});
});

let lastText = "";

store.subscribe(() => {
  const state = store.getState();
  if(lastText !== state.page.text){
    debug(state.page.text);
    io.emit("page:text", state.page.text);
  }
  lastText = state.page.text;
});
