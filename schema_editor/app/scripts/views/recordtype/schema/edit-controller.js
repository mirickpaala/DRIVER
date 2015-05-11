(function () {
    'use strict';

    /* ngInject */
    function RTSchemaEditController($log, $scope, EditorFields) {
        var ctl = this;
        var editor = null;
        initialize();

        function initialize() {

            ctl.editor = {
                id: 'test-id',
                options: {
                    schema: EditorFields.Schema,
                    disable_edit_json: true,
                    disable_properties: true,
                    disable_array_add: true,
                    theme: 'bootstrap3'
                }
            };
            ctl.onEditorAddClicked = onEditorAddClicked;

            $scope.$on('json-editor:ready', onEditorReady);
        }

        function onEditorReady(event, newEditor) {
            editor = newEditor;
        }

        function onEditorAddClicked() {
            // TODO: Add new stubbed object to list
            $log.debug('RTSchemaEditController.onEditorAddClicked');
            var fields = editor.getValue();
            fields.push(EditorFields.createTextField());
            editor.setValue(fields);
        }
    }

    angular.module('ase.views.recordtype')
    .controller('RTSchemaEditController', RTSchemaEditController);
})();