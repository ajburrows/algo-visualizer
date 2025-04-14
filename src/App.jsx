import { useEffect, useState } from 'react'
import './App.css'

const GRID_SIZE = 6

function App(){
  const [nodes, setNodes] = useState([{ ID: 1, x: 0, y: 0}])
  const [selectedNodeID, setSelectedNodeID] = useState(null)
  const [mousePos, setMousePos] = useState(null)
  const [connections, setConnections] = useState([])
  const [startConnector, setStartConnector] = useState(null)
  

  const handleDrop = (x, y) => {
    setNodes((prevNodes) =>
      prevNodes.map((node) =>
        node.ID === draggedNodeID ? { ...node, x, y } : node
      )
    )
    setDraggedNodeID(null)
  }

  const addNode = () => {
    const newID = nodes.length + 1
    setNodes([...nodes, { ID: newID, x: 0, y: 0}])
  }


  const getConnectorCenter = (node, pos) => {
    const baseX = node.x * 80 + 40 // center of grid cell
    const baseY = node.y * 80 + 40
    const offset = 30
  
    switch (pos) {
      case 'top': return { x: baseX, y: baseY - offset }
      case 'right': return { x: baseX + offset, y: baseY }
      case 'bottom': return { x: baseX, y: baseY + offset }
      case 'left': return { x: baseX - offset, y: baseY }
      default: return { x: baseX, y: baseY }
    }
  }
  
  
  const handleConnectorClick = (node, pos) => {
    if (!startConnector) {
      setStartConnector({ nodeID: node.ID, pos })
    } else {
      setConnections((prev) => [
        ...prev,
        {
          from: { nodeID: startConnector.nodeID, pos: startConnector.pos },
          to: { nodeID: node.ID, pos },
        },
      ])
      setStartConnector(null)
    }
  }
  

  useEffect(() => {
    const handleMouseMove = (e) => {
      setMousePos({ x: e.clientX, y: e.clientY })
    }

    if (selectedNodeID !== null) {
      window.addEventListener('mousemove', handleMouseMove)
    }

    return () => {
      window.removeEventListener('mousemove', handleMouseMove)
    }
  }, [selectedNodeID])



  return (
    <div>
      <h1>Node Grid</h1>
      <button onClick={addNode}>Add Node</button>
      {selectedNodeID !== null && mousePos && (
        <div
          className='floating-node'
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
          {selectedNodeID}
        </div>
      )}

      <div className='grid-wrapper'>
        <svg className="connection-layer">
          {connections.map((conn, index) => {
            const fromNode = nodes.find((n) => n.ID === conn.from.nodeID)
            const toNode = nodes.find((n) => n.ID === conn.to.nodeID)
            if (!fromNode || !toNode) return null

            const fromPos = getConnectorCenter(fromNode, conn.from.pos)
            const toPos = getConnectorCenter(toNode, conn.to.pos)

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
                      setNodes((prevNodes) =>
                        prevNodes.map((node) =>
                          node.ID === selectedNodeID ? { ...node, x, y } : node
                        )
                      )
                      setSelectedNodeID(null)
                      setMousePos(null)
                    }
                  }}
                >
                  <div className="grid-dot"></div>
                  {node && (
                    <div
                      className={`node ${selectedNodeID === node.ID ? 'hidden' : ''}`}
                      onClick={(e) => {
                        e.stopPropagation()
                        setSelectedNodeID(node.ID)
                      }}
                      
                    >
                      {node.ID}
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