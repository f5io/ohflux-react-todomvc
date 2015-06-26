export default function connect(Store, modifier = (a) => a) {
	return {
		getInitialState() {
			return { contents: Store.map(modifier).toProperty() };
		},
		componentDidMount() {
			this._storeStream = Store.map(modifier);
			this._storeStreamHandler = state => this.setState(state);
			this._storeStream.onValue(this._storeStreamHandler);
		},
		componentWillUnmount() {
			this._storeStream.offValue(this._storeStreamHandler);
		}
	}
}
