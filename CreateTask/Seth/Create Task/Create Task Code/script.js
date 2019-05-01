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
  var array = getJSON();
}

function getJSON() {
  var array = [];
  var firstFiveTotals = [];
  var megaTotals = [];
  var tiesTotals = [];
  var mostCommon = [];
  var leastCommon = [];
  for (var i = 0; i < 75; i++){
    firstFiveTotals[i] = 0;
  }
  for (var i = 0; i < 52; i++){
    megaTotals[i] = 0;
  }
  for (var i = 0; i < 5; i++){
    tiesTotals[i] = 0;
  }
  var compares = 0;
  var swaps = 0;

  $.getJSON("data.json", function(json) {
    for (var i = 0; i < json.data.length; i++){
      array[i] = json.data[i];
    }
    /*mySort

    */
    var frontCount = 0;
    var backCount = array.length-1;
    console.time("Time Taken To Complete Sorting");
    for(var i = 0; i < array.length/2; i++){
      for(var j = frontCount; j < backCount; j++){
        compares++;
        if(array[j][11] > array[j+1][11] || array[j+1][11] === null){
          var temp = array[j];
          array[j] = array[j+1];
          array[j+1] = temp;
          swaps++;
        }
      }
      backCount--;
      for(var k = backCount; k > frontCount; k--){
        compares++;
        if(array[k][11] < array[k-1][11] || array[k][11] === null){
          var temp = array[k];
          array[k] = array[k-1];
          array[k-1] = temp;
          swaps++;
        }
      }
      frontCount++;
    }
    console.timeEnd("Time Taken To Complete Sorting");

    /*bubbleSort
    console.time("Time Taken To Complete Sorting");
    for (var i = array.length-1; i > 0; i--){
      for(var j = 0; j < i; j++){
        compares++;
        if (array[j][11] > array[j+1][11] || array[j+1][11] === null){
          var temp = array[j];
          array[j] = array[j+1];
          array[j+1] = temp;
          swaps++;
        }
      }
    }
    console.timeEnd("Time Taken To Complete Sorting");
    */

    /*selectionSort
    console.time("Time Taken To Complete Sorting");
    for(var i = 0; i < array.length-1; i++){
      var index = i;
      for(var j = i+1; j < array.length; j++){
        compares++;
        if(array[j][11] < array[index][11] || array[j][11] === null){
          index = j;
        }
      }
      var temp = array[index];
      array[index] = array[i];
      array[i] = temp;
      swaps++;
    }
    console.timeEnd("Time Taken To Complete Sorting");
    */

    /*insertSort
    console.time("Time Taken To Complete Sorting");
    for(var i = 1; i < array.length; i++){
      for(var j = i; j > 0; j--){
        compares++;
        if(array[j][11] < array[j-1][11] || array[j][11] === null){
          var temp = array[j];
          array[j] = array[j-1];
          array[j-1] = temp;
          swaps++;
        }
      }
    }
    console.timeEnd("Time Taken To Complete Sorting");
    */


    //1-75, mega 1-52, final for ties 2-5
    for (var i = 0; i < array.length; i++){
      for(var j = 0; j < 15; j=j+3){
        firstFiveTotals[parseInt(array[i][9].substring(j, j+2))-1]++;
      }
      megaTotals[parseInt(array[i][10])-1]++;
      if (array[i][11] === null){
        tiesTotals[0]++;
      } else {
        tiesTotals[parseInt(array[i][11])-1]++;
      }
    }

    console.log("Number of comparisons made: " + compares + " comparisons");
    console.log("Number of swaps made: " + swaps + " swaps");
    display(firstFiveTotals, megaTotals, tiesTotals, mostCommon, leastCommon, 0);
  });
}

