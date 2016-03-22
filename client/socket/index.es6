const debug = require("debug")("semirara:socket");

import SocketIO from "socket.io-client";
import {getStore} from "../store";
const store = getStore();

const io = SocketIO();
io.on("connect", () => {
  debug("connect");
});

io.on("page:text", (data) => {
  debug("received: " + data);
  store.dispatch({type: "page:text:received", value: data});
});

store.subscribe(() => {
  const state = store.getState();
  if(state.page.editByMe){
    debug(state.page.text);
    io.emit("page:text", state.page.text);
  }
});
