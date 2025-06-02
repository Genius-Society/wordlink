function adjustBody() {
	let mt = $(document.body).height() - ($(".body").height() + 20);
	$(".body").css("marginTop", 0.5 * mt);
}

window.onload = function () {
	adjustBody();
}

window.onresize = function () {
	adjustBody();
}

function loadUnits(domain) {
	let count = 0;
	let jurl = domain + "wordlist.json";
	$.ajaxSettings.async = false;
	$.getJSON(jurl, function (data) {
		let uselect = $(".ui-select");
		$.each(data, function (i, item) {
			if (count == 0) {
				uselect.append('<option selected value="0">unit' + item.Tables_in_wordlist + '</option>');
			}
			else {
				uselect.append('<option value="' + count.toString() + '">unit' + item.Tables_in_wordlist + '</option>');
			}
			count++;
		})
	});
}

$(function () {
	loadUnits("./src/");
});