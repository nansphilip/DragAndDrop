// Elements
const rectangleEl = $('.element');

// Containers
const containerElList = [];
$('.container').each(function () {
    containerElList.push($(this));
});

// Variables
let mousePos = undefined;

// Returns element position
const getElementPosition = (element) => {
    return {
        x: Math.floor(element.position().left),
        y: Math.floor(element.position().top)
    };
};

// Returns element size
const getElementSize = (element) => {
    return {
        width: element.width(),
        height: element.height()
    };
};

// Returns element area
const getElementArea = (element) => {
    return {
        start: getElementPosition(element),
        end: {
            x: (getElementPosition(element).x + getElementSize(element).width),
            y: (getElementPosition(element).y + getElementSize(element).height)
        }
    }
};

// Returns mouse position
const getMousePosition = (event) => {
    return {
        x: event.clientX,
        y: event.clientY
    };
};

// Returns mouse movement
const getMouseMovement = (event) => {
    // Stores difference between new and old mouse position
    let mouseMov = {
        x: event.clientX - mousePos.x,
        y: event.clientY - mousePos.y
    }

    // Stores new mouse position
    mousePos = getMousePosition(event);

    return {
        x: mouseMov.x,
        y: mouseMov.y
    };
};

// Drag and drop
const dragAndDrop = (event) => {
    event.preventDefault();
    const rectanglePos = getElementPosition(rectangleEl);
    const mouseMov = getMouseMovement(event);

    rectangleEl.css('left', (rectanglePos.x + mouseMov.x));
    rectangleEl.css('top', (rectanglePos.y + mouseMov.y));
};

// Moves rectangle to container
const moveToContainer = (position, areaList) => {
    for (const index in areaList) {
        // Inside container
        if (areaList[index].start.x < position.x && position.x < areaList[index].end.x &&
            areaList[index].start.y < position.y && position.y < areaList[index].end.y) {
            // Resets rectangle position
            rectangleEl.css('left', '');
            rectangleEl.css('top', '');

            // Moves rectangle to container
            rectangleEl.appendTo(containerElList[index]);
        }
        // Out of bounds
        else {
            // Resets rectangle position
            rectangleEl.css('left', '');
            rectangleEl.css('top', '');
        }
    }
};


// Mouse and touch events
rectangleEl.on('mousedown touchstart', (event) => {
    // Stores initial mouse position
    mousePos = getMousePosition(event);

    // Tracks mouse movement
    $(window).on('mousemove touchmove', dragAndDrop);
});

$(window).on('mouseup touchend', (event) => {
    // Stops tracking mouse movement
    $(window).off('mousemove touchmove', dragAndDrop);

    // Stores mouse position
    mousePos = getMousePosition(event);

    // Stores container areas
    const containerAreaList = [];
    for (const containerEl of containerElList) {
        containerAreaList.push(getElementArea(containerEl));
    }

    // Checks if rectangle is inside container1 or container2
    moveToContainer(mousePos, containerAreaList);
});
