class Room {
  constructor(id, title, namespace, roomPrivate = false) {
    this.id = id;
    this.title = title;
    this.namespace = namespace;
    this.roomPrivate = roomPrivate;
    this.history = [];
  }

  addMessage(msg) {
    this.history.push(msg);
  }

  clearHistory() {
    this.history = [];
  }
}

module.exports = Room;
