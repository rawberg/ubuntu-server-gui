require([
    'model/User'
    'model/Session'
    'app'

], (User, Session, App) ->
    describe('User - default attributes', ->

        beforeEach( ->
            @user = new User()
            return
        )

        it('should set "email" attribute to an empty string upon User creation', ->
            expect(@user.get('email')).toBe('')
            return
        )

        it('should set "password" attribute to an empty string upon User creation', ->
            expect(@user.get('password')).toBe('')
            return
        )        
        return
    )

    describe('User - setting attributes', ->

        beforeEach( ->
            @user = new User({email: 'david@ubuntuservergui.com', password: 'samplepass'})
            return
        )

        it('should set "email" attribute upon creation', ->
            expect(@user.get('email')).toBe('david@ubuntuservergui.com')
            return
        )

        it('should set "password" attribute upon creation', ->
            expect(@user.get('password')).toBe('samplepass')
            return
        )        
        return
    )

    describe('User - login functionality', ->

        beforeEach( ->
            App.routers.main = {navigate: jasmine.createSpy()}
            spyOn(App.vent, 'trigger')
            spyOn(App.vent, 'bind')
            @server = sinon.fakeServer.create();
            return
        )

        afterEach( ->
            @server.restore()
        )        

        it('should make a login request to the server', ->
            user = new User({email: 'david@ubuntuservergui.com', password: 'samplepass'})
            user.login()
            @server.respond()
            expect(@server.requests[0].method).toEqual('POST')
            expect(@server.requests[0].url).toEqual('https://cloud.ubuntuservergui.dev/main/login')
            expect(@server.requests[0].requestBody).toEqual('email=david%40ubuntuservergui.com&password=samplepass')
            return
        )

        it('should attempt to set "active" attribute of user.session to true upon successful login', ->
            responseBody = '{"success": "true"}';
            @server.respondWith("POST", "https://cloud.ubuntuservergui.dev/main/login", [
                200,
                {"Content-Type": "application/json"},
                responseBody
            ])
            spyOn(User.prototype, 'loginSuccess').andCallThrough()
            spyOn(Session.prototype, 'set')
            user = new User({email: 'david@ubuntuservergui.com', password: 'samplepass'})

            user.login()
            @server.respond()
            expect(user.loginSuccess).toHaveBeenCalled()
            expect(user.session.set).toHaveBeenCalled()
            expect(user.session.set.argsForCall[1][0]).toMatch('active')
            expect(user.session.set.argsForCall[1][1]).toMatch(true)
            return
        )        

        it('should handle an invalid authentication request', ->
            responseBody = '{"success": "false", "msg": "Invalid email or password."}';
            @server.respondWith("POST", "https://cloud.ubuntuservergui.dev/main/login", [
                406,
                {"Content-Type": "application/json"},
                responseBody
            ])
            spyOn(User.prototype, 'loginError').andCallThrough()
            spyOn(Session.prototype, 'set')
            user = new User({email: 'david@ubuntuservergui.com', password: 'samplepass'})

            user.login()
            @server.respond()
            expect(user.loginError).toHaveBeenCalled()
            expect(user.session.set).toHaveBeenCalled()
            expect(user.session.set.argsForCall[1][0]).toMatch('active')
            expect(user.session.set.argsForCall[1][1]).toMatch(false)
            expect(App.vent.trigger).toHaveBeenCalledWith('auth:invalidLoginRequest', 'Invalid email or password.')
            return
        )        
        
        return
    )

    return  {name: "userSpec"}
)