import { TreeNode } from './tree-node.js';

/**
 * Validates whether the tree rooted at node satisfies the strict Binary Search Tree property.
 * @param {TreeNode|null} node
 * @param {number} min
 * @param {number} max
 */
function validateBstProperty(node, min = -Infinity, max = Infinity) {
  if (!node || node.isSentinel) return;
  if (node.val <= min || node.val >= max) {
    throw new Error(
      `Invalid Binary Search Tree: node value ${node.val} violates BST property for range (${min}, ${max})`
    );
  }
  validateBstProperty(node.left, min, node.val);
  validateBstProperty(node.right, node.val, max);
}

/**
 * Reconstructs a binary tree from a level-order (breadth-first) serialized array
 * (e.g. [5, 3, 7, 1, 4, 6, 8] or [1, 2, 3, null, 4]).
 * Passing null or empty array returns null (empty tree).
 * 
 * Throws an Error if:
 * 1. The input array contains duplicate values (set membership model).
 * 2. The resulting tree violates the BST ordering property.
 * 
 * @param {Array<number|null>|null} array
 * @returns {TreeNode|null} Root of the constructed tree or null if empty
 */
export function build_tree(array) {
  if (array === null || array === undefined) {
    return null;
  }

  if (!Array.isArray(array)) {
    throw new Error('Input to build_tree must be an array or null');
  }

  if (array.length === 0 || array[0] === null || array[0] === undefined) {
    return null;
  }

  // Check for duplicates
  const seenValues = new Set();
  for (const item of array) {
    if (item !== null && item !== undefined) {
      if (typeof item !== 'number' || Number.isNaN(item)) {
        throw new Error(`Invalid item in tree array: ${item}. Expected number or null.`);
      }
      if (seenValues.has(item)) {
        throw new Error(`Duplicate value found in input array: ${item}. Duplicate keys are not permitted.`);
      }
      seenValues.add(item);
    }
  }

  const root = new TreeNode(array[0]);
  const queue = [root];
  let i = 1;

  while (queue.length > 0 && i < array.length) {
    const current = queue.shift();

    // Left child
    if (i < array.length) {
      const leftVal = array[i++];
      if (leftVal !== null && leftVal !== undefined) {
        current.left = new TreeNode(leftVal);
        queue.push(current.left);
      }
    }

    // Right child
    if (i < array.length) {
      const rightVal = array[i++];
      if (rightVal !== null && rightVal !== undefined) {
        current.right = new TreeNode(rightVal);
        queue.push(current.right);
      }
    }
  }

  // Verify BST property
  validateBstProperty(root);

  return root;
}

/**
 * Serializes a binary tree into a level-order (breadth-first) array.
 * Trims trailing null values.
 * @param {TreeNode|null} root
 * @returns {Array<number|null>}
 */
export function serialize_tree(root) {
  if (!root || root.isSentinel) return [];

  const result = [];
  const queue = [root];

  while (queue.length > 0) {
    const node = queue.shift();
    if (node && !node.isSentinel) {
      result.push(node.val);
      queue.push(node.left);
      queue.push(node.right);
    } else {
      result.push(null);
    }
  }

  // Trim trailing nulls
  while (result.length > 0 && result[result.length - 1] === null) {
    result.pop();
  }

  return result;
}
