export function eventCollision(Events, engine) {
  Events.on(engine, "collisionStart", function (event) {
    let pairs = event.pairs;
    for (let i = 0; i < pairs.length; i++) {
      const pair = pairs[i];
      const isGoal =
        (pair.bodyA.label === "goal" && pair.bodyB.label === "ball") ||
        (pair.bodyA.label === "ball" && pair.bodyB.label === "goal");
      if (isGoal) {
        console.log("ゴール");
      }
    }
  });
}
