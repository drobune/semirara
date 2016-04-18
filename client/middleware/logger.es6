const debug = require("debug")("semirara:middleware:logger");

export default store => next => action => {
  debug(`action.type = ${action.type}`);
  debug(action.value);
  const result = next(action);
  debug(store.getState());
  return result;
};
