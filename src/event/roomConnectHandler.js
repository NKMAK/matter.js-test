import { globalRoomInfo } from "../globalValue/globalVal";

const connectInputDom = document.getElementById("connectID");
const createRoomBtnDom = document.getElementById("createRoomID");
const joinRoomBtnDom = document.getElementById("joinRoomID");
const initMenuDom = document.getElementById("initMenuID");
const myCanvasDom = document.getElementById("gameRenderCanvasID");

export function roomConnectHandler(websocketService) {
  connectInputDom.addEventListener("input", (e) => {
    globalRoomInfo.roomID = e.target.value;
  });

  createRoomBtnDom.addEventListener("click", async (e) => {
    try {
      await websocketService.createRoom();
    } catch (e) {}
  });

  joinRoomBtnDom.addEventListener("click", async (e) => {
    try {
      await websocketService.joinRoom(globalRoomInfo.roomID);
      initMenuDom.style.display = "none";
      //myCanvasDom.style.visibility = "visible";
    } catch (e) {
      console.error(e);
    }
  });
}
