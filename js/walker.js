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

  function Position(_x, _y) {
    var x, y;

    function init(_x, _y) {
      typeof _x == 'object' ?
        (this.x = _x.x || _x.clientX, this.y = _x.y || _x.clientY) :
        (this.x = _x || 0, this.y = _y || 0);
    }

    this.updateWith = init.bind(this);
    this.add = function (pos) {
      return new Position(this.x + pos.x, this.y + pos.y)
    };
    this.subtract = function (pos) {
      return new Position(this.x - pos.x, this.y - pos.y)
    };
    this.multiple = function (n) {
      return new Position(this.x * n, this.y * n)
    };
    this.divide = function (n) {
      return new Position(this.x / n, this.y / n)
    };
    this.equals = function (pos) {
      return pos.subtract(this).manhattanLength() < 5
    };
    this.manhattanLength = function() {
      return Math.abs(this.x) + Math.abs(this.y)
    };
    this.angel = function () {
      return Math.floor(Math.atan2(this.y, this.x) * 180 / Math.PI)
    };

    init.call(this, _x, _y);
  }

  function Person() {
    var moveID,
    speed = 3,
    direction = 'down',
    vector = new Position(),
    destination = new Position(),
    el = document.getElementById('walker'),
    currentPos = new Position(elementPos(el));

    function move() {
      currentPos.updateWith(currentPos.add(vector.multiple(speed)));
      if(currentPos.equals(destination)) {
        el.classList.remove('go');
        clearInterval(moveID);
        moveID = 0
      }
      makeAStep()
    }

    function makeAStep() {
      el.style.top = (currentPos.y - 90) + 'px';
      el.style.left = (currentPos.x - 64) + 'px'
    }

    function rotate(angel) {
      var dir = angelToDirection(angel);
      el.classList.remove(direction, 'flip');
      el.classList.add(direction = dir[0]);
      dir[1] && el.classList.add('flip')
    }

    function elementPos() {
      return { x: el.offsetLeft + 64, y: el.offsetTop + 90 }
    }

    this.setDestination = function (pos) {
      var delta = pos.subtract(currentPos), ang = delta.angel();

      rotate(ang);
      vector.updateWith(delta.divide(delta.manhattanLength()));
      destination.updateWith(pos);
      return this
    };
    this.walk = function () {
      moveID || (moveID = setInterval(move, 63), el.classList.add('go'))
    }
  }

  function Play() {
    var walker = new Person();

    document.onclick = function (ev) {
      walker.setDestination(new Position(ev)).walk();
    }
  }

  Play()
}());
