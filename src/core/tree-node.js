let nextNodeId = 1;

export function resetNodeIdCounter() {
  nextNodeId = 1;
}

/**
 * Represents a node in the binary search tree.
 */
export class TreeNode {
  /**
   * @param {number|null} val
   * @param {TreeNode|null} [left=null]
   * @param {TreeNode|null} [right=null]
   * @param {boolean} [isSentinel=false]
   * @param {string|null} [id=null]
   */
  constructor(val, left = null, right = null, isSentinel = false, id = null) {
    this.id = id || `node-${nextNodeId++}`;
    this.val = val;
    this.left = left;
    this.right = right;
    this.isSentinel = Boolean(isSentinel);
    this.x = 0;
    this.y = 0;
    this.depth = 0;
  }

  isLeaf() {
    return (!this.left || this.left.isSentinel) && (!this.right || this.right.isSentinel);
  }

  /**
   * Deep clones the tree starting at this node.
   * @returns {TreeNode}
   */
  clone() {
    const copy = new TreeNode(
      this.val,
      this.left ? this.left.clone() : null,
      this.right ? this.right.clone() : null,
      this.isSentinel,
      this.id
    );
    copy.x = this.x;
    copy.y = this.y;
    copy.depth = this.depth;
    return copy;
  }
}
