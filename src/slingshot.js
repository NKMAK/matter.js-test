// npmでインストールしたMatter.jsをインポート
import Matter from "matter-js";
import { goalObj } from "./object/goal";
import { eventCollision } from "./func/collosion";
import { launchRock } from "./func/launchRock";
import { createWallStatge1 } from "./object/wall";
import { getLanchRockInfo } from "./func/getLanchRockInfo";
import { initEventHandler } from "./event/initEventHandler";
import { globalRoomInfo } from "./globalValue/globalVal";
import websocketService from "./service/websocket/fetch";

// グローバルにMatterを提供（slingshot.jsで使用できるようにする）
window.Matter = Matter;

// スリングショットの起動関数
function initSlingshot() {
  var Example = window.Example || {};

  Example.slingshot = function () {
    var Engine = Matter.Engine,
      Render = Matter.Render,
      Runner = Matter.Runner,
      Composites = Matter.Composites,
      Events = Matter.Events,
      Constraint = Matter.Constraint,
      MouseConstraint = Matter.MouseConstraint,
      Mouse = Matter.Mouse,
      Body = Matter.Body,
      Composite = Matter.Composite,
      Bodies = Matter.Bodies;

    // create engine
    var engine = Engine.create(),
      world = engine.world;

    // create renderer
    const renderElement = document.getElementById("myCanvas");
    document.body.appendChild(renderElement);
    var render = Render.create({
      element: renderElement,
      engine: engine,
      options: {
        width: 1200,
        height: 800,
        showAngleIndicator: true,
      },
    });
    let dragStartPosition;
    renderElement.style.visibility = "hidden";
    initEventHandler(websocketService);

    Render.run(render);

    // create runner
    var runner = Runner.create();
    Runner.run(runner, engine);

    // エンジン設定を調整して衝突検出精度を向上
    engine.positionIterations = 10; // デフォルトより高い値（デフォルト: 6）
    engine.velocityIterations = 10; // デフォルトより高い値（デフォルト: 4）

    // 画面の端に壁を追加

    // ボールの初期位置を中央寄りに
    var rock = Bodies.polygon(250, 600, 8, 20, rockOptions, { label: "ball" });
    var anchor = { x: 250, y: 600 };

    // ボールの初期位置を中央寄りに
    var rockOptions = {
      density: 0.004,
      frictionAir: 0.005,
      restitution: 0.6, // 跳ね返り係数を上げる
      render: {
        fillStyle: "#F35e66", // 赤みがかったピンク色
        strokeStyle: "black",
        lineWidth: 1,
      },
      label: "ball",
      collisionFilter: { category: 0x0002 },
    };

    // 多角形から円に変更
    var rock = Bodies.circle(170, 450, 20, rockOptions);

    var anchor = { x: 170, y: 450 };
    var elastic = Constraint.create({
      pointA: anchor,
      bodyB: rock,
      length: 0.01,
      damping: 0.01,
      stiffness: 0.05,
    });

    var pyramid = Composites.pyramid(500, 300, 9, 10, 0, 0, function (x, y) {
      return Bodies.rectangle(x, y, 25, 40, {
        collisionFilter: { category: 0x0001 },
      });
    });

    var pyramid2 = Composites.pyramid(550, 0, 5, 10, 0, 0, function (x, y) {
      return Bodies.rectangle(x, y, 25, 40);
    });

    const goal = goalObj(Bodies);
    console.log(goal);
    // 全ての物体をワールドに追加
    createWallStatge1(Bodies, Composite, engine);

    Composite.add(engine.world, [pyramid, pyramid2, rock, elastic, goal]);

    // ボールの状態を管理するフラグ
    var rockLaunched = false;
    var waitForRockToStop = false;

    eventCollision(Events, engine, websocketService);

    Events.on(engine, "afterUpdate", function () {
      // ボールが発射されたかチェック
      if (
        mouseConstraint.mouse.button === -1 &&
        !rockLaunched &&
        !waitForRockToStop &&
        elastic.bodyB === rock &&
        Body.getSpeed(rock) > 2
      ) {
        var mousePosition = mouseConstraint.mouse.position;
        if (Body.getSpeed(rock) > 4) {
          Body.setSpeed(rock, 4);
        }
        console.log(mousePosition);
        /*ここをコメントでドラッグによって弾が飛ばなくなる
        rockLaunched = true;
        elastic.bodyB = null;
        elastic.render.visible = false;*/
      }

      // ボールが発射され、速度が十分低くなり、地面に近い場合のみ停止処理を行う
      if (rockLaunched && Body.getSpeed(rock) < 0.2) {
        waitForRockToStop = true;

        // すべての動いているオブジェクトを停止させる
        setTimeout(function () {
          // ボールを完全に停止させる
          Body.setVelocity(rock, { x: 0, y: 0 });
          Body.setAngularVelocity(rock, 0);

          // すべてのrectangleブロックも停止させる
          var bodies = Composite.allBodies(world);
          for (var i = 0; i < bodies.length; i++) {
            var body = bodies[i];
            if (!body.isStatic) {
              Body.setVelocity(body, { x: 0, y: 0 });
              Body.setAngularVelocity(body, 0);
            }
          }

          // アンカーポイントを更新
          anchor.x = rock.position.x;
          anchor.y = rock.position.y;

          // エラスティックのアンカーポイントも更新して再接続
          elastic.pointA = anchor;
          elastic.bodyB = rock;
          elastic.render.visible = true;

          // 発射フラグをリセット
          rockLaunched = false;
          waitForRockToStop = false;
          //websocketService.notifyNoGoal();
        }, 300); // 少し待ってから停止処理
      }
    });

    // add mouse control
    var mouse = Mouse.create(render.canvas),
      mouseConstraint = MouseConstraint.create(engine, {
        mouse: mouse,
        constraint: {
          stiffness: 0.2,
          render: {
            visible: false,
          },
        },
      });

    Composite.add(world, mouseConstraint);

    // keep the mouse in sync with rendering
    render.mouse = mouse;

    // fit the render viewport to the scene
    Render.lookAt(render, {
      min: { x: 0, y: -175 },
      max: { x: 1000, y: 900 },
    });

    Events.on(mouseConstraint, "startdrag", function (event) {
      if (event.body === rock) {
        console.log("ok1");
        dragStartPosition = { x: rock.position.x, y: rock.position.y };
        // ドラッグ中は壁とのみ衝突（他のオブジェクトとは衝突しない）
        rock.collisionFilter.mask = 0x0001;
      }
    });

    // マウスのドラッグ終了時に衝突マスクを元に戻す
    Events.on(mouseConstraint, "enddrag", function (event) {
      if (event.body === rock) {
        // ドラッグ終了時には通常通りすべてと衝突
        rock.collisionFilter.mask = 1;
        const lanchVec = getLanchRockInfo(rock, anchor);
        Body.setPosition(rock, { x: anchor.x, y: anchor.y });

        websocketService.sendShot(lanchVec.normalizedDirection);
      }
    });

    window.addEventListener("ballVectorReceived", (event) => {
      const vectorData = event.detail;
      console.log(event);
      rockLaunched = true;
      elastic.bodyB = null;
      elastic.render.visible = false;
      launchRock(
        rock,
        Matter,
        {
          x: vectorData.x * 10,
          y: vectorData.y * 10,
        },
        false
      );
    });

    window.addEventListener("goalScored", () => {
      console.log("goal");
    });

    return {
      engine: engine,
      runner: runner,
      render: render,
      canvas: render.canvas,
      stop: function () {
        Matter.Render.stop(render);
        Matter.Runner.stop(runner);
      },
    };
  };

  window.Example = Example;
  Example.slingshot();
}

// DOMが読み込まれた後に実行
document.addEventListener("DOMContentLoaded", initSlingshot);
