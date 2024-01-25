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
    const position = getElementPosition(element);
    const size = getElementSize(element);
    return {
        start: position,
        end: {
            x: position.x + size.width,
            y: position.y + size.height
        }
    };
};

// Stores mouse position
const storesMousePosition = (event) => {
    // Checks if event is touch or mouse
    const eventType = event.touches ? event.touches[0] : event;

    mousePos = {
        x: eventType.clientX,
        y: eventType.clientY
    };
};

// Returns mouse movement
const getMouseMovement = (event) => {
    // Checks if event is touch or mouse
    const eventType = event.changedTouches ? event.changedTouches[0] : event;

    // Stores difference between new and old mouse position
    let mouseMov = {
        x: eventType.clientX - mousePos.x,
        y: eventType.clientY - mousePos.y
    };

    // Stores new mouse position
    storesMousePosition(event);

    return mouseMov;
};

// Drag and drop
const dragAndDrop = (event) => {
    // Prevents default scroll behavior for touch events
    if (event.type === 'touchmove') event.preventDefault();

    const rectanglePos = getElementPosition(rectangleEl);
    const mouseMov = getMouseMovement(event);

    // rectangleEl.css('left', (rectanglePos.x + mouseMov.x));
    // rectangleEl.css('top', (rectanglePos.y + mouseMov.y));
    rectangleEl.css('left', (rectanglePos.x + mouseMov.x) + 'px');
    rectangleEl.css('top', (rectanglePos.y + mouseMov.y) + 'px');
};

// Moves rectangle to container
const movesToContainer = (position, areaList) => {
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
    // Stops propagation and default behavior
    // event.stopPropagation();
    event.preventDefault();

    // Stores initial mouse position
    storesMousePosition(event);

    // Tracks mouse movement
    $(window).on('mousemove touchmove', dragAndDrop);
});

$(window).on('mouseup touchend', (event) => {
    // Stops tracking mouse movement
    $(window).off('mousemove touchmove', dragAndDrop);

    // Stores mouse position
    storesMousePosition(event);

    // Stores container areas
    const containerAreaList = [];
    for (const containerEl of containerElList) {
        containerAreaList.push(getElementArea(containerEl));
    }

    // Checks if rectangle is inside container1 or container2
    movesToContainer(mousePos, containerAreaList);
});
