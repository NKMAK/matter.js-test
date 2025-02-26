export function getLanchRockInfo(rock, anchor) {
  if (!rock || !anchor) {
    return null;
  }

  const direction = {
    x: anchor.x - rock.position.x,
    y: anchor.y - rock.position.y,
  };

  const length = Math.sqrt(direction.x ** 2 + direction.y ** 2);
  //TODO パラメータ調整
  const strength = length * 0.1;

  const normalizedDirection =
    length === 0
      ? { x: 0, y: 0 }
      : { x: direction.x / length, y: direction.y / length };

  return { normalizedDirection, strength };
}
