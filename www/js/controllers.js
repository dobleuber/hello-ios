angular.module('starter.controllers', [])

.controller('DashCtrl', function($scope, $http) {
    var fd = new FormData();
    fd.append( 'dvrId', 42 );
    $http(
        {
          'method': 'POST',
          'url': 'https://stg2.vmaxlive.net/rest/dvrStream/startStream',
          'data': fd,
          'headers': {'Content-Type':'application/x-www-form-urlencoded'}
        }
        )
        .then(function(res){
          console.dir(res);
          $scope.streamUrl = res.data.html5StreamUrl;
        }, function(error) {
          console.dir(error);
        });

    })

.controller('ChatsCtrl', function($scope, Chats) {
  // With the new view caching in Ionic, Controllers are only called
  // when they are recreated or on app start, instead of every page change.
  // To listen for when this page is active (for example, to refresh data),
  // listen for the $ionicView.enter event:
  //
  //$scope.$on('$ionicView.enter', function(e) {
  //});

  $scope.chats = Chats.all();
  $scope.remove = function(chat) {
    Chats.remove(chat);
  };
})

.controller('ChatDetailCtrl', function($scope, $stateParams, Chats) {
  $scope.chat = Chats.get($stateParams.chatId);
})

.controller('AccountCtrl', function($scope) {
  $scope.settings = {
    enableFriends: true
  };
});
