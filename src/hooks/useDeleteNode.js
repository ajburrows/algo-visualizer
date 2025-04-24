import { useEffect } from "react";

export default function useDeleteConnection(
    selectedNodeID,
    setSelectedNodeID,
    setNodes,
    setConnections
){
    useEffect(() => {
        const handleKeyDown = (e) => {
            if ((e.key === 'Delete' || e.key === 'Backspace') && selectedNodeID !== null){
                // delete the node
                setNodes((prevNodes) =>
                    prevNodes.filter((node) => node.ID !== selectedNodeID)
                )

                // delete all connections on the node
                setConnections((prevConnections) =>
                    prevConnections.filter((conn) =>
                        conn.from.nodeID !== selectedNodeID && conn.to.nodeID !== selectedNodeID
                    )
                )

                setSelectedNodeID(null)
            }
        }

        window.addEventListener('keydown', handleKeyDown)
        return () => {
            window.removeEventListener('keydown', handleKeyDown)
        }
    }, [selectedNodeID])
}