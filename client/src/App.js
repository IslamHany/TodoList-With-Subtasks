import {createStore, applyMiddleware} from 'redux';
import {Provider} from 'react-redux';
import thunk from 'redux-thunk';
import {countReducer} from './store/reducer';

import Todos from './Todo/Todos';

import "./App.sass"

let store = createStore(countReducer, applyMiddleware(thunk));
function App() {
  return (
    <Provider store={store}>
      <Todos />
    </Provider>
  );
}

export default App;
