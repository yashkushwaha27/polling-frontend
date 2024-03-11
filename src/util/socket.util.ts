import { Socket, io } from "socket.io-client";
import { socketConstants } from "../constants/socketConstants";
import { DefaultEventsMap } from "@socket.io/component-emitter";

class SocketUtil {
  socket: Socket<DefaultEventsMap, DefaultEventsMap> | undefined;

  createSocket() {
    if (!this.socket) {
      const socket = io(socketConstants.connectionUrl);
      this.socket = socket;
    }
    return this;
  }

  getSocket() {
    return this.socket;
  }
}

// eslint-disable-next-line
export default new SocketUtil();
