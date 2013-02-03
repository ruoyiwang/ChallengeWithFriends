$(document).ready(function() {
	$("#submit-challenge-button").click(function () {
		$('this').hide();
		$('#form').show();
	});

	$("#form").hover(function() {}, function() {
		$('#form').hide();
		$('#submit-challenge-button').show();
	});

	$("#challenge-submit-button").click(function () {
		$.ajax({
			type: "POST",
			url: "/category/",
			data: { category: $('#challenge-input').val() },
			success: function(data) {
				location.reload();
			}
		});	
	});

	$("#challenge-button").click(function () {
		picGo();
		/*$.ajax({
			type: "POST",
			url: "/entry/",
			data: { },
			success: function(data) {
				location.reload();
			}
		});*/	
	});
});