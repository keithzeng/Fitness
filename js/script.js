(function() {
	//window size change change css property
	$(document).ready(function() {
		$('.menu-holder').hide();
		$('.difficulty-level').hide();
		$('.muscle-title').hide();
		$('.show-diffexercise').hide();
		$('.show-diffmuscle').hide();
	});


	// $(window).resize(function() {
	//    scale();
	// });
	
	function scale(){
		if ($(window).width() > 1024){	
			$('#explanation img').height($('.boxes-holder').height());
		}
		else {
			$('#explanation img').height("100%");
		}	
	}

	//clicking on top navigation
	var j=-1
		,menuHolder=$('.menu-holder');
	$(".menu>ul>li:not('.logo')").on('click', function(e){
		e.preventDefault();
		$('.general ul').hide('slow');
		var i=$(this).index()
		    ,className = $(this).attr('class')
		    ,menuHolder=$('.menu-holder'),
		    aboutClass='.about-'+className;
		if (j===-1) {
			menuHolder.slideDown('slow');
			$(aboutClass).show();
			$('.menu-holder>div').not(aboutClass).hide();
			j=i;
		} else if (i!=j) {
			$(aboutClass).show();
			$('.menu-holder>div').not(aboutClass).hide();
			j=i;
		} else if (i===j) {
			menuHolder.slideUp('slow', function(){
				menuHolder.find('span').text('+');
				j=-1;
			});
		};
	});

	// closing menu outside of menu
	menuHolder.click(function() {
		menuHolder.slideUp('slow', function(){
			menuHolder.find('span').text('+');
			j=-1;
		});
	});

	//clickiing within menu-holder
	$('ul li').on('click', function(e){
		e.preventDefault();
		e.stopPropagation();
		$(this).find('>ul').slideToggle();
		$(this).siblings().find('ul').hide();
		$(this).siblings().find('span').text('+');
		$(this).find('>a>span').text(function(i, text){
			return text === "+" ? "-" : "+";
      	})
	}).children('ul').on('click', function(e){
  		return false;
  	});

	//loading different info into div
	function loadContent(exercise){
		$('.boxes-holder img').hide();
		$('.difficulty-level').show();
		$('.muscle-title').show();
		$('.show-diffexercise').show();
		$('.show-diffmuscle').show();
		$('.boxes-holder').load('content.html .box'+'.'+exercise, function() {
			addingExercise();
			var numOfBoxes=24;
			showMore(numOfBoxes);
			addStar();
			getThumbnail();
    		imgClicked();
		});
	}

	function showMore(numOfBoxes){
		var indexOfLastBox=numOfBoxes-1;
		$('.box:gt('+indexOfLastBox+')').hide();
		$('.show-diffexercise .prev').click(function() {
		    var first = $('.boxes-holder').children('.box:visible:first');
		    first.prevAll(':lt('+numOfBoxes+')').show();
    		first.prev().nextAll().hide();
		});
		$('.show-diffexercise .next').on('click',function() {
		    var last =  $('.boxes-holder').children('.box:visible:last');
		    last.nextAll(':lt('+numOfBoxes+')').show();
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
		$('.box a').on('click', function(e){
			e.preventDefault();
			var exerciseName=$(this).parent().attr('id');
			var allClassesName=$('#'+exerciseName).attr('class')
			var classArray=allClassesName.split(" ");
		    $('#explanation img').hide();
		    $('#explanation').load('content.html '+'.'+exerciseName, function() {
		    	muscleWorkedOn(classArray,"primary-");
		    	muscleWorkedOn(classArray,"secondary-");
		    	var diagramSrc='images/diagram/'+generalExercise+'.jpg';
		   		$('.diagram img').attr('src',diagramSrc);
	    	});
	    });
	}

	function muscleWorkedOn(classArray,check){
		var cls = $.map(classArray, function (val, i) {
			if (val.indexOf(check) > -1) {
				return val.slice(check.length, val.length)
			}
		});
		muscle=cls.join(', ');
		var muscleFocus=check.replace("-","");
		$('.'+muscleFocus).text(muscleFocus+': '+muscle.replace(/-/g," "));
	}

	function getThumbnail(){
		$('.box img').each(function(){
			var youtubeUrl = $(this).parent().attr('href');
			var videoId = youtubeUrl.substr(youtubeUrl.lastIndexOf("/") + 1);
			var thumbnail="http://img.youtube.com/vi/"+videoId+"/0.jpg";
			$(this).attr("src", thumbnail);
		})
	}

	var exercise,
		generalExercise;

	$('.general>ul>li>a').on('click', function(e){
			e.preventDefault();
		    exercise = $(this).text().replace('+','');
		    generalExercise=exercise;
		    loadContent(exercise);
	});

	$('.general>ul>li>ul>li>a').on('click', function(e){
	    e.preventDefault();
	    exercise = $(this).text();
	    exercise='primary-'+exercise.replace(' ','-');
	    loadContent(exercise);
	});

	$('.difficulty-level a').on('click', function(e){
	    e.preventDefault();
	    var level = $(this).find('h3').text();
	    var exerciseLevel=exercise+'.'+level;
	    loadContent(exerciseLevel);
	});

	$('.muscle-title a').on('click', function(e){
	    e.preventDefault();
	    var imgName=$(this).find('h3').text();
	    imgName=imgName.replace(/ /g,"-")
	    var newImgUrl="images/"+imgName+".jpg"
	    $('#explanation img').attr('src',newImgUrl);
	});

	//drag and drop
	$( ".drop-area" ).droppable({drop: function( event, ui ) {
        $( this ).addClass( "ui-state-highlight" ).find( "p" ).html( "Dropped!" );
      }
    });
	function addingExercise(){
		$('.box').draggable({
			appendTo: 'body',
			helper: 'clone', 
			zIndex:	350, 
    		revert: "invalid",
    		snap: ".draggableContainer",
    		stack: ".draggable"
		});
		$( ".box" ).on( "drag", function( event, ui ) {
			var addedExercise=$(this).attr("id");
			addedExercise=addedExercise.replace(/-/g," ");
			$( ".drop-area" ).droppable(
				{drop: function( event, ui ) {
			    	$( this ).find("p").remove();
			    	$( this ).find("ul").append("<li>"+addedExercise+"</li>");
			    }
			});
		});
	}

	$(".workout-day button").on('click', function(e){
		$( ".drop-area" ).html("<ul></ul><p>drop your exercise here<p>")
	});

})();