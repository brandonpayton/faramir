export default class Component {
    constructor() {
        this.resourceHandles = [];
    }

    // NOTE: BRANDONPAYTON: Using React-like lifecycle methods because it seemed
    // like I was naturally discovering the need for such methods one-by-one
    // when developing from scratch.
    // getInitialState() {}
    // getDefaultProps() {}
    // componentWillMount() {}
    // componentDidMount() {}
    // componentWillUnmount() {}
    // componentDidUnmount() {}
    // getStateResponseToProps -- instead of componentWillReceiveProps(nextProps) {}
    // shouldComponentUpdate(nextProps, nextState) {}
    // componentWillUpdate(nextProps, nextState) {}
    // componentDidUpdate(previousProps, previousState) {}
    // render() {}

    setProps(incomingProps) {
        const newProps = Object.assign({}, this.defaultProps, incomingProps);

        const stateUpdates = this.getStateResponseToProps(newProps);
        const state = (stateUpdates && Object.keys(stateUpdates).length > 0)
            ? Object.assign({}, this.state, stateUpdates)
            : this.state;

        this.requestUpdate(newProps, state);
    }

    setState(partialState) {
        const newState = Object.assign({}, this.state, partialState);
        this.requestUpdate(this.props, newState);
    }

    shouldComponentUpdate(nextProps, nextState) {
        return this.props !== nextProps || this.state !== nextState;
    }

    requestUpdate(newProps, newState) {
        if (this.shouldComponentUpdate(newProps, newState)) {
            this.componentWillUpdate(newProps, newState);

            const prevProps = this.props;
            const prevState = this.state;
            this.props = newProps;
            this.state = newState;

            this.node && this.node.requestUpdate();

            this.componentDidUpdate(prevProps, prevState);
        }
    }

    own(...resourceHandles) {
        this.resourceHandles.push(...resourceHandles);
    }

    dispose() {
        this.component.resourceHandles.forEach(resourceHandle => {
            [ 'remove', 'dispose', 'destroy' ].forEach(
                name => name in resourceHandle && resourceHandle[name]()
            );
        });
    }
}