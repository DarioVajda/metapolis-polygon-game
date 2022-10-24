/**
 * @dev this is a function receiving the dimensions of a building, its corner coordinate, rotation and then returns an object containing the start and end coordinates
 * @param   {Number[]}               dimensions      the first number indicates the width, the second number indicates the height
 * @param   {Number}                  rotation        number from 0 to 3 indicating the rotation of the building
 * @param   {{ x: Number, y: Number }}  coord           object containing the coordinates of the corner of the building
 * @returns {{ start: { x: Number, y: Number }, end: { x: Number, y: Number } }}
 */
 function calculateCoordinates(dimensions, rotation, coord) {
    let start = coord;
    let end = { x: -1, y: -1 };

    if(rotation === 0) {
        end.x = start.x + (dimensions[0] - 1);
        end.y = start.y + (dimensions[1] - 1);
    }
    else if(rotation === 1) {
        end.y = start.y;
        end.x = start.x + (dimensions[1] - 1);
        start.y = start.y - (dimensions[0] - 1);
    }
    else if(rotation === 2) {
        end.x = start.x;
        end.y = start.y;
        start.x = start.x - (dimensions[0] - 1);
        start.y = start.y - (dimensions[1] - 1);
    }
    else {
        end.y = start.y + (dimensions[0] - 1);
        end.x = start.x;
        start.x = start.x - (dimensions[1] - 1);
    }
    return { start, end }
}

exports.calculateCoordinates = calculateCoordinates;