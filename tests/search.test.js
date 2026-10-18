import test from 'node:test';
import assert from 'node:assert/strict';
import { build_tree } from '../src/core/build-tree.js';
import { attach_sentinels } from '../src/core/bst.js';
import { search_3way } from '../src/search/search-3way.js';
import { search_sentinel } from '../src/search/search-sentinel.js';
import { search_twoway } from '../src/search/search-twoway.js';

test('3-way search finds existing key', () => {
  const root = build_tree([5, 3, 7, 1, 4, 6, 8]);
  const steps = search_3way(root, 4);

  const lastStep = steps[steps.length - 1];
  assert.equal(lastStep.type, 'found');
  assert.equal(lastStep.status, 'success');
  assert.match(lastStep.message, /Found target 4/);
});

test('3-way search fails gracefully on missing key', () => {
  const root = build_tree([5, 3, 7, 1, 4, 6, 8]);
  const steps = search_3way(root, 9);

  const lastStep = steps[steps.length - 1];
  assert.equal(lastStep.type, 'not_found');
  assert.equal(lastStep.status, 'failed');
  assert.match(lastStep.message, /Reached null leaf/);
});

test('Sentinel search finds existing key without null checks in trace', () => {
  const root = build_tree([5, 3, 7, 1, 4, 6, 8]);
  attach_sentinels(root);
  const steps = search_sentinel(root, 6);

  const lastStep = steps[steps.length - 1];
  assert.equal(lastStep.type, 'found');
  assert.equal(lastStep.status, 'success');
  assert.match(lastStep.message, /Found target 6/);

  // Verify none of the inspect steps mention null check
  const inspectSteps = steps.filter((s) => s.type === 'inspect');
  for (const s of inspectSteps) {
    assert.match(s.details, /skipping null check/i);
  }
});

test('Sentinel search stops at sentinel leaf when key is missing', () => {
  const root = build_tree([5, 3, 7, 1, 4, 6, 8]);
  attach_sentinels(root);
  const steps = search_sentinel(root, 2);

  const lastStep = steps[steps.length - 1];
  assert.equal(lastStep.type, 'not_found');
  assert.equal(lastStep.status, 'failed');
  assert.match(lastStep.message, /sentinel leaf node/);
});

test('Two-way search finds existing key using candidate tracking', () => {
  const root = build_tree([5, 3, 7, 1, 4, 6, 8]);
  const steps = search_twoway(root, 7);

  const lastStep = steps[steps.length - 1];
  assert.equal(lastStep.type, 'found');
  assert.equal(lastStep.status, 'success');
  assert.equal(lastStep.candidateVal, 7);
  assert.match(lastStep.message, /Found target 7/);

  // Check that candidate_update occurred
  const updateSteps = steps.filter((s) => s.type === 'candidate_update');
  assert.ok(updateSteps.length > 0);
});

test('Two-way search correctly identifies non-existing key', () => {
  const root = build_tree([5, 3, 7, 1, 4, 6, 8]);
  const steps = search_twoway(root, 2);

  const lastStep = steps[steps.length - 1];
  assert.equal(lastStep.type, 'not_found');
  assert.equal(lastStep.status, 'failed');
  assert.match(lastStep.message, /Target 2 not found/);
});
