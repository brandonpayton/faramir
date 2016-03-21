import ComponentNode from './ComponentNode';

function notifyComponent(notificationMethod, node) {
    if (node instanceof ComponentNode) {
        const c = node.component;
        notificationMethod in c && c[notificationMethod]();
    }
}

function notifyWillMount(node) {
    node.children.forEach(notifyWillMount);
    notifyComponent('notifyWillMount', node);
}
function notifyDidMount(node) {
    notifyComponent('notifyDidMount', node);
    node.children.forEach(notifyDidMount);
}

function notifyWillUnmountAndDispose(node) {
    node.children.forEach(notifyWillUnmountAndDispose);
    notifyComponent('notifyWillUnmount', node);
    notifyComponent('dispose', node);
}

function notifyDidUnmount(node) {
    notifyComponent('notifyDidUnmount', node);
    node.children.forEach(notifyDidUnmount);
}

function mount(domMethod, parentNode, virtualNode, domNode, ...rest) {
    notifyWillMount(virtualNode);
    parentNode[domMethod](domNode, ...rest);
    notifyDidMount(virtualNode);
}


function unmount(parentNode, virtualNode, domNode) {
    notifyWillUnmountAndDispose(virtualNode);
    parentNode.removeChild(domNode);
    notifyDidUnmount(virtualNode);
}

export default {
    mountAppend: mount.bind(undefined, 'appendChild'),
    mountBefore: mount.bind(undefined, 'insertBefore'),
    unmount: unmount
};