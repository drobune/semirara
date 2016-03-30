const debug = require("debug")("semirara:reducer");

import {diffpatch, clone} from "../../lib/diffpatch";

export default function page(state, action){
  debug(`action.type = ${action.type}`);
  delete state.page.diff;
  switch(action.type){
  case "page":
    state.page = action.value;
    break;
  case "page:new":
    state.page._id = 0;
    break;
  case "page:_id":
    state.page._id = action.value;
    break;
  case "page:lines":
    state.page.diff = diffpatch.diff(state.page.lines, action.value);
    state.page.lines = action.value;
    break;
  case "page:lines:patch":
    state.page.lines = diffpatch.patch(clone(state.page.lines), action.value);
    break;
  }
  debug(state);
  return state;
}
