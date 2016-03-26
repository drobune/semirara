window.location.__defineGetter__("pageId", function(){
  const m = location.pathname.match(/^\/(\d+)$/);
  if(!m) return null;
  return Number.parseInt(m[1]);
});
