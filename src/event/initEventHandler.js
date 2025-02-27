import { globalRoomInfo } from "../globalValue/globalVal";

const connectInputDom = document.getElementById("connectID");
const createRoomBtnDom = document.getElementById("createRoomID");
const joinRoomBtnDom = document.getElementById("joinRoomID");

let coonectUID;

export const initEventHandler = () => {
  connectInputDom.addEventListener("input", (e) => {
    globalRoomInfo.isRoomID = e.target.value;
  });

  createRoomBtnDom.addEventListener("click", (e) => {
    try {
      console.log("ルーム作成fetch" + globalRoomInfo.isRoomID);
      if (true) {
        globalRoomInfo.isRoomCreate = true;
      }
    } catch (e) {}
  });

  joinRoomBtnDom.addEventListener("click", (e) => {
    try {
      console.log("接続" + globalRoomInfo.isRoomID);
      if (true) {
        globalRoomInfo.isJoinRoom = true;
      }
    } catch (e) {
      console.error(e);
    }
  });
};
