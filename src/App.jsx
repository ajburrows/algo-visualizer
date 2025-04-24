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

    const handleMouseMove = (e) => {
        const svg = document.querySelector('.connection-layer')
        const rect = svg.getBoundingClientRect()
      
        setMousePos({
            x: e.clientX - rect.left,
            y: e.clientY - rect.top,
        })
    }

    const handleConnectorClick = (node, pos) => {
        if (selectedConnection !== null && editingConnector === null){
            // Edit connection
            window.addEventListener('mousemove', handleMouseMove)
            
            // Track the mouse
            editingConnectorCleanup.current = () => {
                window.removeEventListener('mousemove', handleMouseMove)
                setMousePos(null)
            }

            const connection = connections[selectedConnection]
            const isFrom = connection.from.nodeID === node.ID
            const endClicked = isFrom ? 'fromNode' : 'toNode'
            console.log(`conn.nodeID: ${connection.from.nodeID}, node.nodeID: ${node.nodeID}`)
            setEditingConnector({
                index: selectedConnection,
                endClicked:  endClicked,
                nodeID: node.ID,
                pos: pos
            })

            // Remove the connection being edited
        }
        else if (selectedConnection !== null && editingConnector !== null) {
            setConnections((prev) =>
              prev.map((conn, index) => {
                if (index !== editingConnector.index) return conn
                console.log(`endClicked: ${editingConnector.endClicked}`)
                if (editingConnector.endClicked === 'toNode'){
                    console.log('toNode clicked')
                    return {
                        ...conn,
                        to: { nodeID: node.ID, pos}
                    }
                } else {
                    console.log('fromNode clicked')
                    return {
                        ...conn,
                        from: {nodeID: node.ID, pos}
                      }
                }
              })
            )
          
            // Stop tracking mouse
            if (editingConnectorCleanup.current) {
              editingConnectorCleanup.current()
            }
          
            setEditingConnector(null)
            setSelectedConnection(null)
            return
        }          
        else if (startConnector === null) {        
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
