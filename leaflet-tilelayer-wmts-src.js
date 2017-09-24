L.TileLayer.WMTS = L.TileLayer.extend({
	defaultWmtsParams: {
		Service: 'WMTS',
		Request: 'GetTile',
		Version: '1.0.0',
		style: '',
		TileatrixSet: '',
		Format: 'image/png'
	},

	initialize: function (url, options) { // (String, Object)
		this._url = url;
		var wmtsParams = L.extend({}, this.defaultWmtsParams);
		var tileSize = options.tileSize || this.options.tileSize;
		if (options.detectRetina && L.Browser.retina) {
			wmtsParams.width = wmtsParams.height = tileSize * 2;
		} else {
			wmtsParams.width = wmtsParams.height = tileSize;
		}
		for (var i in options) {
			// all keys that are not TileLayer options go to WMTS params
			if (!this.options.hasOwnProperty(i) && i != "matrixIds") {
				wmtsParams[i] = options[i];
			}
		}
		this.wmtsParams = wmtsParams;
		this.matrixIds = options.matrixIds || this.getDefaultMatrix();
		L.setOptions(this, options);
	},

	onAdd: function (map) {
		this._crs = this.options.crs || map.options.crs;
		L.TileLayer.prototype.onAdd.call(this, map);
	},

	getTileUrl: function (coords) { // (Point, Number) -> String
		var tileSize = this.options.tileSize;
		var nwPoint = coords.multiplyBy(tileSize);
		nwPoint.x += 1;
		nwPoint.y -= 1;
		var sePoint = nwPoint.add(new L.Point(tileSize, tileSize));
		var zoom = this._tileZoom;
		var nw = this._crs.project(this._map.unproject(nwPoint, zoom));
		var se = this._crs.project(this._map.unproject(sePoint, zoom));
		var tilewidth = se.x - nw.x;
		//zoom = this._map.getZoom();
		var ident = "EPSG:4326:" + this.matrixIds[zoom].identifier;
		var X0 = this.matrixIds[zoom].topLeftCorner.lng;
		var Y0 = this.matrixIds[zoom].topLeftCorner.lat;
		var tilecol = Math.floor((nw.x - X0) / tilewidth);
		var tilerow = -Math.floor((nw.y - Y0) / tilewidth);
		var url = L.Util.template(this._url, {
			s: this._getSubdomain(coords)
		});

		return url + L.Util.getParamString(this.wmtsParams, url) + "&tilematrixset=EPSG:4326" + "&TileMatrix=" + ident + "&TileRow=" + tilerow + "&TileCol=" + tilecol;
		/*
		var tileBounds = this._tileCoordsToBounds(coords);
		var zoom = this._tileZoom;
		var nw = this._crs.project(tileBounds.getNorthWest());
		var se = this._crs.project(tileBounds.getSouthEast());
		var tilewidth = se.x-nw.x;
		var ident = this.matrixIds[zoom].identifier;
		var X0 = this.matrixIds[zoom].topLeftCorner.lng;
		var Y0 = this.matrixIds[zoom].topLeftCorner.lat;
		var tilecol=Math.floor((nw.x+1-X0)/tilewidth);
		var tilerow=-Math.floor((nw.y-1-Y0)/tilewidth);
		var url = L.Util.template(this._url, {s: this._getSubdomain(coords)});
		console.log(L.Util.getParamString(this.wmtsParams, url) + "&tilematrix=" + ident + "&tilerow=" + tilerow +"&tilecol=" + tilecol );
		return url + L.Util.getParamString(this.wmtsParams, url) + "&tilematrix=" + ident + "&tilerow=" + tilerow +"&tilecol=" + tilecol ;
		*/
	},

	setParams: function (params, noRedraw) {
		L.extend(this.wmtsParams, params);
		if (!noRedraw) {
			this.redraw();
		}
		return this;
	},

	getDefaultMatrix: function () {
		/**
		 * the matrix3857 represents the projection 
		 * for in the IGN WMTS for the google coordinates.
		 */
		var matrixIds3857 = new Array(22);
		for (var i = 0; i < 22; i++) {
			matrixIds3857[i] = {
				identifier: "" + i,
				topLeftCorner: new L.LatLng(20037508.3428, -20037508.3428)
			};
		}
		return matrixIds3857;
	}
});

L.tileLayer.wmts = function (url, options) {
	return new L.TileLayer.WMTS(url, options);
};
