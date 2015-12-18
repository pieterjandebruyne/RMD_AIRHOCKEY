'use strict';


fallback.load({
  'socket': [
    '//cdnjs.cloudflare.com/ajax/libs/socket.io/1.3.7/socket.io.js',
    'js/vendor/socket.io.js'
  ]
});

<<<<<<< HEAD
fallback.ready(function(){
=======
fallback.ready(() =>{
>>>>>>> eda2f20733993c9a9f9dc5f36b1b7b81fbc962bd
  init();
});

// some features need the be polyfilled..
// https://babeljs.io/docs/usage/polyfill/

// import 'babel-core/polyfill';
// or import specific polyfills
import {Ball, Player} from './game/';
import {$, html} from './helpers/util.js';
import userTpl from '../_hbs/user';
import Status from '../models/Status.js';
import {AudioPlayer} from './modules/sound';


let player, ball;
let socket;
let $clientsList = $('.clients');
let socketId;
let ballOnScreen;
let ownScore = 0;
let strangerScore = 0;
let backgroundInGame, backgroundAlign, backgroundAlignReady, paddleYou, paddleOpponent, puck, readyButtonDisabled, readyButtonEnabled, backgroundInGameOpponent;
let startsWithBall = false;
let gameRunning;

//readybutton coords
let rdyX = 52;
let rdyY = 343;
let rdyWidth = 216;
let rdyHeight = 99;
window.AudioContext = window.AudioContext || window.webkitAudioContext;
let audioPlayer;
let audioContext = new AudioContext();
let readySound, hornSound;

let $canvas = document.querySelector('#canvas');
let ctx = $canvas.getContext('2d');

const init = () => {
    //SOCKET.IO
  audioContext = new AudioContext();

  audioPlayer = new AudioPlayer(audioContext);

//  audioPlayer = new AudioPlayer(audioContext);

  initSocket();
  loadAssets();


};


//#-#-#-#-#-#-#-#-#-#-#-#- pregame functions -#-#-#-#-#-#-#-#-#-#-#-#

const matchPlayers = (e) => {

  socket.emit('gameInvite', {
    from: socketId,
    to: e.currentTarget.parentNode.getAttribute('data-socketid')
  });
  socket.opponent = e.currentTarget.parentNode.getAttribute('data-socketid');
  socket.playerNumber = 1;
  startsWithBall = true;
  socket.status = Status.paired;
  hideList();
};

const hideList = () => {

  socket.emit('leaveList', socketId);
  $clientsList.parentNode.removeChild($clientsList);
  showStartScreen();
};


const showStartScreen = () => {
  //align phones
  ctx.drawImage(backgroundAlign, 0, 0, 320, 492);
  ctx.drawImage(readyButtonDisabled, 52, 343, 216, 99);

  ctx.fillStyle = '#BC31AF';
  ctx.font='90px BigNoodle';
  ctx.fillText('player ' + socket.playerNumber, 50, 230);
  ctx.font='33px';
  ctx.fillText('Align your phones', 65, 155);

  $canvas.addEventListener('touchstart', setReady, false);
};

const setReady = e => {



  e.preventDefault();

  if(e.touches['0'].clientX > rdyX && e.touches['0'].clientX < rdyX + rdyWidth && e.touches['0'].clientY > rdyY && e.touches['0'].clientY < rdyY + rdyHeight){
    if(socket.status === Status.paired){

      ctx.drawImage(backgroundAlignReady, 0, 0, 320, 492);

      ctx.fillStyle = '#00B3CC';
      ctx.font='90px BigNoodle';
      ctx.fillText('player ' + socket.playerNumber, 50, 230);
      ctx.font='33px';
      ctx.fillText('Align your phones', 65, 155);

      ctx.drawImage(readyButtonEnabled, 52, 343, 216, 99);

      socket.status = Status.ready;

    }else if(socket.status === Status.scoreScreen){
      socket.status = Status.ready;

    }
    audioPlayer.playSound(readySound);

    socket.emit('requestStatus', {
      from: socketId,
      to: socket.opponent
    });
  }
};

const setupGame = () => {

  resetPositionsAndTouch();

  _onFrame();
};

const loadAssets = () => {

  //IMAGES
  backgroundAlign = new Image();   // Create new img element
  backgroundAlignReady = new Image();
  paddleYou = new Image();   // Create new img element
  paddleOpponent = new Image();
  puck = new Image();
  readyButtonDisabled = new Image();
  readyButtonEnabled = new Image();
  backgroundInGame = new Image();
  backgroundInGameOpponent = new Image();


  backgroundAlign.src = './assets/images/backgroundalign.png';
  backgroundAlignReady.src = './assets/images/backgroundaligndone.png';
  paddleYou.src = './assets/images/paddleyou.png';
  paddleOpponent.src = './assets/images/paddleopponent.png';
  puck.src = './assets/images/puck.png';
  readyButtonDisabled.src = './assets/images/readybuttonoff.png';
  readyButtonEnabled.src = './assets/images/readybuttonon.png';
  backgroundInGame.src = './assets/images/backgroundingame.png';
  backgroundInGameOpponent.src = './assets/images/backgroundingameopponent.png';

  //SOUNDS

  loadSounds();

};

const loadSounds = () => {
  // Create and Initialize the Audio Context
   // Create the Sound
  let getSound = new XMLHttpRequest(); // Load the Sound with XMLHttpRequest
<<<<<<< HEAD
  getSound.open("GET", './assets/sounds/ready.wav', true); // Path to Audio File
  getSound.responseType = 'arraybuffer'; // Read as Binary Data

  getSound.onload = function() {

    audioContext.decodeAudioData(getSound.response, function(buffer){
=======
  getSound.open('GET', './assets/sounds/ready.wav', true); // Path to Audio File
  getSound.responseType = 'arraybuffer'; // Read as Binary Data
  getSound.onload = function() {

    audioContext.decodeAudioData(getSound.response, (buffer)=>{


      readySound = buffer; // Decode the Audio Data and Store it in a Variable
>>>>>>> eda2f20733993c9a9f9dc5f36b1b7b81fbc962bd

    readySound = buffer; // Decode the Audio Data and Store it in a Variable

    });
<<<<<<< HEAD
  }
=======
  };
>>>>>>> eda2f20733993c9a9f9dc5f36b1b7b81fbc962bd

  getSound.send(); // Send the Request and Load the File

  // Create the Sound
  let getSound2 = new XMLHttpRequest(); // Load the Sound with XMLHttpRequest
  getSound2.open('GET', './assets/sounds/horn.mp3', true); // Path to Audio File
  getSound2.responseType = 'arraybuffer'; // Read as Binary Data
  getSound2.onload = function() {

    audioContext.decodeAudioData(getSound2.response, (buffer)=>{


      hornSound = buffer; // Decode the Audio Data and Store it in a Variable


    });
  };

  getSound2.send(); // Send the Request and Load the File



};


const resetPositionsAndTouch = () => {
  if(socket.playerNumber === 1){
    player = new Player(paddleYou);
  }else{
    player = new Player(paddleOpponent);
  }

  if(startsWithBall){
    ball = new Ball(160.0, 300.0, true, socket, puck);
    ballOnScreen = true;
  }
  $canvas.removeEventListener('touchstart', setReady, false);
};

const _onFrame = () => {
  gameRunning = true;

  if(socket.status === Status.playing){
    //draw background
    ctx.fillStyle = '#E4EEF9';
    ctx.rect(0, 0, 320, 568);
    ctx.fill();
    if(socket.playerNumber === 1){
      ctx.drawImage(backgroundInGame, 0, 0, 320, 492);
    }else{
      ctx.drawImage(backgroundInGameOpponent, 0, 0, 320, 492);
    }


    update();

  }else{

  // execute drawImage statements here
    if(socket.status === Status.scoreScreen){
      ctx.fillStyle = '#E4EEF9';
      ctx.rect(0, 0, 320, 568);
      ctx.fill();
      ctx.drawImage(readyButtonDisabled, 52, 343, 216, 99);
      $canvas.addEventListener('touchstart', setReady, false);
      ctx.textAlign = 'center';
      ctx.fillStyle = '#BC31AF';
      ctx.font='133px BigNoodle';
      ctx.fillText(ownScore + ' - ' + strangerScore, 160, 200);
      ctx.font='33px BigNoodle';
      ctx.fillText('You        Opponent', 169, 250);



    }else{
      ctx.fillStyle = '#E4EEF9';
      ctx.rect(0, 0, 320, 568);
      ctx.fill();
      ctx.drawImage(readyButtonEnabled, 52, 343, 216, 99);
      ctx.fillStyle = '#00B3CC';
      ctx.font='133px BigNoodle';
      ctx.fillText(ownScore + ' - ' + strangerScore, 160, 200);
      ctx.font='33px BigNoodle';
      ctx.fillText('You        Opponent', 169, 250);
    }





  }
  requestAnimationFrame(() => _onFrame()); //lus om te blijven uitvoeren voor animatie
};

const update = () => {


  if(ballOnScreen){
    if(ball.overTheEdge()){
      audioPlayer.play(ball);
      fixOverlapping();

    }
    ball.update();

    if(checkCollision()){
      manageBounce();
      extraBounce();

      while(checkCollision()){

        if(ball.overTheEdge()){
          stopPlayerUpdate();
        }
        fixOverlapping();
      }
    }
    ball.draw();

  }
  player.update();
  player.draw();

};

const spawnBall = data => {
  ballOnScreen = true;
  //radius hard coded 20
  ball = new Ball(320 - data.location.x, data.location.y - 20, true, socket, puck);
  ball.setVelocity(-data.velocity.x, -data.velocity.y);
};

const checkCollision = () => {
  //check collision if true bereken de bounce

  let distance = Math.sqrt(Math.pow(ball.location.x - player.location.x, 2) + Math.pow(ball.location.y - player.location.y, 2));
  if (distance <= player.radius + ball.radius){

    return true;
  }else{

    return false;
  }


};

const extraBounce = () => {

  ball.velocity.x += ((ball.location.x - player.location.x)/(ball.radius+player.radius));
  ball.velocity.y += ((ball.location.y - player.location.y)/(ball.radius+player.radius));

};

const fixOverlapping = () => {

  ball.location.x -= -ball.velocity.x*2;
  ball.location.y -= -ball.velocity.y*2;
};
const stopPlayerUpdate = () => {

  player.location.x -= -player.velocity.x/10;
  player.location.y -= -player.velocity.y/10;
};


const manageBounce = () => {

  let dx = player.location.x-ball.location.x;
  let dy = player.location.y-ball.location.y;
  let collisionisionAngle = Math.atan2(dy, dx);
  let magnitude1 = Math.sqrt(player.velocity.x*player.velocity.x+player.velocity.y*player.velocity.y);
  let magnitude2 = Math.sqrt(ball.velocity.x*ball.velocity.x+ball.velocity.y*ball.velocity.y);
  let direction1 = Math.atan2(player.velocity.y, player.velocity.x);
  let direction2 = Math.atan2(ball.velocity.y, ball.velocity.x);
  let newVelocityX1 = magnitude1*Math.cos(direction1-collisionisionAngle);
  let newVelocityY1 = magnitude1*Math.sin(direction1-collisionisionAngle);
  let newVelocityX2 = magnitude2*Math.cos(direction2-collisionisionAngle);
  let newVelocityY2 = magnitude2*Math.sin(direction2-collisionisionAngle);
  let finalVelocityX1 = ((player.mass-ball.mass)*newVelocityX1+(ball.mass+ball.mass)*newVelocityX2)/(player.mass+ball.mass);
  let finalVelocityX2 = ((player.mass+player.mass)*newVelocityX1+(ball.mass-player.mass)*newVelocityX2)/(player.mass+ball.mass);
  let finalVelocityY1 = newVelocityY1;
  let finalVelocityY2 = newVelocityY2;


  player.velocity.x = Math.cos(collisionisionAngle)*finalVelocityX1+Math.cos(collisionisionAngle+Math.PI/2)*finalVelocityY1;
  player.velocity.y = Math.sin(collisionisionAngle)*finalVelocityX1+Math.sin(collisionisionAngle+Math.PI/2)*finalVelocityY1;
  ball.velocity.x = Math.cos(collisionisionAngle)*finalVelocityX2+Math.cos(collisionisionAngle+Math.PI/2)*finalVelocityY2;
  ball.velocity.y = Math.sin(collisionisionAngle)*finalVelocityX2+Math.sin(collisionisionAngle+Math.PI/2)*finalVelocityY2;



};

const initSocket = () => {
  //socket = io.connect('http://localhost:3000');
  socket = io();
  socket.on('init', clients => {

    if($clientsList){

      $clientsList.innerHtml = '';
      clients.forEach(client => {

        if(client.socketId === socket.id){

          client.self = true;
        }
        let $client = html(userTpl(client));
        if(client.socketId !== socketId){

          $client.querySelector('.connect').addEventListener('click', e => {
            e.preventDefault();
            matchPlayers(e);
          });

        }
        if(client.self === true){

          $client.setAttribute('class', 'self');
          let firstChild = $clientsList.firstChild;
          if(firstChild){
            $clientsList.insertBefore($client, firstChild);
          }else{
            $clientsList.appendChild($client);
          }
        }else{

          $client.setAttribute('class', 'other');
          $clientsList.appendChild($client);
        }
      });
    }
  });

   //als er iem joint
  socket.on('join', client => {

    let $el = html(userTpl(client));
    $el.setAttribute('class', 'other');
    $el.querySelector('.connect').addEventListener('click', e => {
      e.preventDefault();
      matchPlayers(e);

    });
    $clientsList.appendChild($el);
  });

  //stel eigen id in als socketId
  socket.on('id', id => {
    socketId = id;
  });

  //als er iemand disconnect
  socket.on('leave', socketIdToRemove => {
    if(socket.opponent === ''){
      let $el = $(`[data-socketId='${socketIdToRemove}']`); //``backtabs
      $el.parentNode.removeChild($el);
    }
  });

  //als er op jouw naam geklikt is
  socket.on('gameInvite', senderid => {
    socket.opponent = senderid;
    socket.playerNumber = 2;
    socket.startsWithBall = false;
    socket.status = Status.paired;
    hideList();
  });

  //stuur terug of jij ready bent of niet
  socket.on('requestStatus', senderid => {
    socket.emit('sendStatus', {
      status: socket.status,
      to: senderid
    });
  });

  // als de andere ook rdy is start game
  socket.on('sendStatus', status => {
    if(socket.status === status){
      socket.emit('startGame', socket.opponent);
      socket.status = Status.playing;
      if(gameRunning){
        resetPositionsAndTouch();
      }else{
        setupGame();
      }

    }
  });
  // iedereen is rdy
  socket.on('readyToStart', () => {
    socket.status = Status.playing;
    if(gameRunning){
      resetPositionsAndTouch();
    }else{
      setupGame();
    }
  });

  socket.on('sendingBallData', data => {
    spawnBall(data);
  });

  socket.on('hideBall', () => {
    ballOnScreen = false;
  });

  socket.on('tegengoal', () => {
    strangerScore++;
    socket.status = Status.scoreScreen;
    startsWithBall = true;
  });

  socket.on('gescoord', () => {
    audioPlayer.playSound(hornSound);
    ownScore++;
    socket.status = Status.scoreScreen;
    startsWithBall = false;
  });


};


