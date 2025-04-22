import React from 'react'
import Node from './Node'



export default function Grid({
    GRID_SIZE,
    nodes,
    setNodes,
    selectedNodeID,
    setSelectedNodeID,
    setMousePos,
    setHasMoved,
    handleConnectorClick,
    hasMoved,
    mousePos
}) {
    return (
        <div className='grid'>
            {Array.from({ length: GRID_SIZE * GRID_SIZE}, (_, index) => {
                const x = index % GRID_SIZE
                const y = Math.floor(index / GRID_SIZE)
                const node = nodes.find((n) => n.x === x && n.y === y)
                return (
                    <div
                        key={index}
                        className="grid-cell"
                        onClick={() => {
                            if (selectedNodeID !== null){
                                const selectedNode = nodes.find(n => n.ID === selectedNodeID)

                                if (selectedNode.x !== x || selectedNode.y !== y){
                                    setNodes((prevNodes) =>
                                        prevNodes.map((node) =>
                                            node.ID === selectedNodeID ? { ...node, x, y } : node
                                        )
                                    )
                                }

                                setSelectedNodeID(null)
                                setMousePos(null)
                                setHasMoved(null)
                            }
                        }}
                    >
                        <div className="grid-dot"></div>

                        {node && (
                            <Node
                                ID={node.ID}
                                isSelected={selectedNodeID === node.ID}
                                isHidden={selectedNodeID === node.ID && hasMoved}
                                onClick={(e) => {
                                    if (selectedNodeID === null && mousePos === null) {
                                        e.stopPropagation()
                                        setSelectedNodeID(node.ID)
                                    }
                                }}
                                onConnectorClick={(pos) => handleConnectorClick(node, pos)}
                            />
                        )}
                    </div>
                )
            })}
        </div>
    )
}