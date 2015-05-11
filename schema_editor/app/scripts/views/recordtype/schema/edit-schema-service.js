(function () {
    'use strict';

    var FieldTypes = [
        'text',
        'select',
        'image',
        'relationship'
    ];

    var Field = {
        id: 'field',
        title: 'Field',
        type: 'object',
        headerTemplate: '{{ title }}',
        properties: {
            fieldTitle: {
                type: 'string',
                title: 'Field Title',
            },
            fieldType: {
                type: 'string',
                title: 'Field Type',
                enum: FieldTypes,
                options: {
                    enum_titles: [
                        'Text Field',
                        'Select List',
                        'Image Uploader',
                        'Relationship'
                    ]
                }
            },
            isRequired: {
                type: 'boolean',
                format: 'checkbox',
                title: 'Required'
            },
            isSearchable: {
                type: 'boolean',
                format: 'checkbox',
                title: 'Filterable/Searchable'
            }
        },
        required: ['fieldTitle', 'fieldType', 'isRequired', 'isSearchable']
    };


    var TextField = angular.extend({}, Field, {
        id: 'textfield',
        title: 'Text Field',
        headerTemplate: '{{self.fieldTitle}} :: {{ title }}:{{ self.textOptions }}',
        properties: angular.extend({}, Field.properties, {
            textOptions: {
                type: 'string',
                title: 'Text Options',
                enum: [
                    'text',
                    'color',
                    'tel',
                    'datetime',
                    'url'
                ],
                options: {
                    enum_titles: [
                        'Single line text',
                        'HTML Color',
                        'Telephone number',
                        'Date / Time',
                        'Website URL'
                    ]
                }
            }
        })
    });

    var SelectList = angular.extend({}, Field, {
        id: 'selectlist',
        title: 'Select List',
        headerTemplate: '{{self.fieldTitle}} :: {{ title }}:{{ self.displayType }}',
        properties: angular.extend({}, Field.properties, {
            displayType: {
                type: 'string',
                enum: [
                    'select',
                    'checkbox'
                ]
            }
        })
    });

    var Schema = {
        type: 'array',
        title: 'Fields',
        items: TextField,
        options: {
            disable_collapse: true,
            disable_array_add: true
        }
    };

    function EditorFields() {
        var module = {
            Schema: Schema,
            createTextField: createTextField,
            createSelectList: createSelectList
        };
        return module;

        function createTextField() {
            return {
                fieldType: 'text',
                isRequired: false,
                isSearchable: false,
                textOptions: 'text'
            };
        }

        function createSelectList() {
            return {
                fieldType: 'select',
                isRequired: false,
                isSearchable: false,
                displayType: 'checkbox'
            };
        }
    }

    angular.module('ase.views.recordtype')
    .service('EditorFields', EditorFields);

})();