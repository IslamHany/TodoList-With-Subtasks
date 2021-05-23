const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const app = express();

const controllers = require("./controllers");
const url = "mongodb://localhost/nested-todo";

app.use(express.json());
app.use(cors());

mongoose.connect(
  url,
  { useNewUrlParser: true, useUnifiedTopology: true },
  () => {
    console.log("mongo db is connected");
  }
);

//Create todo route
app.post("", controllers.createTodo);

//Read all todos
app.get("", controllers.getTodos);

//Delete Todo
app.delete("", controllers.deleteTodo);

//Update Todo
app.put("", controllers.updateTodo);

app.listen(5000, () => {
    console.log(`Server is listening on port 5000`);
});