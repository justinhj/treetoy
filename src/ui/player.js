/**
 * Playback controller for step-by-step tree animations.
 */
export class Player {
  /**
   * @param {Object} options
   * @param {Array<Object>} [options.steps=[]]
   * @param {number} [options.speed=800]
   * @param {Function} [options.onStepChange]
   * @param {Function} [options.onStateChange]
   */
  constructor(options = {}) {
    this.steps = options.steps || [];
    this.speed = options.speed || 800;
    this.onStepChange = options.onStepChange || (() => {});
    this.onStateChange = options.onStateChange || (() => {});

    this.currentIndex = -1;
    this.isPlaying = false;
    this.timer = null;
  }

  setSteps(steps) {
    this.pause();
    this.steps = steps || [];
    this.currentIndex = -1;
    this.notifyState();
  }

  setSpeed(speedMs) {
    this.speed = Math.max(100, speedMs);
    if (this.isPlaying) {
      this.pause();
      this.play();
    }
  }

  play() {
    if (this.isPlaying) return;
    if (this.steps.length === 0) return;

    if (this.currentIndex >= this.steps.length - 1) {
      // If at end, loop back from start
      this.currentIndex = -1;
    }

    this.isPlaying = true;
    this.notifyState();

    this.scheduleNextTick();
  }

  pause() {
    if (!this.isPlaying) return;
    this.isPlaying = false;
    if (this.timer) {
      clearTimeout(this.timer);
      this.timer = null;
    }
    this.notifyState();
  }

  scheduleNextTick() {
    if (!this.isPlaying) return;

    this.timer = setTimeout(() => {
      if (!this.isPlaying) return;

      if (this.currentIndex < this.steps.length - 1) {
        this.stepForward();
        this.scheduleNextTick();
      } else {
        this.pause();
      }
    }, this.speed);
  }

  stepForward() {
    if (this.currentIndex < this.steps.length - 1) {
      this.currentIndex++;
      this.notifyStep();
      this.notifyState();
      return true;
    }
    return false;
  }

  stepBackward() {
    if (this.currentIndex > 0) {
      this.currentIndex--;
      this.notifyStep();
      this.notifyState();
      return true;
    } else if (this.currentIndex === 0) {
      this.reset();
      return true;
    }
    return false;
  }

  seek(index) {
    const target = Math.max(-1, Math.min(index, this.steps.length - 1));
    this.currentIndex = target;
    this.notifyStep();
    this.notifyState();
  }

  reset() {
    this.pause();
    this.currentIndex = -1;
    this.notifyStep();
    this.notifyState();
  }

  notifyStep() {
    const currentStep = this.currentIndex >= 0 ? this.steps[this.currentIndex] : null;
    this.onStepChange(this.currentIndex, currentStep);
  }

  notifyState() {
    this.onStateChange({
      isPlaying: this.isPlaying,
      currentIndex: this.currentIndex,
      totalSteps: this.steps.length,
      hasPrev: this.currentIndex > -1,
      hasNext: this.currentIndex < this.steps.length - 1
    });
  }
}
