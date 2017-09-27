var mongoose = require('mongoose'),
    Member = require('./models/memberModel.js'),
    startTid,
    slutTid;

startTid = Date.now();

// Koppla upp mot en databas
mongoose.Promise = global.Promise;
mongoose.connect('mongodb://localhost/brfGrantoppen', {
    useMongoClient: true
});

let membersController = require("./public/membersController");

//=============
//Querys
var query = {


    total : [
        {$match:{}},
        {$group:{
            _id:null,
            total:{$sum:"$lgh.yta"}
        }},
        {$sort:{building: 1}}
    ],
    byHouse : [
        {$match:{}},
        {$group:{
            _id:"$building",
            total:{$sum:"$lgh.yta"}
        }},
        {$sort:{building: 1}}
    ],
    adress : [
        {$project:{
            firstName: "$name.first",
            lastName: "$name.last",
            nr: "$lgn.nummer"
        }}
    ],


    /*let queryBiggestHouse = {

    };*/

    bySize : [
        {$match:{}},
        {$sort:{"lgh.yta": 1}}
    ],

};
//========================================================

var db = mongoose.connection;
db.on('error', console.error.bind(console, 'connection error:'));
db.once('open', function() {
    /*membersController.countMembers();
    membersController.countMembers({
        "lgh.avgift":{
            $gt:3000
        }
    });
    membersController.countMembers({
        "lgh.avgift":{
            $lt:3000
        },
        "lgh.yta":{
            $lt:40
        }
    });
    membersController.sortedBy(query.total);
    membersController.sortedBy(query.byHouse);*/
    //membersController.sortedBy(query.bySize);

    //membersController.distinctMembers("building");
    //membersController.distinctMembers("lgh.avgift");


});
db.createView("adressList","members",query.adress);
db.adressList.find()
    .exec((err,res)=>{
        console.log(res +
            "\n-------------------------------------------");
    });


function listMembers(){
    // Lista alla medlemmar. Namn samt avgift per kvm.
    Member.find({}, function (err, data) {
        if (err){
            console.log(err);
        }
        else{
            console.log("Medlemslista, namn och avgift/kvm");
            // Sortera arrayen.

            data.sort(function (a, b) {
                return a.avgiftPerKvm() - b.avgiftPerKvm();
            });
            data.forEach(function(medlem){
                console.log(medlem.fullName() + ", avgift: " + medlem.avgiftPerKvm().toFixed(2));
                // .toFixed() ger antal decimaler.
            });
        }
    });
    slutTid = Date.now();
    let millis = slutTid - startTid;
    console.log("Körningen tog: " + millis + " ms");
}
