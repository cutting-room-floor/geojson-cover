var s2 = require('s2'),
    normalize = require('geojson-normalize'),
    geojsonExtent = require('geojson-extent'),
    constants = require('./constants');

var serialization = 'toToken';

module.exports.constants = function(_constants) {
    if (!arguments.length) return constants;
    constants = _constants;
};

module.exports.bboxQueryIndexes = function(bbox) {
    var latLngRect = new s2.S2LatLngRect(
        new s2.S2LatLng(bbox[1], bbox[0]),
        new s2.S2LatLng(bbox[3], bbox[2]));

    var cover_options = {
        min: constants.QUERY_MIN_LEVEL,
        max: constants.QUERY_MAX_LEVEL,
        max_cells: constants.MAX_INDEX_CELLS
    };

    return s2.getCover(latLngRect, cover_options).map(function(cell) {
        return [
            cell.id().rangeMin().toToken(),
            cell.id().rangeMax().toToken()
        ];
    });
};

module.exports.bboxCellGeoJSON = function(bbox) {
    var latLngRect = new s2.S2LatLngRect(
        new s2.S2LatLng(bbox[1], bbox[0]),
        new s2.S2LatLng(bbox[3], bbox[2]));

    var cover_options = {
        min: constants.QUERY_MIN_LEVEL,
        max: constants.QUERY_MAX_LEVEL,
        max_cells: constants.MAX_INDEX_CELLS
    };
    return s2.getCover(latLngRect, cover_options).map(function(c) {
        return c.toGeoJSON();
    });
};

module.exports.geometryIndexes = function(input) {
    var geom = normalize(input).features[0].geometry;
    switch (geom.type) {
        case 'Point':
            return pointIndex(geom.coordinates);
        case 'Polygon':
            return polygonIndex(geom);
        default:
            return [];
    }
};

module.exports.geometryGeoJSON = function(input) {
    var geom = normalize(input).features[0].geometry;
    switch (geom.type) {
        case 'Point':
            return pointGeoJSON(geom.coordinates);
        case 'Polygon':
            return polygonGeoJSON(geom);
        default:
            return [];
    }
};

function pointIndex(coords) {
    var id = new s2.S2CellId(new s2.S2LatLng(coords[1], coords[0]));
    return [id.parent(constants.INDEX_POINT_LEVEL).toToken()];
}

function lineIndex(coords) {
    return polygonIndex(geojsonExtent.polygon(geometry));
}

function polygonIndex(geometry) {

    var rings = geometry.coordinates;

    var cover_options = {
        min: constants.INDEX_MIN_LEVEL,
        max: constants.INDEX_MAX_LEVEL,
        max_cells: constants.MAX_INDEX_CELLS,
        type: 'polygon'
    };

    // GeoJSON
    var llRings = rings.map(function(ring){
        return ring.map(function(c){
            var latLng = (new s2.S2LatLng(c[1], c[0])).normalized();
            return latLng.toPoint();
        }).slice(1);
    });

    return s2.getCover(llRings, cover_options).map(function(cell) {
        return cell.id().toToken();
    });
}

function polygonGeoJSON(geometry) {
    var rings = geometry.coordinates;

    var cover_options = {
        min: constants.INDEX_MIN_LEVEL,
        max: constants.INDEX_MAX_LEVEL,
        max_cells: constants.MAX_INDEX_CELLS,
        type: 'polygon'
    };

    // GeoJSON
    var llRings = rings.map(function(ring){
        return ring.map(function(c){
            var latLng = (new s2.S2LatLng(c[1], c[0])).normalized();
            return latLng.toPoint();
        }).slice(1);
    });
    var features = s2.getCover(llRings, cover_options).map(function(cell,i) {
        var geojson = cell.toGeoJSON();
        return {
            type: 'Feature',
            geometry: geojson,
            properties: {}
        };
    });

    return {
        type: 'FeatureCollection',
        features: features
    }
}

function linestringGeoJSON(geometry) {
    var rings = geometry.coordinates;

    var cover_options = {
        min: constants.INDEX_MIN_LEVEL,
        max: constants.INDEX_MAX_LEVEL,
        max_cells: constants.MAX_INDEX_CELLS,
        type: 'polygon'
    };

    // GeoJSON
    var llRings = rings.map(function(ring){
        return ring.map(function(c){
            var latLng = (new s2.S2LatLng(c[1], c[0])).normalized();
            return latLng.toPoint();
        }).slice(1);
    });
    var features = s2.getCover(llRings, cover_options).map(function(cell,i) {
        var geojson = cell.toGeoJSON();
        return {
            type: 'Feature',
            geometry: geojson,
            properties: {}
        };
    });

    return {
        type: 'FeatureCollection',
        features: features
    }
}
