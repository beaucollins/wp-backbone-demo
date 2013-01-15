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

	function admin_init(){
		add_meta_box( 'demo', __( 'Demo' ), array( $this, 'meta_content' ), 'post' );		
		add_action( 'admin_enqueue_scripts', array( $this, 'enqueue_scripts') );
	}

	function enqueue_scripts( $hook ){
		if ( in_array( $hook, array( 'post.php', 'post-new.php' ) ) ) {
			$script = plugin_dir_url( __FILE__ ) . 'demo.js' ;
			$google_maps_url = 'https://maps.googleapis.com/maps/api/js?key=' . self::GOOGLE_API_KEY . '&sensor=false';
			wp_enqueue_script( 'demo-google-maps', $google_maps_url );
			wp_enqueue_script( 'demo', $script, array( 'jquery', 'backbone' ) );
		}		
	}

}

add_action( 'admin_init', array( new Demo, 'admin_init' ) );
