
(function () {
    'use strict';

    /* ngInject */
    function RTRelatedAddController($log, $state, $stateParams, RecordSchemas, RecordTypes, Schemas) {
        var ctl = this;
        ctl.submitForm = submitForm;
        initialize();

        function initialize() {
            ctl.definition = Schemas.JsonObject();
            RecordTypes.get({ id: $stateParams.uuid }).$promise.then(function (data) {
                ctl.recordType = data;
                /* jshint camelcase:false */
                ctl.currentSchema = RecordSchemas.get({ id: ctl.recordType.current_schema });
                /* jshint camelcase:true */
            });
        }

        function submitForm() {
            var key = ctl.definition.title;
            if (ctl.currentSchema.schema.definitions[key]) {
                $log.debug('Title', key, 'exists for current schema');
                return;
            }

            ctl.currentSchema.schema.definitions[key] = ctl.definition;

            // Use an array or object depending on the 'multiple' setting
            var ref = '#/definitions/' + Schemas.encodeJSONPointer(ctl.definition.title);
            if (ctl.definition.multiple) {
                ctl.currentSchema.schema.properties[ctl.definition.title] = {
                    type: 'array',
                    items: {
                        $ref: ref
                    }
                };
            } else {
                ctl.currentSchema.schema.properties[ctl.definition.title] = {
                    $ref: ref
                };
            }

            RecordSchemas.create({
                /* jshint camelcase:false */
                schema: ctl.currentSchema.schema,
                record_type: ctl.recordType.uuid
                /* jshint camelcase:true */
            }, function () {
                $state.go('rt.related', {uuid: ctl.recordType.uuid});
            }, function (error) {
                $log.debug('Error saving new schema: ', error);
            });
        }
    }

    /* ngInject */
    function RTRelatedAdd() {
        var module = {
            restrict: 'E',
            templateUrl: 'scripts/views/recordtype/related-add-edit-partial.html',
            controller: 'RTRelatedAddController',
            controllerAs: 'rtRelated',
            bindToController: true
        };
        return module;
    }

    angular.module('ase.views.recordtype')
    .controller('RTRelatedAddController', RTRelatedAddController)
    .directive('aseRtRelatedAdd', RTRelatedAdd);

})();
