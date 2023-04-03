import type { Identifier, XYCoord } from 'dnd-core'
import React, { useRef } from 'react';
import { useDrag, useDrop } from 'react-dnd';
import { HiBars3 } from 'react-icons/hi2';

interface DraggableImageProps {
    id: number;
    url: string;
    index: number;
    name?: string;
    alt?: string;
    moveImage: (dragIndex: number, hoverIndex: number) => void;
    removeImage: () => void;
    handleAltChange: (imageId: number, newAlt: string) => void;
}


interface DragItem {
    index: number
    id: string
    type: string
}

const DraggableImage: React.FC<DraggableImageProps> = ({
    id,
    url,
    index,
    name,
    alt,
    moveImage,
    removeImage,
    handleAltChange,
}) => {
    const ref = useRef<HTMLDivElement>(null);

    const [{ isDragging }, drag] = useDrag({
        type: 'image',
        item: () => {
            return { id, index }
        },
        collect: (monitor: any) => ({
            isDragging: monitor.isDragging(),
        }),
    })

    const [{ handlerId }, drop] = useDrop<
        DragItem,
        void,
        { handlerId: Identifier | null }
    >({
        accept: 'image',
        collect(monitor) {
            return {
                handlerId: monitor.getHandlerId(),
            }
        },
        hover(item: DragItem, monitor) {
            if (!ref.current) {
                return
            }
            const dragIndex = item.index
            const hoverIndex = index

            // Don't replace items with themselves
            if (dragIndex === hoverIndex) {
                return
            }

            // Determine rectangle on screen
            const hoverBoundingRect = ref.current?.getBoundingClientRect()

            // Get vertical middle
            const hoverMiddleY =
                (hoverBoundingRect.bottom - hoverBoundingRect.top) / 2

            // Determine mouse position
            const clientOffset = monitor.getClientOffset()

            // Get pixels to the top
            const hoverClientY = (clientOffset as XYCoord).y - hoverBoundingRect.top

            // Only perform the move when the mouse has crossed half of the items height
            // When dragging downwards, only move when the cursor is below 50%
            // When dragging upwards, only move when the cursor is above 50%

            // Dragging downwards
            if (dragIndex < hoverIndex && hoverClientY < hoverMiddleY) {
                return
            }

            // Dragging upwards
            if (dragIndex > hoverIndex && hoverClientY > hoverMiddleY) {
                return
            }

            // Time to actually perform the action
            moveImage(dragIndex, hoverIndex)

            // Note: we're mutating the monitor item here!
            // Generally it's better to avoid mutations,
            // but it's good here for the sake of performance
            // to avoid expensive index searches.
            item.index = hoverIndex
        },
    })
    drag(drop(ref))

    const handleRemove = () => {
        removeImage();
    };
    return (
        <div
            ref={ref}
            className="relative flex items-center space-x-3 rounded-lg border border-gray-300 bg-white px-6 py-2 shadow-sm justify-between"
            style={{ opacity: isDragging ? 0 : 1 }}
            data-handler-id={handlerId}
        >
            <div className="relative space-x-3 flex items-center">
                <div className="flex-shrink-0">
                    <img className="h-16 w-16" src={url} alt="" />
                </div>
                <div className="min-w-0 flex-1">
                    <p className="text-md font-medium text-gray-900">{name}</p>
                    <div className="py-2">
                        <input
                            type="text"
                            className="block w-full px-2 py-[2px] max-w-lg rounded-md border-0 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 sm:max-w-xs sm:text-sm sm:leading-6"
                            value={alt}
                            placeholder="Alt text"
                            onChange={(e) => handleAltChange(id, e.target.value)}
                        />
                    </div>
                </div>
            </div>
            <div className="hover:cursor-grab">
                <HiBars3 className="h-6 w-6" />
            </div>
            <button
                className="absolute top-0 right-0 bg-white rounded-full w-6 h-6 -mt-2 -mr-2 text-gray-500 text-sm flex items-center justify-center hover:bg-gray-100"
                onClick={handleRemove}
            >
                &times;
            </button>
        </div>
    );
};

export default DraggableImage;
