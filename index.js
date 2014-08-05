var s2 = require('s2'),
    normalize = require('geojson-normalize'),
    buffer = require('turf-buffer'),
    geojsonExtent = require('geojson-extent');

var serialization = 'toToken';

module.exports.bboxQueryIndexes = function(bbox, range, opts) {
    opts = setOptions(opts);
    if(range === undefined) range = true;
    var latLngRect = new s2.S2LatLngRect(
        new s2.S2LatLng(bbox[1], bbox[0]),
        new s2.S2LatLng(bbox[3], bbox[2]));

    var cover_options = {
        min: opts.query_min_level,
        max: opts.query_max_level,
        max_cells: opts.max_index_cells
    };

    return s2.getCover(latLngRect, cover_options).map(function(cell) {
        if(range){
            return [
                cell.id().rangeMin().toToken(),
                cell.id().rangeMax().toToken()
            ];
        } else {
            return cell.id().toToken();
        }
    });
};

module.exports.bboxCellGeoJSON = function(bbox, opts) {
    opts = setOptions(opts);
    var latLngRect = new s2.S2LatLngRect(
        new s2.S2LatLng(bbox[1], bbox[0]),
        new s2.S2LatLng(bbox[3], bbox[2]));

    var cover_options = {
        min: opts.query_min_level,
        max: opts.query_max_level,
        max_cells: opts.max_index_cells
    };
    return s2.getCover(latLngRect, cover_options).map(function(c) {
        return c.toGeoJSON();
    });
};

module.exports.geometryIndexes = function(input, opts) {
    opts = setOptions(opts);
    var geom = normalize(input).features[0].geometry;
    switch (geom.type) {
        case 'Point':
            return pointIndex(geom.coordinates, opts);
        case 'LineString':
            return linestringIndex(geom, opts);
        case 'Polygon':
            return polygonIndex(geom, opts);
        case 'MultiPolygon':
            return multipolygonIndex(geom, opts);
        default:
            return [];
    }
};

module.exports.geometryGeoJSON = function(input, opts) {
    opts = setOptions(opts);
    var geom = normalize(input).features[0].geometry;
    switch (geom.type) {
        case 'Point':
            return pointGeoJSON(geom.coordinates, opts);
        case 'LineString':
            return linestringGeoJSON(geom, opts);
        case 'Polygon':
            return polygonGeoJSON(geom, opts);
        case 'MultiPolygon':
            return multipolygonGeoJSON(geom, opts);
        default:
            return [];
    }
};

// GeometryIndex

function pointIndex(coords, opts) {
    var id = new s2.S2CellId(new s2.S2LatLng(coords[1], coords[0]));
    return [id.parent(opts.index_point_level).toToken()];
}

function linestringIndex(geometry, opts) {
    var feature = {
        type:'Feature',
        geometry: geometry
    }
    geometry = buffer(feature, .00001, 'miles').features[0].geometry;
    var rings = geometry.coordinates;

    var cover_options = {
        min: opts.index_min_level,
        max: opts.index_max_level,
        max_cells: opts.max_index_cells,
        type: 'polygon'
    };

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

function polygonIndex(geometry, opts) {
    var rings = geometry.coordinates;

    var cover_options = {
        min: opts.index_min_level,
        max: opts.index_max_level,
        max_cells: opts.max_index_cells,
        type: 'polygon'
    };

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

function multipolygonIndex(geometry, opts) {
    var polygons = geometry.coordinates;

    var cover_options = {
        min: opts.index_min_level,
        max: opts.index_max_level,
        max_cells: opts.max_index_cells,
        type: 'multipolygon'
    };

    var llRings = polygons.map(function(rings){
        return rings.map(function(ring){
            return ring.map(function(c){
                var latLng = (new s2.S2LatLng(c[1], c[0])).normalized();
                return latLng.toPoint();
            }).slice(1);
        });
    });

    return s2.getCover(llRings, cover_options).map(function(cell) {
        return cell.id().toToken();
    });
}

// GeometryGeoJSON

function linestringGeoJSON(geometry, opts) {
    var feature = {
        type:'Feature',
        geometry: geometry
    }
    geometry = buffer(feature, .00001, 'miles').features[0].geometry;
    var rings = geometry.coordinates;

    var cover_options = {
        min: opts.index_min_level,
        max: opts.index_max_level,
        max_cells: opts.max_index_cells,
        type: 'polygon'
    };

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

function polygonGeoJSON(geometry, opts) {
    var rings = geometry.coordinates;

    var cover_options = {
        min: opts.index_min_level,
        max: opts.index_max_level,
        max_cells: opts.max_index_cells,
        type: 'polygon'
    };

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

function multipolygonGeoJSON(geometry, opts) {
    var polygons = geometry.coordinates;

    var cover_options = {
        min: opts.index_min_level,
        max: opts.index_max_level,
        max_cells: opts.max_index_cells,
        type: 'multipolygon'
    };

    var llRings = polygons.map(function(rings){
        return rings.map(function(ring){
            return ring.map(function(c){
                var latLng = (new s2.S2LatLng(c[1], c[0])).normalized();
                return latLng.toPoint();
            }).slice(1);
        });
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

function setOptions(opts){
    if(!opts){
        opts = {}
    }

    // the maximum number of S2 cells used for any query coverage.
    // - More = more complex queries
    // - Fewer = less accurate queries
    if(!opts.max_query_cells){
        opts.max_query_cells = 100
    }

    // The largest size of a cell permissable in a query.
    if(!opts.query_min_level){
        opts.query_min_level = 1;
    }

    // The smallest size of a cell permissable in a query.
    // - This must be >= index_max_level
    if(!opts.query_max_level){
        opts.query_max_level = 8;
    }

    // the maximum number of S2 cells used for any index coverage.
    // - More = more accurate indexes
    // - Fewer = more compact queries
    if(!opts.max_index_cells){
        opts.max_index_cells = 100;
    }

    // The largest size of a cell permissable in an index.
    // - This must be <= query_min_level
    if(!opts.index_min_level){
        opts.index_min_level = 8;
    }

    // The smallest size of a cell permissable in an index.
    if(!opts.index_max_level){
        opts.index_max_level = 12;
    }

    // The index level for point features only.
    if(!opts.index_point_level){
        opts.index_point_level = 15;
    }

    if(!(opts.query_max_level >= opts.index_min_level)){
        throw new Error('query level and index level must correspond');
    }
    return opts;
}
