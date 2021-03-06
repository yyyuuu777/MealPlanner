

checkError = function(cb, err)
{
    if (err)
        return cb(err);
    return cb();
}

module.exports = function(db, cb)
{
    
    db.load("./user.js", function (err) {checkError(cb, err)});
    db.load("./meeting.js", function (err) {checkError(cb, err)});
    db.load("./Order.js", function (err) {checkError(cb, err)});
    db.load("./order_line.js", function (err) {checkError(cb, err)});
    db.load("./reservation.js", function (err) {checkError(cb, err)});
    db.load("./restaurant.js", function (err) {checkError(cb, err)});
    db.load("./dish.js", function(err) {checkError(cb, err)});
    db.load("./message.js", function(err) {checkError(cb, err)});
    db.load("./openingDay.js", function(err) {checkError(cb, err)});
    db.load("./coupon.js", function(err) {checkError(cb, err)});

    var Message = db.models.message;
    var User = db.models.user;
    var Dish = db.models.dish; 
    var Meeting = db.models.meeting;
    var Order = db.models.order;
    var OrderLine = db.models.orderLine;
    var Reservation = db.models.reservation;
    var Restaurant = db.models.restaurant;
    var OpeningDay = db.models.openingDay;
    var Coupon = db.models.coupon;

    OpeningDay.hasOne('restaurant', Restaurant, {reverse : "restaurants", autoFetch : false});

    Message.hasOne("sender", User, {reverse : "messages"});
    Message.hasOne("meetings", Meeting, {reverse : "messages"});
    Meeting.hasOne("Owner", User, {reverse : "meetingsOwned"});
    Meeting.hasMany("members", User, {}, {reverse : "meetings"});
    Meeting.hasOne("restaurant", Restaurant, {}, {reverse : "meetings"});
    
    Order.hasOne("owner", User, {reverse : "ordersOwned"});
    Order.hasOne("restaurant", Restaurant, {reverse : "orders"});
    Order.hasOne("reservation", Reservation);

    OrderLine.hasOne("order", Order, {reverse : "orderLines"});
    OrderLine.hasOne("user", User, {reverse : "orderLines"});
    OrderLine.hasOne("dish", Dish, {reverse : "orderLines"});


    Reservation.hasOne("order", Order);
    Reservation.hasOne("owner", User, {reverse: "reservationsOwned"});
    Reservation.hasOne("restaurant", Restaurant, {reverse : "reservations"});
    Reservation.hasOne('meeting', Meeting);

    Dish.hasOne("restaurant", Restaurant, {reverse : "dishes"});

    User.hasMany("friends");

    Coupon.hasOne("restaurant", Restaurant);
    Coupon.hasOne("dish", Dish);
    Coupon.hasOne("user", User);

    db.sync();
}   