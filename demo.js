(function(){

	var demo = function(){
		// initialize here
		var location = new Location(),
			button = new ToolbarButton({model:location}),
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

	var ToolbarButton = demo.ToolbarButton = Backbone.View.extend({
		el: '.button[href^=#demo-locate-toolbar]',
		options: {
			locateLabel: "Add Location",
			clearLabel: "Clear Location",
			locatingLabel: "Locating ..."
		},
		events: {
			'click' : 'updateLocation'
		},
		initialize: function(){
			this.model.on( 'change', this.render, this );
		},
		render: function(){
			if ( this.model.hasLocation() ) {
				this.$el.text( this.options.clearLabel );
			} else {
				this.$el.text( this.options.locateLabel );
			}
		},
		updateLocation: function(e){
			e.preventDefault();
			if ( this.model.hasLocation() ) {
				this.model.unset('location');
			} else {
				this.$el.text( this.options.locatingLabel );
				this.model.findLocation();
			}
			return false;
		}
	});

	var MapBox = demo.MapBox = Backbone.View.extend({
		el: '#demo-map',
		events: {
			'click a[href^=#locate]' : 'findLocation',
			'click a[href^=#clear]' : 'clearLocation'
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
			this.locateButton = this.$el.find('[href^=#locate]');
			this.clearButton = this.$el.find('[href^=#clear]');
			this.render();
		},
		render: function(){
			if ( !this.map ) {
				this.map_node = this.make( 'div', {style:'height:400px'}, 'map goes here' );
				this.$el.prepend( this.map_node );
				this.map = new google.maps.Map( this.map_node, this.options.mapOptions );
 			};
			if (this.model.hasLocation()) {
				this.clearButton.show();
				this.map.setCenter( this.model.toGoogleLocation() );
				this.map.setZoom( 8 );
			} else {
				this.clearButton.hide();
				this.map.setCenter( this.options.mapOptions.center );
				this.map.setZoom( this.options.mapOptions.zoom );
			}
		},
		clearLocation: function(e){
			e.preventDefault();
			this.model.unset( 'location' );
			return false;
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
