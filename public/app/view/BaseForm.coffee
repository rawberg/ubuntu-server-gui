define([
    'jquery'
    'underscore'
    'backbone'
    'backbone_marionette'
],

($, _, Backbone, BackboneMarionette) ->
    class BaseForm extends BackboneMarionette.ItemView

        constructor: (options={}) ->
            super

        clearForm: ->
            @.$(':input').val('')
            return

        disableForm: ->
             @.$(':input').attr('disabled', true)
             return

        enableForm: ->
            @.$(':input').attr('disabled', false)
            return

        hideError: ->
            $('#error_alert').hide()
            return
)