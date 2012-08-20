require(['backbone', 'model/Session', 'app'], (Backbone, Session, App) ->
  
    describe('Session', ->

        it('should set "active" attribute to undefined and attemptedRoute to "" upon Session creation', ->
            sess = new Session({})
            expect(sess.get('active')).toBeUndefined(0)
            expect(sess.get('attemptedRoute')).toEqual('')
            return
        )
        return
    )

    describe('Session - onStatusChange', ->
        beforeEach( ->
            Backbone.history = new Backbone.History()
            Backbone.history.start({silent: true, pushState: false})
            Backbone.history.stop()
            Backbone.history.fragment = 'destination/route'
            
            App.routers.main = {navigate: jasmine.createSpy()}
            return
        )

        it('should respond to "active" attribute being set to false and set the "attemptedRoute" attribute', ->
            spyOn(Session.prototype, 'set').andCallThrough()
            spyOn(Session.prototype, 'onStatusChange').andCallThrough()
            sess = new Session()            

            sess.set('active', false)

            expect(sess.set).toHaveBeenCalledWith('active', false)
            expect(sess.onStatusChange).toHaveBeenCalled()
            expect(sess.set).toHaveBeenCalledWith('attemptedRoute', 'destination/route')
            expect(App.routers.main.navigate).toHaveBeenCalled
            expect(App.routers.main.navigate.argsForCall[0][0]).toMatch('auth/login')

            return
        )

        it('should respond to "active" attribute being set to true and navigate to a set "attemptedRoute"', ->
            spyOn(Session.prototype, 'set').andCallThrough()
            spyOn(Session.prototype, 'onStatusChange').andCallThrough()
            sess = new Session({'active': false, 'attemptedRoute': 'destination/route'})

            sess.set('active', true)

            expect(sess.set).toHaveBeenCalledWith('active', true)
            expect(sess.onStatusChange).toHaveBeenCalled()
            expect(App.routers.main.navigate).toHaveBeenCalled
            expect(App.routers.main.navigate.argsForCall[0][0]).toMatch('destination/route')
            return
        )

        it('should respond to "active" attribute being set to true and navigate to default "attemptedRoute"', ->
            spyOn(Session.prototype, 'set').andCallThrough()
            spyOn(Session.prototype, 'onStatusChange').andCallThrough()
            sess = new Session({'active': false})

            sess.set('active', true)

            expect(sess.set).toHaveBeenCalledWith('active', true)
            expect(sess.onStatusChange).toHaveBeenCalled()
            expect(App.routers.main.navigate).toHaveBeenCalled
            expect(App.routers.main.navigate.argsForCall[0][0]).toMatch('')
            return
        )        

        return
    )

    return {name: "modulespec"}
)