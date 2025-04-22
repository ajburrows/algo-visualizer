import React from 'react'
import Node from './Node'
import { NODE_RADIUS } from '../constants'

export default function FloatingNode({
    mousePos,
    selectedNodeID
}) {
    if (!mousePos || selectedNodeID === null) return null
    
    return (
        <div
            style={{
                position: 'fixed',
                left: mousePos.x - NODE_RADIUS,
                top: mousePos.y - NODE_RADIUS,
                pointerEvents: 'none',
                zIndex: 1000,
            }}
        >
            <Node
                ID={selectedNodeID}
                isSelected={true}
                isHidden={false}
                onClick={() => {}}
                onConnectorClick={() => {}}
            />
        </div>
    )
}