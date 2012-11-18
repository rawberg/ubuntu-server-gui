define([
    'jquery'
    'underscore'
    'App'
    'backbone_modelbinder'
    'models/Server'
    'collections/ServerList'
    'views/BaseForm'
    'text!views/modal/templates/add-edit-server.html'
    'bootstrap_modal'
    'bootstrap_transition'
],
($, _, App, BackboneModelBinder, Server, ServerList, BaseForm, addEditServerTpl) ->

    ###*
     * @class AddEditServerModal
     * Add server modal dialog.
     * @extends BackboneMarionette.ItemView
     ###
    class AddServerModal extends BaseForm

        ###*
         * @constructor
         * Creates a new AddServerModal instance.
         * @param {Object} [options] config options for BackboneMarionette.ItemView.
         ###
        constructor: (options={}) ->
            @App = App

            @model = options.model ? new Server()
            @modelBinder  = new BackboneModelBinder()

            @tagName = 'div'
            @id = 'modal_add_server'
            @className = 'modal hide fade'

            @template = _.template(addEditServerTpl)
            @templateHelpers =
                titleOperation: options.operationLabel ? 'Add'

            @events =
                'click #add_server_btn': 'onSubmit',
                'keyup input': 'onInputKeyup'

            super
            return

        hideModal: () ->
            @modelBinder.unbind()
            $('#modal_add_server').modal('hide')
            @clearForm()
            @enableForm()
            return

        onSubmit: (eventObj) ->
            eventObj.stopPropagation()
            eventObj.preventDefault()
            eventObj.returnValue = false

            @hideError()
            @disableForm()

            @model.save()
            @App.vent.trigger('server:new-server-added', {server: @model})
            @hideModal()

            return

        onInputKeyup: (eventObj) ->
            eventObj.stopPropagation()
            eventObj.preventDefault()
            eventObj.returnValue = false

            if (eventObj.keyCode == 13)
                @onSubmit(eventObj)

            return false

        onAddServerError: ->
            @showError(@model.get('errorMsg'))
            return

        onShow: () ->
            $('#modal_add_server').modal({
                show: true
            }).on('hidden', =>
                @clearForm()
                @close()
                return
            ).on('shown', =>
                @modelBinder.bind(@model, @el)
                $('input[type=text]:first').focus()
                return
            )
            return

        showError: (msg) ->
            @enableForm()
            $('#error_alert').text(msg).show()
            return




)