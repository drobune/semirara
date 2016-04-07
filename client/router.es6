// route: /wiki/page

export function parse(path){
  let route = {};
  const m = path.match(/^\/([^\/]+)\/([^\/]+)/);
  if(m){
    route.wiki = m[1];
    route.page = m[2];
  }
  return route;
}

export function build(route){
  return `/${route.wiki}/${route.page}`;
}

import {getStore} from "./store";
const store = getStore();

store.subscribe(() => {
  const state = store.getState();
  const wiki = state.page.wiki;
  const page = state.page.name;
  document.title = `${wiki}::${page}`;
  if(location.pathname !== build({wiki, page})){
    history.pushState(null, null, build({wiki, page}));
  }
});

store.dispatch({
  type:"route",
  value: Object.assign({wiki: "general", page: "test"}, parse(location.pathname))
});
