app.use(function (req, res, next) {
    res.locals.isAuth = req.session.isAuth;
    res.session.username = req.session.username;
    next();
  });