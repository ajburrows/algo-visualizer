import { useState } from 'react'
import './App.css'

const GRID_SIZE = 6

function App(){
  const [nodes, setNodes] = useState([{ ID: 1, x: 0, y: 0}])
  const [draggedNodeID, setDraggedNodeID] = useState(null)


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



  return (
    <div>
      <h1>Node Grid</h1>
      <button onClick={addNode}>Add Node</button>
      <div className='grid'>
        {Array.from({ length: GRID_SIZE * GRID_SIZE}, (_, index) => {
          const x = index % GRID_SIZE
          const y = Math.floor(index / GRID_SIZE)
          const node = nodes.find((n) => n.x === x && n.y === y)
            return (
              <div
                key={index}
                className="grid-cell"
                onDragOver={(e) => e.preventDefault()}
                onDrop={() => handleDrop(x, y)}
              >
                <div className="grid-dot"></div>
                {node && (
                  <div
                    className="node"
                    draggable
                    onDragStart={() => setDraggedNodeID(node.ID)}
                  >
                    {node.ID}
                  </div>
                )}
              </div>
            )
        })}
      </div>
    </div>
  )
}

export default App