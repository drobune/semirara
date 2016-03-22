const debug = require("debug")("semirara:reducer");

export default function user(state, action){
  debug(`action.type = ${action.type}`);
  switch(action.type){
  case "editor:text":
  case "page:text":
    state.page.text = action.value.toUpperCase();
    break;
  }
  debug(state);
  return state;
}
