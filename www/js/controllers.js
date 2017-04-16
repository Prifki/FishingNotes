(function () {
    var app = angular.module('fishNotes.controllers', []);

    app.controller('DeleteCtrl', function ($state, $scope, $stateParams) {
        localStorage.removeItem($stateParams.noteId);
        console.log($stateParams.noteId + "Deleted");
        $state.go('note-index', { reload: true });
    });


    app.controller('CreateNote', function ($state, $scope, $http) {
        //Geoposition
            if (!navigator.geolocation) {
                document.getElementById('geoPos').value = "Is not supported";
            }
            function success(position) {
                var latitude = position.coords.latitude;
                var longitude = position.coords.longitude;
                var imgsrc = "http://maps.googleapis.com/maps/api/staticmap?center=" + latitude + "," + longitude + "&zoom=13&size=300x300&sensor=false";
                console.log(latitude + ' ' + longitude + ' ' + imgsrc);
                document.getElementById('geoPos').value = 'lat: ' + latitude + ' long: ' + longitude;
                $http({
                    method: 'GET', url: 'http://api.openweathermap.org/data/2.5/weather?lat=' + latitude + '&lon=' + longitude + '&appid=f0eaea844f0d5ca39a71f9353f3276ab'
                }).then(function (response) {
                    console.log(response);
                }, function (response) {
                    console.log(response);
                });
            };
            function error() {
                console.log("Unable to retrieve your location");
                document.getElementById('geoPos').value = "Unable to get";
            };
            navigator.geolocation.getCurrentPosition(success, error);
        //
        if ((localStorage.length - 1) == 0)
            var noteId = 1;
        else
            var noteId = JSON.parse(localStorage.getItem(localStorage.key(localStorage.length - 2))).id + 1;
        console.log(noteId);
        var catchTime = function() {
            if (new Date().getMonth() < 10) var M = '0'; else var M = '';
            if (new Date().getDate() < 10) var D = '0'; else var D = '';
            if (new Date().getHours() < 10) var H = '0'; else var H = '';
            if (new Date().getMinutes() < 10) var m = '0'; else var m = '';
            var date = new Date().getFullYear() + '-' + M + new Date().getMonth() + '-'
            + D + new Date().getDate() + 'T' + H + new Date().getHours() + ':' + m + new Date().getMinutes();
            return date;
        };
        $scope.setTime = catchTime();
        this.addNote = function (note) {
            note.pic = document.getElementById('picUrl').value;
            note.geoposition = document.getElementById('geoPos').value;
            if (note.date == null) note.date = catchTime();
            if (note.details == null) note.details = false;
            if (note.bait == null) note.bait = false;
            if (note.method == null) note.method = false;
            if (note.geoposition == null) note.geoposition = false;
            if (note.weather == null) note.weather = false;
            if (note.pic == '') note.pic = "img/nophoto.png";
            var sign = {
                'id': noteId, 'fish': note.fish, 'weight': note.weight, 'weightType': note.weightType, 'pic': note.pic, 'place': note.place,
                'date': note.date, 'geoposition': note.geoposition, 'weather': note.weather, 'method': note.method,
                'bait': note.bait, 'length': note.length, 'lengthType': note.lengthType, 'details': note.details
            };
            localStorage.setItem(noteId, JSON.stringify(sign));
            console.log("PARSED:" + JSON.parse(localStorage.getItem(noteId)));
            //console.log("CREATED:" + JSON.stringify(localStorage));
                $state.go('note-index', { reload: true });
        };

    });

    app.controller('EditCtrl', function ($state, $scope, $stateParams) {
        console.log($stateParams.noteId);
        $scope.note = JSON.parse(localStorage.getItem($stateParams.noteId));
        $scope.weigType = $scope.note.weightType;
        $scope.lengType = $scope.note.lengthType;
        //console.log(JSON.stringify($scope.note));
        //console.log(JSON.stringify(localStorage.getItem($stateParams.noteId + 'fish')));
        this.editNote = function (note) {
            if (note.date == null) note.date = catchTime();
            if (note.details == null) note.details = false;
            if (note.bait == null) note.bait = false;
            if (note.method == null) note.method = false;
            note.pic = document.getElementById('picUrl').value;
            console.log("editNote Called");
            var sign = {
                'id': $stateParams.noteId * 1, 'fish': note.fish, 'weight': note.weight, 'weightType': note.weightType, 'pic': note.pic, 'place': note.place,
                'date': note.date, 'geoposition': note.geoposition, 'weather': note.weather, 'method': note.method,
                'bait': note.bait, 'length': note.length, 'lengthType': note.lengthType, 'details': note.details
            };
            localStorage.setItem($stateParams.noteId, JSON.stringify(sign));
            console.log("Edited:" + JSON.stringify(localStorage));
            $state.go('note-index', { reload: true });
        };

    });

    app.controller('NoteIndexCtrl', function ($scope, $state, NoteService) {
        var notes = [];
        for (var i = 0; i < localStorage.length - 1; ++i) {
                var note = JSON.parse(localStorage.getItem(localStorage.key(i)));
                console.log(note);
                notes.push(note);
                console.log("Notes:\n" + JSON.stringify(notes));
        }
        $scope.searchKey = "";
        $scope.clearSearch = function () {
            $scope.searchKey = "";
            findAllNotes();
        }
        $scope.search = function () {
            NoteService.findByName($scope.searchKey, notes).then(function (notes) {
                $scope.notes = notes;
            });
        }
        findAllNotes = function () {
            NoteService.findAll(notes).then(function (notes) {
                $scope.notes = notes;
            });
        }
        findAllNotes();
    });

    app.controller('NoteDetailCtrl', function ($scope, $stateParams, $q) {
        findById = function () {
            //console.log(JSON.stringify($stateParams) + '\n' + notes);
            var deferred = $q.defer();
            var note = JSON.parse(localStorage.getItem($stateParams.noteId));
            console.log(note);
            deferred.resolve(note);
            return deferred.promise;
        };
        findById().then(function (note) {
            $scope.note = note;
        });
    });
})();