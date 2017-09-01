// Dependencies
// =============================================================
var friends=require("./../data/friends.js")
var fs=require("fs");

module.exports = function(app) {

console.log(friends);
console.log(friends.length);

app.get("/api/friends", function(req, res) {
  res.json(friends);
});

// Create New friend from survey - takes in JSON input
app.post("/api/friends", function(req, res) {
  var newfriend = req.body;

	//creates total score for survey taker
	var newfriendTotalScore=0;
	for(i=0;i<newfriend.scores.length;i++)
     newfriendTotalScore+=Number(newfriend.scores[i]);
 console.log(newfriendTotalScore);


//creates an array of totalscores and totaldifferences
var totalScores=[];
var totalDifference=[];
	for(i=0;i<friends.length;i++){
		totalScores[i]=0;
		for(j=0;j<friends[i].scores.length;j++){
			totalScores[i]+=Number(friends[i].scores[j]);
		}
		totalDifference[i]=Math.abs(newfriendTotalScore-totalScores[i]);
	}

console.log(totalDifference);

var match = {
      name: "",
      photo: "",
      totalDifference:51
    };
	//finds match
	for(i=0;i<friends.length;i++){
		if(totalDifference[i]<match.totalDifference){
		 	match.name=friends[i].name;
		 	match.photo=friends[i].photo;
		 	match.totalDifference=totalDifference[i];
		}
	}
	     
	
console.log(match);
	res.json(match);
	//add new submission to friends API
	 friends.push(newfriend);
     //writes the newfriend object to friends.js file 
    var position = 16;
	var file_path = './../FriendFinder/app/data/friends.js';
	var new_text = JSON.stringify(newfriend,null,4)+",";

	fs.readFile(file_path, function read(err, data) {
    	if (err) {
        throw err;
    	}
    	console.log('Saved!');
    	var file_content = data.toString();
    	file_content = file_content.substring(position);
    	var file = fs.openSync(file_path,'r+');
    	var bufferedText = new Buffer(new_text+file_content);
    	fs.writeSync(file, bufferedText, 0, bufferedText.length, position);
    	fs.close(file);
	});
  
});
};