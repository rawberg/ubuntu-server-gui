define(function (require_browser, exports, module) {
    module.exports.SessionsResponse = {
        "https://cloud.ubuntuservergui.com/sessions/": {
            "POST": {
                "202": [{"success": true}],
                "400": [{"success": false}],
                "406": [
                    {"errors": {"no account": ["Couldn't find an account with that email."]}, "success": false},
                    {"errors": {"invalid password": ["Incorrect password."]}, "success": false}
                ]
            }
        }
    }
});