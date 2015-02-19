(function($) {

	$.fn.druckerfreund = function(params) {
		var options = $.extend({
			data: 'data/printers.json',
			drivers: 'data/drivers.json'
		}, params);
		var printers = {};
		var driver = {};
		var Super = this;
		var def = '';
		var model = {
			printer: function(data){
				var o = def === data.qname ? ' -d ' : '';
				var name = data.name === '' ? data.qname : data.name; 
				return '/usr/sbin/lpadmin -p ' + data.qname + o + '-L "' 
					+ data.location + '" -E -v ' + options.domain + data.name 
					+ ' -P "/Library/Printers/PPDs/Contents/Resources/' + driver[data.driver] + '"'
					+ ' -D "' +  name + '"';
			}
		};
		$.getJSON( options.data, function( data ) {
			$.each( data, function( n, item ) {
				printers[item.qname] = item;
				var option = $('<option value=\"' + item.qname + '\">' + item.name + '</option>');
				if($("optgroup[label=\'" + item.group + "\']").html() == null ) $(Super).append('<optgroup label=\"' + item.group + '\"></optgroup>');
				$("optgroup[label=\'" + item.group + "\']").append(option);
			});
		});
		$.getJSON( options.drivers, function( data ) {
			driver = data;
		});
		options.thatbooton.click(function(){
			options.shell.html('');
			$('option:selected', $(Super)).each(function() {
				options.shell.append('<p>' + model.printer(printers[$(this).attr('value')]) + '</p>');
			});
			window.location.href = '#shell';
		});
		$(Super).change(function(){
			if($('option:selected', Super).length > 0){
				$(options.def_printer).html('<option></option>')
				$('option:selected', Super).each(function() {
					 $(options.def_printer).append('<option value=\"' + $(this).attr('value') + '\">' + $(this).attr('value') + '</option>');
				})
				$(options.def_printer).prop('disabled', false);
			}else{
				$(options.def_printer).html('<option></option>')
				$(options.def_printer).prop('disabled', true);
				def = '';
			}
		});
		$(options.def_printer).change(function(){
			$('option:selected', options.def_printer).each(function() {
				def = $(this).attr('value');
			})
		})
	};
	
}(jQuery));
