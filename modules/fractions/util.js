
function rational_compare( fraction_a, fraction_b ) {
	
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

function rational_simplify( rational ) {
	
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

function unique_rationals_array( count, max_denominator ) {
	
	var result = [];
	var fraction;
	for( var i=0; i<count; i++ ) {
		do {
			fraction = Rational( max_denominator );
		} while( !result.every( function(r) { return rational_compare(r, fraction) != 0 } ) );
		result[i] = fraction;
	}

	return result;
}


function add_fraction_canvas( parent_element, id, size, onclick_handler ) {
	
	var canvas = document.getElementById( id );
	
	if( canvas == null ) {
		var canvas = document.createElement("canvas");
		canvas.setAttribute("id", id);
		canvas.setAttribute("class", "fraction");
		parent_element.appendChild( canvas );
	}
	// if it already exists, still set the right handler and size
	canvas.setAttribute("width", size);
	canvas.setAttribute("height", size);
	canvas.onclick = onclick_handler;
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
	var start_angle = Math.PI * 2 * Math.random();
	
	ctx.fillStyle = "orange";
	ctx.lineWidth = 1;
	for( var i=0; i<rational.den; i++ ) {
		// draw a pie slice
		ctx.lineTo( mid.x, mid.y );
		ctx.arc( mid.x, mid.y, radius, start_angle + i*distance, start_angle + (i+1)*distance, false);
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

function draw_fraction_as_text( canvas, rational ) {
	
	var width = canvas.width;
	var height = canvas.height;
	
	var ctx = canvas.getContext("2d");
	ctx.fillStyle = "rgb(255,255,255)";
	ctx.fillRect(0, 0, width, height);
	
	print_fraction( ctx, rational, width, height, 4 );
}

function print_fraction( ctx, rational, width, height, scale ) {
	
	scale = scale == null ? 1 : scale;
	
	var font_size_px = Math.ceil(height / 10*scale);
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

var fraction_slash = '&frasl;';

function numerator( n ) {

	var out = "&#x"; // unicode entity in hex
	if( n == 1 ) {
		out += '00b9';
	} else if( n == 2 ) {
		out += '00b2';
	} else if( n == 3 ) {
		out += '00b3';
	} else if( n > 9 ) {
		return numerator( Math.floor(n/10) ) + numerator( n % 10 );
	} else {
		out += '207' + n;		
	}
		
	return out + ";";
}
function denominator( n ) {

	var out = "&#x"; // unicode entity in hex
	if( n > 9 ) {
		return denominator( Math.floor(n/10) ) + denominator( n % 10 );
	} else {
		out += '208' + n;		
	}
		
	return out + ";";
}

function html_entity_from_fraction( num, den ) {
	return numerator(num) + fraction_slash + denominator(den);
}



function create_correction_generic( correct_answer ) {

	var canvas = document.createElement("canvas");
	canvas.setAttribute("width", "160px");
	canvas.setAttribute("height", "160px");
	draw_fraction_as_circle( canvas, correct_answer, true);
	
	return canvas;
}
