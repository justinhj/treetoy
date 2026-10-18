import { build_tree } from '../core/build-tree.js';
import { insert_bst, attach_sentinels, strip_sentinels } from '../core/bst.js';
import { compute_tree_layout } from '../core/layout.js';
import { search_3way } from '../search/search-3way.js';
import { search_sentinel } from '../search/search-sentinel.js';
import { search_twoway } from '../search/search-twoway.js';
import { TreeSVG } from './tree-svg.js';
import { LogView } from './log-view.js';
import { Player } from './player.js';

export class TreeToyInstance {
  /**
   * @param {HTMLElement|string} target
   * @param {Object} [options={}]
   */
  constructor(target, options = {}) {
    this.container = typeof target === 'string' ? document.querySelector(target) : target;
    if (!this.container) {
      throw new Error(`Target container not found: ${target}`);
    }

    this.options = {
      initialValues: [5, 3, 7, 1, 4, 6, 8],
      treeType: 'default', // 'default' | 'sentinel' | 'two-way'
      searchKey: null,
      showControls: true,
      showLog: true,
      logCollapsible: true,
      title: null,
      speed: 700,
      autoPlay: false,
      ...options
    };

    this.treeType = this.options.treeType;
    this.searchKey = this.options.searchKey;
    this.root = null;
    this.steps = [];

    this.initDOM();
    this.initTree(this.options.initialValues);

    if (this.searchKey !== null && this.searchKey !== undefined) {
      this.search(this.searchKey, this.options.autoPlay);
    }
  }

  initDOM() {
    this.container.innerHTML = '';

    this.wrapper = document.createElement('div');
    this.wrapper.className = 'treetoy-wrapper';

    // Header with title and algorithm badge
    this.header = document.createElement('div');
    this.header.className = 'treetoy-header';

    const titleContainer = document.createElement('div');
    titleContainer.className = 'treetoy-title';

    this.titleText = document.createElement('span');
    this.titleText.textContent = this.options.title || 'Binary Search Tree';

    this.badge = document.createElement('span');
    this.updateBadge();

    titleContainer.appendChild(this.titleText);
    titleContainer.appendChild(this.badge);
    this.header.appendChild(titleContainer);

    this.wrapper.appendChild(this.header);

    // Canvas container
    this.canvasContainer = document.createElement('div');
    this.canvasContainer.className = 'treetoy-canvas-container';
    this.wrapper.appendChild(this.canvasContainer);

    // Controls bar
    if (this.options.showControls) {
      this.controlsBar = document.createElement('div');
      this.controlsBar.className = 'treetoy-controls';

      const leftControls = document.createElement('div');
      leftControls.className = 'treetoy-btn-group';

      this.btnPlay = document.createElement('button');
      this.btnPlay.className = 'treetoy-btn treetoy-btn-primary';
      this.btnPlay.textContent = '▶ Play';
      this.btnPlay.addEventListener('click', () => {
        if (this.player.isPlaying) {
          this.pause();
        } else {
          this.play();
        }
      });

      this.btnPrev = document.createElement('button');
      this.btnPrev.className = 'treetoy-btn';
      this.btnPrev.textContent = '⏮ Step';
      this.btnPrev.title = 'Step Backward';
      this.btnPrev.addEventListener('click', () => this.stepBackward());

      this.btnNext = document.createElement('button');
      this.btnNext.className = 'treetoy-btn';
      this.btnNext.textContent = 'Step ⏭';
      this.btnNext.title = 'Step Forward';
      this.btnNext.addEventListener('click', () => this.stepForward());

      this.btnReset = document.createElement('button');
      this.btnReset.className = 'treetoy-btn';
      this.btnReset.textContent = '↺ Reset';
      this.btnReset.addEventListener('click', () => this.reset());

      this.stepCounter = document.createElement('span');
      this.stepCounter.className = 'treetoy-step-counter';
      this.stepCounter.textContent = 'Step 0 / 0';

      leftControls.appendChild(this.btnPlay);
      leftControls.appendChild(this.btnPrev);
      leftControls.appendChild(this.btnNext);
      leftControls.appendChild(this.btnReset);
      leftControls.appendChild(this.stepCounter);

      const rightControls = document.createElement('div');
      rightControls.className = 'treetoy-btn-group';

      // Speed dropdown
      const speedLabel = document.createElement('label');
      speedLabel.textContent = 'Speed: ';
      speedLabel.style.fontSize = '0.8rem';
      speedLabel.style.color = 'var(--tt-text-muted)';

      this.speedSelect = document.createElement('select');
      this.speedSelect.className = 'treetoy-speed-select';
      [
        { label: '0.5x', ms: 1400 },
        { label: '1x', ms: 700 },
        { label: '1.5x', ms: 450 },
        { label: '2x', ms: 250 }
      ].forEach((s) => {
        const opt = document.createElement('option');
        opt.value = s.ms;
        opt.textContent = s.label;
        if (s.ms === this.options.speed) opt.selected = true;
        this.speedSelect.appendChild(opt);
      });

      this.speedSelect.addEventListener('change', (e) => {
        const val = parseInt(e.target.value, 10);
        this.player.setSpeed(val);
      });

      rightControls.appendChild(speedLabel);
      rightControls.appendChild(this.speedSelect);

      this.controlsBar.appendChild(leftControls);
      this.controlsBar.appendChild(rightControls);
      this.wrapper.appendChild(this.controlsBar);
    }

    // Log section container
    this.logContainer = document.createElement('div');
    this.wrapper.appendChild(this.logContainer);

    this.container.appendChild(this.wrapper);

    // Initialize Log View
    this.logView = new LogView(this.logContainer, {
      visible: this.options.showLog,
      collapsible: this.options.logCollapsible,
      onSelectStep: (idx) => this.player.seek(idx)
    });

    // Initialize Player
    this.player = new Player({
      speed: this.options.speed,
      onStepChange: (idx, step) => {
        this.svgRenderer?.applyStep(step);
        this.logView?.setCurrentStep(idx);
        this.updateStepCounter(idx);
      },
      onStateChange: (state) => {
        if (this.btnPlay) {
          this.btnPlay.textContent = state.isPlaying ? '⏸ Pause' : '▶ Play';
        }
        if (this.btnPrev) {
          this.btnPrev.disabled = !state.hasPrev;
        }
        if (this.btnNext) {
          this.btnNext.disabled = !state.hasNext;
        }
      }
    });
  }

