/**
 * Sets the value of all sentinel nodes in the tree to the search target.
 * @param {import('../core/tree-node.js').TreeNode|null} root
 * @param {number} target
 */
export function set_sentinel_values(root, target) {
  function walk(node) {
    if (!node) return;
    if (node.isSentinel) {
      node.val = target;
      return;
    }
    walk(node.left);
    walk(node.right);
  }
  walk(root);
}

/**
 * Generates step-by-step search trace for Sentinel BST search.
 * 
 * @param {import('../core/tree-node.js').TreeNode|null} root
 * @param {number} target
 * @returns {Array<Object>} List of discrete animation steps
 */
export function search_sentinel(root, target) {
  const steps = [];

  steps.push({
    stepIndex: 0,
    type: 'init',
    nodeId: root ? root.id : null,
    candidateId: null,
    edge: null,
    status: 'running',
    message: `Starting Sentinel search for key ${target}.`,
    details: `All sentinel leaf nodes are set to ${target}. Traversal proceeds without null checks.`
  });

  if (!root) {
    steps.push({
      stepIndex: steps.length,
      type: 'not_found',
      nodeId: null,
      candidateId: null,
      edge: null,
      status: 'failed',
      message: `Tree is empty. Key ${target} not found.`,
      details: 'No nodes in tree.'
    });
    return steps;
  }

  // Assign search key to all sentinels
  set_sentinel_values(root, target);

  let curr = root;

  // The sentinel loop: no null checks needed!
  while (curr.val !== target) {
    steps.push({
      stepIndex: steps.length,
      type: 'inspect',
      nodeId: curr.id,
      candidateId: null,
      edge: null,
      status: 'running',
      message: `Inspecting node ${curr.val} (does not match target ${target}).`,
      details: 'Direct comparison with target; skipping null check.'
    });

    if (target < curr.val) {
      const nextNode = curr.left;
      steps.push({
        stepIndex: steps.length,
        type: 'move',
        nodeId: curr.id,
        candidateId: null,
        edge: { from: curr.id, to: nextNode ? nextNode.id : null, direction: 'left' },
        status: 'running',
        message: `${target} < ${curr.val}: moving left to ${nextNode.isSentinel ? 'sentinel leaf' : 'node ' + nextNode.val}.`,
        details: 'Navigating left child.'
      });
      curr = nextNode;
    } else {
      const nextNode = curr.right;
      steps.push({
        stepIndex: steps.length,
        type: 'move',
        nodeId: curr.id,
        candidateId: null,
        edge: { from: curr.id, to: nextNode ? nextNode.id : null, direction: 'right' },
        status: 'running',
        message: `${target} > ${curr.val}: moving right to ${nextNode.isSentinel ? 'sentinel leaf' : 'node ' + nextNode.val}.`,
        details: 'Navigating right child.'
      });
      curr = nextNode;
    }
  }

  // Found matching value! Now verify if it's a real tree node or a sentinel leaf.
  if (curr.isSentinel) {
    steps.push({
      stepIndex: steps.length,
      type: 'not_found',
      nodeId: curr.id,
      candidateId: null,
      edge: null,
      status: 'failed',
      message: `Encountered target ${target} at sentinel leaf node. Key ${target} is not in tree.`,
      details: 'Reached sentinel leaf; search terminated without null checks.'
    });
  } else {
    steps.push({
      stepIndex: steps.length,
      type: 'found',
      nodeId: curr.id,
      candidateId: null,
      edge: null,
      status: 'success',
      message: `Found target ${target} at internal node ${curr.val}!`,
      details: 'Node is an authentic tree node (not a sentinel).'
    });
  }

  return steps;
}
