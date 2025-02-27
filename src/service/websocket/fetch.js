import { globalRoomInfo } from "../../globalValue/globalVal";
class WebSocketService {
  constructor() {
    this.socket = null;
    this.isConnected = false;
    this.serverUrl = "http://localhost:8000/ws"; //TODO envで読み込ませる
    this.reconnectAttempts = 0;
    this.maxReconnectAttempts = 5;
  }

  connect() {
    return new Promise((resolve, reject) => {
      try {
        this.socket = new WebSocket(this.serverUrl);

        this.socket.onopen = () => {
          console.log("WebSocket接続");
          this.isConnected = true;
          this.reconnectAttempts = 0;
          globalRoomInfo.isDisconnect = false;
          resolve();
        };

        this.socket.onmessage = (event) => {
          try {
            const message = JSON.parse(event.data);
            console.log("受信メッセージ:", message);
            this.handleMessage(message);
          } catch (error) {
            console.error("予期しないエラー:", error);
          }
        };

        this.socket.onerror = (error) => {
          console.error("WebSocket接続エラー:", error);
          reject(error);
        };

        this.socket.onclose = (event) => {
          console.log(`WebSocket接続が閉じられました。コード:  ${event}`);
          this.isConnected = false;
          globalRoomInfo.isDisconnect = true;
        };
      } catch (error) {
        console.error("WebSocket接続の確立に失敗:", error);
        reject(error);
      }
    });
  }

  // 受信メッセージを処理
  handleMessage(message) {
    const { event_type } = message;

    switch (event_type) {
      case "create_room":
        this.handleRoomCreated(message);
        break;
      case "join_room":
        this.handleJoinRoom(message);
        break;
      case "start_game":
        this.handleGameStarted(message);
        break;
      case "send_shot":
        this.handleShotData(message);
        break;
      case "ready_shot":
        this.handleVectorData(message);
        break;
      case "reach_goal":
        this.handleGoal(message);
        break;
      case "reach_no_goal":
        this.handleNoGoal(message);
        break;
      case "wait_for_next_shot":
        this.handleNoGoal(message);
        break;
      case "game_over":
        this.handleGameOver(message);
        break;
      default:
        console.warn(`未知のメッセージタイプ: ${event_type}`);
    }
  }

  createRoom() {
    return this.ensureConnectedAndSend({
      event_type: "create_room",
    });
  }

  joinRoom(roomId) {
    if (!roomId) {
      return Promise.reject(new Error("ルームIDが必要です"));
    }

    return this.ensureConnectedAndSend({
      event_type: "join_room",
      room: { room_id: roomId },
    });
  }

  startGame() {
    if (!globalRoomInfo.roomID) {
      return Promise.reject(new Error("ルームIDが設定されていません"));
    }

    return this.ensureConnectedAndSend({
      event_type: "start_game",
      room: { room_id: globalRoomInfo.roomID },
    });
  }

  sendShot(shotData) {
    return this.ensureConnectedAndSend({
      event_type: "send_shot",
      room: { room_id: globalRoomInfo.roomID },
      shot: shotData,
    });
  }

  notifyGoal() {
    return this.ensureConnectedAndSend({
      event_type: "reach_goal",
      room: { room_id: globalRoomInfo.roomID },
    });
  }

  notifyNoGoal() {
    return this.ensureConnectedAndSend({
      event_type: "reach_no_goal",
      room: { room_id: globalRoomInfo.roomID },
    });
  }

  ensureConnectedAndSend(message) {
    if (!this.isConnected) {
      return this.connect().then(() => this.sendMessage(message));
    }
    return this.sendMessage(message);
  }

  sendMessage(message) {
    return new Promise((resolve, reject) => {
      if (!this.isConnected) {
        reject(new Error("WebSocketに接続されていません"));
        return;
      }

      try {
        this.socket.send(JSON.stringify(message));
        console.log("送信メッセージ", message);
        resolve();
      } catch (error) {
        console.error("メッセージ送信に失敗:", error);
        reject(error);
      }
    });
  }

  disconnect() {
    if (this.socket && this.isConnected) {
      this.socket.close();
      this.isConnected = false;
    }
  }

  handleRoomCreated(message) {
    const { room } = message;
    if (room && room.room_id) {
      globalRoomInfo.roomID = room.room_id;
      globalRoomInfo.userUID = room.room_owner_id;
      globalRoomInfo.isRoomCreate = true;
      console.log(
        `ルームが作成されました: ${room.room_id}, オーナーID: ${room.room_owner_id}`
      );
    } else {
      console.error("不正なルーム作成レスポンス:", message);
    }
  }

  handleJoinRoom(message) {
    const { room, users } = message;
    if (room && room.room_id && users) {
      globalRoomInfo.roomID = room.room_id;
      globalRoomInfo.joinMemberCnt = users.length;

      if (!globalRoomInfo.userUID && users.length > 0) {
        // 最後に参加したユーザーが自分と仮定
        globalRoomInfo.userUID = users[users.length - 1].id;
      }

      globalRoomInfo.isJoinRoom = true;
      console.log(
        `ルーム ${room.room_id} に参加しました、参加者数: ${users.length}人`
      );
    } else {
      console.error("不正なルーム参加レスポンス:", message);
    }
  }

  handleGameStarted(message) {
    const { room } = message;
    if (room && room.room_id) {
      globalRoomInfo.isGameStart = true;
      console.log(`ルーム ${room.room_id} でゲームが開始されました`);
    } else {
      console.error("不正なゲーム開始レスポンス:", message);
    }
  }

  handleShotData(message) {
    const { shot, room } = message;
    console.log(`ルーム ${room?.room_id} でショットデータを受信:`, shot);
    globalRoomInfo.isShot = true;
  }

  // 計算済みベクトルデータ受信時の処理
  handleVectorData(message) {
    const { room, shot } = message;
    console.log(`ルーム ${room?.room_id} でベクトルデータを受信:`, shot);

    const vectorEvent = new CustomEvent("ballVectorReceived", {
      detail: shot,
    });
    window.dispatchEvent(vectorEvent);
  }

  handleGoal(message) {
    const { room } = message;
    globalRoomInfo.isGoal = true;
    console.log(`ルーム ${room?.room_id} でゴールが決まりました`);
    alert("ゴールが決まりました");
    const goalEvent = new CustomEvent("goalScored");
    window.dispatchEvent(goalEvent);
  }

  handleNoGoal(message) {
    const { room } = message;
    console.log("ゴールできなかった");
  }

  handleGameOver(message) {
    const { room } = message;

    console.log(`ルーム ${room?.room_id} でゲームが終了しました`);

    alert("おめでとうございます！ゴールしました");
    //　何も使ってないイベント
    const gameOverEvent = new CustomEvent("gameOver");
    window.dispatchEvent(gameOverEvent);

    this.disconnect();
  }
}

const websocketService = new WebSocketService();

export default websocketService;
