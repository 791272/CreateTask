window.onload = init; // Wait for the page to load before we begin animation
var canvas;
var ctx;// This is a better name for a global variable

function init(){
  //get the canvas
  canvas = document.getElementById('cnv');
  // Set the dimensions of the canvas
  canvas.width = window.innerWidth;
  canvas.height = window.innerHeight;
  ctx = canvas.getContext('2d'); // This is the context
  var stadium = getJSON();
}

function getJSON() {
  var stadium = [];
  var tvChannel = [];
  var team = [];
  var group = [];
  var knockout = [];
  var compares = 0;
  var swaps = 0;

  $.getJSON("data.json", function(json) {
      for (var i = 0; i < json.stadiums.length; i++){
        stadium[i] = json.stadiums[i];
      }
      for (var i = 0; i < json.tvchannels.length; i++){
        tvChannel[i] = json.tvchannels[i];
      }
      for (var i = 0; i < json.teams.length; i++){
        team[i] = json.teams[i];
      }
      for (var i = 0; i < json.groups.length; i++){
        group[i] = json.groups[i];
      }
      for (var i = 0; i < json.knockout.length; i++){
        knockout[i] = json.knockout[i];
      }

    var frontCount = 0;
    var backCount = team.length-1;
    for(var i = 0; i < team.length/2; i++){
      for(var j = frontCount; j < backCount; j++){
        if(parseInt(team[j].WCRank) > parseInt(team[j+1].WCRank)){
          var temp = team[j];
          team[j] = team[j+1];
          team[j+1] = temp;
        }
      }
      backCount--;
      for(var k = backCount; k > frontCount; k--){
        compares++;
        if(parseInt(team[k].WCRank) < parseInt(team[k-1].WCRank)){
          var temp = team[k];
          team[k] = team[k-1];
          team[k-1] = temp;
        }
      }
      frontCount++;
    }

      console.log(stadium);
      console.log(tvChannel);
      console.log(team);
      console.log(group);
      console.log(knockout);
      display(stadium, tvChannel, team, group, knockout, 0);
    })
  }

  function display(stadium, tvChannel, team, group, knockout, doListeners){
    function normalize(val, max, min){
      return (val - min) / (max - min);
    }
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    for (var m = 0; m < team.length; m++){
      var x = (m+8.3)*40;
      //var y = (normalize(team[m].name.charCodeAt(0), team[0].name.charCodeAt(0), team[team.length-1].name.charCodeAt(0)))*200;
      var y = 700-(team[m].fifaRank*9);
      ctx.fillStyle = 'rgb(0, 0, 0)';
      ctx.rect(x, canvas.height/2+280, 10, -y);
      ctx.fill();
      ctx.font = "30px Verdana";
      ctx.fillText(team[m].emojiString, x -10, (canvas.height/2+280)+23);
      ctx.font = "10px Verdana";
      ctx.fillText(m+1,x , (canvas.height/2+290)+35);
      var compare =  (team[m].WCRank*2.28125)/team[m].fifaRank;
      if (doListeners === 0){
        addListener(x, canvas.height/2+200, x+10, canvas.height/2+200-y, stadium, tvChannel, team, group, knockout, compare);
      }

      console.log();
    }
    var hor = ctx.rect((canvas.height/2+200)-360, canvas.height/2+280, 1280, 2); // horizontal
    var vert = ctx.rect((canvas.height/2+200)-360, canvas.height/2+280, 2, -700); // vertical axis
    ctx.fill();
    ctx.font = "30px Verdana";
    ctx.fillText("World Cup Teams Ranking vs Preformance",(canvas.height/2+200)-75 , (canvas.height/2+200)-700);
      ctx.font = "20px Verdana";
    ctx.fillText("World Cup Preformance",(canvas.height/2+50) , (canvas.height/2+300)+70);
      ctx.fillText("Fifa Ranking",(canvas.height/2-400) , (canvas.height/2-100)+70);
    for(var i = 0; i < 73; i++){
      ctx.font = "9px Verdana";
      ctx.fillText(i+1, (canvas.height/2+200)-380, (i+6)*9.5);
    }
  }
  function addListener(x, y, otherX, otherY, stadium, tvChannel, team, group, knockout, compare){
  canvas.addEventListener('mousedown', function(event) {
    if(event.pageX > x && event.pageX < otherX && event.pageY < y && event.pageY > otherY){
      ctx.beginPath();
      ctx.rect(event.pageX, event.pageY-25, 80, 25);
      ctx.fillStyle = 'rgb(255, 255, 255)';
      ctx.fill();
      ctx.strokeStyle = 'rgb(255, 255, 255)';
      ctx.stroke();
      ctx.fillStyle = 'rgb(0, 0, 0)';
      ctx.strokeStyle = 'rgb(0, 0, 0)';

      if(compare <= 1){
      ctx.fillText("Overpreformed", event.pageX, event.pageY-15);
      }else{
      ctx.fillText("Underpreformed", event.pageX, event.pageY-15);
      }
    }

  }, false);
  canvas.addEventListener('mouseup', function(event) {
    if(event.pageX > x && event.pageX < otherX && event.pageY < y && event.pageY > otherY){
      ctx.beginPath();
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      display(stadium, tvChannel, team, group, knockout, 1);
    }
  }, false);
}

  // var letter = "h";
  // var letterPosition = alphabet.indexOf(letter)+1;
