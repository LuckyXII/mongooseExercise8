let members = require("../models/memberModel");


function countMembers(query=""){
    members.count(query,(err,res)=>{
        console.log(res +
            "\n------------------------------------------" );
    });

}

function distinctMembers(query=""){
    members.distinct(query)
        .exec((err,res)=>{
            console.log(res +
                "\n-----------------------------------------");
        });
}

function sortedBy(query=""){
     members.aggregate(query)
        .exec((err,res)=>{
            console.log(res);
        });

}




module.exports = {
    countMembers: countMembers,
    sortedBy: sortedBy,
    distinctMembers: distinctMembers,

};