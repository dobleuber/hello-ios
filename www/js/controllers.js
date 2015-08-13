angular.module('starter.controllers', [])

    .controller('BusFootageCtrl', function ($scope, $stateParams, $timeout, $ionicPlatform, StreamService) {
        var streamId;
        $scope.isConnected = false;
        var videoTimeout;
        var dvrId = $stateParams.dvrId || 8;

        $scope.getStream = function(){
            StreamService.getStream(dvrId, function (data) {
                console.log(data);
                console.log(data.html5StreamUrl);

                if(data.error) return;

                $timeout(function(){
                    $scope.isConnected = true;
                }, 100);

                streamId = data.streamId;
                videoTimeout = $timeout(function(){
                    $('#myVideo').attr('src',data.html5StreamUrl);
                }, 60000);

            },function (xhr, type) {
                alert('Ajax error! ' + type);
            });
        };

        $scope.disconectStream = function(){
            if($scope.isConnected) {
                $timeout.cancel(videoTimeout);
                StreamService.disconnectStream(streamId,
                    function (data) {
                        console.log(data);
                        $timeout(function(){
                            $scope.isConnected = false;
                        }, 100);
                        $('#myVideo').removeAttr('src');
                    },
                    function (xhr, type) {
                        alert('Ajax error! ' + type);
                    }
                );
            }
        };

        StreamService.freeStream($scope);

        $timeout(function(){
            $scope.getStream();
        }, 5000);



    })

    .controller('ChatsCtrl', function ($scope, Chats, Buses) {
        // With the new view caching in Ionic, Controllers are only called
        // when they are recreated or on app start, instead of every page change.
        // To listen for when this page is active (for example, to refresh data),
        // listen for the $ionicView.enter event:
        //
        //$scope.$on('$ionicView.enter', function(e) {
        //});

        $scope.chats = Chats.all();
        $scope.remove = function (chat) {
            Chats.remove(chat);
        };

        Buses.all().then(function(res){
            $scope.buses = res.data;
            console.log(res.data);
        })
    })

    .controller('ChatDetailCtrl', function ($scope, $stateParams, Chats) {
        $scope.chat = Chats.get($stateParams.chatId);
    })

    .controller('AccountCtrl', function ($scope) {
        $scope.settings = {
            enableFriends: true
        };
    });
