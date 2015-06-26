import React from 'react';
import { Header } from './';
import { connect } from '../core';
import TodoStore from '../stores';

let App = React.createClass({
	mixins: [
		connect(TodoStore, store => store.toList().toJS())
	],
	render() {
		console.log(this.state);
		return (
			<div id="todoapp">
				<Header />
			</div>
		);
	}
});

export default App;
