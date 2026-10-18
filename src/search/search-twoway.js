/**
 * Generates step-by-step search trace for Two-way (candidate-based) BST search.
 * 
 * @param {import('../core/tree-node.js').TreeNode|null} root
 * @param {number} target
 * @returns {Array<Object>} List of discrete animation steps
 */
export function search_twoway(root, target) {
  const steps = [];

  steps.push({
    stepIndex: 0,
    type: 'init',
    nodeId: root ? root.id : null,
    candidateId: null,
    edge: null,
    status: 'running',
    message: `Starting Two-way search for key ${target} (candidate = null).`,
    details: 'Two-way search checks only strict less-than (<) during traversal, storing a candidate when target >= current node.'
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
  let candidate = null;

  while (curr && !curr.isSentinel) {
    steps.push({
      stepIndex: steps.length,
      type: 'inspect',
      nodeId: curr.id,
      candidateId: candidate ? candidate.id : null,
      candidateVal: candidate ? candidate.val : null,
      edge: null,
      status: 'running',
      message: `Inspecting node ${curr.val} (candidate is ${candidate ? candidate.val : 'null'}).`,
      details: `Testing single condition: is target ${target} < ${curr.val}?`
    });

    if (target < curr.val) {
      const nextNode = curr.left && !curr.left.isSentinel ? curr.left : null;
      steps.push({
        stepIndex: steps.length,
        type: 'move',
        nodeId: curr.id,
        candidateId: candidate ? candidate.id : null,
        candidateVal: candidate ? candidate.val : null,
        edge: { from: curr.id, to: nextNode ? nextNode.id : null, direction: 'left' },
        status: 'running',
        message: `${target} < ${curr.val}: candidate stays ${candidate ? candidate.val : 'null'}, moving left.`,
        details: nextNode
          ? `Moving to left child node ${nextNode.val}.`
          : 'Left child is null.'
      });
      curr = nextNode;
    } else {
      // target >= curr.val: update candidate to curr, and go right
      candidate = curr;
      const nextNode = curr.right && !curr.right.isSentinel ? curr.right : null;
      steps.push({
        stepIndex: steps.length,
        type: 'candidate_update',
        nodeId: curr.id,
        candidateId: candidate.id,
        candidateVal: candidate.val,
        edge: { from: curr.id, to: nextNode ? nextNode.id : null, direction: 'right' },
        status: 'running',
        message: `${target} >= ${curr.val}: updated candidate to node ${candidate.val}, moving right.`,
        details: nextNode
          ? `Moving to right child node ${nextNode.val}.`
          : 'Right child is null.'
      });
      curr = nextNode;
    }
  }

  // At the end of the tree: verify candidate
  steps.push({
    stepIndex: steps.length,
    type: 'check_candidate',
    nodeId: null,
    candidateId: candidate ? candidate.id : null,
    candidateVal: candidate ? candidate.val : null,
    edge: null,
    status: 'running',
    message: `Reached null leaf. Now testing if candidate (${candidate ? candidate.val : 'null'}) === target (${target}).`,
    details: 'Final single equality comparison at leaf.'
  });

  if (candidate && candidate.val === target) {
    steps.push({
      stepIndex: steps.length,
      type: 'found',
      nodeId: candidate.id,
      candidateId: candidate.id,
      candidateVal: candidate.val,
      edge: null,
      status: 'success',
      message: `Found target ${target}! Candidate node ${candidate.val} matches ${target}.`,
      details: 'Two-way search completed successfully.'
    });
  } else {
    steps.push({
      stepIndex: steps.length,
      type: 'not_found',
      nodeId: null,
      candidateId: candidate ? candidate.id : null,
      candidateVal: candidate ? candidate.val : null,
      edge: null,
      status: 'failed',
      message: `Target ${target} not found in tree (candidate was ${candidate ? candidate.val : 'null'}).`,
      details: 'Candidate does not equal search key.'
    });
  }

  return steps;
}
