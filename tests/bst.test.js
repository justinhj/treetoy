import test from 'node:test';
import assert from 'node:assert/strict';
import { insert_bst, attach_sentinels, strip_sentinels, in_order_traversal } from '../src/core/bst.js';
import { build_tree } from '../src/core/build-tree.js';

test('insert_bst into empty tree creates root', () => {
  const root = insert_bst(null, 42);
  assert.ok(root);
  assert.equal(root.val, 42);
  assert.equal(root.left, null);
  assert.equal(root.right, null);
});

test('insert_bst maintains sorted BST order', () => {
  let root = null;
  const values = [50, 30, 70, 20, 40, 60, 80];
  for (const v of values) {
    root = insert_bst(root, v);
  }

  assert.deepEqual(in_order_traversal(root), [20, 30, 40, 50, 60, 70, 80]);
});

test('insert_bst throws on duplicate insertion', () => {
  let root = build_tree([10, 5, 15]);
  assert.throws(
    () => {
      insert_bst(root, 5);
    },
    {
      name: 'Error',
      message: /already exists in the tree/
    }
  );
});

test('attach_sentinels replaces all null leaves with sentinels', () => {
  const root = build_tree([2, 1, 3]);
  attach_sentinels(root);

  assert.ok(root.left.left && root.left.left.isSentinel);
  assert.ok(root.left.right && root.left.right.isSentinel);
  assert.ok(root.right.left && root.right.left.isSentinel);
  assert.ok(root.right.right && root.right.right.isSentinel);

  strip_sentinels(root);
  assert.equal(root.left.left, null);
  assert.equal(root.left.right, null);
  assert.equal(root.right.left, null);
  assert.equal(root.right.right, null);
});
