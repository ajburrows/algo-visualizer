import React from 'react'
import clsx from 'clsx'
import getConnectorCenter from '../utils/getConnectorCenter'
import { GRID_CELL_LENGTH, NODE_RADIUS } from '../constants'

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
    svgRef,
    selectedConnection,
    setSelectedConnection,
    editingConnector
}) {
    const svgRect = svgRef.current?.getBoundingClientRect()
    if (!svgRect) return null

    const findNode = (id) => nodes.find(n => n.ID === id)

    return (
        <>
            {/* Draw a solid line for all existing connections */}
            {connections.map((conn, index) => {
                if (index === selectedConnection && editingConnector !== null){
                    return null
                }

                const fromNode = findNode(conn.from.nodeID)
                const toNode = findNode(conn.to.nodeID)
                if (!fromNode || !toNode) return null

                {/* Determine if the From node or the To node was picked up */}
                const isMovingFrom = selectedNodeID === fromNode.ID
                const isMovingTo = selectedNodeID === toNode.ID

                const fromPos = isMovingFrom && mousePos
                    ? getConnectorCenter(getMousePosInSVG(mousePos, svgRect), conn.from.pos)
                    : getConnectorCenter(fromNode, conn.from.pos)

                const toPos = isMovingTo && mousePos
                    ? getConnectorCenter(getMousePosInSVG(mousePos, svgRect), conn.to.pos)
                    : getConnectorCenter(toNode, conn.to.pos)

                const isSelected = selectedConnection === index

                return (
                    <g key={index}>
                        <line 
                            className='connection-hitbox'
                            x1={fromPos.x}
                            y1={fromPos.y}
                            x2={toPos.x}
                            y2={toPos.y}
                            onClick={(e) => {
                                setSelectedConnection( isSelected ? null : index )
                            }}
                            stroke='transparent'
                            strokeWidth='12'
                            pointerEvents='stroke'
                            cursor='pointer'
                        />
                        <line
                            className={clsx('connection', {
                                            selected: isSelected
                                        })}
                            pointerEvents="none"
                            x1={fromPos.x}
                            y1={fromPos.y}
                            x2={toPos.x}
                            y2={toPos.y}
                            stroke={ isSelected ? 'blue' : 'black'}
                            strokeWidth={ isSelected ? '3' : '2' }
                        />
                    </g>
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

            {/* Edit Connections */}
            {editingConnector && mousePos && (() => {
                const conn = connections[editingConnector.index]
                const stationaryConnector = editingConnector.endClicked === 'fromNode' ? conn.to : conn.from
                const stationaryNode = nodes.find(n => n.ID === stationaryConnector.nodeID)
                const stationaryConnCoord = getConnectorCenter(stationaryNode, stationaryConnector.pos)

                return (
                    <line
                        x1={stationaryConnCoord.x}
                        y1={stationaryConnCoord.y}
                        x2={mousePos.x}
                        y2={mousePos.y}
                        stroke="black"
                        strokeWidth="2"
                    />
                )
            })()}

        </>
    )
}