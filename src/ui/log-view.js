/**
 * Manages the collapsible action log view.
 */
export class LogView {
  /**
   * @param {HTMLElement} container
   * @param {Object} options
   */
  constructor(container, options = {}) {
    this.container = container;
    this.collapsible = options.collapsible !== false;
    this.initiallyVisible = options.visible !== false;
    this.onSelectStep = options.onSelectStep || null;
    this.steps = [];
    this.currentStepIndex = -1;
    this.isCollapsed = !this.initiallyVisible;

    this.render();
  }

  render() {
    this.container.innerHTML = '';

    const section = document.createElement('div');
    section.className = 'treetoy-log-section';

    // Header
    const header = document.createElement('div');
    header.className = 'treetoy-log-header';

    this.titleSpan = document.createElement('span');
    this.titleSpan.textContent = 'Action Log (0 steps)';

    this.toggleSpan = document.createElement('span');
    this.toggleSpan.textContent = this.isCollapsed ? '▶ Show Log' : '▼ Hide Log';

    header.appendChild(this.titleSpan);
    if (this.collapsible) {
      header.appendChild(this.toggleSpan);
      header.addEventListener('click', () => this.toggle());
    }

    // Body
    const body = document.createElement('div');
    body.className = 'treetoy-log-body';
    body.style.display = this.isCollapsed ? 'none' : 'block';
    this.bodyElement = body;

    const list = document.createElement('ul');
    list.className = 'treetoy-log-list';
    this.listElement = list;

    body.appendChild(list);
    section.appendChild(header);
    section.appendChild(body);
    this.container.appendChild(section);
  }

  toggle() {
    this.isCollapsed = !this.isCollapsed;
    this.bodyElement.style.display = this.isCollapsed ? 'none' : 'block';
    this.toggleSpan.textContent = this.isCollapsed ? '▶ Show Log' : '▼ Hide Log';
  }

  setVisible(visible) {
    this.isCollapsed = !visible;
    this.bodyElement.style.display = this.isCollapsed ? 'none' : 'block';
    this.toggleSpan.textContent = this.isCollapsed ? '▶ Show Log' : '▼ Hide Log';
  }

  /**
   * Sets the list of steps to display.
   * @param {Array<Object>} steps
   */
  setSteps(steps) {
    this.steps = steps || [];
    this.titleSpan.textContent = `Action Log (${this.steps.length} steps)`;
    this.listElement.innerHTML = '';

    this.steps.forEach((step, idx) => {
      const li = document.createElement('li');
      li.className = 'treetoy-log-item';
      li.id = `tt-log-step-${idx}`;
      li.innerHTML = `<strong>Step ${idx}:</strong> ${step.message}`;
      li.style.cursor = 'pointer';
      li.title = step.details || '';

      li.addEventListener('click', () => {
        if (typeof this.onSelectStep === 'function') {
          this.onSelectStep(idx);
        }
      });

      this.listElement.appendChild(li);
    });
  }

  /**
   * Highlights the active step in the log and scrolls to it.
   * @param {number} stepIndex
   */
  setCurrentStep(stepIndex) {
    this.currentStepIndex = stepIndex;

    const items = this.listElement.querySelectorAll('.treetoy-log-item');
    items.forEach((item, idx) => {
      item.classList.remove('is-current', 'is-success', 'is-failed');
      if (idx === stepIndex) {
        item.classList.add('is-current');
        const step = this.steps[idx];
        if (step) {
          if (step.type === 'found') item.classList.add('is-success');
          if (step.type === 'not_found') item.classList.add('is-failed');
        }

        // Auto-scroll
        if (!this.isCollapsed) {
          item.scrollIntoView({ block: 'nearest', behavior: 'smooth' });
        }
      }
    });
  }
}
