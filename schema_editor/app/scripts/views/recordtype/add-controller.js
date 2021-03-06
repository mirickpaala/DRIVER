(function () {
    'use strict';

    /* ngInject */
    function RTAddController($log, $scope, $state, RecordSchemas, RecordTypes, Schemas) {
        var ctl = this;
        initialize();

        function initialize() {
            ctl.recordType = {};
            ctl.submitForm = submitForm;
        }

        /*
         * Creates the record type and switches to the list view on success
         */
        function submitForm() {
            RecordTypes.create(ctl.recordType, onRecordTypeCreateSuccess, function(error) {
                $log.debug('Error while adding recordType: ', error);
            });
        }

        /**
         * Create blank associated record schema v1 on record type create success
         * @return {[type]} [description]
         */
        function onRecordTypeCreateSuccess(recordType) {
            $scope.$emit('ase.recordtypes.changed');

            // Automatically add 'Details' related content type to all record types
            var schema = Schemas.JsonObject();
            schema = Schemas.addVersion4Declaration(schema); // Make root object a "real" JSON-Schema
            var definition = Schemas.JsonObject();
            definition.description = 'Details for ' + recordType.label;
            definition.multiple = false;
            /* jshint camelcase: false */
            definition.title = definition.plural_title = recordType.label + ' Details';
            /* jshint camelcase: true */
            // TODO: $refs should be stored as JSON Pointers, which use URI encoding for certain
            // characters, such as spaces. However, json-editor currently does not appear to decode
            // the URI encoding for JSON pointers properly. Putting in spaces directly works with
            // json-editor, but is technically not a valid JSON Pointer. If this causes problems
            // with other libraries, we may need to find a fix.
            schema.definitions[definition.title] = definition;
            schema.properties[definition.title] = {
                $ref: '#/definitions/' + Schemas.encodeJSONPointer(definition.title)
            };

            RecordSchemas.create({
                /* jshint camelcase: false */
                record_type: recordType.uuid,
                schema: schema
                /* jshint camelcase: true */
            }).$promise.then(function () {
                $state.go('rt.list');
            }, function (error) {
                $log.debug('Error while creating recordschema:', error);
            });
        }
    }

    angular.module('ase.views.recordtype')
    .controller('RTAddController', RTAddController);
})();
