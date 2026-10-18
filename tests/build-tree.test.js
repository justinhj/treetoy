import test from 'node:test';
import assert from 'node:assert/strict';
import { build_tree, serialize_tree } from '../src/core/build-tree.js';
import { in_order_traversal } from '../src/core/bst.js';

test('build_tree with null or empty array returns null', () => {
  assert.equal(build_tree(null), null);
  assert.equal(build_tree([]), null);
  assert.equal(build_tree([null]), null);
});

test('build_tree reconstructs valid BST from LeetCode array', () => {
  // Tree:
  //       5
  //     /   \
  //    3     7
  //   / \   / \
  //  1   4 6   8
  const root = build_tree([5, 3, 7, 1, 4, 6, 8]);
  assert.ok(root);
  assert.equal(root.val, 5);
  assert.equal(root.left.val, 3);
  assert.equal(root.right.val, 7);
  assert.equal(root.left.left.val, 1);
  assert.equal(root.left.right.val, 4);
  assert.equal(root.right.left.val, 6);
  assert.equal(root.right.right.val, 8);

  // In-order traversal must be strictly sorted
  const sorted = in_order_traversal(root);
  assert.deepEqual(sorted, [1, 3, 4, 5, 6, 7, 8]);

  // Serialization round-trip
  const serialized = serialize_tree(root);
  assert.deepEqual(serialized, [5, 3, 7, 1, 4, 6, 8]);
});

test('build_tree handles trees with null children', () => {
  // Tree:
  //     4
  //    / \
  //   2   6
  //    \   \
  //     3   7
  const root = build_tree([4, 2, 6, null, 3, null, 7]);
  assert.ok(root);
  assert.equal(root.val, 4);
  assert.equal(root.left.val, 2);
  assert.equal(root.left.left, null);
  assert.equal(root.left.right.val, 3);
  assert.equal(root.right.val, 6);
  assert.equal(root.right.left, null);
  assert.equal(root.right.right.val, 7);

  assert.deepEqual(in_order_traversal(root), [2, 3, 4, 6, 7]);
  assert.deepEqual(serialize_tree(root), [4, 2, 6, null, 3, null, 7]);
});

test('build_tree strictly rejects duplicate values with error', () => {
  assert.throws(
    () => {
      build_tree([5, 3, 5]);
    },
    {
      name: 'Error',
      message: /Duplicate value found/
    }
  );
});

test('build_tree rejects invalid BST arrays', () => {
  // 1 is placed in right subtree of 5, which is invalid
  assert.throws(
    () => {
      build_tree([5, 3, 1]);
    },
    {
      name: 'Error',
      message: /violates BST property/
    }
  );
});
