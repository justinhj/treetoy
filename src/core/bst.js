import { TreeNode } from './tree-node.js';

/**
 * Inserts a value into a binary search tree rooted at `root`.
 * Follows strict set membership rules: throws an error if value is already present.
 * 
 * @param {TreeNode|null} root
 * @param {number} val
 * @returns {TreeNode} The root of the updated tree
 */
export function insert_bst(root, val) {
  if (typeof val !== 'number' || Number.isNaN(val)) {
    throw new Error(`Invalid value for BST insertion: ${val}. Expected a number.`);
  }

  const newNode = new TreeNode(val);
  if (!root || root.isSentinel) {
    return newNode;
  }

  let curr = root;
  while (curr) {
    if (val === curr.val) {
      throw new Error(`Duplicate value: ${val} already exists in the tree.`);
    }

    if (val < curr.val) {
      if (!curr.left || curr.left.isSentinel) {
        curr.left = newNode;
        break;
      }
      curr = curr.left;
    } else {
      if (!curr.right || curr.right.isSentinel) {
        curr.right = newNode;
        break;
      }
      curr = curr.right;
    }
  }

  return root;
}

/**
 * Creates sentinel leaf nodes for all null children in the tree.
 * @param {TreeNode|null} root
 * @returns {TreeNode|null}
 */
export function attach_sentinels(root) {
  if (!root) {
    // For an empty tree with sentinel, root itself can be a sentinel
    return new TreeNode(null, null, null, true);
  }

  function walk(node) {
    if (!node || node.isSentinel) return;

    if (!node.left) {
      node.left = new TreeNode(null, null, null, true);
    } else if (!node.left.isSentinel) {
      walk(node.left);
    }

    if (!node.right) {
      node.right = new TreeNode(null, null, null, true);
    } else if (!node.right.isSentinel) {
      walk(node.right);
    }
  }

  walk(root);
  return root;
}

/**
 * Removes sentinel leaf nodes, returning a clean tree with null children.
 * @param {TreeNode|null} root
 * @returns {TreeNode|null}
 */
export function strip_sentinels(root) {
  if (!root || root.isSentinel) return null;

  function walk(node) {
    if (!node) return;
    if (node.left && node.left.isSentinel) {
      node.left = null;
    } else {
      walk(node.left);
    }
    if (node.right && node.right.isSentinel) {
      node.right = null;
    } else {
      walk(node.right);
    }
  }

  walk(root);
  return root;
}

/**
 * Traverses the tree in-order, returning an array of values.
 * Useful for verifying BST sorted order.
 * @param {TreeNode|null} root
 * @returns {number[]}
 */
export function in_order_traversal(root) {
  const result = [];
  function walk(node) {
    if (!node || node.isSentinel) return;
    walk(node.left);
    result.push(node.val);
    walk(node.right);
  }
  walk(root);
  return result;
}
