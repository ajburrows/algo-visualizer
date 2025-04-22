import { useEffect } from "react";

export function useDragTracker(selectedNodeID, setMousePos, setIsMoving){
    useEffect(() => {
        const handleMouseMove = (e) => {
            setMousePos({ x: e.clientX, y: e.clientY });
            setIsMoving(true);
        };
    
        if (selectedNodeID !== null) {
            window.addEventListener('mousemove', handleMouseMove);
        }
    
        return () => {
            window.removeEventListener('mousemove', handleMouseMove);
        };
    }, [selectedNodeID]);
}
