# geojson-cover

[![build status](https://secure.travis-ci.org/mapbox/geojson-cover.png)](http://travis-ci.org/mapbox/geojson-cover)

generates an s2 cover from geojson

## API

```js
geojsonCover.bboxQueryIndexes(bbox); // -> cells
geojsonCover.bboxCellGeoJSON(bbox); // -> geojson
geojsonCover.geometryIndexes(input); // -> cells
geojsonCover.geometryGeoJSON(input); // -> geojson
```

###options

```js
{
	max_query_cells: 100,
	query_min_level: 1,
	query_max_level: 8,
	max_index_cells: 100,
	index_min_level: 8,
	index_max_level: 12,
	index_point_level: 15
}
```