export default function handleConnectorClickFactory ({
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
}) {

    // Track cursor's position drawing or editing connections
    const handleMouseMove = (e) => {
        const svg = document.querySelector('.connection-layer')
        const rect = svg.getBoundingClientRect()
        
        setMousePos({
            x: e.clientX - rect.left,
            y: e.clientY - rect.top,
        })
    }

    return function handleConnectorClick(node, pos) {
        // Pick up one end of an existing connection
        if (selectedConnection !== null && editingConnector === null){
            window.addEventListener('mousemove', handleMouseMove)
            
            // Track the mouse
            editingConnectorCleanup.current = () => {
                window.removeEventListener('mousemove', handleMouseMove)
                setMousePos(null)
            }
    
            const connection = connections[selectedConnection]
            const isFrom = connection.from.nodeID === node.ID
            const endClicked = isFrom ? 'fromNode' : 'toNode'
            setEditingConnector({
                index: selectedConnection,
                endClicked:  endClicked,
                nodeID: node.ID,
                pos: pos
            })
    
            // Remove the connection being edited
        }
        // Place down the selected end of an exsiting connection
        else if (selectedConnection !== null && editingConnector !== null) {
            setConnections((prev) =>
            prev.map((conn, index) => {
                if (index !== editingConnector.index) return conn
                if (editingConnector.endClicked === 'toNode'){
                    return {
                        ...conn,
                        to: { nodeID: node.ID, pos}
                    }
                } else {
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
        // Begin drawing a new connection  
        else if (startConnector === null) {        
            window.addEventListener('mousemove', handleMouseMove)
    
            startConnectorCleanup.current = () => {
                window.removeEventListener('mousemove', handleMouseMove)
                setMousePos(null)
            }
    
            setStartConnector({ nodeID: node.ID, pos })
        } 
        // Complete drawing a new connection
        else {
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
}