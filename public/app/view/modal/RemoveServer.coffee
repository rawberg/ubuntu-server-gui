define([
    'jquery'
    'underscore'
    'backbone_marionette'
    'app'
    'text!view/modal/tpl/remove-server.html'
    'bootstrap_modal'
    'bootstrap_transition'
],
($, _, BackboneMarionette, App, removeServerTpl) ->
    
    ###*
     * @class RemoveServerModal
     * Add server modal dialog.
     * @extends BackboneMarionette.ItemView
     ###
    class RemoveServerModal extends BackboneMarionette.ItemView

        ###*
         * @constructor
         * Creates a new RemoveServerModal instance.
         * @param {Object} [options] config options for BackboneMarionette.ItemView.
         ###
        constructor: (options={}) ->
            throw new Error('server must be provided') unless options.server?

            @App = App
            @model = options.model
            
            @template = _.template(removeServerTpl)
            @tagName = 'div'

            @id = 'modal_remove_server'
            @className = 'modal hide fade'
            
            @events =
                'click #remove_server_btn': 'onConfirmation'

            super
            return

        hideModal: () ->
            $('#modal_remove_server').modal('hide')
            return

        onConfirmation: (eventObj) ->
            eventObj.stopPropagation()
            eventObj.preventDefault()
            eventObj.returnValue = false
            
            @model.destroy()
            @hideModal()
            return
           

        onShow: () ->
            $('#modal_remove_server').modal({
                show: true
            }).on('hidden', =>
                @close()
                return
            ).on('shown', =>
                return
            )
            return





)