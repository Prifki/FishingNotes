(function () {
    var app = angular.module('fishNotes.services', []);
        app.factory('NoteService', function ($q) {
            return {
                findAll: function (notes) {
                    var deferred = $q.defer();
                    deferred.resolve(notes);
                    return deferred.promise;
                },

                findByName: function (searchKey, notes) {
                    var deferred = $q.defer();
                    var results = notes.filter(function (element) {
                        var fullName = element.fish + " " + element.weight;
                        return fullName.toLowerCase().indexOf(searchKey.toLowerCase()) > -1;
                    });
                    deferred.resolve(results);
                    return deferred.promise;
                }

            }
        });
})();