import axios from 'axios';
import * as actionTypes from './actionTypes';

export const loadTodo = () => {
  return dispatch => {
    dispatch(setLoading());
    axios.get("http://localhost:5000")
      .then(res => {
      dispatch(setTodos(res.data));
    })
      .catch(err => {})
      .finally(() => dispatch(setFinished()));
  };
};

export const setTodos = (todos) => {
  return{
    type: actionTypes.TODO_LOAD,
    todos
  }
};

export const setCompleted = (parentId, childId, completed) => {
  return dispatch => {
    let body = {parentId, childId, completed};

    if(childId)
      body["type"] = "child";
    else
      body["type"] = "parent";

    axios.put("http://localhost:5000", body)
      .then(res => {
      dispatch({
        type: actionTypes.TODO_SET_COMPLETE,
        parentId,
        childId
      });
    })
      .catch(err => {});
  };
};

export const removeTodo = (parentId, childId) => {
  return dispatch => {
    dispatch(setLoading());
    let body = {type: "", childId, parentId};

    if(childId)
      body.type = "child";
    else
      body.type = "parent";

    axios.delete("http://localhost:5000", {data: body})
      .then(res => {
      return dispatch({
        type: actionTypes.TODO_REMOVE,
        parentId,
        childId
      });
    })
      .catch(err => {})
      .finally(() => dispatch(setFinished()));
  };
};

export const addTodo = (payload) => {
  return dispatch => {
    dispatch(setLoading());
    let body;

    if(payload.parentId === "new"){
      body = {
        text: payload.todo,
        type: "parent"
      }
    }else{
      body = {
        text: payload.todo,
        type: "child",
        parentId: payload.parentId
      }
    }
    axios.post("http://localhost:5000", body)
      .then(res => {
      return dispatch({
        type: actionTypes.TODO_ADD,
        ...res.data,
        todo: payload.todo,
      });
    })
      .catch(err => {})
      .finally(() => dispatch(setFinished()));
  };
};


export const updateTodo = (payload) => {
  return dispatch => {
    dispatch(setLoading());
    let body = {...payload, text: payload.todo};

    if(payload.childId)
      body["type"] = "child";
    else
      body["type"] = "parent";

    axios.put("http://localhost:5000", body)
      .then(res => {
      dispatch({
        type: actionTypes.TODO_UPDATE,
        ...payload
      });
    })
      .catch(err => {})
      .finally(() => dispatch(setFinished()));
  };
};

export const setLoading = () => {
  return{
    type: actionTypes.TODO_LOADING
  };
};

export const setFinished = () => {
  return{
    type: actionTypes.TODO_FINISHED
  };
};