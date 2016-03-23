const debug = require("debug")("semirara:reducer");

import {diffpatch, clone} from "../lib/diffpatch";

export default function user(state, action){
  debug(`action.type = ${action.type}`);
  delete state.page.diff;
  switch(action.type){
  case "page:text":
    state.page.diff = diffpatch.diff(state.page.text, action.value);
    state.page.text = action.value;
    break;
  case "page:text:patch":
    state.page.text = diffpatch.patch(clone(state.page.text), action.value);
    break;
  }
  debug(state);
  return state;
}
