angular.module('starter.services', [])

    .factory('Chats', function () {
        // Might use a resource here that returns a JSON array

        // Some fake testing data
        var chats = [{
            id: 0,
            name: 'Ben Sparrow',
            lastText: 'You on your way?',
            face: 'https://pbs.twimg.com/profile_images/514549811765211136/9SgAuHeY.png'
        }, {
            id: 1,
            name: 'Max Lynx',
            lastText: 'Hey, it\'s me',
            face: 'https://avatars3.githubusercontent.com/u/11214?v=3&s=460'
        }, {
            id: 2,
            name: 'Adam Bradleyson',
            lastText: 'I should buy a boat',
            face: 'https://pbs.twimg.com/profile_images/479090794058379264/84TKj_qa.jpeg'
        }, {
            id: 3,
            name: 'Perry Governor',
            lastText: 'Look at my mukluks!',
            face: 'https://pbs.twimg.com/profile_images/598205061232103424/3j5HUXMY.png'
        }, {
            id: 4,
            name: 'Mike Harrington',
            lastText: 'This is wicked good ice cream.',
            face: 'https://pbs.twimg.com/profile_images/578237281384841216/R3ae1n61.png'
        }];

        return {
            all: function () {
                return chats;
            },
            remove: function (chat) {
                chats.splice(chats.indexOf(chat), 1);
            },
            get: function (chatId) {
                for (var i = 0; i < chats.length; i++) {
                    if (chats[i].id === parseInt(chatId)) {
                        return chats[i];
                    }
                }
                return null;
            }
        };
    }).factory('StreamService', function($ionicPlatform, serviceUrl){
        var getStream = function(dvrId, success, error){
            $.ajax({
                url: serviceUrl + 'dvrStream/startStream',
                data: { dvrId: dvrId },
                type: 'POST',
                success: success,
                error: error
            });
        };


        var disconnectStream = function(streamId, success, error){
            $.ajax({
                url: serviceUrl + 'dvrStream/disconnectStream',
                type: 'POST',
                async: false,
                data: { 'streamId': streamId},
                success: success,
                error: error
            });

        };

        var freeStream = function(scope){
            scope.$on('$destroy', function(){
                scope.disconectStream();
                deregisterBack();

            });

            $ionicPlatform.onHardwareBackButton(function(){
                scope.disconectStream();
            });

            $ionicPlatform.on('pause', function(){
                scope.disconectStream();
            });

            var deregisterBack = $ionicPlatform.registerBackButtonAction(function(){
                scope.disconectStream();
            }, 501);

        };

        return {
            getStream: getStream,
            disconnectStream: disconnectStream,
            freeStream: freeStream
        };
    })

    .factory('Buses', function($http, serviceUrl) {
        function all() {
            // https://psl.vmaxlive.net/rest/dvrStream/vehicleList?vehicleType=&groupId=&vehicleId=&after=0&filtersDisplayed=false&timeStampNoCache=1439407459685
            return $http.get(serviceUrl + 'stream/vehicleList?vehicleType=&groupId=&vehicleId=&after=0&filtersDisplayed=false&timeStampNoCache=' + (new Date()).getTime());
        }

        return {
            all: all
        };
    });
