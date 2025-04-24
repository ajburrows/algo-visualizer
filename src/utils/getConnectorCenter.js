import { GRID_CELL_LENGTH, NODE_RADIUS } from "../constants"

export default function getConnectorCenter(node, pos) {
  const baseX = node.x * GRID_CELL_LENGTH + (GRID_CELL_LENGTH / 2)
  const baseY = node.y * GRID_CELL_LENGTH + (GRID_CELL_LENGTH / 2)
  const offset = NODE_RADIUS

  switch (pos) {
    case 'top': return { x: baseX, y: baseY - offset }
    case 'right': return { x: baseX + offset, y: baseY }
    case 'bottom': return { x: baseX, y: baseY + offset }
    case 'left': return { x: baseX - offset, y: baseY }
    default: return { x: baseX, y: baseY }
  }
}