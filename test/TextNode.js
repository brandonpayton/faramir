import { TextNode, ElementNode } from 'faramir';
import { assert } from 'chai';
import domAssert from './domAssert';

describe('TextNode', () => {
    it('should create a DOM text node', () => {
        const expectedText = 'expected text';
        const virtualNode = new TextNode(expectedText);

        const realNode = virtualNode.create();
        domAssert.textNode(realNode, expectedText);
    });

    it('matches other virtual text nodes', () => {
        const textNode1 = new TextNode('node1');
        const textNode2 = new TextNode('node2');

        assert.isTrue(textNode1.match(textNode2));
        assert.isTrue(textNode2.match(textNode1));
    });

    it('doesn\'t match virtual nodes of other types', () => {
        const textNode = new TextNode('node1');
        const elementNode = new ElementNode('div');

        assert.isFalse(textNode.match(elementNode));
    });

    it('should patch a text node', () => {
        const initialText = 'initial text';
        const textNode1 = new TextNode(initialText);
        const realTextNode = textNode1.create();

        // Verify assumption of initial text
        domAssert.textNode(realTextNode, initialText);

        const updatedText = 'updated text';
        const textNode2 = new TextNode(updatedText);

        textNode1.patch(realTextNode, textNode2);
        domAssert.textNode(realTextNode, updatedText);
    });
});