var test = require('tape'),
    geojsonCover = require('./');

test('constants', function(t) {
    t.ok(geojsonCover.constants(), 'constants()');
    t.equal(geojsonCover.constants().QUERY_MAX_LEVEL, 8);
    t.end();
});

test('point', function(t) {

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
