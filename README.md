# geojson-cover

[![build status](https://secure.travis-ci.org/mapbox/geojson-cover.png)](http://travis-ci.org/mapbox/geojson-cover)

generates an s2 cover from geojson

## API

```js
geojsonCover.bboxQueryIndexes(bbox); // -> cells
geojsonCover.bboxCellGeoJSON(bbox); // -> geojson
geojsonCover.geometry(input); // -> cells
```
