const routes = {    
    '/login': {
        method: 'post',
        handler: function(req, res) {
            return res.json({
                "identityToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIxMjM0NTY3ODkwIiwibmFtZSI6IkpvaG4gRG9lIiwiaWF0IjoxNTE2MjM5MDIyfQ.SflKxwRJSMeKKF2QT4fwpMeJf36POk6yJV_adQssw5c",
                "accessToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzY29wZXMiOlsiY2YudkN1c3RvbWVyIiwiY2YubUN1c3RvbWVyIiwiY2Yudk9yZGVyIiwiY2YubU9yZGVyIl19.CmIa1Tr4kTZ7Ky-bH1jw6mZ-HxRCjv_9l-HPECPXVjg",
                "expiresIn": 3600
            });
        }
    }
};

module.exports = routes