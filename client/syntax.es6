import React from "react";
import {store} from "./store";

export default function compile(str){
  const methods = [strong, externalLinkWithTitle, image, externalLink, wikiLink, innerLink];
  let chunks = split(str);
  return chunks.map((chunk) => {
    for(let method of methods){
      chunk = method(chunk);
      if(typeof chunk !== "string") return chunk;
    }
    return chunk;
  });
}

function split(str){
  return str.split(/(\[{2,3}[^\]]+\]{2,3})/).filter(i => i.length > 0);
}

function gyazz2jsx(regex, replacer){
  return function(chunk){
    if(typeof chunk !== "string") return chunk;
    const m = chunk.match(regex);
    if(!m) return chunk;
    return replacer(m);
  };
}

const strong = gyazz2jsx(/\[{3}(.+)\]{3}/, m => <strong>{m[1]}</strong>);

const innerLink = gyazz2jsx(/\[{2}(.+)\]{2}/, m => {
  const title = m[1];
  const wiki = store.getState().page.wiki;
  const onClick = e => {
    e.preventDefault();
    e.stopPropagation();
    store.dispatch({type: "route", value: {title}});
  };
  return <a href={`/${wiki}/${title}`} onClick={onClick}>{title}</a>;
});

const wikiLink = gyazz2jsx(/\[{2}([^\]]+)::([^\]]+)\]{2}/, (m) => {
  const [, wiki, title] = m;
  const onClick = e => {
    e.preventDefault();
    e.stopPropagation();
    store.dispatch({type: "route", value: {wiki, title}});
  };
  return <a href={`/${wiki}/${title}`} onClick={onClick}>{`${wiki}::${title}`}</a>;
});

const externalLinkWithTitle = gyazz2jsx(/\[{2}(https?:\/\/.+) (.+)\]{2}/, (m) => {
  return <a href={m[1]} target="_blank">{m[2]}</a>;
});

const externalLink = gyazz2jsx(/\[{2}(https?:\/\/.+)\]{2}/, m => <a href={m[1]} target="_blank">{m[1]}</a>);

const image = gyazz2jsx(/\[{2}(https?:\/\/.+)\.(jpe?g|gif|png)\]{2}/i, m => <img src={`${m[1]}.${m[2]}`} title={m[0]} />);

