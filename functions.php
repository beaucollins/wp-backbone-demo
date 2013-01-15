<?php
/*
Plugin Name: Demo
Version: 1
Author: Beau Collins
License: GPL2
*/

class Demo {

	const GOOGLE_API_KEY = 'AIzaSyAdqxYNR7gs3t3AZV9fos-ddIZeZVBMCMY';
	const POST_META_KEY = "demo_lat_lng";
	const LOCATION_FIELD_NAME = "demo_post_location";

	function admin_init(){
		add_meta_box( 'demo', __( 'Demo' ), array( $this, 'meta_content' ), 'post' );		
		add_action( 'admin_enqueue_scripts', array( $this, 'enqueue_scripts') );
		add_action( 'media_buttons', array( $this, 'toolbar_locate_button' ) );
		add_action( 'edit_post', array( $this, 'save_post_location' ) );
	}

	function enqueue_scripts( $hook ){
		if ( in_array( $hook, array( 'post.php', 'post-new.php' ) ) ) {
			$script = plugin_dir_url( __FILE__ ) . 'demo.js' ;
			$google_maps_url = 'https://maps.googleapis.com/maps/api/js?key=' . self::GOOGLE_API_KEY . '&sensor=false';
			wp_enqueue_script( 'demo-google-maps', $google_maps_url );
			wp_enqueue_script( 'demo', $script, array( 'jquery', 'backbone' ) );
		}		
	}

	/**
	 * Displays a meta box for rendering our map UI. Don't use as is, there's
	 * a secuity hole in the JSON output
	 *
	 * @param string $post WordPress post object
	 * @return void
	 */
	function meta_content( $post ){
		// retrive post meta using our key constant
		$lat_lng = get_post_meta( $post->ID, self::POST_META_KEY, true );
		// render some HTML that we can use to display our UI
		?>
		<div id="demo-map">
			<a class="button button-large" href="#locate">Update Location</a>
			<a class="button button-large" href="#clear">Clear Location</a>
			<input type="hidden" name="<?php echo self::LOCATION_FIELD_NAME; ?>" value=" <?php echo $lat_lng ;?>"></input>
		</div>
		<script type="text/javascript">
		if (window.demo) {
			jQuery(document).ready(function(){
				// initializes demo.js
				var location = window.demo( <?php echo $lat_lng; ?> );
			});
		};
		</script>
		<?php
	}
	/**
	 * A button to render in the toolbar for easy access to updating location.
	 *
	 * @return void
	 */
	function toolbar_locate_button(){
		?>
		<a class="button" href="#demo-locate-toolbar">Add Location</a>
		<?php
	}

	/**
	 * after a post is saved it stores the demo location in the post meta
	 *
	 * @param mixed $post_id
	 */
	function save_post_location( $post_id ){
		if ( array_key_exists( self::LOCATION_FIELD_NAME, $_POST ) ) {
			update_post_meta( $post_id, self::POST_META_KEY, $_POST[ self::LOCATION_FIELD_NAME ] );
		}
	}

}

add_action( 'admin_init', array( new Demo, 'admin_init' ) );
