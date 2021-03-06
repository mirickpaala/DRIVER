(function () {
    'use strict';

    /* ngInject */
    function RTSchemaEditController($log, $stateParams, BuilderSchemas, RecordTypes,
                                    RecordSchemas, Schemas, Notifications) {
        var ctl = this;
        var editorData = null;
        initialize();

        function initialize() {
            ctl.schemaKey = $stateParams.schema;
            ctl.onDataChange = onDataChange;
            ctl.onSaveClicked = onSaveClicked;
            loadRecordType()
                .then(loadRecordSchema)
                .then(loadRelatedBuilderSchema)
                .then(onSchemaReady);
        }

        // Helper for loading the record type
        function loadRecordType () {
            return RecordTypes.get({ id: $stateParams.uuid })
                .$promise.then(function(recordType) {
                    ctl.recordType = recordType;
                });
        }

        // Helper for loading the record schema
        function loadRecordSchema() {
            /* jshint camelcase: false */
            var currentSchemaId = ctl.recordType.current_schema;
            /* jshint camelcase: true */

            return RecordSchemas.get({ id: currentSchemaId })
                .$promise.then(function(recordSchema) {
                    ctl.recordSchema = recordSchema;
                });
        }

        // Helper for loading the related builder schema
        function loadRelatedBuilderSchema () {
            return BuilderSchemas.get({ name: 'related' })
                .$promise.then(function(relatedBuilderSchema) {
                    ctl.relatedBuilderSchema = relatedBuilderSchema;
                });
        }

        // Called after all prerequesite data has been loaded
        function onSchemaReady() {
            // Need to call toJSON here in order to strip the additional angular
            // resource properties, as they don't play well with json-editor.
            var schema = ctl.relatedBuilderSchema.toJSON();

            // Populate saved properties
            // TODO: Schema deserialization here, probably
            var definition = ctl.recordSchema.schema.definitions[ctl.schemaKey];
            schema.description = definition.description;
            schema.title = definition.title;
            var initialData = Schemas.schemaFormDataFromDefinition(definition);
            $log.debug('Initializing form with startval', initialData);

            // Configure the json-editor
            ctl.editor = {
                id: 'schema-editor',
                options: {
                    /* jshint camelcase: false */
                    schema: schema,
                    disable_edit_json: true,
                    disable_properties: true,
                    disable_array_add: false,
                    theme: 'bootstrap3',
                    show_errors: 'change',
                    no_additional_properties: true,
                    startval: initialData
                    /* jshint camelcase: true */
                },
                errors: []
            };
        }

        function onDataChange(newData, validationErrors) {
            $log.debug('Schema Entry Form data:', newData, 'Errors:', validationErrors);
            editorData = newData;
            // Perform custom validation
            var customErrors = Schemas.validateSchemaFormData(editorData);
            ctl.editor.errors = validationErrors.concat(customErrors);
            // TODO: Fix Save button disablement
            // Multiple developers have now attempted to fix the save button disablement, and
            // it seems to be a very strange issue with scope. Right now, ng-disabled is being
            // set on the button to "rtSchemaEdit.editor.errors.length > 0". This should work,
            // but doesn't for some reason and needs further investigation. Multiple other fixes
            // were attempted, including using a separate variable/object for storing validation,
            // but in all cases the changes are not reflected in the HTML.
        }

        function onSaveClicked() {
            // First we confirm that the form data is valid; then we know we have something which
            // we can transform into a Data Form Schema.
            if (ctl.editor.errors.length > 0) {
                Notifications.show({
                    displayClass: 'alert-danger',
                    text: 'Saving failed: invalid data schema definition'
                });
                $log.debug('Validation errors on save:', ctl.editor.errors);
                return;
            }
            // All is well; serialize the form data into a JSON-Schema snippet.
            var dataToSave = Schemas.definitionFromSchemaFormData(editorData);
            $log.debug('Serialized schema to save:', dataToSave);

            // Extend the definitions with the new data. Need to extend rather than
            // update in order to preserve the other attributes (title/etc.)
            var definitions = ctl.recordSchema.schema.definitions;
            definitions[ctl.schemaKey] = angular.extend(definitions[ctl.schemaKey], dataToSave);

            // Save the updated schema
            RecordSchemas.create({
                /* jshint camelcase:false */
                record_type: ctl.recordType.uuid,
                schema: ctl.recordSchema.schema
                /* jshint camelcase:true */
            }).$promise
                .then(function() {
                    Notifications.show({
                        text: 'Schema saved successfully',
                        displayClass: 'alert-success',
                        timeout: 3000
                    });
                })
                .catch(function(error) {
                    $log.debug('Error saving schema:', error);
                    Notifications.show({
                        text: 'Error saving schema: ' + error.statusText,
                        displayClass: 'alert-danger',
                        timeout: 3000
                    });
                });
        }
    }

    angular.module('ase.views.recordtype')
    .controller('RTSchemaEditController', RTSchemaEditController);
})();
