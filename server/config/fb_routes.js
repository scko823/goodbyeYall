'use strict'

module.exports = function(app, passport) {
  // route for home page
  app.get('/', function(req, res) {
    res.render(''); 
  });

  // DON'T THINK WE NEED 

  app.get('/profile', isLoggedIn, function(req, res) {
    res.render('', {
      user : req.user // get the user out of session and pass to template
    });
  });

  // FACEBOOK ROUTES
  // route for facebook authentication and login
  app.get('/auth/facebook', passport.authenticate('facebook', { scope : ['email'] }));

  // handle the callback after facebook has authenticated the user
  app.get('/auth/facebook/callback',
    passport.authenticate('facebook', {
      successRedirect : '/',
      failureRedirect : '/'
    }));

  // route for logging out
  app.get('/logout', function(req, res) {
    req.logout();
    res.redirect('/');
  });
};

// route middleware to make sure a user is logged in
function isLoggedIn(req, res, next) {
  // if user is authenticated in the session, carry on
  if (req.isAuthenticated()){
    return next();
  }
  // if they aren't redirect them to the home page
  res.redirect('/');
}