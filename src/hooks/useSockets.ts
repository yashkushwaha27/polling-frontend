import socketUtil from "../util/socket.util";

export const useSockets = () => {
  const socket = socketUtil.getSocket();

  const createSocket = () => socketUtil.createSocket();

  return { socket, createSocket };
};
