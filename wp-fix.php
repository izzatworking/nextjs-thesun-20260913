// =====================================================
// 1. Daftarkan argumen 'isTopStories' ke dalam GraphQL
// =====================================================
add_action( 'graphql_register_types', function() {
    register_graphql_field( 'RootQueryToPostConnectionWhereArgs', 'isTopStories', [
        'type'        => 'Boolean',
        'description' => 'Filter posts to only show top stories from GA4',
    ]);
});

// =====================================================
// 2. Hubungkan argumen dengan WP_Query
// =====================================================
add_filter( 'graphql_post_object_connection_query_args', function( $query_args, $source, $args, $context, $info ) {
    if ( isset( $args['where']['isTopStories'] ) && true === $args['where']['isTopStories'] ) {
        $top_ids = get_option( 'ga4_top_stories_ids', [] );

        if ( ! empty( $top_ids ) && is_array( $top_ids ) ) {
            $query_args['post__in'] = $top_ids;
            $query_args['orderby']  = 'post__in';
            $query_args['post_type'] = 'post';
            $query_args['post_status'] = 'publish';
        } else {
            $query_args['post__in'] = [0]; // return empty
        }
    }

    return $query_args;
}, 10, 5 );

// =====================================================
// 3. GA4 Cron: fetch top 20 posts setiap 1 jam
// =====================================================
if ( ! wp_next_scheduled( 'fetch_top_stories_from_ga4_hook' ) ) {
    wp_schedule_event( time(), 'hourly', 'fetch_top_stories_from_ga4_hook' );
}

add_action( 'fetch_top_stories_from_ga4_hook', 'fetch_top_stories_from_ga4' );

function fetch_top_stories_from_ga4() {
    if ( ! class_exists( 'Google\\Analytics\\Data\\V1beta\\BetaAnalyticsDataClient' ) ) {
        require_once __DIR__ . '/vendor/autoload.php';
    }

    $property_id     = 'LETAK_PROPERTY_ID_GA4_KAU_KAT_SINI';
    $credentials_json = __DIR__ . '/fail-credentials-kau.json';

    if ( ! file_exists( $credentials_json ) ) {
        error_log( 'GA4: Credentials file not found at ' . $credentials_json );
        return;
    }

    try {
        $client = new BetaAnalyticsDataClient([
            'credentials' => $credentials_json,
        ]);

        $response = $client->runReport([
            'property'   => 'properties/' . $property_id,
            'dateRanges' => [ new DateRange([ 'start_date' => '7daysAgo', 'end_date' => 'today' ]) ],
            'dimensions' => [ new Dimension([ 'name' => 'pagePath' ]) ],
            'metrics'    => [ new Metric([ 'name' => 'screenPageViews' ]) ],
            'orderBys'   => [ new \Google\Analytics\Data\V1beta\OrderBy([
                'metric' => new \Google\Analytics\Data\V1beta\OrderBy\MetricOrderBy([
                    'metric_name' => 'screenPageViews',
                ]),
                'desc' => true,
            ])],
            'limit'      => 50,
        ]);

        $top_post_ids = [];

        foreach ( $response->getRows() as $row ) {
            $path = $row->getDimensionValues()[0]->getValue();
            $post_id = url_to_postid( home_url( $path ) );

            if ( $post_id && get_post_type( $post_id ) === 'post' && get_post_status( $post_id ) === 'publish' ) {
                $top_post_ids[] = $post_id;
            }

            if ( count( $top_post_ids ) >= 20 ) {
                break;
            }
        }

        if ( ! empty( $top_post_ids ) ) {
            update_option( 'ga4_top_stories_ids', $top_post_ids );
        } else {
            delete_option( 'ga4_top_stories_ids' );
        }

    } catch ( Exception $e ) {
        error_log( 'GA4 API Error: ' . $e->getMessage() );
    }
}
