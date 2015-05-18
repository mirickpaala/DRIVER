-(function() {
    'use strict';

    /* ngInject */
    function FormSerializer() {

        var module = {
            toSchema: toSchema
        };
        return module;


        /** Serialize json editor form data to a json schema */
        function toSchema(formData) {

        }
    }

    angular.module('ase.schemas')
    .factory('EditFormSerializer', FormSerializer);

})();
