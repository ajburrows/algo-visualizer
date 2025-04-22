import React from 'react'

const GRID_CELL_LENGTH = 80
const NODE_RADIUS = 30

function getConnectorCenter(node, pos) {
    const baseX = node.x * GRID_CELL_LENGTH + (GRID_CELL_LENGTH / 2)
    const baseY = node.y * GRID_CELL_LENGTH + (GRID_CELL_LENGTH / 2)
    const offset = NODE_RADIUS

    switch (pos) {
        case 'top': return { x: baseX, y: baseY - offset }
        case 'right': return { x: baseX + offset, y: baseY }
        case 'bottom': return { x: baseX, y: baseY + offset }
        case 'left': return  { x: baseX - offset, y: baseY }
        default: return { x: baseX, y: baseY }
    }
}

export default function Connections({
    nodes,
    connections,
    selectedNodeID,
    mousePos,
    startConnector,
    svgRef
}) {
    return (
        <>
            {connections.map((conn, index) => {
                const fromNode = nodes.find((n) => n.ID === conn.from.nodeID)
                const toNode = nodes.find((n) => n.ID === conn.to.nodeID)
                if (!fromNode || !toNode) return null

                const svgRect = svgRef.current?.getBoundingClientRect()
                if (!svgRect) return null

                const isMovingFrom = selectedNodeID === fromNode.ID
                const isMovingTo = selectedNodeID === toNode.ID

                const fromPos = isMovingFrom && mousePos
                    ? getConnectorCenter({ x: (mousePos.x - svgRect.left - (GRID_CELL_LENGTH / 2)) / GRID_CELL_LENGTH, y: (mousePos.y - svgRect.top - (GRID_CELL_LENGTH / 2)) / GRID_CELL_LENGTH }, conn.from.pos)
                    : getConnectorCenter(fromNode, conn.from.pos)

                const toPos = isMovingTo && mousePos
                    ? getConnectorCenter({ x: (mousePos.x - svgRect.left - (GRID_CELL_LENGTH / 2)) / GRID_CELL_LENGTH, y: (mousePos.y - svgRect.top - (GRID_CELL_LENGTH / 2)) / GRID_CELL_LENGTH }, conn.to.pos)
                    : getConnectorCenter(toNode, conn.to.pos)

                return (
                    <line
                        key={index}
                        x1={fromPos.x}
                        y1={fromPos.y}
                        x2={toPos.x}
                        y2={toPos.y}
                        stroke="black"
                        strokeWidth="2"
                    />
                )
            })}

            {startConnector && mousePos && (() => {
                const fromNode = nodes.find(n => n.ID === startConnector.nodeID)
                if (!fromNode) return null
                const fromPos = getConnectorCenter(fromNode, startConnector.pos)

                return (
                    <line
                        x1={fromPos.x}
                        y1={fromPos.y}
                        x2={mousePos.x}
                        y2={mousePos.y}
                        stroke="gray"
                        strokeWidth="1"
                        strokeDasharray="4"
                    />
                )
            })()}
        </>
    )
}