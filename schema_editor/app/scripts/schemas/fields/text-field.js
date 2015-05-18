(function() {
    'use strict';

    /* ngInject */
    function TextField() {

        var module = {
            editFormSchema: editFormSchema,
            toSchema: toSchema,
            fromSchema: fromSchema
        };
        return module;
    }

    angular.module('ase.schemas.fields')
    .factory('TextField', TextField);

})();
