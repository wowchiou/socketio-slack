class Namespace {
  constructor(id, title, img, endpoint) {
    this.id = id;
    this.title = title;
    this.img = img;
    this.endpoint = endpoint;
    this.rooms = [];
  }

  addRoom(roomObject) {
    this.rooms.push(roomObject);
  }
}

module.exports = Namespace;
