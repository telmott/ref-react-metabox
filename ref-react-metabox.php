<?php
/**
 * Plugin Name: Post references React metabox
 * 
 * 
 * 
 */

/**
 * Register the reference meta to post type
 */
$args = array(
    // 'sanitize_callback' => 'sanitizeReferences',
    'type' => 'string',
    'description' => 'My registered meta key',
    'single' => false,
    'show_in_rest' => true,
);
register_meta( 'post', 'reference', $args );

/**
 * Sanitizes the Url from the user input field, to be safely storaged in the database
 *
 * @param string $ref
 * @return string   Escaped url string to safe storage in the database
 */
function sanitizeReferences($ref)
{
    return esc_url_raw($ref);
}

/**
 * Hook to add references meta box to edit post screen
 */
add_action( 'add_meta_boxes_post', 'addReferencesMetaboxToPost', 10 );

/**
 * Add the meta box to post type
 *
 * @param [type] $post
 * @return void
 */
function addReferencesMetaboxToPost($post)
{
    add_meta_box( 
        'post-references',
        __( 'Post references' ),
        'referencesMetabox',
        'post',
        'normal',
        'default'
    );
}

/**
 * Render the html markup for the meta box
 *
 * @return string Html markup for rendering of the meta box 
 */
function referencesMetabox()
{
    echo '<div></div>';
}

/**
 * Hook to enqueue the admin area scripts
 */
add_action( 'admin_enqueue_scripts', 'adminRefMetaboxScripts' );

/**
 * Enqueue js scripts on edit post screen
 *
 * @param string $hook
 * @return void
 */
function adminRefMetaboxScripts($hook) {
    global $post_id;

    if ( 'post.php' != $hook ) {
        return;
    }

    /* Enqueue react.js development version */
    wp_enqueue_script('react-js', 'https://unpkg.com/react@15/dist/react.js', [], null, true);

    /* Enqueue react-dom.js development version */
    wp_enqueue_script('react-dom-js', 'https://unpkg.com/react-dom@15/dist/react-dom.js', [], null, true);

    /* Register plugin script ref-metabox.js */
    wp_register_script('ref-metabox-js', plugins_url('/ref-react-metabox/assets/js/ref-metabox.js'), ['jquery', 'react-js', 'react-dom-js'], null, true);

    /* Pass authentication array to plugin js script */
    wp_localize_script('ref-metabox-js', 'wpApiSettings', [
        'root'  => esc_url_raw(rest_url()),
        'nonce' => wp_create_nonce('wp_rest')
    ]);

    wp_localize_script('ref-metabox-js', 'postId', ['val' => $post_id]);

    /* Enqueue plugin script */
	wp_enqueue_script( 'ref-metabox-js' );
}