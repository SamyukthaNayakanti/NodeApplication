var express=require('express');
var app=express();
var users=require('../models/User.js');
var path=require('path');
var items=require('../models/itemDB.js');
var session = require('express-session');


module.exports=function (req,res,next) {
  if(req.method==='GET')
  {
    if(req.session.theUser){


      users.getUserItems(req.session.theUser[0].UserId).exec(function(err,result){
        if(err) throw err;
        res.render(path.resolve('../views/myItems'),{
          user:req.session.theUser,
          result:result,
          users:users});
      })



      console.log("Session already exists");

    }
    else{
      res.render(path.resolve('../views/login'),{message:'1'});
    /*  users.getUser('User1').exec(function(err,result){
         if(err) throw err;
         users.getUserItems('User1').exec(function(err,ans){
           if(err) throw err;
           console.log(result);
           req.session.theUser= result;

           console.log(req.session.theUser);
           res.render(path.resolve('../views/myItems'),{
             user:req.session.theUser,
             result:ans,
             users:users})

         })

      })*/


    }

  }
  else if (req.method==='POST') {


    var actionParameter=req.body;


    if(actionParameter.update)
    {

      req.session.Thevalue= actionParameter.update;
      console.log(req.session.Thevalue);
      users.findStatus(actionParameter.update).exec(function(err,result){
          if(result[0].status==="available" || result[0].status ==="swapped"){
            items.getitembyname(actionParameter.update).exec(function(err,anz){
              if(err) throw err;
              items.getItem(anz[0].ItemCode).exec(function(err,imp){
                res.render(path.resolve('../views/item'),{result:imp,ans:'1',a:req.session.theUser,test:'1'});
              })
            })
          }
          else(
            users.findStatus(actionParameter.update).exec(function(err,result){
              res.render(path.resolve('../views/mySwaps'),{usercurrentitem:result});
            })
          )
        })

    }
    else if(actionParameter.delete)
    {
      users.removeanItem(actionParameter.delete,req.session.theUser[0].UserId).exec(function(err,response){
      if (err) throw err;
      users.getUserItems(req.session.theUser[0].UserId).exec(function(err,fin){
        res.render(path.resolve('../views/myItems'),{
          result:fin,
          user:req.session.theUser,
          users:users

        })
      })
    })
    }
    else if (actionParameter.Accept) {
      users.updatetheStatusforaccept(actionParameter.Accept,req.session.theUser[0].UserId).exec(function(err,ups){
        if(err) throw err;
        users.getUserItems(req.session.theUser[0].UserId).exec(function(err,result){
          if(err) throw err;

          res.render(path.resolve('../views/myItems'),{
            user:req.session.theUser,
            result:result,
            users:users

          })
        })
      })


    }
    else if (actionParameter.Reject || actionParameter.Withdraw) {
      if(actionParameter.Reject){
      users.updatetheStatusforReject(actionParameter.Reject,req.session.theUser[0].UserId).exec(function(err,ups){
        if(err) throw err;
        users.getUserItems(req.session.theUser[0].UserId).exec(function(err,result){
          if(err) throw err;

          res.render(path.resolve('../views/myItems'),{
            user:req.session.theUser,
            result:result,
            users:users

          })
        })
      })
    }
    else if (actionParameter.Withdraw) {
      users.updatetheStatusforReject(actionParameter.Withdraw,req.session.theUser[0].UserId).exec(function(err,ups){
        if(err) throw err;
        users.getUserItems(req.session.theUser[0].UserId).exec(function(err,result){
          if(err) throw err;

          res.render(path.resolve('../views/myItems'),{
            user:req.session.theUser,
            result:result,
            users:users

          })
        })
      })

    }


    }
    else if (actionParameter.Offer) {
      if(req.session.theUser){
        items.getallItems().exec(function(err,result){
    if(err) throw err;



        users.getUserItems(req.session.theUser[0].UserId).exec(function(err,userItems){
          var filteredItems = result.filter(function(item) {
            return !userItems.find(function(userItem) { return userItem.item.trim() == item.ItemName.trim() });
          })
          res.render(path.resolve('../views/swap'),{ans:filteredItems})
        });


  })

    }
    else{
      res.send('No session available');
    }

    }
        else if(actionParameter.Submit){
              console.log(actionParameter.Submit);
            var obj=  {
                itemfeedbackrating: req.body.itemrating ,
                userfeedback: req.body.ownerrating
              }
              users.addFeedback(obj);
              users.updatetheStatusforconfirm(req.session.Thevalue,req.session.theUser[0].UserId).exec(function(err,ans){
                if(err) throw err;
                users.getUserItems(req.session.theUser[0].UserId).exec(function(err,result){
                  if(err) throw err;

                  res.render(path.resolve('../views/myItems'),{
                    user:req.session.theUser,
                    result:result,
                    users:users

                  })
                })
              })


            }


    }

  else
  {
    next();
  }
}
