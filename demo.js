(function(){

	var demo = function(){
		// initialize here
		var location = new Location();
			map_box = new MapBox({model:location});
	};
	
	var Location = demo.Location = Backbone.Model.extend({
		toGoogleLocation: function(){
			var coords = this.get( 'location' );
			if (coords) {
				return new google.maps.LatLng( coords[0], coords[1] );
			};
		},
		hasLocation: function(){
			return this.get( 'location' );
		},
		updateLocation: function( geolocation ){
			var coords = geolocation.coords;
			this.set( 'location', [ coords.latitude, coords.longitude ] );
		},
		findLocation: function(){
			if ( navigator.geolocation ) {
				navigator.geolocation.getCurrentPosition( _.bind( this.updateLocation, this ) );
			};
		}
	});
	
	var MapBox = demo.MapBox = Backbone.View.extend({
		el: '#demo-map',
		events: {
			'click a' : 'findLocation',
		},
		options: {
			// https://developers.google.com/maps/documentation/javascript/reference#MapOptions
			mapOptions: {
				zoom: 1,
				center: new google.maps.LatLng(0,0),
				mapTypeId: google.maps.MapTypeId.ROADMAP
			}
		},
		initialize: function(){
			this.model.on( 'change', this.render, this );
			this.render();
		},
		render: function(){
			if ( !this.map ) {
				this.map_node = this.make( 'div', {style:'height:400px'}, 'map goes here' );
				this.$el.find('a').before( this.map_node );
				this.map = new google.maps.Map( this.map_node, this.options.mapOptions );
 			};
			if (this.model.hasLocation()) {
				this.map.setCenter( this.model.toGoogleLocation() );
				this.map.setZoom( 8 );
			};
		},
		findLocation: function( e ){
			e.preventDefault();
			this.model.findLocation();
			return false;
		}
	});
	// don't override if demo exists because we're nice
	if ( !window.demo ) window.demo = demo;

})();
