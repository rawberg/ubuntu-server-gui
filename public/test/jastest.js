require(['../app/model/Session'], function(Session) {
  
  describe('Session', function() {
    it('should set "Active" attribute to undefined upon new object creation', function() {
      var sess;
      sess = new Session({app: {}});
      expect(sess.get('active')).toBe(undefined);
    });
  });

  return {name: "modulespec"};
});