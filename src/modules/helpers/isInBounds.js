export default function isCoordInBounds(x, y) {
  return (
    (x < 10) && (x >= 0) &&
    (y < 10) && (y >= 0)
  )
}