import React from 'react';
import { Header, MainSection, Footer } from './';
import { connect, compose } from 'ohflux';
import TodoStore from '../stores';
import Constants from '../constants';

let deriveFilteredTodos = store => store.map(({ allTodos, filter }) => {
  let filteredTodos;
  switch (filter) {
    case Constants.FILTER_ACTIVE:
      filteredTodos = allTodos.filterNot(todo => todo.get('completed'));
    break;
    case Constants.FILTER_COMPLETE:
      filteredTodos = allTodos.filter(todo => todo.get('completed'));
    break;
    default:
      filteredTodos = allTodos;
    break;
  }
  return { filteredTodos, allTodos, filter };
});

let convertImmutableToJS = store => store.map(({ allTodos, filteredTodos, filter }) => {
  allTodos = allTodos.toList().toJS();
  filteredTodos = filteredTodos.toList().toJS();
  return { allTodos, filteredTodos, filter };
});

let deriveStore = compose(convertImmutableToJS, deriveFilteredTodos);

let App = React.createClass({
	mixins: [
		connect(TodoStore, deriveStore)
	],
	render() {
		return (
			<div id="todoapp">
				<Header />
				<MainSection {...this.state} />
				<Footer {...this.state} />
			</div>
		);
	}
});

export default App;
