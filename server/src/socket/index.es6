const debug = require("debug")("semirara:socket");

export function use(app){

  const io = app.context.io;

  io.on("connection", (socket) => {
    socket.on("page:text:diff", (data) => {
      debug(data);
      if(!data.diff) return;
      socket.broadcast.emit("page:text:diff", data);
    });
  });
}
