var newErr = require('./error').newError;
var users = require('./routes/users');
var meetings = require('./routes/meetings');
var messages = require('./routes/messages');
var restaurants = require('./routes/restaurants');
var orders = require('./routes/orders');
var order_lines = require('./routes/order_lines');

exports.myRouter = function(app)
{
	app.get('/',authAndLoadUser, function(req, res)
		{
		//	res.send("Wesh");
			throw newErr(409, "hahaha");
			res.send("Wesh");
		});
	// USERS
	app.get('/auth', authAndLoadUser, users.auth);
	app.post('/users/create', users.createUser);
	app.delete('/users/delete', authAndLoadUser, users.delete);
	app.get('/users/read', authAndLoadUser, users.list);
	app.put('/users/update', authAndLoadUser, users.update);
	app.get('/users/friends/read', authAndLoadUser, users.friendsList);
	app.put('/users/friends/add/:friend_id', authAndLoadUser, users.addFriend);
	app.put('/users/friends/remove/:friend_id', authAndLoadUser, users.removeFriend);
	
	// MEETINGS
	app.get('/users/meetings/read', authAndLoadUser, meetings.readByUser);
	app.post('/meetings/create', authAndLoadUser, meetings.create);
	app.put('/meetings/:meeting_id/update', authAndLoadUser, loadMeeting,  meetings.update);
	app.get('/meetings/:meeting_id/read', authAndLoadUser, loadMeeting, meetings.readOne);
	app.delete('/meetings/:meeting_id/delete', authAndLoadUser, loadMeeting, meetings.delete);
	app.get('/meetings/:meeting_id/members/read', authAndLoadUser, loadMeeting, meetings.listMembers);
	app.put('/meetings/:meeting_id/members/add/:user_id', authAndLoadUser, loadMeeting, meetings.addMembers);
	// MESSAGES (MEETINGS)
	app.get('/meetings/:meeting_id/messages/read', authAndLoadUser, loadMeeting, messages.readAll);
	app.post('/meetings/:meeting_id/messages/create', authAndLoadUser, loadMeeting, messages.create);

	// RESTAURANT
	app.post('/restaurants/login', authAndLoadRestaurant, restaurants.login);

	//ORDER
	app.post('/orders/create', authAndLoadUser, orders.create);
	app.put('/orders/validateByOwner', authAndLoadUser, orders.validateByOwner);
	app.put('/orders/validateByRestaurant', authAndLoadRestaurant, orders.validateByRestaurant);
	app.get('/orders/read', authAndLoadUser, orders.readAll);
	app.get('/orders/read/:order_id', authAndLoadUser, orders.readOne);
	app.get('/orders/readByOwner/:owner_id', authAndLoadUser, orders.readByOwner);

	//ORDERLINE
	app.post('/order_lines/CreateForOrder', authAndLoadUser, order_lines.CreateForOrder);
	app.delete('/order_lines/delete/:orderLine_id', authAndLoadUser, order_lines.delete);
}

// This is a middleware. To use for routes  that needs a user logged-in
// if the request don't contains credentials or contains bad ones, this method will respond an error...
// else it will call the method (next())

authAndLoadUser = function(req, res, next)
{
	var userName = req.header("userName");
	var password = req.header("password");
			req.db.models.user.one({"userName":userName},
			function(err, user)
			{
				if (!user)
				{
					res.send(500, "authentification error user Not found");
					return ;
				}
				if (user.password != password)
				{
					res.send(500, "authentification bad password");
					return ;
				}
				req.user = user;
				next();
			});
}

authAndLoadRestaurant = function(req, res, next)
{
	console.log(req.session);
	if (!userName || !password)
	{
		res.redirect('/login');
		return ;
	}
	req.db.models.restaurant.one({"userName":userName},
		function(err, restaurant)
		{
			if (!restaurant)
			{
				res.redirect('/login');
				return ;
			}
			if (!restaurant.password != password)
			{
				res.redirect('/login');
				return ;
			}
			var userName = req.session.userName;
			var password = req.session.password;
			req.restaurant = restaurant;
			next();
		});
}

loadMeeting = function(req, res, next)
{
	req.db.models.meeting.get(req.params.meeting_id, function (err, meeting)
	{
		if (err)
		{
			res.send(500, err);
			return ;
		}
		req.meeting = meeting;
		next();
	});
}