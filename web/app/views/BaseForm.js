define(['jquery', 'marionette'], function ($, Marionette) {

    return Marionette.ItemView.extend({

        initialize: function() {
            Marionette.ItemView.__super__.initialize.apply(this, arguments);
        },

        clearForm: function() {
            this.$(':input').val('');
        },

        disableForm: function() {
            this.$(':input').attr('disabled', true);
        },

        enableForm: function() {
            this.$(':input').attr('disabled', false);
        },

        displayError: function(msg) {
            this.$('.form-errors').text(msg).css('visibility', 'visible');
        },

        clearError: function() {
            this.$('.form-errors').text('').css('visibility', 'hidden');
        },

        hideError: function() {
            $('#error_alert').hide();
        },

        onInputKeyup: function(eventObj) {
            if (eventObj.keyCode === 13) {
                $(eventObj.target).closest('form').parent().find('button').click();
            }
        }
    });
 });
