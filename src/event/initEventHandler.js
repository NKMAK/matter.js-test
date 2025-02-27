import { roomConnectHandler } from "./roomConnectHandler";
import { gameStartHandler } from "./gameStartHandler";
export const initEventHandler = (websocketService) => {
  roomConnectHandler(websocketService);

  gameStartHandler(websocketService);
};
