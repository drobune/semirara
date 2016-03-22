const debug = require("debug")("semirara:reducer");

export default function user(state, action){
  debug(`action.type = ${action.type}`);
  state.page.editByMe = false;
  switch(action.type){
  case "page:text":
    state.page.editByMe = true;
    state.page.text = action.value;
    break;
  case "page:text:received":
    state.page.text = action.value;
    break;
  }
  debug(state);
  return state;
}
