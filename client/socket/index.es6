const debug = require("debug")("semirara:socket");

import SocketIO from "socket.io-client";
import {getStore} from "../store";
const store = getStore();

const io = SocketIO();
io.on("connect", () => {
  debug("connect");
  const state = store.getState();
  io.emit("page:get", {number: state.page.number});
});

io.on("page:get:result", (page) => {
  debug(page);
  store.dispatch({type: "page", value: page});
});

io.on("disconnect", () => {
  debug("disconnect");
});

io.on("page:lines:diff", (data) => {
  if(!data.diff) return;
  store.dispatch({type: "page:lines:patch", value: data.diff});
});

store.subscribe(() => {
  const state = store.getState();
  const diff = state.page.diff;
  const number = state.page.number;
  if(diff && number){
    io.emit("page:lines:diff", {diff, number});
  }
});
