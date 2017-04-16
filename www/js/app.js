(function () {
    var app = angular.module('fishNotes', ['ionic', 'fishNotes.services', 'fishNotes.controllers']);

    app.config(function ($stateProvider, $urlRouterProvider, $compileProvider) {
        $compileProvider.imgSrcSanitizationWhitelist(/^\s(https|file|blob|chrome-extension):|data:image\/|http:\/\/|blob:http:\//);
        //$compileProvider.aHrefSanitizationWhitelist(/^\s*(https?|ftp|mailto|chrome-extension):/);
            $stateProvider

                .state('note-index', {
                    cache: false,
                    url: '/notes',
                    templateUrl: 'templates/note-index.html',
                    controller: 'NoteIndexCtrl'
                })

                .state('note-detail', {
                    url: '/note/:noteId',
                    templateUrl: 'templates/note-detail.html',
                    controller: 'NoteDetailCtrl'
                })

                .state('create', {
                    url: '/create',
                    templateUrl: 'templates/create.html'
                    //controller: 'CreateNote',
                    //controllerAs: 'CrNt'
                })

                .state('note-edit', {
                    url: '/edit/:noteId',
                    templateUrl: 'templates/edit.html'
                    //controller: 'EditCtrl'
                })

                .state('note-delete', {
                    url: '/delete/:noteId',
                    controller: 'DeleteCtrl'
                })
            $urlRouterProvider.otherwise('/notes');
    });
    app.run(function ($ionicPlatform) {
        $ionicPlatform.ready(function () {
            if (cordova.platformId === "ios" && window.cordova && window.cordova.plugins.Keyboard) {
                cordova.plugins.Keyboard.hideKeyboardAccessoryBar(true);
                cordova.plugins.Keyboard.disableScroll(true);
            }
        });
    });

})();