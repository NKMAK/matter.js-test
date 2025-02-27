import { globalRoomInfo } from "../globalValue/globalVal";

const connectInputDom = document.getElementById("connectID");
const createRoomBtnDom = document.getElementById("createRoomID");
const joinRoomBtnDom = document.getElementById("joinRoomID");

export function roomConnectHandler() {
  connectInputDom.addEventListener("input", (e) => {
    globalRoomInfo.roomID = e.target.value;
  });

  //TODO try-catchスコープはserviceフォルダで実装
  createRoomBtnDom.addEventListener("click", (e) => {
    try {
      console.log("ルーム作成fetch" + globalRoomInfo.roomID);
      if (true) {
        globalRoomInfo.isRoomCreate = true;
      }
    } catch (e) {}
  });

  joinRoomBtnDom.addEventListener("click", (e) => {
    try {
      console.log("接続" + globalRoomInfo.roomID);
      if (true) {
        globalRoomInfo.isJoinRoom = true;
      }
    } catch (e) {
      console.error(e);
    }
  });
}
