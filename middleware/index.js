var Camp = require("../models/campground");
var Comment = require("../models/comment");

var middleObj = {};


middleObj.isLoggedIn = function(req, res, next){
	if(req.isAuthenticated()){
		return next();
	}
	req.flash("error", "You need to be logged in to do that!!");
	res.redirect("/login");
};

middleObj.checkCampAuthorization = function(req, res, next){
	if(req.isAuthenticated()){
		Camp.findById(req.params.id, function(err, foundCamp){
			if(err){
				console.log(err);
			} else {
				if(foundCamp.author.id.equals(req.user._id)){
					return next();
				} else{
					req.flash("error", "you do not have permissions to do that");
					res.redirect("back");
				}
			}
		})
	} else{
		req.flash("error", "You need to be logged in to do that!!");
		res.redirect("/login");
	}
};


middleObj.checkCommentAuthorization = function(req, res, next){
	if(req.isAuthenticated()){
		Comment.findById(req.params.comment_id, function(err, foundComment){
			if(err){
				console.log("err");
			} else {
				if(foundComment.author.id.equals(req.user._id)){
					return next();
				} else{
					req.flash("error", "you do not have permissions to do that");
					res.redirect("back");
				}
			}
		})
	} else{
		req.flash("error", "You need to be logged in to do that!!")
		res.redirect("/login");
	}
};

module.exports = middleObj;
