export function goalObj(Bodies) {
  return Bodies.polygon(900, 700, 3, 20, {
    isStatic: true,
    render: { fillStyle: "#060a19" },
    label: "goal",
  });
}
