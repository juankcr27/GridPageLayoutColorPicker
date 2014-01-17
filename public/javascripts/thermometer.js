$(document).ready(function() {
	var server = io.connect('http://192.168.188.129:8080');
	//create the 10 x 10 grid
	createGrid();
	
	//handle onclick event over the grid cells
	$(".grid-cell").on("click", function() {
		var $self = $(this);
		var getColumn = $self.index();
		var getRow = $self.parent().index();
		
		var colorPicker = "#color-picker";
		var color = $(colorPicker).val();
		
		changeColor($self, color);

		server.emit('changeColor', {
			x: getRow,
			y: getColumn,
			color: color
		});
	});

	server.on('changeColor', function(data) {
		var $element = $('table').find('tr').eq(data.x).find('td').eq(data.y);
		changeColor($element, data.color);
	});

	server.on('loadColors', function(colors) {
		for(var i in colors){
			var splitColors = i.split('x'),
				color = colors[i],
				$element = $('table').find('tr').eq(splitColors[0]).find('td').eq(splitColors[1]);
			changeColor($element, color);
		}
	});

	function changeColor($element, color) {
		$element.css({
			"background-color": color,
			color: (parseInt(color, 16) > 0xffffff/2) ? 'black':'white'
		});
	}

	function createGrid() {
		var $table = $("<table>");
		
		for(var i = 0; i < 10; i++){
			var $row = $("<tr>");
			
			$table.append($row);
			for(var j = 0; j < 10; j++){
				
				var $column = $("<td class='grid-cell'>").text(i*10+j+1);			
			
				$row.append($column);
			}
			
		}
		
		var gridSection = "#grid-section";
		$(gridSection).append($table);
	}
});