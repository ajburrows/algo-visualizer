import { useEffect } from 'react'

// Delete a connection while it is selected by pressing "Delete" or "Backspace"
export default function useDeleteConnection(
    selectedConnection,
    setSelectedConnection,
    setConnections
) {
    useEffect(() => {
        const handleKeyDown = (e) => {
            if ((e.key === 'Delete' || e.key === 'Backspace') && selectedConnection !== null) {
                setConnections(prev => prev.filter((_, index) => index !== selectedConnection))
                setSelectedConnection(null)
            }
        }

        if (selectedConnection !== null){
            window.addEventListener('keydown', handleKeyDown)
        }

        return () => {
            window.removeEventListener('keydown', handleKeyDown)
        }
    }, [selectedConnection])
}