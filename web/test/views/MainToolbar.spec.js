define(function (require_browser) {
    var MainToolbar = require_browser('views/MainToolbar');

    describe('MainToolbar - ItemView', function() {
        var mainToolbar, highlightIconSpy, clickIconSpy;

        beforeEach(function() {
            highlightIconSpy = sinon.spy(MainToolbar.prototype, 'highlightIcon');
            clickIconSpy = sinon.spy(MainToolbar.prototype, 'onClickIcon');
            mainToolbar = new MainToolbar();
            mainToolbar.render();
        });

        afterEach(function() {
            mainToolbar.close();
            highlightIconSpy.restore();
            clickIconSpy.restore();
        });

        describe('initialze', function() {

            it('should set the main toolbar template', function() {
                (mainToolbar.template).should.exist;
            });
        });

        describe('highlightIcon', function() {

            it('should add "active" css class to a toolbar icon and remove "active" class from existing icons', function() {
                mainToolbar.highlightIcon('toolbar-dashboard');
                (mainToolbar.$('.toolbar-dashboard').hasClass('active')).should.be.ok;
                mainToolbar.highlightIcon('toolbar-filemanager');
                (mainToolbar.$('.toolbar-dashboard').hasClass('active')).should.be.false;
                (mainToolbar.$('.toolbar-filemanager').hasClass('active')).should.be.ok;
            });
        });

        describe('onClickIcon', function() {

            it('should add active class to an icon when clicked', function() {
                mainToolbar.$('.toolbar-filemanager').click();
                (mainToolbar.$('.toolbar-filemanager').hasClass('active')).should.be.ok;
            });
        });
    });
});