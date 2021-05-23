var mongoose = require("mongoose");

var TodoSchema = new mongoose.Schema({
  data: { type: Object }
});

module.exports = mongoose.model("Todo", TodoSchema);