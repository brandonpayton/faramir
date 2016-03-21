import { ElementNode, TextNode } from 'faramir';
import { assert } from 'chai';
import domAssert from './domAssert';

describe('ElementNode', () => {
    it('should create a DOM element', () => {
        const expectedSimpleTagName = 'div';
        const simpleNode = new ElementNode(expectedSimpleTagName);
        const simpleDomNode = simpleNode.create();

        domAssert.elementNode(simpleDomNode, expectedSimpleTagName);
        domAssert.elementAttributes(simpleDomNode, {}, 'no attributes');

        const expectedTagName = 'span';
        const expectedAttributes = {
            id: 'test-span',
            class: 'aCssClass'
        };
        const node = new ElementNode(expectedTagName, { attributes: expectedAttributes });
        const domNode = node.create();

        domAssert.elementNode(domNode, expectedTagName);
        domAssert.elementAttributes(domNode, expectedAttributes);
    });

    it('should create child DOM elements', () => {
        const expectedChildren = [
            new ElementNode('span', { attributes: { class: 'test-class' } }),
            new TextNode('the greatest text node that will ever be'),
            new ElementNode('ol', { attributes: { id: 'ordered-list' } }, [
                new ElementNode('li', { attributes: { id: 'item1' } }, [
                    new TextNode('first item')
                ]),
                new ElementNode('li', { attributes: { id: 'item2' } }, [
                    new TextNode('second item')
                ]),
                new ElementNode('li', { attributes: { id: 'item3' } }, [
                    new TextNode('third item')
                ])
            ]),
            new ElementNode('div', { attributes: { id: 'something' } }),
            new ElementNode('ul', { attributes: { id: 'unordered-list' } }, [
                new ElementNode('li', { attributes: { class: 'item-class1' } }, [
                    new TextNode('first item')
                ]),
                new ElementNode('li', { attributes: { class: 'item-class2' } }, [
                    new TextNode('second item')
                ]),
                new ElementNode('li', { attributes: { class: 'item-class3' } }, [
                    new TextNode('third item')
                ])
            ])
        ];
        const rootNode = new ElementNode('div', {}, expectedChildren);
        const rootDomNode = rootNode.create();

        const assertChildren = (domChildNodes, virtualChildNodes) => {
            assert.strictEqual(domChildNodes.length, virtualChildNodes.length, 'same number of virtual and DOM nodes');
            virtualChildNodes.forEach((node, i) => {
                const domNode = domChildNodes[i];
                if (node.type === 'text') {
                    domAssert.textNode(domNode, node.text);
                }
                else if (node.type === 'element') {
                    domAssert.elementNode(domNode, node.name);
                    domAssert.elementAttributes(domNode, node.attributes);

                    if (node.children) {
                        assertChildren(domNode.childNodes, node.children);
                    }
                }
                else {
                    throw new Error(`Unexpected type "${node.type}"`);
                }
            })
        };

        assertChildren(rootDomNode.childNodes, expectedChildren);
    });

    it('matches other virtual element nodes', () => {

    });

    it('does not match virtual nodes of other types', () => {

    });

    it('should patch an element', () => {
        // Patches tree
            // Patch existing
                // Calls updated hook
            // Insert new
                // Calls created hook
                // Calls inserted hook
            // Remove existing
                // Calls removed hook
            // Reorder existing by key
                // Calls updated hook
    });
});
