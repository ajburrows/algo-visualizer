/*
Object dimensions
 - Grid squares are 80x80px
 - Nodes are 60px in diameter
*/

import { useState, useRef, useEffect } from 'react'
import './App.css'
import Connections from './components/Connections.jsx'
import Grid from './components/Grid.jsx'
import FloatingNode from './components/FloatingNode.jsx'
import useDragTracker from './hooks/useDragTracker.js'
import useDeleteConnection from './hooks/useDeleteConnection.js'
import handleConnectorClickFactory from './utils/handleConnectorClickFactory.js'
import useDeleteNode from './hooks/useDeleteNode.js'
import runAlgorithm from './utils/runAlgorithm.js'
import clsx from 'clsx'

function App(){
    const [nodes, setNodes] = useState([{ ID: 1, x: 0, y: 0}]) // all nodes on the grid
    const [selectedNodeID, setSelectedNodeID] = useState(null) // integer
    const [mousePos, setMousePos] = useState(null) // { x, y }
    const [connections, setConnections] = useState([]) // [{ from: {nodeID, pos}, to: {nodeID, pos} }, ...]
    const [startConnector, setStartConnector] = useState(null) // First connector clicked in a connection
    const [isMoving, setIsMoving] = useState(false) // True | False if a node is being moved
    const [selectedConnection, setSelectedConnection] = useState(null) // index of connections state
    const [editingConnector, setEditingConnector] = useState(null) // { index, end ('toNode' or 'fromNode'), nodeID, pos }
    const [startNodeID, setStartNodeID] = useState(null)
    const [endNodeID, setEndNodeID] = useState(null)
    const [targetType, setTargetType] = useState(null) // null | 'start' | 'end'
    const [algorithm, setAlgorithm] = useState('DFS')
    const [nodeTraversal, setNodeTraversal] = useState(null)
    const [edgeTraversal, setEdgeTraversal] = useState(null)
    const [algoPlaying, setAlgoPlaying] = useState(false)
    const [currentSetp, setCurrentStep] = useState(0)
    const [stepDelay, setStepDelay] = useState(250)
    const [visitedNodes, setVisitedNodes] = useState([])
    const [curNode, setCurNode] = useState(null)

    const startConnectorCleanup = useRef(null)
    const editingConnectorCleanup = useRef(null)
    const svgRef = useRef(null) // rectangle over the grid where connections are drawn

    useDragTracker(selectedNodeID, setMousePos, setIsMoving)
    useDeleteConnection(selectedConnection, setSelectedConnection, setConnections)
    useDeleteNode(selectedNodeID, setSelectedNodeID, setNodes, setConnections)

    const addNode = () => {
        const newID = nodes.reduce((max,n) => Math.max(max, n.ID), 0) + 1
        setNodes([...nodes, { ID: newID, x: 0, y: 0}])
    }

    async function animateTraversal(nodeTraversal, edgeTraversal) {
        for (let i = 0; i < nodeTraversal.length; i++){
            const curEdge = edgeTraversal[i]
            setCurNode(curEdge[0])
            await new Promise((resolve) => setTimeout(resolve, stepDelay))
            setVisitedNodes((prev) => [...prev, curEdge[1]])
            setCurNode(curEdge[1])
            await new Promise((resolve) => setTimeout(resolve, stepDelay))
        }
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
            {startNodeID && (
                <button 
                    onClick={() => {

                        const [nodeTraversal, edgeTraversal] = runAlgorithm({
                                            algorithm,
                                            nodes,
                                            connections,
                                            startID: startNodeID,
                                            endID: endNodeID,
                                        })
                        setNodeTraversal(nodeTraversal)
                        setEdgeTraversal(edgeTraversal)
                        setCurrentStep(0)
                        setAlgoPlaying(true)
                        
                        console.log('DFS')
                        console.log(nodeTraversal)
                        console.log(edgeTraversal)

                        animateTraversal(nodeTraversal, edgeTraversal)
                    }}
                >
                    Run {algorithm}
                </button>

            )}

            <div className='target-type-toggle'>
                <button
                    className={clsx({'active': targetType==='start'})} 
                    onClick={() => {
                        if (targetType !== 'start' ){
                            setTargetType('start')
                        } else {
                            setTargetType(null)
                        }
                    }}
                >
                    Set Start Node
                </button>
                <button 
                    className={clsx({'active': targetType==='end'})}
                    onClick={() => {
                        if (targetType !== 'end'){
                            setTargetType('end')
                        } else {
                            setTargetType(null)
                        }
                    }}
                >
                    Set End Node
                </button>
            </div>


            {/* Render a fictitious floating node after picking a node up */}
            {selectedNodeID !== null && mousePos && isMoving && (() => {
                return (
                    <FloatingNode
                        mousePos={mousePos}
                        selectedNodeID={selectedNodeID}
                        startNodeID={startNodeID}
                        endNodeID={endNodeID}
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
                    startNodeID={startNodeID}
                    setStartNodeID={setStartNodeID}
                    endNodeID={endNodeID}
                    setEndNodeID={setEndNodeID}
                    targetType={targetType}
                    algorithm={algorithm}
                    visitedNodes={visitedNodes}
                    curNode={curNode}
                />
            </div>
        </div>
    )
}

export default App
