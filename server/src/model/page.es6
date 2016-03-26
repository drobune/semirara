const debug = require("debug")("semirara:model:page");

import mongoose from "mongoose";

const pageSchema = new mongoose.Schema({
  number: {
    type: Number,
    unique: true,
    required: true
  },
  title: {
    type: String,
    required: true,
    default: "untitled"
  },
  wiki: {
    type: String,
    required: true,
    default: "general"
  },
  lines: {
    type: Array,
    default: [ ]
  },
  updatedAt: {
    type: Date,
    default: () => { return Date.now() }
  },
  createdAt: {
    type: Date,
    default: () => { return Date.now() }
  }
});

pageSchema.pre("save", function(next){
  debug("save!");
  this.updatedAt = Date.now();
  next();
});

pageSchema.pre("save", async function(next){
  if(!this.isNew) return next();
  if(typeof this.wiki !== "string") throw new Error("invalid wiki name: " + this.wiki);
  const page = await Page.findOne({wiki: this.wiki}).sort({ number: 1 }).limit(1);
  this.number = page ? page[0].number + 1 : 1;
  debug("new number: " + this.number);
  next();
});

pageSchema.methods.toHash = function(){
  return {
    wiki: this.wiki,
    title: this.title,
    number: this.number,
    _id: this._id,
    lines: this.lines,
    updatedAt: this.updatedAt,
    createdAt: this.createdAt
  };
};

const Page = mongoose.model("Page", pageSchema);

export function isValidPageNumber(number){
  return /^[1-9]\d*$/.test(number);
}
