$(document).ready(function() {
	$("#submit-challenge-button").click(function () {
		$('this').hide();
		$('#form').show();
	});

	$("#challenge-submit-button").click(function () {
		$.ajax({
			type: "POST",
			url: "/category/",
			data: { challenge: $('#challenge-input').val(),
					unit: $('#unit-input').val(),
					quant: $('input[name="quant"]:checked').val(),
					order: $('input[name="order"]:checked').val()},
			success: function(data) {
				location.reload();
			}
		});	
	});

	$("#challenge-button").click(function () {
		$.ajax({
			type: "POST",
			url: "/entry/",
			data: { },
			success: function(data) {
				location.reload();
			}
		});	
	});
});