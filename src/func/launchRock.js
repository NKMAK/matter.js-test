export function launchRock(rock, Matter, vector, useForce) {
  //vector{x:y:}
  console.log(vector);
  if (vector.x === 0 && vector.y === 0) {
    console.warn("発射ベクトルがゼロ");
    return;
  }
  if (rock.constraint) {
    Matter.Composite.remove(Matter.Engine.world, rock.constraint);
    rock.constraint = null;
  }

  if (useForce) {
    //物理的に力を加える
    console.log("ok");
    Matter.Body.applyForce(rock, rock.position, vector);
  } else {
    // 速度を直接設定する
    Matter.Body.setVelocity(rock, vector);
  }

  return rock;
}
