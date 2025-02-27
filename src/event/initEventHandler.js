const connectInputDom = document.getElementById("connectID");
const createRoomBtnDom = document.getElementById("createRoomID");
const joinRoomBtnDom = document.getElementById("joinRoomID");

let coonectUID;

export const initEventHandler = () => {
  connectInputDom.addEventListener("input", (e) => {
    coonectUID = e.target.value;
  });

  createRoomBtnDom.addEventListener("click", (e) => {
    console.log(coonectUID + "ルーム作成");
  });

  joinRoomBtnDom.addEventListener("click", (e) => {
    console.log(coonectUID + "接続");
  });
};