function display(firstFiveArray, megaArray, tiesArray, mostCommon, leastCommon, doListeners){
  //draw labels
  ctx.beginPath();
  ctx.font = "80px Georgia";
  ctx.fillText("Trends in Winning", 900, 150);
  ctx.fillText("Lottery Numbers", 935, 225);
  ctx.font = "40px Georgia";
  ctx.fillText("First 5 Numbers", 300, canvas.height/2-200);
  ctx.fillText("Jackpot Numbers", 300, canvas.height/2+210);
  ctx.fillText("Tie Numbers", 1050, canvas.height/2+75);
  ctx.font = "20px Georgia";
  ctx.fillText("(Higher Number of Occurences = Chosen by People More Often)", 955, 265)
  ctx.font = "15px Georgia";
  //draw bargraphs
  for (var m = 0; m < firstFiveArray.length; m++){
    if (firstFiveArray[m] > firstFiveArray[mostCommon[0]] || m === 0){
      mostCommon[0] = m;
    }
    if (firstFiveArray[m] < firstFiveArray[leastCommon[0]] || m === 0){
      leastCommon[0] = m;
    }
    var x = m*10+100;
    var y = firstFiveArray[m];
    ctx.rect(x, canvas.height/2, 5, -y);
    ctx.fillStyle = 'rgb(0, 0, 0)';
    ctx.fill();
    if (m === 0 || m === firstFiveArray.length-1){
      ctx.fillText((m+1), x-2.5, canvas.height/2+10);
    }
    if (doListeners === 0){
      addListener(x, canvas.height/2, x+5, canvas.height/2-y, firstFiveArray, firstFiveArray, megaArray, tiesArray, m, mostCommon, leastCommon);
    }
  }
  for (var m = 0; m < megaArray.length; m++){
    if (megaArray[m] > megaArray[mostCommon[1]] || m === 0){
      mostCommon[1] = m;
    }
    if (megaArray[m] < megaArray[leastCommon[1]] || m === 0){
      leastCommon[1] = m;
    }
    var x = m*10+200;
    var y = megaArray[m];
    ctx.rect(x, canvas.height/2+300, 5, -y);
    ctx.fillStyle = 'rgb(0, 0, 0)';
    ctx.fill();
    if (m === 0 || m === megaArray.length-1){
      ctx.fillText((m+1), x-2.5, canvas.height/2+310);
    }
    if (doListeners === 0){
      addListener(x, canvas.height/2+300, x+5, canvas.height/2+300-y, megaArray, firstFiveArray, megaArray, tiesArray, m, mostCommon, leastCommon);
    }
  }
  for (var m = 0; m < tiesArray.length; m++){
    if (tiesArray[m] > tiesArray[mostCommon[2]] || m === 0){
      mostCommon[2] = m;
    }
    if (tiesArray[m] < tiesArray[leastCommon[2]] || m === 0){
      leastCommon[2] = m;
    }
    var x = tiesArray[m];
    var y = canvas.height/2+100+m*10;
    ctx.rect(canvas.width/2-100, y, x, 5);
    ctx.fillStyle = 'rgb(0, 0, 0)';
    ctx.fill();
    if (m === 0){
      ctx.fillText("No Tie", canvas.width/2-150, y+5);
    } else if (m === tiesArray.length-1){
      ctx.fillText((m+1), canvas.width/2-115, y+5);
    }
    if (doListeners === 0){
      addListener(canvas.width/2-100, y+5, canvas.width/2-100+x, y, tiesArray, firstFiveArray, megaArray, tiesArray, m, mostCommon, leastCommon);
    }
  }
  //draw ranges
  ctx.font = "10px Georgia";
  ctx.beginPath();
  ctx.fillText("Most Common: " + (mostCommon[0]+1) + ", " + (firstFiveArray[mostCommon[0]]) + " times", 450, canvas.height/2-180);
  ctx.fillText("Most Common: " + (mostCommon[1]+1) + ", " + (megaArray[mostCommon[1]]) + " times", 450, canvas.height/2+230);
  if (mostCommon[2] === 0){
    ctx.fillText("Most Common: " + "No Tie" + ", " + (tiesArray[mostCommon[2]]) + " times", 900, canvas.height/2+60);
  } else {
    ctx.fillText("Most Common: " + (mostCommon[2]) + ", " + (tiesArray[mostCommon[2]]) + " times", 900, canvas.height/2+60);
  }
  ctx.fillText("Least Common: " + (leastCommon[0]+1) + ", " + (firstFiveArray[leastCommon[0]]) + " times", 450, canvas.height/2-170);
  ctx.fillText("Least Common: " + (leastCommon[1]+1) + ", " + (megaArray[leastCommon[1]]) + " times", 450, canvas.height/2+240);
  if (leastCommon[2] === 0){
    ctx.fillText("Least Common: " + "No Tie" + ", " + (tiesArray[leastCommon[2]]) + " times", 900, canvas.height/2+70);
  } else {
    ctx.fillText("Least Common: " + (leastCommon[2]+1) + ", " + (tiesArray[leastCommon[2]]) + " times", 900, canvas.height/2+70);
  }
}

function addListener(x, y, otherX, otherY, thisArray, m){
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

      if(compare === true){
      ctx.fillText("Overpreformed", event.pageX, event.pageY-15);
      }else{
      ctx.fillText("Underpreformed", event.pageX, event.pageY-15);
    }

  }, false);
  canvas.addEventListener('mouseup', function(event) {
    if(event.pageX > x && event.pageX < otherX && event.pageY < y && event.pageY > otherY){
      ctx.beginPath();
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      display(firstFiveArray, megaArray, tiesArray, mostCommon, leastCommon, 1);
    }
  }, false);
}
