var express = require("express"),
	app = express(),
	mongoose = require("mongoose"),
	bodyParser = require("body-parser"),
	Camp = require("./models/campground"),
	User = require("./models/user"),
	Comment = require("./models/comment"),
	passport = require("passport"),
	LocalStrategy = require("passport-local"),
	passportLocalMongoose = require("passport-local-mongoose"),
	campRoute = require("./routes/campground"),
	commentRoute = require("./routes/comment"),
	indexRoute = require("./routes/index"),
	methodOverride = require("method-override"),
	flash = require("connect-flash");

// mongoose.connect("mongodb://agrawal_sajal:sajal@1234@ds239648.mlab.com:39648/yelp-camp");
mongoose.connect("mongodb://localhost/yelp_camp");
app.use(bodyParser.urlencoded({extended: true}));
app.use(express.static(__dirname+"/public"));
app.use(require('express-session')({ 
	secret: 'Web development is awesome', 
	resave: false, 
	saveUninitialized: false 
}));
app.use(flash());
app.use(methodOverride("_method"));
app.set("view engine", "ejs");
app.use(passport.initialize());
app.use(passport.session());
passport.use(new LocalStrategy(User.authenticate()));
passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

app.use(function(req, res, next){
	res.locals.currentUser = req.user;
	res.locals.error = req.flash("error");
	res.locals.success = req.flash("success");
	next();
})

app.use(indexRoute);
app.use("/campgrounds", campRoute);
app.use("/campgrounds/:id/comments", commentRoute);


app.listen(5000, function(){
	console.log("server started on port 5000");
});