/**
 * Generates step-by-step search trace for standard 3-way BST search.
 * 
 * @param {import('../core/tree-node.js').TreeNode|null} root
 * @param {number} target
 * @returns {Array<Object>} List of discrete animation steps
 */
export function search_3way(root, target) {
  const steps = [];

  steps.push({
    stepIndex: 0,
    type: 'init',
    nodeId: root ? root.id : null,
    candidateId: null,
    edge: null,
    status: 'running',
    message: `Starting 3-way BST search for key ${target}.`,
    details: 'Standard 3-way search checks (<, ==, >) at each node, checking for null at leaves.'
  });

  if (!root || root.isSentinel) {
    steps.push({
      stepIndex: steps.length,
      type: 'not_found',
      nodeId: null,
      candidateId: null,
      edge: null,
      status: 'failed',
      message: `Tree is empty. Key ${target} not found.`,
      details: 'Root is null.'
    });
    return steps;
  }

  let curr = root;

  while (curr) {
    // Step: inspect current node
    steps.push({
      stepIndex: steps.length,
      type: 'inspect',
      nodeId: curr.id,
      candidateId: null,
      edge: null,
      status: 'running',
      message: `Inspecting node ${curr.val}.`,
      details: `Comparing target ${target} with current node ${curr.val}.`
    });

    if (target === curr.val) {
      steps.push({
        stepIndex: steps.length,
        type: 'found',
        nodeId: curr.id,
        candidateId: null,
        edge: null,
        status: 'success',
        message: `Found target ${target}! (node ${curr.val} === ${target})`,
        details: `Search successful in ${steps.length} steps.`
      });
      return steps;
    }

    if (target < curr.val) {
      const nextNode = curr.left && !curr.left.isSentinel ? curr.left : null;
      steps.push({
        stepIndex: steps.length,
        type: 'move',
        nodeId: curr.id,
        candidateId: null,
        edge: { from: curr.id, to: nextNode ? nextNode.id : null, direction: 'left' },
        status: 'running',
        message: `${target} < ${curr.val}: moving left.`,
        details: nextNode
          ? `Moving to left child node ${nextNode.val}.`
          : 'Left child is null (reached leaf).'
      });
      curr = nextNode;
    } else {
      const nextNode = curr.right && !curr.right.isSentinel ? curr.right : null;
      steps.push({
        stepIndex: steps.length,
        type: 'move',
        nodeId: curr.id,
        candidateId: null,
        edge: { from: curr.id, to: nextNode ? nextNode.id : null, direction: 'right' },
        status: 'running',
        message: `${target} > ${curr.val}: moving right.`,
        details: nextNode
          ? `Moving to right child node ${nextNode.val}.`
          : 'Right child is null (reached leaf).'
      });
      curr = nextNode;
    }
  }

  steps.push({
    stepIndex: steps.length,
    type: 'not_found',
    nodeId: null,
    candidateId: null,
    edge: null,
    status: 'failed',
    message: `Reached null leaf. Key ${target} not found in tree.`,
    details: 'Completed tree traversal without finding key.'
  });

  return steps;
}
