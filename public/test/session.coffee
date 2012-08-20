require(['model/Session'], (Session) ->

    describe('defaults', ->
      it('Active should be set to undefined upon new object creation', ->
        sess = new Session({app: {}})
        assert.equal(undefined, sess.get('active'))
        return
      )
      return
    )

    return {name: 'sessionSpecModule'}
)