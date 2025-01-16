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

// function porp(x, y) {
// 	let a = x.Tables_in_wordlist.replace(/[^0-9]/ig, '');
// 	let b = y.Tables_in_wordlist.replace(/[^0-9]/ig, '');
// 	return parseInt(a) > parseInt(b) ? 1 : -1;
// }

function loadUnits(domain) {
	let count = 0;
	let jurl = domain + "wordlist.json";

	$.ajaxSettings.async = false;
	$.getJSON(jurl, function (data) {
		let uselect = $(".ui-select");
		// data.sort(porp);
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
	loadUnits("https://www.modelscope.cn/datasets/Genius-Society/wordlink/resolve/master/units/");
});