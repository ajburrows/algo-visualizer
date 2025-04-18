/*
Object dimensions
 - Grid squares are 80x80px
 - Nodes are 60px in diameter
*/

import { useEffect, useState, useRef } from 'react'
import './App.css'

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
      // Set the mouse's position relative to the viewport and update the hasMoved state
      setMousePos({ x: e.clientX, y: e.clientY });
      setHasMoved(true);
    };
  
    // Whenever a node is selected, add the event listener
    if (selectedNodeID !== null) {
      window.addEventListener('mousemove', handleMouseMove);
    }
  
    // Whenever selectedNodeID changes or this component unmounts, remove the event listener
    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
    };
  }, [selectedNodeID]);
  


  // Create a new node and append it to the current nodes array (which is a state)
  const addNode = () => {
    const newID = nodes.length + 1 // this will break when nodes are deleted (assuming it's not the most recently created node)
    setNodes([...nodes, { ID: newID, x: 0, y: 0}])
  }


  // Find the location of a connector relative to the grid in pixels { x_val, y_val }
  const getConnectorCenter = (node, pos) => {
    const baseX = node.x * GRID_CELL_LENGTH + (GRID_CELL_LENGTH / 2) // vertical center of grid cell
    const baseY = node.y * GRID_CELL_LENGTH + (GRID_CELL_LENGTH / 2) // horizontal center of grid cell
    const offset = NODE_RADIUS // used to go from node center to cirumference to find locations of connectors
  
    switch (pos) {
      case 'top': return { x: baseX, y: baseY - offset }
      case 'right': return { x: baseX + offset, y: baseY }
      case 'bottom': return { x: baseX, y: baseY + offset }
      case 'left': return { x: baseX - offset, y: baseY }
      default: return { x: baseX, y: baseY }
    }
  }
  

  const handleConnectorClick = (node, pos) => {
    /*
    On first click:
      - Set start connector
      - Track mouse pos
    On second click:
      - Connect both connectors
      - Stop tracking mouse pos
      - Clear start connector
    */

    // Check if a connector has been selected yet
    if (startConnector === null) {
      const handleMouseMove = (e) => {
        // Get the location of svg we draw lines on (this covers the grid area)
        const svg = document.querySelector('.connection-layer')
        const rect = svg.getBoundingClientRect()
      
        // Calculate where the mouse is within the svg
        setMousePos({
          x: e.clientX - rect.left,
          y: e.clientY - rect.top
        })
      }
      
      // Add listener to track the mouse's position as it moves
      window.addEventListener('mousemove', handleMouseMove)
  
      // Define cleanup function
      startConnectorCleanup.current = () => {
        window.removeEventListener('mousemove', handleMouseMove)
        setMousePos(null)
      }
  
      setStartConnector({ nodeID: node.ID, pos })
    } else {
      // Add a new connection to the connections array
      setConnections((prev) => [
        ...prev,
        {
          from: { nodeID: startConnector.nodeID, pos: startConnector.pos },
          to: { nodeID: node.ID, pos },
        },
      ])
  
      // Check if the cleanup function exists
      if (startConnectorCleanup.current) {
        startConnectorCleanup.current()
      }
  
      setStartConnector(null)
    }
  }
  
  return (
    <div>
      <h1>Node Grid</h1>

      {/* Spawn a node in the top left corner of the grid */}
      <button onClick={addNode}>Add Node</button>

      {/* Render a floating node when the user moves a node */}
      {selectedNodeID !== null && mousePos && hasMoved && (() => {
        return (
          <div
            className="floating-node node"
            style={{
              position: 'fixed',
              left: mousePos.x - 30,
              top: mousePos.y - 30,
              width: 60,
              height: 60,
              backgroundColor: '#646cff',
              borderRadius: '50%',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: 'white',
              fontWeight: 'bold',
              pointerEvents: 'none',
              zIndex: 1000,
            }}
          >
            {/* TODO: change this to render nodes as components rather than text */}
            {selectedNodeID}

            {/* Render the connectors on the floating */}
            {['top', 'right', 'bottom', 'left'].map((pos) => (
              <div
                key={pos}
                className={`connector-wrapper ${pos}`}
              >
                <div className="connector" />
              </div>
            ))}
          </div>
        );
      })()}

      {/* The grid */}
      <div className='grid-wrapper'>

        {/* This is where the edges are drawn */}
        <svg className="connection-layer" ref={svgRef}>
          {connections.map((conn, index) => {
            const fromNode = nodes.find((n) => n.ID === conn.from.nodeID)
            const toNode = nodes.find((n) => n.ID === conn.to.nodeID)
            if (!fromNode || !toNode) return null

            const svgRect = svgRef.current?.getBoundingClientRect()
            if (!svgRect) return null
            
            const getLivePosition = (pos) => {
              return {
                x: (mousePos.x - svgRect.left),
                y: (mousePos.y - svgRect.top)
              }
            }
            
            // Determine whether the From node is moving or the To node
            const isMovingFrom = selectedNodeID === fromNode.ID
            const isMovingTo = selectedNodeID === toNode.ID
            
            // Track the From node as it moves
            const fromPos = isMovingFrom && mousePos
              ? getConnectorCenter({ x: (mousePos.x - svgRect.left - 40) / 80, y: (mousePos.y - svgRect.top - 40) / 80 }, conn.from.pos)
              : getConnectorCenter(fromNode, conn.from.pos)
            
            // Track the To node as it moves
            const toPos = isMovingTo && mousePos
              ? getConnectorCenter({ x: (mousePos.x - svgRect.left - 40) / 80, y: (mousePos.y - svgRect.top - 40) / 80 }, conn.to.pos)
              : getConnectorCenter(toNode, conn.to.pos)
            

            // Draw the line
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

          {/* Draw a temporary dashed line while making new connections */}
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

        {/* Draw the grid where nodes are placed */}
        <div className='grid'>
          {/* Loop through every cell in the grid */}
          {Array.from({ length: GRID_SIZE * GRID_SIZE}, (_, index) => {
            const x = index % GRID_SIZE
            const y = Math.floor(index / GRID_SIZE)
            const node = nodes.find((n) => n.x === x && n.y === y)
              return (
                <div
                  key={index}
                  className="grid-cell"
                  onClick={() => {
                    {/* Update a node's position when it is placed down */}
                    if (selectedNodeID !== null){
                      setNodes((prevNodes) =>
                        prevNodes.map((node) =>
                          node.ID === selectedNodeID ? { ...node, x, y } : node
                        )
                      )
                      setSelectedNodeID(null)
                      setMousePos(null)
                      setHasMoved(false)
                    }
                  }}
                >
                  {/* Place a dot at the center of every grid cell */}
                  <div className="grid-dot"></div>

                  {/* Check if there is a node in the current grid cell */}
                  {node && (
                    // Render/hide the actual node on the grid. Not the floating node 
                    <div
                      className={`node ${(selectedNodeID === node.ID && hasMoved) ? 'hidden' : ''}`}
                      onClick={(e) => {
                      e.stopPropagation()
                      if (selectedNodeID === null) {
                          setSelectedNodeID(node.ID)
                      }
                    }}>
                      {/* Render the number on the node */}
                      {node.ID}

                      {/* Render the connectors on the node */}
                      {['top', 'right', 'bottom', 'left'].map((pos) => (
                        <div
                          key={pos}
                          className={`connector-wrapper ${pos}`}
                          onClick={(e) => {
                            e.stopPropagation()
                            handleConnectorClick(node, pos)
                          }}
                        >
                          <div className='connector' />
                        </div>
                      ))}
                    </div>
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