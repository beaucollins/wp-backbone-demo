(function(){

	var demo = function(){
		// initialize here
		var map_box = new MapBox();
	};
	
	var MapBox = demo.MapBox = Backbone.View.extend({
		el: '#demo-map',
		options: {
			// https://developers.google.com/maps/documentation/javascript/reference#MapOptions
			mapOptions: {
				zoom: 1,
				center: new google.maps.LatLng(0,0),
				mapTypeId: google.maps.MapTypeId.ROADMAP
			}
		},
		initialize: function(){
			this.render();
		},
		render: function(){
			if ( !this.map ) {
				this.map_node = this.make( 'div', {style:'height:400px'}, 'map goes here' );
				this.$el.append( this.map_node );
				this.map = new google.maps.Map( this.map_node, this.options.mapOptions );
			};
		}
	});
	// don't override if demo exists because we're nice
	if ( !window.demo ) window.demo = demo;

})();
