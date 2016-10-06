var express = require('express');
var router = express.Router();
var crypto = require('crypto'),
	User = require('../models/user.js'),
	Post = require('../models/post.js');
var multer = require('multer');
/* GET home page. */




module.exports = function(app) {
	app.get('/', function (req, res) {
		Post.get(null, function(err, posts){
			if (err) {
				posts = [];
			}

		
			res.render('index', {
				title: 'Home',
				posts: posts,
				user: req.session.user,
				success: req.flash('success').toString(),
				error: req.flash('error').toString()
			});
		});
	});

	app.get('/reg', checkNotLogin);
	app.get('/reg', function (req, res) {
		res.render('reg', {
			title: 'Register',
			user: req.session.user,
			success: req.flash('success').toString(),
			error: req.flash('error').toString()
		});
	});
	app.post('/reg', checkNotLogin);
	app.post('/reg', function(req, res){
		var name = req.body.name,
			password = req.body.password,
			password_re = req.body['password-repeat'];
		//check if this two password are the same
		if (password != password_re) {
			req.flash('error', 'passwords do not match ');
			return res.redirect('/reg');//return to reg page
		}
		//generate md5 of password
		var md5 = crypto.createHash('md5'),
			password = md5.update(req.body.password).digest('hex');
		var newUser = new User({
			name: name,
			password: password,
			email: req.body.email
		});
		//check if the username existed in database
		User.get(newUser.name, function(err, user){
			if(err) {
				req.flash('error', err);
				return res.redirect('/');
			}
			if(user) {
				req.flash('error', 'Username already existed!');
				return res.redirect('/reg');//return to reg page
			}
			//pass check, add new user to database 
			newUser.save(function(err, user){
				if(err) {
					req.flash('error', err);
					return res.redirect('/reg');
				}
				req.session.user = newUser; //store all new user's information into session
				req.flash('success', 'succeed to register');
				res.redirect('/');//return to homepage
			});
		});

	});
	app.get('/login', checkNotLogin);
	app.get('/login', function (req, res) {
		res.render('login', {
			title: 'Login',
			user : req.session.user,
			success: req.flash('success').toString(),
			error: req.flash('error').toString()
		});
	});
	app.post('/login', checkNotLogin);
	app.post('/login', function(req, res){
		//generate md5 of password
		var md5 = crypto.createHash('md5'),
			password = md5.update(req.body.password).digest('hex');
		//check if the username existed
		User.get(req.body.name, function(err, user) {
			if (!user) {
				req.flash('error', 'username does not existed!');
				return res.redirect('/login'); //return to login page when username doesn't existed
			}
			//check if password is correct
			if (password != user.password) {
				req.flash('error', 'password incorrect!');
				return res.redirect('/login');
			}
			//can find username and password is correct, store these in session
			req.session.user = user;
			req.flash('success', 'succeed to login');
			res.redirect('/'); //return to homepage after login successfully

		});
	});
	app.get('/post', checkLogin);
	app.get('/post', function (req, res) {
		res.render('post', {
			title: 'Post',
			user: req.session.user,
			success: req.flash('success').toString(),
			error: req.flash('error').toString()
		});
	});
	app.post('/post', checkLogin);
	app.post('/post', function(req, res){
		var currentUser = req.session.user,
			post = new Post(currentUser.name, req.body.title, req.body.post);
		post.save(function(err){
			if (err) {
				req.flash('error', err);
				return res.redirect('/');
			}
			req.flash('success', 'succeed to post');
			res.redirect('/'); //return to homepage after post 
		});

	});
	app.get('/logout', checkLogin);
	app.get('/logout', function(req, res){
		req.session.user = null;
		req.flash('success', 'succeed to logout');
		res.redirect('/'); //return to homepage after logout
	});

	app.get('/upload', checkLogin);
	app.get('/upload', function(req, res) {
		res.render('upload', {
			title: 'upload',
			user: req.session.user,
			success: req.flash('success').toString(),
			error: req.flash('error').toString()
		});
	});


	app.post('/upload', checkLogin);
	app.post('/upload', upload.array('field1', 5), function(req, res){
		req.flash('success', 'succeed to upload');
		res.redirect('/upload');
	});



	//chinese version of homepage


	app.get('/indexC', function (req, res) {
		Post.get(null, function(err, posts){
			if (err) {
				posts = [];
			}

		
			res.render('indexC', {
				title: '主页',
				posts: posts,
				user: req.session.user,
				success: req.flash('success').toString(),
				error: req.flash('error').toString()
			});
		});
	});

	app.get('/regC', checkNotLogin);
	app.get('/regC', function (req, res) {
		res.render('regC', {
			title: '注册',
			user: req.session.user,
			success: req.flash('success').toString(),
			error: req.flash('error').toString()
		});
	});
	app.post('/regC', checkNotLogin);
	app.post('/regC', function(req, res){
		var name = req.body.name,
			password = req.body.password,
			password_re = req.body['password-repeat'];
		//check if this two password are the same
		if (password != password_re) {
			req.flash('error', 'passwords not match ');
			return res.redirect('/regC');//return to reg page
		}
		//generate md5 of password
		var md5 = crypto.createHash('md5'),
			password = md5.update(req.body.password).digest('hex');
		var newUser = new User({
			name: name,
			password: password,
			email: req.body.email
		});
		//check if the username existed in database
		User.get(newUser.name, function(err, user){
			if(err) {
				req.flash('error', err);
				return res.redirect('/indexC');
			}
			if(user) {
				req.flash('error', 'Username already existed!');
				return res.redirect('/regC');//return to reg page
			}
			//pass check, add new user to database 
			newUser.save(function(err, user){
				if(err) {
					req.flash('error', err);
					return res.redirect('/regC');
				}
				req.session.user = newUser; //store all new user's information into session
				req.flash('success', '注册成功');
				res.redirect('/indexC');//return to homepage
			});
		});

	});
	app.get('/loginC', checkNotLogin);
	app.get('/loginC', function (req, res) {
		res.render('loginC', {
			title: '登录',
			user : req.session.user,
			success: req.flash('success').toString(),
			error: req.flash('error').toString()
		});
	});
	app.post('/loginC', checkNotLogin);
	app.post('/loginC', function(req, res){
		//generate md5 of password
		var md5 = crypto.createHash('md5'),
			password = md5.update(req.body.password).digest('hex');
		//check if the username existed
		User.get(req.body.name, function(err, user) {
			if (!user) {
				req.flash('error', '用户名不存在');
				return res.redirect('/loginC'); //return to login page when username doesn't existed
			}
			//check if password is correct
			if (password != user.password) {
				req.flash('error', '密码错误');
				return res.redirect('/loginC');
			}
			//can find username and password is correct, store these in session
			req.session.user = user;
			req.flash('success', '成功登录');
			res.redirect('/indexC'); //return to homepage after login successfully

		});
	});
	app.get('/postC', checkLogin);
	app.get('/postC', function (req, res) {
		res.render('postC', {
			title: '发布博客',
			user: req.session.user,
			success: req.flash('success').toString(),
			error: req.flash('error').toString()
		});
	});
	app.post('/postC', checkLogin);
	app.post('/postC', function(req, res){
		var currentUser = req.session.user,
			post = new Post(currentUser.name, req.body.title, req.body.post);
		post.save(function(err){
			if (err) {
				req.flash('error', err);
				return res.redirect('/indexC');
			}
			req.flash('success', '发布成功');
			res.redirect('/indexC'); //return to homepage after post 
		});

	});
	app.get('/logoutC', checkLogin);
	app.get('/logoutC', function(req, res){
		req.session.user = null;
		req.flash('success', '登出成功');
		res.redirect('/indexC'); //return to homepage after logout
	});

	app.get('/uploadC', checkLogin);
	app.get('/uploadC', function(req, res) {
		res.render('uploadC', {
			title: '上传文件',
			user: req.session.user,
			success: req.flash('success').toString(),
			error: req.flash('error').toString()
		});
	});


	app.post('/uploadC', checkLogin);
	app.post('/uploadC', upload.array('field1', 5), function(req, res){
		req.flash('success', '上传成功');
		res.redirect('/uploadC');
	});


};


//function check login and logout

function checkLogin (req, res, next) {
	if (!req.session.user) {
		req.flash('error', 'you have not loginned');
		res.redirect('/login');
	}
	next();
}

function checkNotLogin(req, res, next) {
	if (req.session.user) {
		req.flash('error', 'you have already loginned');
		res.redirect('back'); //return to former webpage
	}
	next();
}


// use multer to store file
var storage = multer.diskStorage({
	destination: function(req, file, cb) {
		cb(null, './public/images')
	},
	filename: function(req, file, cb) {
		cb(null, file.originalname)
	}
});

var upload = multer({
	storage: storage
});

var storage = multer.diskStorage({
    destination: function (req, file, cb){
        cb(null, './public/images')
    },
    filename: function (req, file, cb){
        cb(null, file.originalname)
    }
});
var upload = multer({
    storage: storage
});