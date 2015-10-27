(function() {
	//window size change change css property
	$(document).ready(function() {
		scale();
		$('.general div').hide();
		$('.difficulty-level').hide();
		$('.show-diffexercise').hide();
	});

	$(window).resize(function() {
	   scale();
	});

	var allExercises;
	var numOfBoxes;
	function scale(){
		if ($(window).width() < 410){	
			$('#container').removeClass().addClass('tiny');
			numOfBoxes=18;
			showMore(allExercises,numOfBoxes);
		}
		else if ($(window).width() < 550){	
			$('#container').removeClass().addClass('small');
			numOfBoxes=20;
			showMore(allExercises,numOfBoxes);
		}
		else if ($(window).width() < 700){	
			$('#container').removeClass().addClass('medium');
			numOfBoxes=25;
			showMore(allExercises,numOfBoxes);
		}
		else if ($(window).width() < 950){	
			$('#container').removeClass().addClass('large');
			numOfBoxes=28;
			showMore(allExercises,numOfBoxes);
		}
		else {
			$('#container').removeClass();
			numOfBoxes=35;
			showMore(allExercises,numOfBoxes);
		}	
	}

	//navigation clicking open different links
	$('.category').on("click", function(e) {
		e.preventDefault();
		var id = $(this).attr('id');
	    $('#about-'+id).toggle('fast');
	    $('.general div').not('#about-'+id).hide();
	});

	$('#about-muscle>a').on("click", function(e) {
		e.preventDefault();
		var muscle = $(this).text();
	    $('.'+muscle).show('fast');
	});

	//loading different info into div
	function loadContent(exercise){
		$('.boxes-holder img').hide();
		$('.difficulty-level').show();
		$('.show-diffexercise').show();
		$('.boxes-holder').load('content.html .box'+'.'+exercise, function() {
			sortDifficutly();
			addStar();
			allExercises = $('.boxes-holder').html();
			showMore(allExercises,numOfBoxes);
    		imgClicked();
		});
	}

	function showMore(allExercises,numOfBoxes){
		var numOfExercise=numOfBoxes-1;
		var indexOfLastExerciseShow=numOfExercise-1;
		$('.boxes-holder').html(allExercises);
		$('.box:gt('+indexOfLastExerciseShow+')').hide();
		$('.prev').click(function() {
		    var first = $('.boxes-holder').children('.box:visible:first');
		    first.prevAll(':lt('+numOfExercise+')').show();
    		first.prev().nextAll().hide();
		});
		$('.next').on('click',function() {
		    var last =  $('.boxes-holder').children('.box:visible:last');
		    last.nextAll(':lt('+numOfExercise+')').show();
    		last.next().prevAll().hide();
		});
	}

	function addStar(){
		$('.boxes-holder .beginner').append('<div class="rating"><span>★</span><span>☆</span><span>☆</span></div>');
		$('.boxes-holder .intermediate').append('<div class="rating"><span>★</span><span>★</span><span>☆</span></div>');
		$('.boxes-holder .advanced').append('<div class="rating"><span>★</span><span>★</span><span>★</span></div>');
	}

	function sortDifficutly(){
		var elem = $('.boxes-holder').find('.beginner').sort(sortMe);
		$('.boxes-holder').append(elem);
		elem = $('.boxes-holder').find('.intermediate').sort(sortMe);
		$('.boxes-holder').append(elem);
		elem = $('.boxes-holder').find('.advanced').sort(sortMe);
		$('.boxes-holder').append(elem);
	}

	function sortMe(a, b) {
		return a.className < b.className;
	}

	function imgClicked(){
		$('.box').on('click', function(e){
		    e.preventDefault();
		    var exerciseName = $(this).attr('id');
		    $('#explanation img').hide();
		    $('#explanation').load('content.html '+'.'+exerciseName, function() {
		    	muscleWorkedOn("primary-");
		    	muscleWorkedOn("secondary-");
		    	var diagramSrc='images/diagram/'+generalExercise+'.jpg';
		   		$('.diagram img').attr('src',diagramSrc);
		   		// getThumbnail(exerciseName);
	    	});
	    });
	}

	function muscleWorkedOn(check){
		$('[class^='+check+'], [class*='+check+']').each(function () {
			var className = this.className;
			var cls = $.map(this.className.split(' '), function (val, i) {
				if (val.indexOf(check) > -1) {
				    return val.slice(check.length, val.length)
				}
			});
		muscle=cls.join(', ');
		});
		var muscleFocus=check.replace("-","");
		$('.'+muscleFocus).text(muscleFocus+': '+muscle.replace(/-/g," "));
	}

	function getThumbnail(exerciseName){
		var youtubeUrl = $("iframe").attr('src');
		var videoId = youtubeUrl.substr(youtubeUrl.lastIndexOf("/") + 1);
		var thumbnail="http://img.youtube.com/vi/"+videoId+"/0.jpg";
		$('#'+exerciseName+' img').attr('src',thumbnail);
	}

	// function getThumbnail(exerciseName){
	// 	var youtubeUrl = $("iframe").attr('src');
	// 	var videoId = youtubeUrl.substr(youtubeUrl.lastIndexOf("/") + 1);
	// 	var thumbnail="http://img.youtube.com/vi/"+videoId+"/0.jpg";
	// 	$('#'+exerciseName+' img').attr('src',thumbnail);
	// }

	var exercise,
		generalExercise;

	$('.general >div >a').on('click', function(e){
			e.preventDefault();
		    exercise = $(this).text();
		    generalExercise=exercise;
		    loadContent(exercise,numOfBoxes);
	});

	$('.general .specific a').on('click', function(e){
	    e.preventDefault();
	    exercise = $(this).text();
	    exercise='primary-'+exercise.replace(' ','-');
	    loadContent(exercise,numOfBoxes);
	});

	$('.difficulty-level a').on('click', function(e){
	    e.preventDefault();
	    var level = $(this).attr('class');
	    exercise=exercise+'.'+level;
	    loadContent(exercise);
	});

})();