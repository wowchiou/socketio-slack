// Bring in the room class
const Namespace = require('../classes/Namespace');
const Room = require('../classes/Room');

let namespaces = [];
const nsImgSrc = '/images/namespace';

// Set up the namespaces
let mouse = new Namespace(0, '皮卡丘', `${nsImgSrc}/mouse.png`, '/mouse');
let frog = new Namespace(1, '妙蛙種子', `${nsImgSrc}/frog.png`, '/frog');
let dragon = new Namespace(2, '小火龍', `${nsImgSrc}/dragon.png`, '/dragon');
let tortoise = new Namespace(
  3,
  '傑尼龜',
  `${nsImgSrc}/tortoise.png`,
  '/tortoise'
);

// Make the main room and add it to rooms. it will ALWAYS be 0
mouse.addRoom(new Room(0, '過街老鼠', 'mouse', true));
mouse.addRoom(new Room(1, '愛鼠你', 'mouse', false));
mouse.addRoom(new Room(2, '鼠年行大運', 'mouse', false));

frog.addRoom(new Room(0, '青蛙下蛋', 'frog', false));
frog.addRoom(new Room(1, '青蛙人', 'frog', true));
frog.addRoom(new Room(2, '種子種子', 'frog', false));

dragon.addRoom(new Room(0, '老噴', 'dragon', false));
dragon.addRoom(new Room(1, '噴火龍好帥', 'dragon', true));

tortoise.addRoom(new Room(0, '傑尼傑尼', 'tortoise', false));
tortoise.addRoom(new Room(1, '傑尼老大', 'tortoise', false));

namespaces.push(mouse, frog, dragon, tortoise);
module.exports = namespaces;
