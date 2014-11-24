$(document).ready(function(){

	$('#start-button').click(function() {
		resetGame();
		$('#start-button').remove();
	});//starts game and removes start button

	$('#restart-button').click(function() {
		$('.modalOverlay').remove();
		resetGame();
	});//restarts game on click
}); //jQuery Ready Function


//game set up
function resetGame() {
	$('#game-board').empty(); //clear game

	//display stats
	var matches = 0;
	var fails = 0;
	$('#matches').text('Matches: ' + matches);
	$('#remaining').text('Remaining: ' + (8 - matches));
	$('#fails').text('Mistakes: ' + fails);

	//create tiles
	var tiles = [];
	var idx;
	for (idx = 1; idx <= 32; idx++) {
		tiles.push({
			tileNum: idx,
			src: 'img/tile' + idx + '.jpg',
			matched: false
		});
	}

	//shuffle tiles
	var shuffledTiles = _.shuffle(tiles);

	//select tiles for game
	var selectedTiles = shuffledTiles.slice(0, 8);

	//duplicate tiles for game to make matches
	var tilePairs =[];
	_.forEach(selectedTiles, function(tile) {
		tilePairs.push(_.clone(tile));
		tilePairs.push(_.clone(tile));
	});
	tilePairs = _.shuffle(tilePairs);

	//create gameboard in page
	var gameBoard = $('#game-board');
	var row = $(document.createElement('div'));
	var img;
	_.forEach(tilePairs, function(tile, elemIndex){
		if(elemIndex > 0 && !(elemIndex % 4)) {
			gameBoard.append(row);
			row = $(document.createElement('div'));
		}
		img = $(document.createElement('img'));
		img.attr({
			src: 'img/tile-back.png',
			alt: 'image of tile' + tile.tileNum,
			"class": 'img-rounded'
		});
		img.data('tile', tile);
		row.append(img);
	});
	gameBoard.append(row);

	//when user clicks image flips image
	var img1;
	var tile1;
	$('#game-board img').click(function(){
		var img = $(this);
		var tile = img.data('tile');
		//check if same tile previously clicked
		if (!tile.matched && !_.isEqual(img, img1)) {
			flipTile(img, tile);
			if(!tile1) {
				img1 = img;
				tile1 = tile;
			} else {
				//compare two different tiles and update accordingly
				if (tile.tileNum === tile1.tileNum) {
					matches++;
					tile.matched = true;
					tile1.matched = true;
					tile1 = undefined;
					img1 = undefined;
					$('#matches').text('Matches: ' + matches);
					$('#remaining').text('Remaining: ' + (8 - matches));
					//if game is won, disable parent window and show congratulatory pop up
					if(matches === 8) {
						$("#main").append('<div class="modalOverlay">');
						$('#myModal').modal('show');
					}
				} else {
					window.setTimeout(function(){
						flipTile(img, tile);
						flipTile(img1, tile1);
						tile1 = undefined;
						img1 = undefined;
					}, 500);
					fails++;
					$('#fails').text('Mistakes: ' + fails);
				}
			}
		}
	}); //on click of gameboard images

	//timer for game length, updates automatically
	var startTime = _.now();
	var timer = window.setInterval(function(){
		var elapsedSeconds = Math.floor((_.now() - startTime) / 1000);
		$('#elapsed-seconds').text('Time: ' + elapsedSeconds);

		//stop timer if game is over
		if (matches === 8) {
			window.clearInterval(timer);
		}
	}, 1000);
}

//flips tile from img to tile back and vice versa
function flipTile(img, tile) {
	img.fadeOut(100, function(){
		if (tile.flipped) {
			//make into one variable to reduce redundancy
			img.attr('src', 'img/tile-back.png');
		} else {
			img.attr('src', tile.src);
		}
		tile.flipped = !tile.flipped;
		img.fadeIn(100);
	}); //after fadeOut
}