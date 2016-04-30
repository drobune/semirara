const debug = require("debug")("semirara:model:urltype");

import mongoose from "mongoose";

const urlTypeSchema = new mongoose.Schema({
  url: {
    type: String,
    required: true,
    unique: true,
    validate: (url) => /^https?:\/\/[^\s]+$/.test(url)
  },
  type: {
    type: Number,
    required: true
  }
});


urlTypeSchema.post("save", function(urlType){
  debug(`saved!  ${urlType.url} = ${urlType.type}`);
});

mongoose.model("URLType", urlTypeSchema);
