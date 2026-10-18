const SVG_NS = 'http://www.w3.org/2000/svg';

/**
 * Creates and manages the SVG visualization for a binary tree.
 */
export class TreeSVG {
  /**
   * @param {HTMLElement} container
   * @param {Object} layout
   */
  constructor(container, layout) {
    this.container = container;
    this.layout = layout;
    this.nodeMap = new Map();
    this.edgeMap = new Map();
    this.candidateTag = null;

    this.render();
  }

  /**
   * Builds the SVG elements and appends to container.
   */
  render() {
    this.container.innerHTML = '';

    const svg = document.createElementNS(SVG_NS, 'svg');
    svg.setAttribute('class', 'treetoy-svg');
    svg.setAttribute('width', this.layout.width);
    svg.setAttribute('height', this.layout.height);
    svg.setAttribute('viewBox', `0 0 ${this.layout.width} ${this.layout.height}`);

    // Edges group
    const edgesGroup = document.createElementNS(SVG_NS, 'g');
    edgesGroup.setAttribute('class', 'treetoy-edges-group');

    for (const edge of this.layout.edges) {
      const line = document.createElementNS(SVG_NS, 'line');
      line.setAttribute('x1', edge.fromX);
      line.setAttribute('y1', edge.fromY);
      line.setAttribute('x2', edge.toX);
      line.setAttribute('y2', edge.toY);
      line.setAttribute(
        'class',
        edge.toSentinel ? 'treetoy-edge treetoy-edge-sentinel' : 'treetoy-edge'
      );

      const edgeKey = `${edge.from}->${edge.to}`;
      this.edgeMap.set(edgeKey, line);
      edgesGroup.appendChild(line);
    }

    svg.appendChild(edgesGroup);

    // Nodes group
    const nodesGroup = document.createElementNS(SVG_NS, 'g');
    nodesGroup.setAttribute('class', 'treetoy-nodes-group');

    for (const node of this.layout.nodes) {
      const g = document.createElementNS(SVG_NS, 'g');
      g.setAttribute('transform', `translate(${node.x}, ${node.y})`);
      g.setAttribute('id', `node-group-${node.id}`);

      let shape;
      if (node.isSentinel) {
        // Sentinel rendered as rounded rect or distinctive circle
        shape = document.createElementNS(SVG_NS, 'circle');
        shape.setAttribute('r', node.radius);
        shape.setAttribute('class', 'treetoy-node treetoy-node-sentinel');
      } else {
        shape = document.createElementNS(SVG_NS, 'circle');
        shape.setAttribute('r', node.radius);
        shape.setAttribute('class', 'treetoy-node');
      }

      const text = document.createElementNS(SVG_NS, 'text');
      text.setAttribute('class', 'treetoy-node-text');
      text.textContent = node.val !== null ? String(node.val) : (node.isSentinel ? 'S' : '');

      g.appendChild(shape);
      g.appendChild(text);

      this.nodeMap.set(node.id, { g, shape, text, data: node });
      nodesGroup.appendChild(g);
    }

    // Candidate floating badge indicator
    this.candidateTag = document.createElementNS(SVG_NS, 'text');
    this.candidateTag.setAttribute('class', 'treetoy-candidate-tag');
    this.candidateTag.textContent = '★ CANDIDATE';
    this.candidateTag.style.display = 'none';
    nodesGroup.appendChild(this.candidateTag);

    svg.appendChild(nodesGroup);
    this.container.appendChild(svg);
    this.svgElement = svg;
  }

  /**
   * Updates visualization to highlight a specific search step.
   * @param {Object} step
   */
  applyStep(step) {
    this.resetHighlights();
    if (!step) return;

    // Highlight active traversed edge
    if (step.edge && step.edge.from && step.edge.to) {
      const edgeKey = `${step.edge.from}->${step.edge.to}`;
      const line = this.edgeMap.get(edgeKey);
      if (line) {
        line.classList.add('treetoy-edge-active');
      }
    }

    // Highlight candidate node if present (for two-way search)
    if (step.candidateId && this.nodeMap.has(step.candidateId)) {
      const cand = this.nodeMap.get(step.candidateId);
      cand.shape.classList.add('is-candidate');
      if (this.candidateTag) {
        this.candidateTag.setAttribute('x', cand.data.x);
        this.candidateTag.setAttribute('y', cand.data.y - cand.data.radius - 8);
        this.candidateTag.style.display = 'block';
      }
    } else if (this.candidateTag) {
      this.candidateTag.style.display = 'none';
    }

    // Highlight current node
    if (step.nodeId && this.nodeMap.has(step.nodeId)) {
      const curr = this.nodeMap.get(step.nodeId);
      if (step.type === 'found') {
        curr.shape.classList.add('is-success');
      } else if (step.type === 'not_found') {
        curr.shape.classList.add('is-failed');
      } else {
        curr.shape.classList.add('is-active');
      }
    }

    // If sentinel search has assigned values, reflect in sentinel node texts
    for (const [, item] of this.nodeMap) {
      if (item.data.isSentinel && item.data.nodeRef) {
        item.text.textContent =
          item.data.nodeRef.val !== null ? String(item.data.nodeRef.val) : 'S';
      }
    }
  }

  /**
   * Clears highlights from all nodes and edges.
   */
  resetHighlights() {
    for (const [, item] of this.nodeMap) {
      item.shape.classList.remove('is-active', 'is-candidate', 'is-success', 'is-failed');
    }
    for (const [, line] of this.edgeMap) {
      line.classList.remove('treetoy-edge-active');
    }
    if (this.candidateTag) {
      this.candidateTag.style.display = 'none';
    }
  }

  /**
   * Updates tree layout and re-renders SVG.
   * @param {Object} newLayout
   */
  updateLayout(newLayout) {
    this.layout = newLayout;
    this.nodeMap.clear();
    this.edgeMap.clear();
    this.render();
  }
}
