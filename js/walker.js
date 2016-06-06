//The MIT License (MIT)
//Copyright (c) 2016 Meliq Pilosyan

(function () { 'use strict';
  function angelToDirection(a) {
    var d = '', f = 0;
    if (a < -165) d = 'right', f = 1;
    else if (a < -135) d = 'up__', f = 1;
    else if (a < -105) d = 'up_', f = 1;
    else if (a < -75) d = 'up';
    else if (a < -45) d = 'up_';
    else if (a < -15) d = 'up__';
    else if (a < 15) d = 'right';
    else if (a < 45) d = 'down__';
    else if (a < 75) d = 'down_';
    else if (a < 105) d = 'down';
    else if (a < 135) d = 'down_', f = 1;
    else if (a < 165) d = 'down__', f = 1;
    else d = 'right', f = 1;
    return [d, f]
  }

  function walkerWillCallTheseBack() {
    var element = document.createElement('div'), style = element.style,
        computedStyle, w, h;

    // get CSS width and height of class 'flashing'
    element.setAttribute('class', 'destination');
    document.body.appendChild(element);
    computedStyle = window.getComputedStyle(element);
    w = parseInt(computedStyle.getPropertyValue('width'));
    h = parseInt(computedStyle.getPropertyValue('height'));

    element.appendChild(document.createElement('div'))
    element.appendChild(document.createElement('div'))


    return {
      beforeChangeDestination: function(destination) {
        style.left = (destination.x - w / 2) + 'px';
        style.top = (destination.y - h / 2) + 'px';
        element.classList.add('blink');
        document.body.appendChild(element);
      },
      afterStop: function() {
        element.classList.remove('blink');
        element.remove()
      }
    }
  }

  function Position(x, y) {
    function init(x, y) {
      typeof x == 'object' ?
        (this.x = x.x || x.clientX, this.y = x.y || x.clientY) :
        (this.x = x || 0, this.y = y || 0);
    }

    (this.updateWith = init.bind(this))(x, y)
  }

  Position.prototype = {
    changeWith: function (pos) {
      this.x += pos.x;
      this.y += pos.y;
      return this
    },
    subtract: function (pos) {
      return new Position(this.x - pos.x, this.y - pos.y)
    },
    multiply: function (n) {
      return new Position(this.x * n, this.y * n)
    },
    divide: function (n) {
      return new Position(this.x / n, this.y / n)
    },
    equals: function (pos) {
      return pos.subtract(this).manhattanLength() < 2
    },
    manhattanLength: function() {
      return Math.abs(this.x) + Math.abs(this.y)
    },
    angel: function () {
      return Math.floor(Math.atan2(this.y, this.x) * 180 / Math.PI)
    }
  };

  function Walker(doAfterStop) {
    var MOVE_COEFFICIENT = 2.9, MOVE_INTERVAL = 62, moveID,
        beforeChangeDestination = function () {},
        afterStop = function () {},
        currentDirection = 'down',
        currentAnimation = 'walk-down',
        currentVector = new Position(),
        destination = new Position(),
        walkerElement = document.getElementById('walker'),
        currentPos = new Position(elementPos(walkerElement));

    function move() {
      currentPos.changeWith(currentVector.multiply(MOVE_COEFFICIENT));
      if(currentPos.equals(destination)) {
        walkerElement.classList.remove(currentAnimation);
        clearInterval(moveID);
        afterStop();
        moveID = 0
      }
      makeAStep()
    }

    function makeAStep() {
      walkerElement.style.top = (currentPos.y - 90) + 'px';
      walkerElement.style.left = (currentPos.x - 64) + 'px'
    }

    function rotate(angel) {
      var dir = angelToDirection(angel);
      walkerElement.classList.remove(currentDirection, currentAnimation, 'flip');

      walkerElement.classList.add(currentDirection = dir[0], currentAnimation = 'walk-' +  currentDirection);
      dir[1] && walkerElement.classList.add('flip')
    }

    function elementPos() {
      return { x: walkerElement.offsetLeft + 64, y: walkerElement.offsetTop + 90 }
    }

    this.setDestination = function (pos) {
      var delta = pos.subtract(currentPos), ang = delta.angel();

      rotate(ang);
      beforeChangeDestination(pos);
      currentVector.updateWith(delta.divide(delta.manhattanLength()));
      destination.updateWith(pos);
      return this
    };
    this.walk = function () {
      moveID || (moveID = setInterval(move, MOVE_INTERVAL), walkerElement.classList.add(currentAnimation))
    };

    // beforeChangeDestination
    // afterStop
    this.setCallBacks = function(opts) {
      typeof opts.beforeChangeDestination === 'function' && (beforeChangeDestination = opts.beforeChangeDestination)
      typeof opts.afterStop === 'function' && (afterStop = opts.afterStop)
    }
  }

  function Walk() {
    var walker = new Walker();

    walker.setCallBacks(walkerWillCallTheseBack());

    document.onclick = function (ev) {
      walker.setDestination(new Position(ev)).walk();
    }
  }

  Walk()
}());
