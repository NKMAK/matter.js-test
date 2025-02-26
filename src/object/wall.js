var wallOptions = {
  isStatic: true,
  render: { fillStyle: "#060a19" },
  restitution: 0.6, // 跳ね返り係数を設定
  chamfer: { radius: 0 }, // 角を鋭角に
  slop: 0, // 衝突時の許容誤差を小さく
};

export function createWallStatge1(Bodies, Composite, engine) {
  const walls = [
    Bodies.rectangle(510, 800, 1020, 20, wallOptions),
    Bodies.rectangle(0, 400, 20, 810, wallOptions),
    Bodies.rectangle(1025, 400, 20, 800, wallOptions),
    Bodies.rectangle(510, 0, 1020, 20, wallOptions),
    Bodies.rectangle(610, 250, 200, 20, {
      isStatic: true,
      render: { fillStyle: "#060a19" },
    }),
  ];
  Composite.add(engine.world, [...walls]);
}
