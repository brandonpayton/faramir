import mounter from './mounter';

function patchAttributes(realNode, fromAttributes, toAttributes) {
    for (let toKey in toAttributes) {
        realNode.setAttribute(toKey, toAttributes[toKey]);
    }
    for (let fromKey in fromAttributes) {
        !(fromKey in toAttributes) && realNode.removeAttribute(fromKey);
    }
}

function patchProperties(realNode, fromProperties, toProperties) {
    for (let toKey in toProperties) {
        realNode[toKey] = toProperties[toKey];
    }
    for (let fromKey in fromProperties) {
        !(fromKey in toProperties) && (realNode[fromKey] = null);
    }
}

function keysIndexes(children, startIndex, endIndex) {
    let keys = {};
    for (let i = startIndex; i <= endIndex; ++i) {
        const key = children[i].key;
        if (key !== undefined) {
            keys[key] = i;
        }
    }
    return keys;
}

export default class ElementNode {
    get type() { return 'element'; }

    // name = null;
    // children = null;
    // attributes = null;
    // properties = null;

    constructor(name, { attributes = {}, properties = {} } = {}, children) {
        this.name = name;
        this.attributes = Object.assign({}, attributes);
        this.properties = properties;

        // TODO: Should the style attribute be treated specially like this?
        // An alternative is to use $-prefixed attributes to indicate property names just set $style={}
        this.style = attributes.style || {};
        if ('style' in this.attributes) {
            delete attributes.style;
        }

        this.children = children || [];
    }

    create() {
        let realNode = document.createElement(this.name);

        patchAttributes(realNode, {}, this.attributes);
        patchProperties(realNode, {}, this.properties);
        patchProperties(realNode.style, {}, this.style);

        this.children.forEach(
            child => realNode.appendChild(child.create())
        );

        return realNode;
    }

    match(to) {
        return !(
            this.type !== to.type ||
            this.name !== to.name ||
            this.key !== to.key ||
            this.namespace !== to.namespace ||
            // TODO: DEV: Determine whether and how to support `is`
            this.is !== to.is
        );
    }

    patch(realNode, to) {
        patchAttributes(realNode, this.attributes, to.attributes);
        patchProperties(realNode, this.properties, to.properties);
        patchProperties(realNode.style, this.style, to.style);

        let previousRealNodes = [].slice.apply(realNode.childNodes);
        const fromChildren = this.children.slice();
        const toChildren = to.children.slice();

        if (previousRealNodes.length !== fromChildren.length) {
            console.warn('Patching is broken. Real and virtual DOM child counts do not match.');
        }

        let fromStartIndex = 0;
        let fromEndIndex = fromChildren.length - 1;
        let fromStartNode = fromChildren[0];
        let fromEndNode = fromChildren[fromEndIndex];

        let toStartIndex = 0;
        let toEndIndex = toChildren.length - 1;
        let toStartNode = toChildren[0];
        let toEndNode = toChildren[toEndIndex];

        let indexes;

        while (fromStartIndex <= fromEndIndex && toStartIndex <= toEndIndex) {
            if (fromStartNode === undefined) {
                fromStartNode = fromChildren[++fromStartIndex];
            } else if (fromEndNode === undefined) {
                fromEndNode = fromChildren[--fromEndIndex];
            }
            else if (fromStartNode.match(toStartNode)) {
                fromStartNode.patch(previousRealNodes[fromStartIndex], toStartNode);
                fromStartNode = fromChildren[++fromStartIndex];
                toStartNode = toChildren[++toStartIndex];
            } else if (fromEndNode.match(toEndNode)) {
                fromEndNode.patch(previousRealNodes[fromEndIndex], toEndNode);
                fromEndNode = fromChildren[--fromEndIndex];
                toEndNode = toChildren[--toEndIndex];
            } else if (fromStartNode.match(toEndNode)) {
                fromStartNode.patch(previousRealNodes[fromStartIndex], toEndNode);
                realNode.insertBefore(fromStartNode.element, fromEndNode.element.nextSibling);
                fromStartNode = fromChildren[++fromStartIndex];
                toEndNode = toChildren[--toEndIndex];
            } else if (fromEndNode.match(toStartNode)) {
                fromEndNode.patch(previousRealNodes[fromEndIndex], toStartNode);
                realNode.insertBefore(fromEndNode.element, fromStartNode.element);
                fromEndNode = fromChildren[--fromEndIndex];
                toStartNode = toChildren[++toStartIndex];
            } else {
                if (indexes === undefined) {
                    indexes = keysIndexes(fromChildren, fromStartIndex, fromEndIndex);
                }

                let index = indexes[toStartNode.key];
                if (index === undefined) {
                    // Use mount utility to respect encapsulated mount behavior for newly created nodes
                    mounter.mountBefore(realNode, toStartNode, toStartNode.create(), previousRealNodes[fromStartIndex]);
                    toStartNode = toChildren[++toStartIndex];
                } else {
                    fromChildren[index].patch(previousRealNodes[index], toStartNode);
                    realNode.insertBefore(previousRealNodes[index], previousRealNodes[fromStartIndex]);
                    fromChildren[index] = undefined;
                    toStartNode = toChildren[++toStartIndex];
                }
            }
        }
        if (fromStartIndex > fromEndIndex) {
            let realBeforeNode = toChildren[toEndIndex + 1] === undefined
                ? null
                : realNode.childNodes[toEndIndex + 1];

            for (; toStartIndex <= toEndIndex; toStartIndex++) {
                const virtualNode = toChildren[toStartIndex];
                // Use mount utility to respect encapsulated mount behavior for newly created nodes
                mounter.mountBefore(realNode, virtualNode, virtualNode.create(), realBeforeNode);
            }
        } else if (toStartIndex > toEndIndex) {
            for (; fromStartIndex <= fromEndIndex; fromStartIndex++) {
                if (fromChildren[fromStartIndex] !== undefined) {
                    const childNode = previousRealNodes[fromStartIndex];
                    childNode.parentNode.removeChild(childNode);
                }
            }
        }
    }
}