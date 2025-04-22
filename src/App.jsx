/*
Object dimensions
 - Grid squares are 80x80px
 - Nodes are 60px in diameter
*/

import { useEffect, useState, useRef } from 'react'
import './App.css'
import Node from './components/Node.jsx'
import Connections from './components/Connections.jsx'
import Grid from './components/Grid.jsx'
import FloatingNode from './components/FloatingNode.jsx'

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
                    <FloatingNode
                        NODE_RADIUS="30"
                        mousePos={mousePos}
                        selectedNodeID={selectedNodeID}
                    />
                );
            })()}

            <div className='grid-wrapper'>
                <svg className="connection-layer" ref={svgRef}>
                    <Connections
                        nodes={nodes}
                        connections={connections}
                        selectedNodeID={selectedNodeID}
                        mousePos={mousePos}
                        startConnector={startConnector}
                        svgRef={svgRef}
                    />
                </svg>

                <Grid
                    GRID_SIZE={6}
                    nodes={nodes}
                    setNodes={setNodes}
                    selectedNodeID={selectedNodeID}
                    setSelectedNodeID={setSelectedNodeID}
                    setMousePos={setMousePos}
                    setHasMoved={setHasMoved}
                    handleConnectorClick={handleConnectorClick}
                    hasMoved={hasMoved}
                    mousePos={mousePos}
                />
            </div>
        </div>
    )
}

export default App
