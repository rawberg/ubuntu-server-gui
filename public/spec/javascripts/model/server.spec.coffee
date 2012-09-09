require([
    'model/Server'
    'app'

], (Server, App) ->
    describe('Server - default instance settings', ->

        beforeEach( ->
            @server = new Server()
            return
        )

        it('should set "local" object key to true upon Server creation', ->
            expect(@server.local).toBeTruthy()
            return
        )

        it('should set "url" object key to "Servers" upon Server creation', ->
            expect(@server.url).toBe('Servers')
            return
        )        
        return
    )

    describe('Server - model attributes', ->

        beforeEach( ->
            @server = new Server()
            return
        )

        it('should set "name" model attribute', ->
            @server.set('name', 'New Server')
            expect(@server.get('name')).toBe('New Server')
            return
        )

        it('should set "ipv4" model attribute', ->
            @server.set('ipv4', '10.0.0.1')
            expect(@server.get('ipv4')).toBe('10.0.0.1')
            return
        )
        return
    )

    describe('Server - model localStorage operations', ->
        # makes sure localStroage is clear
        window.localStorage.clear()
        
        beforeEach( ->
            @server = new Server()
            return
        )

        afterEach( ->
            window.localStorage.clear()
            return
        )

        it('should save model to localStorage', ->
            runs(() ->
                @server.set('name', 'Sample Server')
                @server.set('ipv4', '192.168.0.1')
                @server.save()
                return
            )

            waits(500)

            runs(() ->
                localStorageServers = window.localStorage["Servers"].split(',')
                expect(localStorageServers.length).toEqual(1)
                return
            )
            return
        )

        it('model id should match item id in localStorage', ->
            runs(() ->
                @server.set('name', 'Super Sample Server')
                @server.set('ipv4', '192.168.10.1')
                @server.save()
                return
            )

            waits(500)

            runs(() ->
                expect(window.localStorage["Servers"]).toBe(@server.id)
                return
            )

            return
        )

        it('should delete model from localStorage when calling destroy', ->
            runs(() ->
                @server.set('name', 'Super Sample Server')
                @server.set('ipv4', '192.168.10.1')
                @server.save()
                return
            )

            waits(300)

            runs(() ->
                expect(window.localStorage["Servers"]).toBe(@server.id)
                @server.destroy()
                return
            )

            waits(300)
            
            runs(() ->
                expect(window.localStorage["Servers"].length).toEqual(0)
                return
            )            
            return
        )

        it('should persist model attribute edits back to localStorage when calling save after edits', ->
            runs(() ->
                @server.set('name', 'Super Sample Server')
                @server.set('ipv4', '192.168.10.1')
                @server.save()
                return
            )

            waits(300)

            runs(() ->
                expect(window.localStorage["Servers"]).toBe(@server.id)
                @server.set('name', 'Changed Sample Server')
                @server.set('ipv4', '111.108.0.1')
                @server.save()
                return
            )

            waits(300)
            
            runs(() ->
                serverKey = "Servers"+@server.id
                serverData = JSON.parse(window.localStorage[serverKey])
                expect(serverData.name).toBe('Changed Sample Server')
                expect(serverData.ipv4).toBe('111.108.0.1')
                return
            )            
            return
        )                

    )
    return
)