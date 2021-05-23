import React, {useState} from 'react';
import {connect} from 'react-redux';
import * as actions from '../store/actions';

const CreateTodo = (props) => {
  const [formInputs, setFormInputs] = useState({
    todo: "",
    selectedTodo: "new"
  });

  const handleChange = e => {
    const name = e.target.name;
    setFormInputs(prevState => {
      return{
        ...prevState,
        [name]: e.target.value
      }
    });
  };

  const submitHandler = e => {
    e.preventDefault();
    const payload = {
      parentId: formInputs.selectedTodo,
      todo: formInputs.todo
    };
    if(formInputs.todo){
      props.addTodo(payload);
      setFormInputs({todo: "", selectedTodo: "new"});
    }
  };

  const iterateParentTodos = (todos) => Object.keys(todos).map(key => {
    if(key == "isLoading") return;
    return <option key={key} value={key}>{todos[key]["text"]}</option>;
  });

  return (
    <>
      <form className="create" onSubmit={submitHandler}>
        <input type="text" placeholder="Enter Todo" value={formInputs.todo} name="todo" onChange={handleChange}/>
        <select onChange={handleChange} name="selectedTodo" value={formInputs.selectedTodo}>
          <option value="new">New Todo</option>
          {iterateParentTodos(props.todos)}
        </select>
        <input type="submit" value="Add" />
      </form>
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
    addTodo: (payload) => dispatch(actions.addTodo(payload))
  }
};

export default connect(mapStateToProps, mapDispatchToProps)(CreateTodo);