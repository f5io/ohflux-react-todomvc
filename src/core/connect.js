let arrayToObject = ([ state, [ filtered, filter ] ]) => ({ state, filter, filtered });

export default function connect(Store, modifier = (a) => a) {
	return {
		getInitialState() {
			console.log('getInitialState');
			let initialState;
			Store.getInitialState()
				.map(arrayToObject)
				.map(modifier)
				.toProperty()
				.onValue((val) => initialState = val);
			return initialState;
		},
		componentDidMount() {
			console.log('componentDidMount');
			this._storeStream = Store.map(arrayToObject).map(modifier);
			this._storeStreamHandler = (state) => {
				this.setState(state);
			}
			this._storeStream.onValue(this._storeStreamHandler);
		},
		componentWillUnmount() {
			console.log('componentWillUnmount');
			this._storeStream.offValue(this._storeStreamHandler);
		}
	}
}
