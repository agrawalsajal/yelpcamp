var express = require("express");
var router = express.Router({mergeParams:true});
var Camp = require("../models/campground");
var middleWare = require("../middleWare");

router.get("/", function(req, res){
	Camp.find({}, function(err, camps){
		if(err){
			console.log(err);
		} else{
			res.render("campground/index", {camps:camps});
		}
	});
})

router.get("/new", middleWare.isLoggedIn, function(req, res){
	res.render("campground/new");
})

router.post("/",middleWare.isLoggedIn, function(req, res){
	var camp = req.body.camp;
	camp.author = {
		id: req.user._id,
		username: req.user.username
	}
	Camp.create(camp, function(err, camp){
		if(err){
			console.log(err);
		} else {
			res.redirect("/campgrounds");
		}
	})
})

router.get("/:id", function(req, res){
	Camp.findById(req.params.id).populate("comments").exec(function(err, camp){
		if(err){
			console.log(err);
		} else{
			res.render("campground/show", {camp:camp});
		}
	});
})

router.get("/:id/edit",middleWare.checkCampAuthorization, function(req, res){
	Camp.findById(req.params.id, function(err, foundCamp){
		if(err){
			console.log(err);
		} else {
			res.render("campground/edit", {foundCamp : foundCamp});
		}
	})
})

router.put("/:id",middleWare.checkCampAuthorization, function(req, res){
	Camp.findByIdAndUpdate(req.params.id, req.body.camp, function(err, updatedCamp){
		if(err){
			console.log(err);
		} else{
			res.redirect("/campgrounds/"+req.params.id);
		}
	});
})

router.delete("/:id", middleWare.checkCampAuthorization, function(req, res){
	Camp.findByIdAndRemove(req.params.id, function(err){
		if(err){
			console.log(err);
		} else {
			res.redirect("/campgrounds");
		}
	})
})


module.exports = router;
