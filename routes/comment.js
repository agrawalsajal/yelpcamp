var express = require("express");
var router = express.Router({mergeParams:true});
var Camp = require("../models/campground");
var Comment = require("../models/comment");
var middleWare = require("../middleWare");

router.get("/new",middleWare.isLoggedIn, function(req, res){
	res.render("comment/new", {camp_id:req.params.id})
});

router.post("/", middleWare.isLoggedIn, function(req, res){
	Camp.findById(req.params.id).populate("comments").exec(function(err, camp){
		if(err){
			console.log(err);
		} else{
			Comment.create(req.body.comment, function(err, comment){
				if(err){
					console.log(err);
				} else{
					comment.author.id = req.user._id;
					comment.author.username  = req.user.username;
					comment.save();
					camp.comments.push(comment);
					camp.save();
					// console.log(camp);
					res.redirect("/campgrounds/"+req.params.id);
				}
			});
		}
	})
})

router.get("/:comment_id/edit",middleWare.checkCommentAuthorization, function(req, res){
	Comment.findById(req.params.comment_id, function(err, foundComment){
		if(err){
			console.log(err);
		} else{
			console.log(req.params.comment_id);
			res.render("comment/edit", {camp_id:req.params.id, foundComment:foundComment});
		}
	})
});

router.put("/:comment_id",middleWare.checkCommentAuthorization, function(req, res){
	Comment.findByIdAndUpdate(req.params.comment_id, req.body.comment, function(err, updatedComment){
		if(err){
			console.log(err);
		} else {
			res.redirect("/campgrounds/"+req.params.id);
		}
	})			
});

router.delete("/:comment_id",middleWare.checkCommentAuthorization, function(req, res){
	Comment.findByIdAndRemove(req.params.comment_id, function(err){
		if(err){
			console.log(err);
			res.redirect("/campgrounds");
		} else {
			res.redirect("/campgrounds/"+req.params.id);
		}
	});
});



module.exports = router;

