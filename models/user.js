var mongodb = require('./db');
function User(user) {
	this.name = user.name;
	this.password = user.password;
	this.email = user.email;
};

module.exports = User;

//Store user's information
User.prototype.save = function(callback) {
	//user's information 
	var user = {
		name: this.name,
		password: this.password,
		email: this.email
	};

	//open mongodb
	mongodb.open(function (err, db) {
		if (err) {
			return callback(err);
		}
		//read users
		db.collection('users', function(err, collection){
			if (err) {
				mongodb.close();
				return callback(err);
			}
			//insert user's information into users
			collection.insert(user,{
				safe: true
			}, function(err, user){
				mongodb.close();
				if(err) {
					return callback(err); 
				}
				callback(null, user[0]);// success, err is null, return the users after stored
			});
		});


	});
};

//read user's information
User.get = function(name, callback) {
	//open mongodb
	mongodb.open(function(err, db){
		if(err) {
			return callback(err);
		}
		//read users
		db.collection('users', function(err, collection){
			if (err) {
				mongodb.close();
				return callback(err);
			}
			//find archive of username's value is name 
			collection.findOne({
				name: name
			}, function(err, user){
				mongodb.close();
				if(err) {
					return callback(err);
				}
				callback(null, user); //success, return the user's information which was found
			});

		});

	});
};
