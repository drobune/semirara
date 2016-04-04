import md5 from "md5";

export function request(io, method, data){
  if(!io.id || typeof io.emit !== "function"){
    throw new Error("argument error: first argument must be Socket.IO");
  }
  if(typeof method !== "string"){
    throw new Error('argument "method" is missing');
  }
  const id = md5(io.id + Date.now() + Math.random());
  io.emit("request", {id, method, data});
  return new Promise((resolve) => {
    io.once(`response:${id}`, (data) => {
      resolve(data);
    });
  });
}


export function response(io, method, callback){
  if(typeof method !== "string"){
    throw new Error('argument "method" is missing');
  }
  if(typeof callback !== "function"){
    throw new Error('"callback" must be a function');
  }
  io.on("request", (data) => {
    if(data.method !== method) return;
    callback(data.data, (res) => {
      io.emit(`response:${data.id}`, res);
    });
  });
}
