require(['model/User', 'view/loginsignup/LoginSignup'], (User, LoginSignup) ->

    describe('LoginSignup - new instance', ->
        it('should set template correctly upon LoginSignup creation', ->
            user = new User()
            loginSignup = new LoginSignup({model: user})
            expect(loginSignup.template).toBeDefined()
            this.after( -> 
                loginSignup.close()
                return
            )
            return
        )
        return
    )

    describe('LoginSignup - login form field model bindings', ->
        beforeEach( ->
            @user = new User()
            @loginSignup = new LoginSignup({model: @user})
            @loginSignup.render()
            return
        )

        afterEach( ->
            delete @user
            @loginSignup.close()
            return
        )

        it('should update user model when field values change', -> 
            @loginSignup.$('input[name=email]').val('russell.peters@aol.com')
            @loginSignup.$('input[name=email]').trigger('change')
            @loginSignup.$('input[name=password]').val('sample-pass')
            @loginSignup.$('input[name=password]').trigger('change')

            expect(@user.get('email')).toEqual('russell.peters@aol.com')
            expect(@user.get('password')).toEqual('sample-pass')
            return
        )
        return
    )

    describe('LoginSignup - login button click event handlers', ->
        beforeEach( ->
            @app = {vent: {trigger: jasmine.createSpy(), bind: jasmine.createSpy()}, routers: {main: {navigate: jasmine.createSpy()}}}
            @user = new User({}, {app: @app})
            spyOn(@user, 'login')
            return
        )

        it('should call displayError and not dislableForm or user.login if email or password fields are empty', ->
            spyOn(LoginSignup.prototype, 'onLoginClick').andCallThrough()
            spyOn(LoginSignup.prototype, 'displayError')
            spyOn(LoginSignup.prototype, 'disableForm')
            ls = new LoginSignup({model: @user})
            ls.render()            

            ls.$('input[name=email]').val('')
            ls.$('input[name=email]').trigger('change')
            ls.$('input[name=password]').val('')
            ls.$('input[name=password]').trigger('change')

            ls.$('#login_btn').click()

            expect(ls.onLoginClick).toHaveBeenCalled()
            expect(ls.displayError).toHaveBeenCalled()
            expect(ls.disableForm).not.toHaveBeenCalled()
            expect(ls.model.login).not.toHaveBeenCalled()

            this.after( -> 
                ls.close()
                return
            )
            return
        )

        it('should call onLoginClick when login button is clicked', -> 
            spyOn(LoginSignup.prototype, 'onLoginClick').andCallThrough()
            spyOn(LoginSignup.prototype, 'clearError')
            loginSignup = new LoginSignup({model: @user})
            loginSignup.render()            

            loginSignup.$('#login_btn').click()
            expect(loginSignup.onLoginClick).toHaveBeenCalled()
            expect(loginSignup.clearError).toHaveBeenCalled()

            this.after( -> 
                loginSignup.close()
                return
            )
            return
        )

        it('should disableForm and call user.login when login button is clicked with valid data', ->             
            spyOn(LoginSignup.prototype, 'clearError')
            spyOn(LoginSignup.prototype, 'disableForm')
            loginSignup = new LoginSignup({model: @user})
            loginSignup.render()            

            loginSignup.$('input[name=email]').val('sample@mail.com')
            loginSignup.$('input[name=email]').trigger('change')
            loginSignup.$('input[name=password]').val('pass')
            loginSignup.$('input[name=password]').trigger('change')            

            loginSignup.$('#login_btn').click()
            expect(loginSignup.clearError).toHaveBeenCalled()
            expect(loginSignup.disableForm).toHaveBeenCalled()
            expect(loginSignup.model.login).toHaveBeenCalled()

            this.after( -> 
                loginSignup.close()
                return
            )                        
            return
        )
        return
    )

    describe('LoginSignup - local form validation', ->
        beforeEach( ->
            @app = {vent: {trigger: jasmine.createSpy(), bind: jasmine.createSpy()}, routers: {main: {navigate: jasmine.createSpy()}}}
            @user = new User({}, {app: @app})
            spyOn(LoginSignup.prototype, 'displayError').andCallThrough()
            @loginSignup = new LoginSignup({model: @user})
            @loginSignup.render()           
            return
        )

        afterEach( -> 
            @loginSignup.close()
            return
        )

        it('should show an error message if email field is invalid', -> 
            @loginSignup.$('#login_btn').click()            
            expect(@loginSignup.displayError).toHaveBeenCalled()
            expect(@loginSignup.$('#loginErrorMsg').css('visibility') == 'visible').toBeTruthy()
            return
        )

        it('should show an error message if password field is invalid', -> 
            @loginSignup.$('#login_btn').click()
            expect(@loginSignup.displayError).toHaveBeenCalled()
            expect(@loginSignup.$('#loginErrorMsg').css('visibility') == 'visible').toBeTruthy()
            return
        )

        it('should show an error message if both email and password fields are invalid', -> 
            @loginSignup.$('#login_btn').click()
            expect(@loginSignup.displayError).toHaveBeenCalled()
            expect(@loginSignup.$('#loginErrorMsg').css('visibility') == 'visible').toBeTruthy()
            return
        )                
        return
    )

    return  {name: "loginsignupSpec"}
)
