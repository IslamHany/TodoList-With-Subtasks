import * as actionTypes from './actionTypes';
const initialState = {
  isLoading: false,
};

const setCompleted = (state, actions) => {
  const {parentId, childId} = actions;
  const newState = {...state};
  if(childId){
    newState[parentId][childId]["completed"] = !newState[parentId][childId]["completed"];
    return newState;
  }

  newState[parentId]["completed"] = !newState[parentId]["completed"];
  Object.keys(newState[parentId]).map(key => {
    if(typeof newState[parentId][key] == "object" && newState[parentId]["completed"])
      newState[parentId][key]["completed"] = true;
    else if(typeof newState[parentId][key] == "object" && !newState[parentId]["completed"])
      newState[parentId][key]["completed"] = false;
  });
  return newState;
}

const deleteTodo = (state, {parentId, childId}) => {
  const newState = {...state};
  if(childId){
    console.log(newState[parentId]);
    delete newState[parentId][childId];
    return newState;
  }
  delete newState[parentId];
  return newState;
}

const addTodo = (state, payload) => {
  const newState = {...state};
  const {todo, parentId, childId} = payload;
  if(newState[parentId]){
    newState[parentId][childId] = {
      type: "child",
      completed: false,
      text: todo
    };
    return newState;
  }

  newState[parentId] = {
    type: "parent",
    completed: false,
    text: todo
  };
  return newState;
};

const updateTodo = (state, {parentId, childId, todo}) => {
  const newState = {...state};
  if(childId){
    newState[parentId][childId]["text"] = todo;
    return newState;
  }
  newState[parentId]["text"] = todo;
  return newState;
}

const setTodos = (state, {todos}) => {
  const newState = {...state, ...todos};
  return newState;
}

export const countReducer = (state = initialState, action) => {
  switch (action.type) {
    case actionTypes.TODO_LOAD:
      return setTodos(state, action);
    case actionTypes.TODO_SET_COMPLETE:
      return setCompleted(state, action);
    case actionTypes.TODO_REMOVE:
      return deleteTodo(state, action);
    case actionTypes.TODO_ADD:
      const newState = addTodo(state, action);
      return newState;
    case actionTypes.TODO_UPDATE:
      return updateTodo(state, action);
    case actionTypes.TODO_LOADING:
      return {...state, isLoading: true};
    case actionTypes.TODO_FINISHED:
      return {...state, isLoading: false};
    default:
      return state;
  }
};