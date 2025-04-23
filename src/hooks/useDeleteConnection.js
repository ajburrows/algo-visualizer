import { useEffect } from 'react'

export default function useDeleteConnection(
    selectedConnection,
    setSelectedConnection,
    setConnections
) {
    useEffect(() => {
        console.log(`${selectedConnection}`)
        const handleKeyDown = (e) => {
            console.log('pressed')
            if ((e.key === 'Delete' || e.key === 'Backspace') && selectedConnection !== null) {
                setConnections(prev => prev.filter((_, index) => index !== selectedConnection))
                setSelectedConnection(null)
            }
        }

        if (selectedConnection !== null){
            console.log('adding event listener')
            window.addEventListener('keydown', handleKeyDown)
        }

        return () => {
            window.removeEventListener('keydown', handleKeyDown)
            console.log('removing event listener')
        }
    }, [selectedConnection])
}