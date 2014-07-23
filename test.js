var test = require('tape'),
    geojsonCover = require('./');

test('constants', function(t) {
    t.ok(geojsonCover.constants(), 'constants()');
    t.equal(geojsonCover.constants().QUERY_MAX_LEVEL, 8);
    t.end();
});

test('point', function(t) {
	var pt = {
      "type": "Feature",
      "properties": {},
      "geometry": {
        "type": "Point",
        "coordinates": [
          -93.416748046875,
          41.37680856570233
        ]
      }
    };

    t.ok(geojsonCover.bboxQueryIndexes(pt), 'point indexes'); // -> cells
	t.ok(geojsonCover.bboxCellGeoJSON(pt), 'point geojson'); // -> geojson
	t.ok(geojsonCover.geometry(pt), 'pt geometry');
	t.end()
})

test('linestring', function(t) {

	t.end()
})

test('polygon', function(t) {

	t.end()
})

test('multipoint', function(t) {

	t.end()
})

test('multilinestring', function(t) {

	t.end()
})

test('multipolygon', function(t) {

	t.end()
})

test('feature', function(t) {

	t.end()
})

test('featurecollection', function(t) {

	t.end()
})
