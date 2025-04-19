/*
Object dimensions
 - Grid squares are 80x80px
 - Nodes are 60px in diameter
*/

import { useEffect, useState, useRef } from 'react'
import './App.css'
import Node from './components/Node.jsx'

const GRID_SIZE = 6
const GRID_CELL_LENGTH = 80
const NODE_RADIUS = 30

function App(){
    const [nodes, setNodes] = useState([{ ID: 1, x: 0, y: 0}])
    const [selectedNodeID, setSelectedNodeID] = useState(null)
    const [mousePos, setMousePos] = useState(null)
    const [connections, setConnections] = useState([])
    const [startConnector, setStartConnector] = useState(null)
    const [hasMoved, setHasMoved] = useState(false)

    const startConnectorCleanup = useRef(null)
    const svgRef = useRef(null)

    useEffect(() => {
        const handleMouseMove = (e) => {
            setMousePos({ x: e.clientX, y: e.clientY });
            setHasMoved(true);
        };
    
        if (selectedNodeID !== null) {
            window.addEventListener('mousemove', handleMouseMove);
        }
    
        return () => {
            window.removeEventListener('mousemove', handleMouseMove);
        };
    }, [selectedNodeID]);

    const addNode = () => {
        const newID = nodes.reduce((max,n) => Math.max(max, n.ID), 0) + 1
        setNodes([...nodes, { ID: newID, x: 0, y: 0}])
    }

    const getConnectorCenter = (node, pos) => {
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

    const handleConnectorClick = (node, pos) => {
        if (startConnector === null) {
            const handleMouseMove = (e) => {
                const svg = document.querySelector('.connection-layer')
                const rect = svg.getBoundingClientRect()
            
                setMousePos({
                    x: e.clientX - rect.left,
                    y: e.clientY - rect.top
                })
            }
        
            window.addEventListener('mousemove', handleMouseMove)

            startConnectorCleanup.current = () => {
                window.removeEventListener('mousemove', handleMouseMove)
                setMousePos(null)
            }

            setStartConnector({ nodeID: node.ID, pos })
        } else {
            setConnections((prev) => [
                ...prev,
                {
                    from: { nodeID: startConnector.nodeID, pos: startConnector.pos },
                    to: { nodeID: node.ID, pos },
                },
            ])

            if (startConnectorCleanup.current) {
                startConnectorCleanup.current()
            }

            setStartConnector(null)
        }
    }

    return (
        <div>
            <h1>Node Grid</h1>
            <button onClick={addNode}>Add Node</button>

            {selectedNodeID !== null && mousePos && hasMoved && (() => {
                return (
                    <div
                        style={{
                            position: 'fixed',
                            left: mousePos.x - NODE_RADIUS,
                            top: mousePos.y - NODE_RADIUS,
                            pointerEvents: 'none',
                            zIndex: 1000,
                        }}
                    >
                        <Node
                            ID={selectedNodeID}
                            isSelected={true}
                            isHidden={false}
                            onClick={() => {}}
                            onConnectorClick={() => {}}
                        />
                    </div>
                );
            })()}

            <div className='grid-wrapper'>
                <svg className="connection-layer" ref={svgRef}>
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
                </svg>

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
                                            if (selectedNodeID === null) {
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
            </div>
        </div>
    )
}

export default App
