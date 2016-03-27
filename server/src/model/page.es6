const debug = require("debug")("semirara:model:page");

import mongoose from "mongoose";
import autoIncrement from "mongoose-auto-increment";
autoIncrement.initialize(mongoose.connection);

const pageSchema = new mongoose.Schema({
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
  if(typeof this._id !== "number" || this._id < 1) delete this._id;
  this.updatedAt = Date.now();
  next();
});

pageSchema.plugin(autoIncrement.plugin, {
  model: "Page",
  startAt: 1
});

pageSchema.post("save", function(){
  debug("save! " + this._id);
});

pageSchema.methods.toHash = function(){
  return {
    wiki: this.wiki,
    title: this.title,
    _id: this._id,
    lines: this.lines,
    updatedAt: this.updatedAt,
    createdAt: this.createdAt
  };
};

const Page = mongoose.model("Page", pageSchema);
