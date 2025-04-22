import React from 'react'

const GRID_CELL_LENGTH = 80
const NODE_RADIUS = 30

// Get coord of a connector on a node relative to the SVG
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

// Calculate mouse positiion relative to the SVG
function getMousePosInSVG(mousePos, svgRect){
    const xCoordInSVG = (mousePos.x - svgRect.left - (GRID_CELL_LENGTH / 2)) / GRID_CELL_LENGTH
    const yCoordInSVG = (mousePos.y - svgRect.top - (GRID_CELL_LENGTH / 2)) / GRID_CELL_LENGTH
    return { x: xCoordInSVG, y: yCoordInSVG }
}

export default function Connections({
    nodes,
    connections,
    selectedNodeID,
    mousePos,
    startConnector,
    svgRef
}) {
    const svgRect = svgRef.current?.getBoundingClientRect()
    if (!svgRect) return null

    const findNode = (id) => nodes.find(n => n.ID === id)

    return (
        <>
            {/* Draw a solid line for all existing connections */}
            {connections.map((conn, index) => {
                const fromNode = findNode(conn.from.nodeID)
                const toNode = findNode(conn.to.nodeID)
                if (!fromNode || !toNode) return null

                {/* Determine if the from node or to node was picked up */}
                const isMovingFrom = selectedNodeID === fromNode.ID
                const isMovingTo = selectedNodeID === toNode.ID

                const fromPos = isMovingFrom && mousePos
                    ? getConnectorCenter(getMousePosInSVG(mousePos, svgRect), conn.from.pos)
                    : getConnectorCenter(fromNode, conn.from.pos)

                const toPos = isMovingTo && mousePos
                    ? getConnectorCenter(getMousePosInSVG(mousePos, svgRect), conn.to.pos)
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

            {/* Draw a dashed line when creating a new connection */}
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