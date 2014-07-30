# geojson-cover

[![build status](https://secure.travis-ci.org/mapbox/geojson-cover.png)](http://travis-ci.org/mapbox/geojson-cover)

generates an s2 cover from geojson

## API

```js
geojsonCover.bboxQueryIndexes(bbox); // -> cells
geojsonCover.bboxCellGeoJSON(bbox); // -> geojson
geojsonCover.geometryIndexes(geojson); // -> cells
geojsonCover.geometryGeoJSON(geojson); // -> geojson

// options
geojsonCover.bboxQueryIndexes(bbox, {max_index_cells: 50}); // -> cells
```

###options

name|default|description
---|---|---
max_query_cells | 100 | the maximum number of S2 cells used for any query coverage.
query_min_level | 1 | The largest size of a cell permissable in a query.
query_max_level | 8 | The smallest size of a cell permissable in a query.
max_index_cells | 100 | the maximum number of S2 cells used for any index coverage.
index_min_level | 8 | The largest size of a cell permissable in an index.
index_max_level | 12 | The smallest size of a cell permissable in an index.
index_point_level | 15 | The index level for point features only.