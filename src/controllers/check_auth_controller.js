const check_auth = (req, res, next) => {
    if(req.isAuthenticated()){
        res.json({
            "is_authenticated": true,
            "user": req.user
        });
    }else{
        res.json({
            "is_authenticated": false,
            "user": null
        });
    }
}

module.exports = check_auth;