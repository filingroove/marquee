# @egstad/marquee

> A straight-forward Marquee

## Install

```bash
npm install @egstad/marquee
```

## Usage

### Markup

```html
<div class="marquee">
  <!-- Can be any html element you wish -->
  <p>Hello World</p>
</div>

<!-- Use the speed dataset to speed it up -->
<div class="marquee" data-speed="5">
  <p>Hello World</p>
</div>
```

### Javascript
```js
// import
import Marquee from '@egstad/marquee'

// init with class
const marquee = new Marquee('.className')

// init with element
const element = document.querySelector('.marquee')
const options = {
  initialOffset: false, // initial offset of marquee sign. `false` will mean that we should use default behavior of egstad/marquee
  mode: 'toLeft', // 'toLeft' | 'toRight' - use intersectionObserver and reset marquee when sign has left the screen. 'leftRight' | 'rightLeft' – change direction when sign is about to reach out of screen
  speed: 0.5, // pixels moved per animation frame
  delay: 1500 // delay in ms for 'leftRight' and 'rightLeft' modes for when direction is changing
}
const marquee = new Marquee(element, options)
```

### Methods
```js
// create instance
const marquee = new Marquee('.className')

// pause animation
marquee.stop()

// start over
marquee.reset()

// destroy events
marquee.destroy()

```
