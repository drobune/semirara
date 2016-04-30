import {onURLType} from "../component/embed-url";

export default function use({io, store, action}){
  onURLType((url, type) => {
    io.emit("urltype", {url, type});
  });
}
