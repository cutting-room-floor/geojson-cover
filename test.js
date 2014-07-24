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
	t.ok(geojsonCover.geometry(pt), 'point geometry');
	t.end();
});

test('linestring', function(t) {
	var line = {
      "type": "Feature",
      "properties": {},
      "geometry": {
        "type": "LineString",
        "coordinates": [
          [
            -49.251708984375,
            -17.214264312027566
          ],
          [
            -46.131591796875,
            -14.381476281951612
          ],
          [
            -41.77001953125,
            -18.79191774423444
          ],
          [
            -41.51733398437499,
            -15.231189704767242
          ]
        ]
      }
    };

    t.ok(geojsonCover.bboxQueryIndexes(line), 'linestring indexes'); // -> cells
	t.ok(geojsonCover.bboxCellGeoJSON(line), 'linestring geojson'); // -> geojson
	t.ok(geojsonCover.geometry(line), 'linestring geometry');
	t.end();
});

test('polygon', function(t) {
	var poly = {
      "type": "Feature",
      "properties": {},
      "geometry": {
        "type": "Polygon",
        "coordinates": [
          [
            [
              -93.328857421875,
              41.65649719441145
            ],
            [
              -96.712646484375,
              40.83043687764923
            ],
            [
              -95.108642578125,
              39.90130858574735
            ],
            [
              -93.328857421875,
              41.65649719441145
            ]
          ]
        ]
      }
    };

	t.ok(geojsonCover.bboxQueryIndexes(poly), 'polygon indexes'); // -> cells
	t.ok(geojsonCover.bboxCellGeoJSON(poly), 'polygon geojson'); // -> geojson
	t.ok(geojsonCover.geometry(poly), 'polygon geometry'); 
	t.end();
});