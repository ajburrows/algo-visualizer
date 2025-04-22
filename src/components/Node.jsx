import React from 'react'
import clsx from 'clsx'

const Node = ({
    ID,
    isSelected,
    isHidden,
    onClick,
    onConnectorClick
}) => {
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
                    onClick={(e) => {
                        e.stopPropagation()
                        onConnectorClick(pos)
                    }}
                >
                    <div className="connector" />
                </div>
            ))}
        </div>
    )
}

export default Node