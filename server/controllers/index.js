const { v4: uuidv4 } = require('uuid');

const Todo = require("../models/todos");
const utils = require("../utils");

const createTodo = async (req, res) => {
  const {type, text} = req.body;
  let todo;

  try{
    if(type == "parent"){
      todo = new Todo({data: {type, text, completed: false}});
      await todo.save();
      res.status(201);
      return res.json({
        parentId: todo._id
      });
    }

    const {parentId} = req.body;
    let newId = uuidv4();
    todo = await Todo.findById(parentId);
    todo["data"][newId] = {type, text, completed: false};
    todo.markModified("data");
    await todo.save();

    res.status(201);
    return res.json({
      parentId: todo._id,
      childId: newId
    });
  }catch(e){
    console.log(e);
    res.status(500);
    return res.json({error: "something went wrong"});
  }
};

const getTodos = async (req, res) => {
  try{
    let todos = await Todo.find();
    let newTodos = utils.iterateTodos(todos);
    res.status(200);
    return res.json(newTodos);
  }catch(e){
    console.log(e);
    res.status(500);
    return res.json({error: "something went wrong"});
  }
}

const deleteTodo = async (req, res) => {
  let {type, parentId} = req.body;
  let todo;

  try{
    if(type == "parent"){
      todo = await Todo.findByIdAndDelete(parentId);
      res.status(200);
      return res.json({msg: "Deleted successfully"});
    }

    let {childId} = req.body;
    todo = await Todo.findById(parentId);
    delete todo["data"][childId];
    todo.markModified("data");
    await todo.save();

    res.status(200);
    return res.json({msg: "Deleted successfully"});
  }catch(e){
    console.log(e);
    return res.json({error: "something went wrong"});
  }
};

const updateTodo = async (req, res) => {
  let {type, parentId, text, completed} = req.body;
  let todo;

  try{
    if(type == "parent"){
      if(text)
        todo = await Todo.findByIdAndUpdate(parentId, {"data.text": text}, {new: true});
      if(completed != undefined){
        //        todo = await Todo.findByIdAndUpdate(parentId, {"data.completed": completed}, {new: true}); 
        todo = await Todo.findById(parentId); 
        todo["data"]["completed"] = completed;
        Object.keys(todo["data"]).map(key => {
          if(typeof todo["data"][key] == "object" && todo["data"]["completed"])
            todo["data"][key]["completed"] = true;
          else if(typeof todo["data"][key] == "object" && !todo["data"]["completed"])
            todo["data"][key]["completed"] = false;
        });
        console.log(todo);
        todo.markModified("data");
        await todo.save();
      }
      res.status(200);
      return res.json(todo);
    }

    let {childId} = req.body;
    todo = await Todo.findById(parentId);
    if(text)
      todo["data"][childId]["text"] = text;
    if(completed != undefined)
      todo["data"][childId]["completed"] = completed;
    todo.markModified("data");
    await todo.save();

    res.status(200);
    return res.json(todo);
  }catch(e){
    console.log(e);
    res.status(500);
    return res.json({error: "something went wrong"});
  }
};

module.exports = {
  createTodo,
  getTodos,
  deleteTodo,
  updateTodo
};