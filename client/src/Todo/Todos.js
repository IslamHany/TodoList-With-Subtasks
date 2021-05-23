import React, {useState, useEffect} from 'react';
import {connect} from 'react-redux';
import * as actions from '../store/actions';
import CreateTodo from './CreateTodo';
import { makeStyles } from '@material-ui/core/styles';
import Modal from '@material-ui/core/Modal';
import Backdrop from '@material-ui/core/Backdrop';
import Fade from '@material-ui/core/Fade';

const useStyles = makeStyles((theme) => ({
  modal: {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
  },
  paper: {
    backgroundColor: "#AF7EEB",
    border: '2px solid #000',
    boxShadow: theme.shadows[5],
    padding: theme.spacing(2, 4, 3),
  },
}));

const Todos = (props) => {
  const classes = useStyles();
  const [open, setOpen] = useState(false);
  const [updatedTodo, setUpdatedTodo] = useState({});
  const [formInput, setFormInput] = useState({
    newTodo: ""
  });
  
  useEffect(() => {
    props.loadTodo();
  }, []);

  const handleOpen = (e, selectedId) => {
    setOpen(true);
    if(props.todos[selectedId])
      return setUpdatedTodo({parentId: selectedId, childId: null});
    let parentId = e.target.parentElement.parentElement.getAttribute("data-id");
    return setUpdatedTodo({parentId, childId: selectedId});
  };

  const handleClose = () => {
    setOpen(false);
  };

  const handleTodoRemove = e => {
    e.stopPropagation();
    let id = e.target.getAttribute("data-id");

    if(props.todos[id])
      return props.removeTodo(id, null);
    let parentId = e.target.parentElement.parentElement.getAttribute("data-id");
    console.log(parentId);
    return props.removeTodo(parentId, id);
  };

  const iterateTodo = (todos) => Object.keys(todos).map(key => {

    if(typeof todos[key] === 'object' && todos[key]["type"] === "parent"){
      return (<ul data-id={key} key={key}>
          <span className="todo" data-id={key}>
            <span className={todos[key]["completed"] ? "completed": ""} data-id={key}>{todos[key]["text"]}</span>
            <span onClick={handleTodoRemove} data-id={key}>&#128465;</span>
            <button type="button" onClick={(e) => handleOpen(e, key)}>
              Update
            </button>
          </span>
          {iterateTodo(todos[key])}
        </ul>);
    }else if(typeof todos[key] === 'object' && todos[key]["type"] === "child"){
      return <li className="todo" key={key} data-id={key}>
        <span className={todos[key]["completed"] ? "completed": ""} data-id={key}>{todos[key]["text"]}</span>
        <span onClick={handleTodoRemove} data-id={key}>&#128465;</span>
        <button type="button" onClick={(e) => handleOpen(e, key)}>
          Update
        </button>
      </li>;
    }
  });


  const handleComplete = e => {
    /*handle complete logic*/
    let completed;
    if(!e.target.hasAttribute("data-id"))
      return;
    let id = e.target.getAttribute("data-id");
    if(props.todos[id]){
      completed = !props.todos[id]["completed"];
      return props.setCompleted(id, null, completed);
    }
    let parentId = e.target.parentElement.parentElement.getAttribute("data-id");
    completed = !props.todos[parentId][id]["completed"];
    return props.setCompleted(parentId, id, completed);
  };

  const handleChange = e => setFormInput(prevState => ({...prevState, [e.target.name]: e.target.value}));

  const submitHandler = e => {
    e.preventDefault();
    if(formInput.newTodo){
      props.updateTodo({...updatedTodo, todo: formInput.newTodo});
      setFormInput(prevState => ({...prevState, newTodo: ""}));
      setUpdatedTodo({});
      setOpen(false);
    }
  };

  return (
    <>
      <CreateTodo />
      <div className="container" onClick={handleComplete}>
        {props.todos.isLoading ? "Loading..." : iterateTodo(props.todos)}
        <Modal
          aria-labelledby="transition-modal-title"
          aria-describedby="transition-modal-description"
          className={classes.modal}
          open={open}
          onClose={handleClose}
          closeAfterTransition
          BackdropComponent={Backdrop}
          BackdropProps={{
            timeout: 500,
          }}
          >
          <Fade in={open}>
            <div className={classes.paper}>
              <form onSubmit={submitHandler}>
                <input name="newTodo" type="text" onChange={handleChange} placeholder="Enter new value"/>
                <input type="submit" disabled={props.todos.isLoading}/>
              </form>
            </div>
          </Fade>
        </Modal>
      </div>
    </>
  );
};

const mapStateToProps = state => {
  return {
    todos: state
  }
};

const mapDispatchToProps = (dispatch) => {
  return {
    setCompleted: (parentId, childId, completed) => dispatch(actions.setCompleted(parentId, childId, completed)),
    removeTodo: (parentId, childId) => dispatch(actions.removeTodo(parentId, childId)),
    updateTodo: (payload) => dispatch(actions.updateTodo(payload)),
    loadTodo: () => dispatch(actions.loadTodo()),
  }
};

export default connect(mapStateToProps, mapDispatchToProps)(Todos);