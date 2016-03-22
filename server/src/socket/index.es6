const debug = require("debug")("semirara:socket");

export function use(app){

  const io = app.context.io;

  io.on("connection", (socket) => {
    socket.on("page:text", (data) => {
      debug(data);
      socket.broadcast.emit("page:text", data);
    });
  });
}
