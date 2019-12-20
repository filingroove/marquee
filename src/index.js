/**
 * @typedef {Object} MarqueeOptions
 * @property {(Boolean|Number)} [initialOffset] - initial offset of marquee sign. `false` will mean that we should use default behavior of egstad/marquee
 * @property {String} [mode] - 'toLeft' | 'toRight' - use intersectionObserver and reset marquee when it has left the screen. 'leftRight' | 'rightLeft' – change direction when sign is about to reach out of screen
 * @property {Number} [speed] - pixels moved per animation frame
 * @property {Number} [delay] - delay in ms for 'leftRight' and 'rightLeft' modes for when direction is changing
 */

const DEFAULT_OPTIONS = {
  initialOffset: false,
  mode: 'toLeft',
  speed: 0.5,
  delay: 1500
}

/**
 * @class
 */
class Marquee {
  /**
   * @param {HTMLElement} el - element to process
   * @param {MarqueeOptions} options
   */
  constructor(el, options = {} ) {

    this.options = Object.assign( DEFAULT_OPTIONS, options );

    // marquee el
    if (typeof el === "object") {
      this.el = el;
    } else if (typeof el === "string") {
      this.el = document.querySelector(el);
    } else {
      throw new TypeError("Marquee accepts either a HTML Element (object) or a class/id to query (string).");
    }
    // marquee content
    this.sign = this.el.children[0];
    // raf instance, cached for cancel
    this.RAF = null;
    this.offset = this.getInitialOffset();
    this.speed = this.options.speed;
    this.observerOptions = {
      rootMargin: '0px 0px',
      threshold: 0,
    };
    this.observer = null;

    this.styleElements();
    this.init();
  }

  init() {
    switch (this.options.mode) {
      case "toLeft":
      case "leftRight":
        this.direction = "left";
        break;
      case "toRight":
      case "rightLeft":
        this.direction = "right";
        break;
    }

    this.observerInit();
    this.observer.observe(this.sign);
    this.draw();
  }
  styleElements() {
    this.el.style.display = "flex";
    this.sign.style.display = "inline-flex";
  }

  getInitialOffset() {
    const { initialOffset, mode } = this.options;

    if ( initialOffset !== false ) {
      return initialOffset;
    }

    switch (mode) {
      case "toRight":
        return this.el.offsetWidth;
      case "toLeft":
        return -this.el.offsetWidth;
    }
  }

  updateOffset() {
    const { mode } = this.options;
    const { el, sign } = this;

    const initOffset = this.getInitialOffset();
    let delay = false;

    switch (mode) {
      case "rightLeft":
        if ( this.offset >= initOffset && this.direction === 'right' ) {
          delay = true;
          this.direction = "left"
        } else if ( this.offset <= el.offsetWidth && this.direction === 'left' ) {
          delay = true;
          this.direction = "right"
        }
        break;

      case "leftRight":
        if ( this.offset <= -( sign.offsetWidth - el.offsetWidth ) && this.direction === 'left' ) {
          delay = true;
          this.direction = "right"
        } else if ( this.offset >= initOffset && this.direction === 'right' ) {
          delay = true;
          this.direction = "left"
        }

        break;

      default:
        break;
    }

    switch (this.direction) {
      case "right":
        this.offset = this.offset + this.speed;
        break;

      case "left":
        this.offset = this.offset - this.speed;
        break;
      default:
        break;
    }

    return delay;
  }

  draw() {
    const performAnimation = () => {
      const delayAnimation = this.updateOffset();
      this.sign.style.transform = `translate3d(${this.offset}px, 0, 0)`;

      if ( delayAnimation ) {
        setTimeout( this.draw.bind( this ), this.options.delay );
      } else {
        this.RAF = requestAnimationFrame(performAnimation);
      }
    };

    requestAnimationFrame(performAnimation);
  }

  stop() {
    cancelAnimationFrame(this.RAF);
  }

  reset() {
    const { mode } = this.options;

    switch (mode) {
      case "toRight":
        this.offset = this.el.offsetWidth;
        break;
      case "toLeft":
        this.offset = -this.el.offsetWidth;
        break;
    }

    this.sign.style.transform = `translate3d(${this.offset}px, 0, 0)`;
  }

  observerInit() {
    this.observer = new IntersectionObserver(entries => {
      entries.forEach(entry => {
        if (entry.intersectionRatio === 0) {
          this.reset()
        }
      });
    }, this.observerOptions);
  }

  destroy() {
    this.stop()
    this.observer.unobserve(this.sign);
  }
}

export default Marquee;
