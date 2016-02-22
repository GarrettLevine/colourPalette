//************************************************************************
//										DOCUMENT READY
//************************************************************************
$(function() {
	artApp.init();
});


//************************************************************************
//										ART APP
//************************************************************************
// DEFINE VARIABLES
var artApp = {};

artApp.url = "https://www.rijksmuseum.nl/api/nl/collection/";
artApp.apiKey = "p5cuDjAx";
artApp.newPaintingArray = [];
artApp.paintingsArray = [];
artApp.paletteChoice = [];

// GET PAINTING
artApp.getPainting = function() {
	 $.ajax( {
		url: artApp.url,
		method: "GET",
		dataType: "json",
		data: {
			format: "json",
			key: artApp.apiKey,
			ps: 50,
			q: 'paintings'
		}
	}).then( function(response) {
		console.log(response.artObjects);
		var filteredPaintings = response.artObjects.filter(artApp.filterPaintings);

		artApp.storePaintings(filteredPaintings);

	});
}

artApp.filterPaintings = function(object) {
		if (object.hasImage === false) {
			return false;
		} else {
			return true;
		}
}

artApp.chooseThreePaintings= function(maxNumber, array) {
	n1 = Math.floor(Math.random() * maxNumber);
	n2 = Math.floor(Math.random() * maxNumber);
	n3 = Math.floor(Math.random() * maxNumber);
	while (n1 === n2 || n1 === n3 ) {
		n2 = Math.floor(Math.random() * maxNumber);
	}
	while (n2 === n3) {
		n3 = Math.floor(Math.random() * maxNumber)
	}
	artApp.newPaintingArray.push(array[n1]);
	artApp.newPaintingArray.push(array[n2]);
	artApp.newPaintingArray.push(array[n3]);
	console.log(artApp.newPaintingArray);
}



artApp.storePaintings = function(paintings) {
	artApp.chooseThreePaintings(30, paintings);
	$.each(artApp.newPaintingArray, function(i, painting) {
		//create variables
		//title
		var title = painting.title;
		//image link
		var image = painting.webImage.url;
		//object number
		var objectNumber = painting.objectNumber;
		//painting colors
		var makeObjects = $.ajax({
			url: artApp.url + painting.objectNumber,
			method: 'GET',
			dataType: 'json',
			data: {
				key: artApp.apiKey,
				format: 'format'
			}
		}).then( function(response){
			var colors = response.artObject.colors.splice(0, 6);
			var paintingObject = {objectNumber, title, image, colors};
			artApp.paintingsArray.push(paintingObject);
			artApp.displayPaintings(paintingObject, i);
		});
	});
}

artApp.resetPaletteChoice = function() {
	artApp.paletteChoice = [];
	$('.paletteChoiceContainer__paletteChoice').css('background-color', 'rgba(229,230,219,0.7)');
}

//put paintingArray options on the page
artApp.displayPaintings = function(painting, i) {
	var image = "<button value=' " + i + "' class='imageButton'><image class='imageButton__imageItem' src="+ painting.image+ "></button>";
	$('.paintingWrapper__paintingContainer').append(image);
}

artApp.createPalette = function() {
	$('body').on('click', '.imageButton', function() {
		artApp.resetPaletteChoice();
		var imageIndex = parseInt($(this).val() );
		var colorPalette = artApp.paintingsArray[imageIndex].colors;
		console.log(colorPalette);		
		$('.paletteArea').show();
		$('button[class^=paletteArea__paletteButton').empty();

		$.each(colorPalette, function(i, color) {
			var paletteColour = "<div class='paletteArea__paletteColor' style='background-color:" + color + "'</div>";
			var paletteText = "<p class='paletteArea__paletteText'>" + color + "</p>";
			$('.paletteArea__paletteButton--' + i).append(paletteColour);
			$('.paletteArea__paletteButton--' + i).append(paletteText);
		});
    $('html,body').animate( {
        scrollTop: $(".paletteArea").offset().top
       },
        'slow');
	});
}

artApp.pickColour = function() {
	$('body').on('click', '.paletteArea__paletteButton', function() {
		var colourPick =  $(this).text();
		artApp.paletteChoice.push(colourPick);
		$.each(artApp.paletteChoice, function(i, colour) {
			$('.paletteChoiceContainer__paletteChoice--' + i).css("background-color", colour);
		});
	});
}

artApp.resetColours = function() {
	$('body').on('click', '.paletteChoiceContainer__header--reset', function(event) {
		event.preventDefault();
		console.log('fire!');
		artApp.resetPaletteChoice();
		$('.layoutArea').toggle();
	});
}

artApp.layoutColours = function() {
	$('.paletteChoiceContainer__layoutButton').on('click', function() {
		if ($('.layoutArea').css('display') === 'none') {
			$('.layoutArea').css('display', 'block');
		}
		$('html,body').animate( {
        scrollTop: $(".layoutArea").offset().top
       },
        'slow');

		var primaryColour = artApp.paletteChoice[0];
		var secondaryColour = artApp.paletteChoice[1];
		var tertiaryColour = artApp.paletteChoice[2];

		$('.layoutArea__header').css('background-color', primaryColour);
		$('.layoutArea__footer').css('background-color', primaryColour);
		$('.layoutArea__heroArea').css('background-color', secondaryColour);
		$('.layoutArea__mainContent').css('background-color', secondaryColour);
		$('.layoutArea__asideContent').css('background-color', tertiaryColour);
	});
}

//ART APP INITIALIZE
artApp.init =  function() {
	artApp.getPainting();
	artApp.createPalette();
	artApp.pickColour();
	artApp.resetColours();
	artApp.layoutColours(artApp.paletteChoice);
}
