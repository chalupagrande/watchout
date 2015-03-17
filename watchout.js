// Game Options ~~~~~~~

var options = {
  numEnemies : 10,
  enemy_data : [],
  player_data : [],
  boardSize : 500,
  boardBoarder : 5,
  enemy_size : 10,
  player_size: 10,
}

var highscore = 0;
var score = 0;
var collisions = 0;


//~~~~~~~~ Button Handlers
d3.selectAll('.pause').on('click', function(){
  clearInterval(id1);
  clearInterval(id2);
})

d3.selectAll('.play').on('click', function(){
  id1 = setInterval(moveEnemy, 2000);
  id2 = setInterval(gameStep, 50);
})

//~~~~~~~~~~~~~~~~

// ENEMY CLASS ~~~~~~~~~~~~
var Enemy = function(){
  this.x = Math.floor(Math.random() * (options.boardSize - options.boardBoarder) + options.boardBoarder);
  this.y = Math.floor(Math.random() * (options.boardSize - options.boardBoarder) + options.boardBoarder);
  this.radius = options.enemy_size;

}
Enemy.prototype.getRandom = function(){
  return Math.floor(Math.random() * (options.boardSize - options.boardBoarder) + options.boardBoarder);
}

//PLAYER CLASS ~~~~~~~~~~~~

var Player = function(){
  this.x = options.boardSize /2,
  this.y = options.boardSize /2,
  this.size = options.player_size
}


var drag = d3.behavior.drag()  
             .on('dragstart', function() { player.style('fill', 'red'); })
             .on('drag', function() { player.attr('cx', d3.event.x)
                                            .attr('cy', d3.event.y); })
             .on('dragend', function() { player.style('fill', 'blue'); });



//~~~~~~~~~ INIT ~~~~~~~~~~~

//Creates player
options.player_data.push( new Player());


// Create Enemy Objects and pushed them into options.enemy_data
for(var i = 0; i < options.numEnemies; i++){
  options.enemy_data.push(new Enemy());
}


//Creates Game Board
var svg =  d3.selectAll('body').append('svg')
                .attr('width', options.boardSize)
                .attr('height', options.boardSize);

//Adds the Enemies to the gameboard.
var enemies = svg.selectAll('.enemies').data(options.enemy_data).enter().append('circle')
                  .attr('class', 'enemy').attr('cx', function(d){return d.x })
                  .attr('cy', function(d){ return d.y })
                  .attr('r',10);

//Adds Player to the center of the Game Board
// Inititalizes Player 
var player = svg.selectAll('.player').data(options.player_data).enter().append('circle').attr('class', 'player')
                  .attr('r', function(d){ return d.size })
                  .attr('cx', function(d){ return d.x }).attr('cy', function(d){ return d.y })
                  .call(drag);


//Check for collisions

var hasCollisions = function(d,i, cb){
    var curX = this.cx.animVal.value;
    var curY = this.cy.animVal.value;
    var pX = d3.selectAll('.player').attr('cx') * 1;
    var pY = d3.selectAll('.player').attr('cy') * 1;

    var distanceX = Math.abs(curX - pX);
    var distanceY = Math.abs(curY - pY);

    var radiusSum = options.player_size + options.enemy_size

    var distance = Math.sqrt(Math.pow(distanceX, 2) 
                      + Math.pow(distanceY, 2));
    distance <= radiusSum ? cb(true) : cb(false);
  };


//Steps the Enemies

//! ERROR, only moving the attributes, not the data objects x and y values
var moveEnemy = function(){
  d3.selectAll('.enemy').transition().duration(2000)
    .attr('cx', function(d){ return d.getRandom() })
    .attr('cy', function(d){ return d.getRandom() })
  }


//Keeps score and checks for collisions
var gameStep = function(){
  var collided = false;

  collided = collided || enemies.each(function(d,i, cb){
    return hasCollisions.call(this, d,i, function(isTrue){
      if(!isTrue){
        score++;
      }else if(highscore > score){
        collisions++;
        score = 0;
        d3.selectAll('.collisions').text(' ' + collisions);
      }else if(highscore < score){
        collisions++;
        d3.selectAll('.collisions').text(' ' + collisions);
        highscore = score;
        d3.selectAll('.high').text(' ' + highscore)
        score = 0;;
      }

      d3.selectAll('.current').text(' ' + score);
    })
  });

  //move player 
 
}




