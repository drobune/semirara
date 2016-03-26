const debug = require("debug")("semirara:socket");

import SocketIO from "socket.io-client";
import {getStore} from "../store";
const store = getStore();

const io = SocketIO();
io.on("connect", () => {
  debug("connect");
  const state = store.getState();
  if(state.page._id){
    io.emit("page:get", {_id: state.page._id});
  }
});

io.on("page:get:result", (page) => {
  debug(page);
  if(page.error && page._id === store.getState().page._id){
    return store.dispatch({type: "page:_id", value: null});
  }
  store.dispatch({type: "page", value: page});
});

io.on("disconnect", () => {
  debug("disconnect");
});

io.on("page:_id", (page) => {
  if(!page._id) return;
  store.dispatch({type: "page:_id", value: page._id});
});

io.on("page:lines:diff", (data) => {
  if(!data.diff) return;
  store.dispatch({type: "page:lines:patch", value: data.diff});
});

store.subscribe(() => {
  const state = store.getState();
  const diff = state.page.diff;
  const _id = state.page._id;
  if(!diff) return;
  io.emit("page:lines:diff", {diff, _id});
});
