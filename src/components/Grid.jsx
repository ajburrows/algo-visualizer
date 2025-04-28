import React from 'react'
import Node from './Node'
import { GRID_SIZE } from '../constants'
import clsx from 'clsx'

export default function Grid({
    nodes,
    setNodes,
    selectedNodeID,
    setSelectedNodeID,
    setMousePos,
    setIsMoving,
    handleConnectorClick,
    isMoving,
    mousePos,
    editingConnector,
    startNodeID,
    setStartNodeID,
    endNodeID,
    setEndNodeID,
    targetType,
    algorithm,
    visitedNodes
}) {
    const moveNode = (id, x, y) =>
        setNodes((nodes) =>
            nodes.map((node) =>
                node.ID === id ? { ...node, x, y } : node
            )
        )

    return (
        <div className='grid'>
            {Array.from({ length: GRID_SIZE * GRID_SIZE}, (_, index) => {
                const cell_x = index % GRID_SIZE
                const cell_y = Math.floor(index / GRID_SIZE)
                const node = nodes.find((node) => node.x === cell_x && node.y === cell_y)
                return (
                    <div
                        key={index}
                        className="grid-cell"
                        onClick={() => {
                            if (selectedNodeID !== null){
                                const selectedNode = nodes.find(n => n.ID === selectedNodeID)

                                if (selectedNode.x !== cell_x || selectedNode.y !== cell_y){
                                    moveNode(selectedNodeID, cell_x, cell_y)
                                }

                                setSelectedNodeID(null)
                                setMousePos(null)
                                setIsMoving(null)
                            }
                        }}
                    >
                        <div className="grid-dot"></div>

                        {node && (
                            <Node
                                ID={node.ID}
                                isSelected={selectedNodeID === node.ID}
                                isHidden={selectedNodeID === node.ID && isMoving}
                                onClick={(e) => {
                                    // Pick up node
                                    if (selectedNodeID === null && mousePos === null && targetType === null) {
                                        e.stopPropagation()
                                        setSelectedNodeID(node.ID)
                                    }
                                    // Set start node
                                    else if (targetType === 'start' && node.ID !== startNodeID ) {
                                        setStartNodeID(node.ID)
                                    }
                                    // Remove start node
                                    else if (targetType === 'start' && node.ID === startNodeID) {
                                        setStartNodeID(null)
                                    }
                                    // Set end node
                                    else if (targetType === 'end' && node.ID !== endNodeID) {
                                        setEndNodeID(node.ID)
                                    }
                                    // Remove end node
                                    else if (targetType === 'end' && node.ID === endNodeID) {
                                        setEndNodeID(null)
                                    }
                                }}
                                onConnectorClick={(pos) => handleConnectorClick(node, pos)}
                                editingConnector={editingConnector}
                                isStartNode={node.ID === startNodeID}
                                isEndNode={node.ID === endNodeID}
                                visited={visitedNodes && visitedNodes.includes(node.ID)}
                            />
                        )}
                    </div>
                )
            })}
        </div>
    )
}