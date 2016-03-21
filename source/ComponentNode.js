export default class ComponentNode {
    get type() { return 'Component'; }

    // Count on jsxConstructor being specified on a derived prototype
    // jsxConstructor = null;

    // ComponentConstructor = null;
    // subTree = null;
    // props = null;
    // children = null;

    constructor({ ComponentConstructor, props, children }) {
        this.ComponentConstructor = ComponentConstructor;

        const defaultProps = 'getDefaultProps' in this && this.getDefaultProps();
        this.props = Object.assign({}, defaultProps, props);
        this.children = children || [];
    }

    create() {
        const { ComponentConstructor } = this;

        const component = this.component = new ComponentConstructor();
        const defaultProps = component.getDefaultProps ? component.getDefaultProps() : {};
        const props = Object.assign({}, defaultProps, this.props);
        const state = 'getInitialState' in component ? component.getInitialState() : {};
        Object.assign(component, {
            defaultProps,
            props,
            state
        });

        this.subTree = this.renderSubTree();
        const domNode = component.domNode = this.subTree.create();

        return domNode;
    }

    match(to) {
        return this.type === to.type
            && this.constructor === to.constructor
            && this.ComponentConstructor === to.ComponentConstructor;
    }

    patch(realNode, to) {
        const { component } = this;

        to.component = component;
        // TODO: DEV: If !shouldUpdate, should the component state and props be updated anyway?
        Object.assign(component, {
            node: to,
            props: to.props,
            state: to.state
        });

        to.subTree = to.renderSubTree();
        this.subTree.patch(realNode, to.subTree);
    }

    destroy(preserveDom) {
        'onDestroyed' in this && this.onDestroyed();

        this.children.forEach(child => child.destroy(true));
        this.component.dispose();

        if (!preserveDom) {
            const domNode = this.domNode;
            domNode.parentNode.removeChild(domNode);
            domNode.innerHTML = '';
            this.domNode = null;
        }
    }

    renderSubTree() {
        return this.jsxConstructor(this.component.render());
    }

    requestUpdate() {
        this.patch(this.component.domNode, this);
    }
}