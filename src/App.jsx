/*
Object dimensions
 - Grid squares are 80x80px
 - Nodes are 60px in diameter
*/

import { useEffect, useState, useRef } from 'react'
import './App.css'
import Connections from './components/Connections.jsx'
import Grid from './components/Grid.jsx'
import FloatingNode from './components/FloatingNode.jsx'
import { useDragTracker } from './hooks/useDragTracker.js'

function App(){
    const [nodes, setNodes] = useState([{ ID: 1, x: 0, y: 0}])
    const [selectedNodeID, setSelectedNodeID] = useState(null)
    const [mousePos, setMousePos] = useState(null)
    const [connections, setConnections] = useState([])
    const [startConnector, setStartConnector] = useState(null)
    const [isMoving, setIsMoving] = useState(false)
    const [selectedConnection, setSelectedConnection] = useState(null)

    const startConnectorCleanup = useRef(null)
    const svgRef = useRef(null)

    useDragTracker(selectedNodeID, setMousePos, setIsMoving)

    const addNode = () => {
        const newID = nodes.reduce((max,n) => Math.max(max, n.ID), 0) + 1
        setNodes([...nodes, { ID: newID, x: 0, y: 0}])
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

            {/* Render a fictitious floating node after picking a node up */}
            {selectedNodeID !== null && mousePos && isMoving && (() => {
                return (
                    <FloatingNode
                        mousePos={mousePos}
                        selectedNodeID={selectedNodeID}
                    />
                );
            })()}

            <div className='grid-wrapper'>
                {/* Draw connetion lines and temp line here */}
                <svg className="connection-layer" ref={svgRef}>
                    <Connections
                        nodes={nodes}
                        connections={connections}
                        selectedNodeID={selectedNodeID}
                        mousePos={mousePos}
                        startConnector={startConnector}
                        svgRef={svgRef}
                        selectedConnection={selectedConnection}
                        setSelectedConnection={setSelectedConnection}
                    />
                </svg>

                {/* Store all grid cells and nodes here */}
                <Grid
                    nodes={nodes}
                    setNodes={setNodes}
                    selectedNodeID={selectedNodeID}
                    setSelectedNodeID={setSelectedNodeID}
                    setMousePos={setMousePos}
                    setIsMoving={setIsMoving}
                    handleConnectorClick={handleConnectorClick}
                    isMoving={isMoving}
                    mousePos={mousePos}
                />
            </div>
        </div>
    )
}

export default App
