var fs=require('fs');
var mongoose = require('mongoose');
mongoose.connect('mongodb://localhost/AshfordAppliancesSwap');
var item=require('../models/itemDB.js')
var Schema=mongoose.Schema;
var autoIncrement = require('mongoose-auto-increment');
autoIncrement.initialize(mongoose.connection);


var UserSchema = new Schema({
    UserId : String,
    FirstName : String,
    LastName : String,
    EmailAdress : String,
    AddressLine1  : String,
    AddressLine2  : String,
    City : String,
    State : String,
    PostCode : String,
    Country : String,
    Password: String

});

var User=mongoose.model('Users',UserSchema);

/*var addUser=User({
  UserId : "User1",
  FirstName : "Samyuktha",
  LastName : "Nayakanti",
  EmailAdress : "snayaka1@gmail.com",
  AddressLine1  : "9309 E",
  AddressLine2  : "Kittansett Drive",
  City : "Charlotte",
  State : "NC",
  PostCode : "28262",
  Country : "USA",
  Password: "Samyu@1234"

}).save(function(err,result){
  if(err) throw err;
  console.log("item saved");
})*/

var UserProfileSchema=new Schema(
  {
    UserId: String,
    UserItem:{type:[String]}
  }
);

var UserProfile=mongoose.model('UserProfiles',UserProfileSchema);



var UserItemsSchema= new Schema(
  {
    UserId: String,
    item: String,
    rating: String,
    status: String,
    swapitem: String,
    swapitemrating: String,
    swapperrating: String,
    category:String
  }
);

var UserItems =mongoose.model('useritems',UserItemsSchema);

var offerFeedbackSchema = new Schema({

    itemfeedbackrating: String,
    userfeedback: String
});
offerFeedbackSchema.plugin(autoIncrement.plugin, {model: 'offerFeedback', startAt: 1});
var offerFeedback =mongoose.model('offerfeedbacks',offerFeedbackSchema);


module.exports.addFeedback=function(obj){
  offerFeedback({
    itemfeedbackrating:obj.itemfeedbackrating ,
    userfeedback:obj.userfeedback
  }).save(function(err){
    if(err) throw err;
    console.log('offerFeedback saved');
  })
}


module.exports.addUser=function(obj){
  User({
  UserId:obj.UserId,
  FirstName : obj.FirstName,
  LastName : obj.LastName,
  EmailAdress :  obj.EmailAdress,
  Password: obj.Password
  }).save(function(err){
    if(err) throw err;
    console.log('User saved');
  })
};


module.exports.addUserItems=function(obj){
  UserItems({
    UserId:obj.UserId,
    item:obj.item,
    category:obj.category,
    rating: obj.rating,
    status: obj.status,
    swapitem: obj.swapitem,
    swapitemrating:"",
    swapperrating:""

  }).save(function(err){
    if(err) throw err;
    
    console.log('useritem saved');
  })
}





module.exports.getUserprofile=function(id){
  var query = UserProfile.find({UserId:id});
  return query;
};

module.exports.getUsers=function(){
  var query=User.find();
  return query;
}

module.exports.getUser=function(id){
  var query=User.find({UserId:id});
  return query;
}


module.exports.getUserItems=function(id){
  var query= UserItems.find({UserId:id});
  return query;
}

module.exports.findStatus=function(name){
  var query=UserItems.find({item:name})
  return query;
}

module.exports.removeanItem=function(name,id){
  var query=UserItems.remove({item:name,UserId:id});
  return query;
}

module.exports.updatetheStatusforaccept = function(name,id){
  var query=UserItems.update({UserId:id,item:name},{$set :{status:"swapped"}});
  return query;
}

module.exports.updatetheStatusforconfirm = function(name,id){
  var query=UserItems.update({UserId:id,item:name},{$set :{status:"swapped"}});
  return query;
}

module.exports.updatetheStatusforReject = function(name,id){
  var query=UserItems.update({UserId:id,item:name},{$set :{status:"available"}});
  return query;
}

module.exports.getUserbymail = function(emailid,password) {
  var query=User.find({EmailAdress:emailid,Password:password});
  return query;
}
