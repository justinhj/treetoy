/**
 * Layout configuration parameters.
 */
export const DEFAULT_LAYOUT_CONFIG = {
  nodeRadius: 22,
  sentinelRadius: 14,
  levelHeight: 70,
  minNodeSpacing: 55,
  padding: {
    top: 40,
    bottom: 40,
    left: 40,
    right: 40
  }
};

/**
 * Computes aesthetic 2D coordinates for all nodes in the binary tree.
 * Uses a post-order subtree width allocation to ensure no overlapping nodes.
 *
 * @param {import('./tree-node.js').TreeNode|null} root
 * @param {Object} [customConfig={}]
 * @returns {{ nodes: Array<Object>, edges: Array<Object>, width: number, height: number }}
 */
export function compute_tree_layout(root, customConfig = {}) {
  const config = { ...DEFAULT_LAYOUT_CONFIG, ...customConfig };
  if (!root) {
    return {
      nodes: [],
      edges: [],
      width: 200,
      height: 120
    };
  }

  let currentX = 0;
  let maxDepth = 0;

  // Pass 1: in-order traversal to establish horizontal order and assign depths
  function assignInitialPositions(node, depth = 0) {
    if (!node) return;
    node.depth = depth;
    if (depth > maxDepth) maxDepth = depth;

    assignInitialPositions(node.left, depth + 1);

    node.x = currentX;
    currentX += config.minNodeSpacing;

    assignInitialPositions(node.right, depth + 1);
  }

  assignInitialPositions(root, 0);

  // Pass 2: Bottom-up centering for internal nodes with both children
  function centerParents(node) {
    if (!node) return;
    centerParents(node.left);
    centerParents(node.right);

    if (node.left && node.right) {
      node.x = (node.left.x + node.right.x) / 2;
    }
  }

  centerParents(root);

  // Collect all nodes and edges
  const nodes = [];
  const edges = [];

  function collect(node) {
    if (!node) return;
    const isSent = Boolean(node.isSentinel);
    const r = isSent ? config.sentinelRadius : config.nodeRadius;
    const y = config.padding.top + node.depth * config.levelHeight;

    nodes.push({
      id: node.id,
      val: node.val,
      x: node.x,
      y: y,
      depth: node.depth,
      radius: r,
      isSentinel: isSent,
      nodeRef: node
    });

    if (node.left) {
      edges.push({
        from: node.id,
        to: node.left.id,
        direction: 'left',
        fromX: node.x,
        fromY: y,
        toX: node.left.x,
        toY: config.padding.top + (node.depth + 1) * config.levelHeight,
        toSentinel: Boolean(node.left.isSentinel)
      });
      collect(node.left);
    }

    if (node.right) {
      edges.push({
        from: node.id,
        to: node.right.id,
        direction: 'right',
        fromX: node.x,
        fromY: y,
        toX: node.right.x,
        toY: config.padding.top + (node.depth + 1) * config.levelHeight,
        toSentinel: Boolean(node.right.isSentinel)
      });
      collect(node.right);
    }
  }

  collect(root);

  // Normalize minX so left margin is config.padding.left
  let minX = Infinity;
  let maxX = -Infinity;
  for (const n of nodes) {
    if (n.x < minX) minX = n.x;
    if (n.x > maxX) maxX = n.x;
  }

  const shiftX = config.padding.left - minX;
  for (const n of nodes) {
    n.x += shiftX;
  }
  for (const e of edges) {
    e.fromX += shiftX;
    e.toX += shiftX;
  }

  const totalWidth = Math.max(maxX + shiftX + config.padding.right, 240);
  const totalHeight = Math.max(
    config.padding.top + maxDepth * config.levelHeight + config.padding.bottom,
    140
  );

  return {
    nodes,
    edges,
    width: totalWidth,
    height: totalHeight
  };
}
