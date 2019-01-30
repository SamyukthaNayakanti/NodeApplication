 var mongoose = require('mongoose');
mongoose.connect('mongodb://127.0.0.1:27017/AshfordAppliancesSwap');
var Schema=mongoose.Schema;

var ItemSchema=new Schema
({
  ItemCode : String,
  ItemName : String,
  CatalogCategory : String,
  Description : String,
  Rating : String,
  ImageURL : String

});

var Item=mongoose.model('items',ItemSchema);

var CategorySchema= new Schema({
  categoryCode: String,
  categoryName: String
});

var Category=mongoose.model('categories',CategorySchema);

module.exports.getallItems=function(){
  var data = Item.find();
  return data;
}

module.exports.getItem=function(id){
  var data=Item.find({ItemCode:id});
  return data;
}

module.exports.getCategory=function(){
  var data=Category.find();
  return data;
}

module.exports.getitembyname=function(name){
  var data = Item.find({ItemName:name});
  return data;
}
