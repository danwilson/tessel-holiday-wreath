
var tessel = require('tessel');
var Neopixels = require('neopixels');

var neo = new Neopixels();


var vals = [0x00, 0x11, 0x22, 0x33, 0x44, 0x55, 0x66, 0x77, 0x88, 0x99, 0xaa, 0xbb, 0xcc, 0xdd, 0xee, 0xff];
var hexes = [0x00, 0x01, 0x02, 0x03, 0x04, 0x05, 0x06, 0x07, 0x08, 0x09, 0x0a, 0x0b, 0x0c, 0x0d, 0x0e, 0x0f, 0x10, 0x11, 0x12, 0x13, 0x14, 0x15, 0x16, 0x17, 0x18, 0x19, 0x1a, 0x1b, 0x1c, 0x1d, 0x1e, 0x1f, 0x20, 0x21, 0x22, 0x23, 0x24, 0x25, 0x26, 0x27, 0x28, 0x29, 0x2a, 0x2b, 0x2c, 0x2d, 0x2e, 0x2f, 0x30, 0x31, 0x32, 0x33, 0x34, 0x35, 0x36];
var NUM_FRAMES = 60;
var FRAME_MULTIPLIER = 2;
var NEO_LENGTH = 60;
var END_FADE_IN = 1;
var END_ANIMATION = 90;
var END_FADE_OUT = 91;
var animCount = 0;
var color = {
  r: 0x00,
  g: 0x11,
  b: 0x33
};

var CHRISTMAS = {
  primary: {
    r: 0x11,
    g: 0x77,
    b: 0x44
  }
};
var THANKSGIVING = {
  primary: {
    r: 243,
    g: 72,
    b: 0
  },
  secondary: [{
    r: 55,
    g: 8,
    b: 10
  },{
    r: 180,
    g: 100,
    b: 3
  }]
};


var now = new Date();
var holiday;
if ((now.getMonth() === 11 && now.getDate() < 26) ||
  (now.getMonth() === 10 && (now.getDay() >= 5 && now.getDate() > 23) ||
    (now.getDay() >= 0 && now.getDay() < 5 && now.getDate() > 25))) {
  holiday = CHRISTMAS;
} else {
  holiday = THANKSGIVING;
}
var anim = Buffer.concat(wreath(NEO_LENGTH, NUM_FRAMES * FRAME_MULTIPLIER, holiday));
neo.on('end', function() {
  console.log((animCount++), ' ended');
  neo.animate(NUM_FRAMES, anim);
});

console.log('starting neopixel animation', (now.getMonth() + 1), now.getDate(), now.getFullYear());
console.log('primary color', holiday.primary.r, holiday.primary.g, holiday.primary.b);
neo.animate(NUM_FRAMES, anim);


function wreath(numLEDs, numFrames, holiday) {
  var arr = [];
  var alternates = {};

  if (holiday.secondary) {
    var randDistance;
    var randSecondary;
    for (var k = 4; k < numLEDs; ) {
      randDistance = Math.ceil(Math.random() * 3) + 1;
      randSecondary = Math.floor(Math.random() * holiday.secondary.length);

      console.log(k, randSecondary, randDistance);
      alternates[k] = holiday.secondary[randSecondary];

      k = k + randDistance;
    }
  }

  for (var j = 0; j < numFrames; j++) {
    var buf = new Buffer(numLEDs * 3);
    
    for (var i = 0; i < numLEDs; i++) {
      if (alternates[i]) {
        buf[i * 3] = alternates[i].g;
        buf[i * 3 + 1] = alternates[i].r;
        buf[i * 3 + 2] = alternates[i].b;
      } else {
        buf[i * 3] = holiday.primary.g;
        buf[i * 3 + 1] = holiday.primary.r;
        buf[i * 3 + 2] = holiday.primary.b;
      }
    }

    arr.push(buf);
  }
  
  return arr;
}