leaflet.TileLayer.WMTS
======================
发现原来的版本在调用`geoserver`发布的`wmts`服务时缺少参数，故做了修正
======================


In order to use this plugin, include the leaflet-tilelayer-wmts.js on your page and use it as follow:

```javascript
// You can get a key here: http://api.ign.fr/accueil (french)
var ignKey = "lqp42l06r6pyp1ll2uuzei4r";
var layerIGNScanStd = "GEOGRAPHICALGRIDSYSTEMS.MAPS.SCAN-EXPRESS.STANDARD";
// The WMTS URL 
var url = "http://wxs.ign.fr/" + ignKey + "/geoportail/wmts";

var ign = new L.TileLayer.WMTS( url ,{
              layer: layerIGNScanStd,
              style: "normal",
              tilematrixSet: "PM",
              format: "image/jpeg"});
var map = L.map('map').setView([48.505, 3.09], 13);
L.control.scale({'position':'bottomleft','metric':true,'imperial':false}).addTo(map);
map.addLayer(ign);
var baseLayers = {"Carte IGN" : ign};
L.control.layers(baseLayers, {}).addTo(map);            
```
