// Fisher-Yates
function shuffle( array ) {
	
    var counter = array.length, temp, index;

    // While there are elements in the array
    while (counter > 0) {
        // Pick a random index
        index = Math.floor(Math.random() * counter);

        // Decrease counter by 1
        counter--;

        // And swap the last element with it
        temp = array[counter];
        array[counter] = array[index];
        array[index] = temp;
    }

    return array;
}

// ensure a/b where a<b
function Rational( max_denominator ) {

	if( max_denominator === undefined ) {
		max_denominator = 20;
	}
	
	// make sure denominator is never 1
	var denominator = 1 + Math.ceil(Math.random() * (max_denominator-1) );
	var numerator = Math.ceil(Math.random()*(denominator-1));
	
	return {
		num: numerator,
		den: denominator
	};
}

function Cmp( fraction_a, fraction_b ) {
	
	var val_a = fraction_a.num * fraction_b.den;
	var val_b = fraction_b.num * fraction_a.den;
	
	if( val_a > val_b ) {
		return 1;
	}
	if( val_b > val_a ) {
		return -1;
	}
	
	return 0;
	
}

function Simplify( rational ) {
	
	var small = rational.num;
	var large = rational.den;

	while( large % small != 0 ) {
		large = large % small;
		var temp = large;
		large = small;
		small = temp;
	}
	
	return {
		num: rational.num / small,
		den: rational.den / small
	};
}

function add_fraction_canvas( parent_element, id, size, onclick_handler ) {
	
	var canvas = document.getElementById( id );
	
	if( canvas == null ) {
		
		var canvas = document.createElement("canvas");
		canvas.setAttribute("id", id);
		canvas.setAttribute("width", size);
		canvas.setAttribute("height", size);
		canvas.setAttribute("class", "fraction");
		canvas.onclick = onclick_handler;
		document.getElementById( parent_element ).appendChild( canvas );
	}
	
}


function draw_fraction_as_circle( canvas, rational, show_as_text ) {
	
	var width = canvas.width;
	var height = canvas.height;
	var y_offset = height/4;
	
	var ctx = canvas.getContext("2d");
	
	var mid = {
		x: width/2,
		y: (height - y_offset)/2
	};
	var radius = width/3;

	// this clears the subpaths (since we redraw the same canvas, this would lead to redrawing all old lines)
	ctx.beginPath();
	
	ctx.fillStyle = "rgb(255,255,255)";
	ctx.fillRect(0, 0, width, height);
	
	var distance = (Math.PI * 2) / rational.den;
	
	ctx.fillStyle = "orange";
	ctx.lineWidth = 3;
	for( var i=0; i<rational.den; i++ ) {
		// draw a pie slice
		ctx.lineTo( mid.x, mid.y );
		ctx.arc( mid.x, mid.y, radius, 0, (i+1)*distance, false);
		ctx.lineTo( mid.x, mid.y );
		if( i < rational.num ) {
			ctx.fill();
		}
		ctx.stroke();	
	}

	if( show_as_text ) {
		print_fraction( ctx, rational, width, height );
	}

}

function print_fraction( ctx, rational, width, height ) {
	
	var font_size_px = Math.ceil(height / 10);
	ctx.font = font_size_px + "px monospace";
	ctx.fillStyle = "black";
	ctx.lineWidth = 3;
	
	var n_width = ctx.measureText("" + rational.num).width;
	var d_width = ctx.measureText("" + rational.den).width;
	var bar_width = n_width > d_width ? n_width : d_width;

	
	var x_start = width/2 - (bar_width/2);
	ctx.moveTo( x_start, height - font_size_px + ctx.lineWidth);
	ctx.lineTo( x_start+bar_width, height - font_size_px + ctx.lineWidth);
	ctx.stroke();

	ctx.fillText("" + rational.num, width/2 - n_width/2, height - font_size_px - ctx.lineWidth);
	ctx.fillText("" + rational.den, width/2 - d_width/2, height - ctx.lineWidth);
	
}

function clear_element( id ) {
	
	var el = document.getElementById( id );
	while( el.hasChildNodes() ) {
		el.removeChild( el.firstChild );
	}
	
}

function show_next_level_panel() {
	
	// clear the main div
	clear_element( "main" );
	
	var caption = levels.length > 0 ? "Volgende level:<br>" + levels[0].data().name : "Alle levels gedaan!";	
	
	var panel = document.createElement("div");
	panel.setAttribute("class", "panel");
	panel.innerHTML = caption;

	if( levels.length > 0 ) {
		panel.onclick = function() {
			clear_element("main");
			start_level();
		}		
	}
		
	document.getElementById("main").appendChild( panel );
	
}

function feedback( params ) {
	

	var feedback_panel = document.createElement("div");
	feedback_panel.setAttribute("class", "feedback");
	var title = document.createElement("h2");
	title.appendChild( document.createTextNode( params.title) );
	feedback_panel.appendChild( title );

	feedback_panel.appendChild( document.createTextNode( "Het goede antwoord was:") );
	var canvas = document.createElement("canvas");
	canvas.setAttribute("width", "160px");
	canvas.setAttribute("height", "160px");
	feedback_panel.appendChild( canvas );
	
	draw_fraction_as_circle( canvas, params.right_answer, true);
	
	document.getElementById("main").appendChild( feedback_panel );
	
	// give the browser a little time to start, otherwise the transition will happen instantaneously
	window.setTimeout( function() { feedback_panel.classList.add("feedback_fadeout"); }, 100 );
	// remove it after the animation has ended
	window.setTimeout( function() { document.getElementById("main").removeChild(feedback_panel) }, 5*1000 );
	
}

