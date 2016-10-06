var mongodb = require('./db');
markdown = require('markdown').markdown;

function Post(name, title, post) {
	this.name = name;
	this.title = title;
	this.post = post;
};

module.exports = Post;

//Store post information
Post.prototype.save = function(callback) {
	var date = new Date();
	//store different type of time
	var time = {
		date: date,
		year: date.getFullYear(),
		month: date.getFullYear() + "-" + (date.getMonth() + 1),
		day: date.getFullYear() + "-" + (date.getMonth() + 1) + "-" + date.getDate(),
		minute: date.getFullYear() + "-" + (date.getMonth() + 1) + "-" + date.getDate() + " " 
		+ date.getHours() + ":" + (date.getMinutes() < 10 ? '0' + date.getMinutes() : date.getMinutes())

	};
	// the post to be stored 
	var post = {
		name: this.name,
		time: time,
		title: this.title,
		post: this.post
	};

	//open mongodb
	mongodb.open(function (err, db) {
		if (err) {
			return callback(err);
		}
		//read posts
		db.collection('posts', function(err, collection){
			if (err) {
				mongodb.close();
				return callback(err);
			}
			//insert post's information into users
			collection.insert(post,{
				safe: true
			}, function(err){
				mongodb.close();
				if(err) {
					return callback(err); 
				}
				callback(null);// success, return err is null
			});
		});


	});
};

//read post's information
Post.get = function(name, callback) {
	//open mongodb
	mongodb.open(function(err, db){
		if(err) {
			return callback(err);
		}
		//read posts
		db.collection('posts', function(err, collection){
			if (err) {
				mongodb.close();
				return callback(err);
			}
			var query = {};
			if(name) {
				query.name = name;
			}
			//find query in all posts
			collection.find(query).sort({
				time: -1
			}).toArray(function(err, docs){
							mongodb.close();
							if(err) {
								return callback(err); //failed, return error
							}
							// markdown to html
							docs.forEach(function(doc) {
								doc.post = markdown.toHTML(doc.post);
							});
							callback(null, docs); //succeed, return query result as an sorted array
						});

		});

	});
};
