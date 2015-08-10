/**
 * Created by wcastro-psl on 8/6/15.
 */
angular.module('starter.filters', [])
    .filter('trustUrl', function ($sce) {
        return function(url) {
            return $sce.trustAsResourceUrl(url);
        };
    });