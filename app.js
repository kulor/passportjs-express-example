var express = require('express'),
    app = express(),
    passport = require('passport'),
    TwitterStrategy = require('passport-twitter').Strategy;

app.configure(function() {
    app.use(express.cookieParser());
    app.use(express.bodyParser());
    app.use(express.session({ secret: 'keyboard cat' }));
    app.use(passport.initialize());
    app.use(passport.session());
    app.use(app.router);
    
    app.set('hostname', 'localhost');
    app.set('port', 4000);
    app.set('TWITTER_CONSUMER_KEY', process.env.TWITTER_CONSUMER_KEY);
    app.set('TWITTER_CONSUMER_SECRET', process.env.TWITTER_CONSUMER_SECRET);
});

passport.use(new TwitterStrategy({
    consumerKey:    app.get('TWITTER_CONSUMER_KEY'),
    consumerSecret: app.get('TWITTER_CONSUMER_SECRET'),
    callbackURL:    'http://' + app.get('hostname') + ':' + app.get('port') + '/auth/twitter/callback'
    },
    function(token, tokenSecret, profile, done) {
        done(null, profile);
    }
));

passport.serializeUser(function(user, done) {
    done(null, user);
});

passport.deserializeUser(function(user, done) {
    done(null, user);
});

app.get('/', function(req, res){
    if(req.user){
        res.send(req.user);
    } else {
        res.send('<a href="/auth/twitter">Sign in with Twitter</a>');
    }
});
app.get('/auth/twitter', passport.authenticate('twitter'));
app.get('/auth/twitter/callback', 
  passport.authenticate('twitter', { successRedirect: '/',
                                     failureRedirect: '/login' }));

console.log('App running, head to http://' + app.get('hostname') + ':' + app.get('port') + ' to sign in with Twitter');
app.listen(app.get('port'));