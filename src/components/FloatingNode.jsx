import React from 'react'
import Node from './Node'

export default function FloatingNode({
    NODE_RADIUS,
    mousePos,
    selectedNodeID
}) {
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