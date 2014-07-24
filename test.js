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
	t.ok(geojsonCover.geometryIndexes(pt), 'point geometry');
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
	t.ok(geojsonCover.geometryIndexes(line), 'linestring geometry');
	console.log(geojsonCover.geometryIndexes(line))
	require('fs').writeFileSync('scratch.geojson',JSON.stringify(geojsonCover.geometryGeoJSON(line)));
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
	t.ok(geojsonCover.geometryIndexes(poly), 'polygon geometry'); 
	t.ok(geojsonCover.geometryGeoJSON(poly), 'polygon geojson');
	t.equal(geojsonCover.geometryGeoJSON(poly).features[0].geometry.type, 'Polygon')
	t.end();
});

test('polygon with hole', function(t) {
	var poly = {
      "type": "Feature",
      "properties": {},
      "geometry": {
        "type": "Polygon",
        "coordinates": [ 
          [    // outer ring
            [
              -49.295654296875,
              -20.055931265194438
            ],
            [
              -49.295654296875,
              -13.27202630119995
            ],
            [
              -41.1328125,
              -13.27202630119995
            ],
            [
              -41.1328125,
              -20.055931265194438
            ],
            [
              -49.295654296875,
              -20.055931265194438
            ]
          ],
          [    // inner ring
            [
              -47.076416015625,
              -18.79191774423444
            ],
            [
              -47.076416015625,
              -16.309595517742185
            ],
            [
              -44.615478515625,
              -16.309595517742185
            ],
            [
              -44.615478515625,
              -18.79191774423444
            ],
            [
              -47.076416015625,
              -18.79191774423444
            ]
          ]
        ]
      }
    };

	t.ok(geojsonCover.bboxQueryIndexes(poly), 'polygon w/ hole indexes'); // -> cells
	t.ok(geojsonCover.bboxCellGeoJSON(poly), 'polygon w/ hole geojson'); // -> geojson
	t.ok(geojsonCover.geometryIndexes(poly), 'polygon w/ hole indexes'); 
	t.ok(geojsonCover.geometryGeoJSON(poly), 'polygon w/ hole geojson');
	t.equal(geojsonCover.geometryGeoJSON(poly).features[0].geometry.type, 'Polygon')
	t.end();
});
