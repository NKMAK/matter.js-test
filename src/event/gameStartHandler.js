import { globalRoomInfo } from "../globalValue/globalVal";
const gameStartBtnDom = document.getElementById("gameStartID");
const initMenuDom = document.getElementById("initMenuID");
const myCanvasDom = document.getElementById("myCanvas");

export const gameStartBtnVisibleHandler = (isCreate) => {
  if (isCreate) {
    gameStartBtnDom.style.visibility = "visible";
  } else {
    gameStartBtnDom.style.visibility = "hidden";
  }
};

export const gameStartHandler = (websocketService) => {
  gameStartBtnDom.addEventListener("click", async () => {
    try {
      console.log("ゲームスタートfetch" + globalRoomInfo.roomID);
      await websocketService.startGame();
      initMenuDom.style.display = "none";
      myCanvasDom.style.visibility = "visible";
    } catch (e) {
      console.error(e);
    }
  });
};
