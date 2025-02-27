import { globalRoomInfo } from "../globalValue/globalVal";
const gameStartBtnDom = document.getElementById("gameStartID");

export const gameStartBtnVisibleHandler = (isCreate) => {
  if (isCreate) {
    gameStartBtnDom.style.display = "block";
    gameStartHandler();
  } else {
    gameStartBtnDom.style.display = "none";
  }
};

const gameStartHandler = () => {
  gameStartBtnDom.addEventListener("click", () => {
    try {
      console.log("ゲームスタートfetch" + globalRoomInfo.roomID);
    } catch (e) {
      console.error(e);
    }
  });
};