  updateBadge() {
    this.badge.className = 'treetoy-badge';
    if (this.treeType === 'sentinel') {
      this.badge.classList.add('treetoy-badge-sentinel');
      this.badge.textContent = 'Sentinel Search';
    } else if (this.treeType === 'two-way') {
      this.badge.classList.add('treetoy-badge-twoway');
      this.badge.textContent = 'Two-Way Search';
    } else {
      this.badge.textContent = 'Default (3-Way)';
    }
  }

  updateStepCounter(idx) {
    if (!this.stepCounter) return;
    const current = idx >= 0 ? idx + 1 : 0;
    this.stepCounter.textContent = `Step ${current} / ${this.steps.length}`;
  }

  initTree(values) {
    this.root = build_tree(values);
    if (this.treeType === 'sentinel' && this.root) {
      attach_sentinels(this.root);
    }
    this.refreshVisualization();
  }

  refreshVisualization() {
    const layout = compute_tree_layout(this.root);
    if (!this.svgRenderer) {
      this.svgRenderer = new TreeSVG(this.canvasContainer, layout);
    } else {
      this.svgRenderer.updateLayout(layout);
    }
  }

  /**
   * Programmatically inserts a key into the BST.
   * Throws Error if duplicate.
   * @param {number} val
   */
  insert(val) {
    if (this.treeType === 'sentinel' && this.root) {
      strip_sentinels(this.root);
    }

    this.root = insert_bst(this.root, val);

    if (this.treeType === 'sentinel') {
      attach_sentinels(this.root);
    }

    this.refreshVisualization();

    // If searchKey is active, recalculate steps
    if (this.searchKey !== null) {
      this.search(this.searchKey, false);
    }
  }

  /**
   * Reconstructs the tree with a new LeetCode serialized array.
   * @param {Array<number|null>|null} values
   */
  setTreeValues(values) {
    this.player.reset();
    this.initTree(values);
    if (this.searchKey !== null) {
      this.search(this.searchKey, false);
    }
  }

  /**
   * Changes the tree type ('default', 'sentinel', 'two-way').
   * @param {'default'|'sentinel'|'two-way'} type
   */
  setTreeType(type) {
    if (type !== 'default' && type !== 'sentinel' && type !== 'two-way') {
      throw new Error(`Unsupported tree type: ${type}`);
    }

    this.treeType = type;
    this.updateBadge();

    // Adjust sentinels in tree
    if (this.treeType === 'sentinel') {
      strip_sentinels(this.root);
      attach_sentinels(this.root);
    } else {
      strip_sentinels(this.root);
    }

    this.refreshVisualization();

    if (this.searchKey !== null) {
      this.search(this.searchKey, false);
    }
  }

  /**
   * Searches for a key and prepares the animation steps.
   * @param {number} key
   * @param {boolean} [autoPlay=false]
   */
  search(key, autoPlay = false) {
    this.searchKey = key;
    this.player.reset();

    // Ensure sentinels are attached if sentinel search
    if (this.treeType === 'sentinel') {
      strip_sentinels(this.root);
      attach_sentinels(this.root);
    } else {
      strip_sentinels(this.root);
    }
    this.refreshVisualization();

    // Generate steps based on treeType
    if (this.treeType === 'sentinel') {
      this.steps = search_sentinel(this.root, key);
    } else if (this.treeType === 'two-way') {
      this.steps = search_twoway(this.root, key);
    } else {
      this.steps = search_3way(this.root, key);
    }

    this.logView.setSteps(this.steps);
    this.player.setSteps(this.steps);
    this.updateStepCounter(-1);

    if (autoPlay) {
      this.play();
    }
  }

  play() {
    this.player.play();
  }

  pause() {
    this.player.pause();
  }

  stepForward() {
    return this.player.stepForward();
  }

  stepBackward() {
    return this.player.stepBackward();
  }

  reset() {
    this.player.reset();
  }

  toggleLog(visible) {
    if (typeof visible === 'boolean') {
      this.logView.setVisible(visible);
    } else {
      this.logView.toggle();
    }
  }
}

/**
 * Main TreeToy library factory.
 */
export const TreeToy = {
  /**
   * Creates an embeddable tree component on an HTML element.
   * @param {HTMLElement|string} target
   * @param {Object} options
   * @returns {TreeToyInstance}
   */
  create(target, options) {
    return new TreeToyInstance(target, options);
  },

  build_tree,
  insert_bst,
  search_3way,
  search_sentinel,
  search_twoway
};
