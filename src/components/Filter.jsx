import React from 'react';
import Actions from '../actions';
import { classSet } from '../utilities';

let Filter = React.createClass({
	propTypes: {
		filter: React.PropTypes.any.isRequired,
		active: React.PropTypes.bool.isRequired
	},
	render() {
		var classes = classSet({ selected: this.props.active });
        return (
            <li>
            	<a href="#"
            		onClick={this._setFilter}
            		className={classes}>{this.props.children}</a>
            </li>
        );
	},
	_setFilter() {
		Actions.setFilter(this.props.filter);
	}
});

export default Filter;