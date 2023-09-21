/**
 * Работа с SHP файлами
 */

const SHP = {
    NULL: 0,
    POINT: 1,
    POLYLINE: 3,
    POLYGON: 5,
};
/** parse shape
 * @param dv - DataView instance
 * @param idx - bite position in the binary string
 * @param length - record lenth
 *
 * @return shape - object
 */
const parseShape = function (dv, idx) {
    let i = 0,
        c = null;
    let shape = {};
    shape.type = dv.getInt32(idx, true);
    idx += 4;
    // let byteLen = length * 2
    switch (shape.type) {
        case SHP.NULL: // Null
            break;

        case SHP.POINT: // Point (x,y)
            shape.content = {
                x: dv.getFloat64(idx, true),
                y: dv.getFloat64(idx + 8, true),
            };
            break;
        case SHP.POLYLINE: // Polyline (MBR, partCount, pointCount, parts, points)
        case SHP.POLYGON: // Polygon (MBR, partCount, pointCount, parts, points)
            c = shape.content = {
                minX: dv.getFloat64(idx, true),
                minY: dv.getFloat64(idx + 8, true),
                maxX: dv.getFloat64(idx + 16, true),
                maxY: dv.getFloat64(idx + 24, true),
                parts: new Int32Array(dv.getInt32(idx + 32, true)),
                points: new Float64Array(dv.getInt32(idx + 36, true) * 2),
            };
            idx += 40;
            for (i = 0; i < c.parts.length; i++) {
                c.parts[i] = dv.getInt32(idx, true);
                idx += 4;
            }
            for (i = 0; i < c.points.length; i++) {
                c.points[i] = dv.getFloat64(idx, true);
                idx += 8;
            }
            break;

        case 8: // MultiPoint (MBR, pointCount, points)
        case 11: // PointZ (X, Y, Z, M)
        case 13: // PolylineZ
        case 15: // PolygonZ
        case 18: // MultiPointZ
        case 21: // PointM (X, Y, M)
        case 23: // PolylineM
        case 25: // PolygonM
        case 28: // MultiPointM
        case 31: // MultiPatch
            throw new Error(
                "Shape type not supported: " +
                    shape.type +
                    ":" +
                    +SHP.getShapeName(shape.type)
            );
        default:
            throw new Error(
                "Unknown shape type at " + (idx - 4) + ": " + shape.type
            );
    }
    return shape;
};

/**  reads binary file data
 * @param arrayBuffer - the contents of the file as binary data array
 * @param src - string, name of the file or any other slug
 *
 * @return object
 */
export const readShape = function (arrayBuffer, src) {
    let o = {};
    let dv = new DataView(arrayBuffer);
    let idx = 0;
    o.fileName = src;
    o.fileCode = dv.getInt32(idx, false);
    if (o.fileCode != 0x0000270a) {
        throw new Error("Unknown file code: " + o.fileCode);
    }
    idx += 6 * 4;
    o.wordLength = dv.getInt32(idx, false);
    o.byteLength = o.wordLength * 2;
    idx += 4;
    o.version = dv.getInt32(idx, true);
    idx += 4;
    o.shapeType = dv.getInt32(idx, true);
    idx += 4;
    o.minY = dv.getFloat64(idx, true);
    o.minX = dv.getFloat64(idx + 8, true);
    o.maxY = dv.getFloat64(idx + 16, true);
    o.maxX = dv.getFloat64(idx + 24, true);
    o.minZ = dv.getFloat64(idx + 32, true);
    o.maxZ = dv.getFloat64(idx + 40, true);
    o.minM = dv.getFloat64(idx + 48, true);
    o.maxM = dv.getFloat64(idx + 56, true);
    idx += 8 * 8;
    o.records = [];
    while (idx < o.byteLength) {
        let record = {};
        record.number = dv.getInt32(idx, false);
        idx += 4;
        record.length = dv.getInt32(idx, false);
        idx += 4;
        try {
            record.shape = parseShape(dv, idx, record.length);
        } catch (e) {
            clog(e, record);
        }
        idx += record.length * 2;
        o.records.push(record);
    }
    return o;
};

/** reads shape file and parses it's data
 *
 * @param  file - file from input
 * @returns object
 */
export const readBinaryShapeFile = async (file) => {
    const buffer = await file.arrayBuffer();
    const parsed = readShape(buffer, "grassland");
    return parsed;
};

/** calculates the center of the map
 *
 * @param {*} shp parsed shaped data
 * @returns [float, float] - coordinates of the center of the map
 */
export const getShapeFileCenter = function (shp) {
    if (!shp) {
        return [45, 45];
    }
    return [(shp.minX + shp.maxX) / 2, (shp.minY + shp.maxY) / 2];
};

/** calculates the center of the map by array of points
 *
 * @param points - array of [float, float]
 * @returns [float, float] - coordinates of the center of the map
 */
export const getCenterByPoints = (points) => {
    const initialValue = [0, 0];
    let sumWithInitial = points.reduce((accumulator, currentValue) => {
        return [
            parseFloat(accumulator[0]) + parseFloat(currentValue[0]),
            parseFloat(accumulator[1]) + parseFloat(currentValue[1]),
        ];
    }, initialValue);

    return [
        sumWithInitial[0] / points.length,
        sumWithInitial[1] / points.length,
    ];
};

/** gets coordinates of the points of the grassland's bound by provided data
 *
 * @param {*} shp - object retrieved from the shape file
 * @returns array of [float, float]
 */
export const getPointsForGrassland = function (shp) {
    if (!shp || shp.records.length > 1) {
        return false;
    }

    let index = 0;
    let pointsParsed = [];
    const points = shp.records[0].shape.content.points;

    for (const id in points) {
        pointsParsed[index] = pointsParsed[index] ? pointsParsed[index] : [];
        pointsParsed[index][1 - (id % 2)] = points[id];
        index = id % 2 === 1 ? index + 1 : index;
    }

    return pointsParsed;
};
