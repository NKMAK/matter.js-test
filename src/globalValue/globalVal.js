import { gameStartBtnVisibleHandler } from "../event/gameStartHandler";

export const globalRoomInfo = new Proxy(
  {
    isRoomCreate: false,
    isJoinRoom: false,
    isDisconnect: false,
    joinMemberCnt: 0,

    roomID: null,
    userUID: null,

    isGameStart: false,
    isShot: false,
    isGoal: false,
  },
  {
    set(target, key, value) {
      if (key === "isRoomCreate") {
        gameStartBtnVisibleHandler(value);
      }
      target[key] = value;
      return true;
    },
  }
);

//TODO　グローバル変数にするか後で考える
export const globalGameState = {};
