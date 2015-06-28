import React from 'react';
import { Header, MainSection, Footer } from './';
import { connect } from '../core';
import TodoStore from '../stores';

let App = React.createClass({
	mixins: [
		connect(TodoStore, ({ state, filtered, filter }) => {
			let allTodos = state.toList().toJS();
			let filteredTodos = filtered.toList().toJS();
			return { allTodos, filteredTodos, filter };
		})
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
