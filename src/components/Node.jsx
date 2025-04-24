import React from 'react'
import { useState } from 'react'
import clsx from 'clsx'

const Node = ({
    ID,
    isSelected,
    isHidden,
    onClick,
    onConnectorClick
}) => {
    const [hoveredPos, setHoveredPos] = useState(null)

    return (
        <div
            className={clsx('node', {
                selected: isSelected,
                hidden: isHidden
            })}
            onClick={onClick}
        >
            {ID}
            {['top', 'right', 'bottom', 'left'].map((pos) => (
                <div
                    key={pos}
                    className={`connector-wrapper ${pos}`}
                >
                    <div
                        className='connector-hitbox'
                        onMouseEnter={() => setHoveredPos(pos)}
                        onMouseLeave={() => setHoveredPos(null)}
                        onClick={(e) => {
                            e.stopPropagation()
                            onConnectorClick(pos)
                        }}>
                        
                    </div>
                    <div className={clsx(
                        'connector',
                        { active: hoveredPos === pos }
                    )} />
                </div>
            ))}
        </div>
    )
}

export default Node