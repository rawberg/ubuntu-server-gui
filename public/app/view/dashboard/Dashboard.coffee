define([
    'jquery'
    'underscore'
    'backbone_marionette'
    'model/PlatformInfo'
    'collection/NetServices'
    'view/dashboard/LeftSidebar'
    'view/dashboard/UtilizationStats'
    'view/dashboard/PlatformStats'
    'view/dashboard/RunningServices'
    'text!view/dashboard/tpl/layout.html'
    
],(
    $
    _
    BackboneMarionette
    PlatformInfoModel
    NetServices
    LeftSidebar
    UtilizationStats
    PlatformStats
    RunningServices
    dashboardLayoutTpl) ->

    ###*
     * @class Dashboard
     * Displays dashboard overview for the currently selected
     * server.
     * @extends BackboneMarionette.Layout
     ###    
    class Dashboard extends BackboneMarionette.Layout

        ###*
         * @constructor
         * Creates a new Dashboard instance.
         * @param {Object} [options] config options for BackboneMarionette.Layout.         
         * @return {Object} Dashboard instance.
         ###        
        constructor: (options = {}) ->
            @template = _.template(dashboardLayoutTpl)
            @tagName = 'div'
            @id = 'dashboard_layout'

            @regions =
                sidebarLeftRegion: '#sidebar_left'
                performanceRegion: '#dash_performance'
                servicesRegion: '#dash_services'
                platformRegion: '#dash_platform'

            # calling this here to make sure our regions
            # get setup and are available for use below
            super(options)
            
            @platformInfo = new PlatformInfoModel();
            @netServices = new NetServices()

            @netServices.on('reset', =>
                @servicesRegion.show(new RunningServices({collection: @netServices}))
                return
            @)
            return

        ###*
         * @method @private
         * Shows sub views that make up the Dashboard upon render.
         * @return {Object} Dashboard instance.
         ###
        onRender: ->
            @netServices.fetch()
            
            @performanceRegion.show(new UtilizationStats())
            @platformRegion.show(new PlatformStats({model: @platformInfo}));
            return

        onShow: ->

            @sidebarLeftRegion.show(new LeftSidebar())
            return

)