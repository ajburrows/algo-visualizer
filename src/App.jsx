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
import useDragTracker from './hooks/useDragTracker.js'
import useDeleteConnection from './hooks/useDeleteConnection.js'
import getConnectorCenter from './utils/getConnectorCenter.js'
import handleConnectorClickFactory from './utils/handleConnectorClickFactory.js'

function App(){
    const [nodes, setNodes] = useState([{ ID: 1, x: 0, y: 0}]) // all nodes on the grid
    const [selectedNodeID, setSelectedNodeID] = useState(null) // integer
    const [mousePos, setMousePos] = useState(null) // { x, y }
    const [connections, setConnections] = useState([]) // [{ from: {nodeID, pos}, to: {nodeID, pos} }, ...]
    const [startConnector, setStartConnector] = useState(null) // First connector clicked in a connection
    const [isMoving, setIsMoving] = useState(false) // True | False if a node is being moved
    const [selectedConnection, setSelectedConnection] = useState(null) // index of connections state
    const [editingConnector, setEditingConnector] = useState(null) // { index, end ('toNode' or 'fromNode'), nodeID, pos }

    const startConnectorCleanup = useRef(null)
    const editingConnectorCleanup = useRef(null)
    const svgRef = useRef(null) // rectangle over the grid where connections are drawn

    useDragTracker(selectedNodeID, setMousePos, setIsMoving)
    useDeleteConnection(selectedConnection, setSelectedConnection, setConnections)

    const addNode = () => {
        const newID = nodes.reduce((max,n) => Math.max(max, n.ID), 0) + 1
        setNodes([...nodes, { ID: newID, x: 0, y: 0}])
    }

    const handleConnectorClick = handleConnectorClickFactory({
        connections,
        setConnections,
        startConnector,
        setStartConnector,
        startConnectorCleanup,
        setEditingConnector,
        editingConnectorCleanup,
        selectedConnection,
        editingConnector,
        setSelectedConnection,
        setMousePos
    })

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
                        editingConnector={editingConnector}
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
                    editingConnector={editingConnector}
                />
            </div>
        </div>
    )
}

export default App
