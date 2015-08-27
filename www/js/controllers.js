angular.module('starter.controllers', [])
    .controller('BusFootageCtrl', function ($scope, $stateParams, $timeout, $ionicPlatform, $ionicLoading, StreamService, SocketService, serviceUrl) {
        var streamId;
        $scope.isConnected = false;
        $scope.hasControls = false;
        var videoTimeout;
        var dvrId = $stateParams.dvrId;
        var videoTag = $('#myVideo');
        var html5Stream;
        var retry = 3;

        $scope.getStream = function(){
            $ionicLoading.show({
                template: '<ion-spinner></ion-spinner>'
            });

            StreamService.getStream(dvrId, function (data) {

                console.log(data);
                console.log(data.html5StreamUrl);

                if(data.error) {
                    $ionicLoading.hide();
                    return;
                }


                $timeout(function(){
                    $scope.isConnected = true;
                }, 100);

                streamId = data.streamId;
                videoTimeout = $timeout(function(){
                    html5Stream =data.html5StreamUrl;
                    $scope.channels = data.channels;
                    videoTag.on('stalled', function(){
                        streamingError('stalled');
                    });
                    videoTag.on('error', function(){
                        streamingError('error');
                    });
                    loadStream();
                }, 10000);

                $timeout(function(){
                    $ionicLoading.hide();
                }, 10000);

                SocketService.emit('registerStream', streamId, serviceUrl +
                    "dvrStream/disconnectStream?fleetId=psl&streamId=", streamId,
                    function(response) {
                        console.log('register response', response);
                        $scope.hasControls = 'controls' === response;
                    });

            },function (xhr, type) {
                $ionicLoading.hide();
                alert('Ajax error! ' + type);
            });
        };

        function streamingError(msg) {
            videoTag.removeAttr('src');
            console.log(msg, 'retry...');
            $timeout(loadStream, 15000);
            retry --;
        }

        function loadStream() {
            videoTag.attr('src', html5Stream);
            if(!retry) {
                videoTag.off('stalled');
            }
        }

        $scope.disconectStream = function(){
            $ionicLoading.hide();
            if($scope.isConnected) {
                SocketService.emit('disconnectStream', streamId);
                console.log('disconnect stream called!');
                $scope.isConnected = false;
                videoTag.off('stalled');
            }
        };

        $scope.requestControl = function(){
          SocketService.emit('requestControls', streamId, 'mobile', function(response) {
              if(response) {
                  $scope.hasControls = true;
              } else {
                  alert("Fail to request controls.");
              }
          });
        };

        SocketService.on('disconnectStream', function(data) {
            console.log('receive disconnect', data);
            if (dvrId) {

            }
        });

        SocketService.on('giveControls', function(requester) {
            console.log('The user ' + requester +' requested the control');
            $scope.hasControls = false;
        });

        StreamService.freeStream($scope);

        $timeout(function(){
            $scope.getStream();
        }, 100);



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
