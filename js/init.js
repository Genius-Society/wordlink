function adjustBody()
{
	var mt = $(document.body).height() - ($(".body").height() + 20);	
	$(".body").css("marginTop", 0.5 * mt);
}
 
window.onload = function()
{
	adjustBody();
}

window.onresize = function()
{
	adjustBody();
}

function porp(x, y)
{ 
	var a = x.Tables_in_wordlist.replace(/[^0-9]/ig, '');
	var b = y.Tables_in_wordlist.replace(/[^0-9]/ig, '');
	return parseInt(a) > parseInt(b) ? 1 : -1; 
}

function loadUnits(domain)
{
	var count = 0;
	var jurl = domain + "/mybackend/wordlist/index.php";
	
	$.ajaxSettings.async = false;
	$.getJSON(jurl, function (data)
	{		
		var uselect = $(".ui-select");
		data.sort(porp);
		$.each(data, function(i, item)
		{
			if(count == 0)
			{
				uselect.append('<option selected value="0">' + item.Tables_in_wordlist + '</option>');
			}
			else
			{
				uselect.append('<option value="' + count.toString() + '">' + item.Tables_in_wordlist + '</option>');
			}
			
			count++;
		})
		
	});
	
}

$(function()
{
	loadUnits("https://georgechou21.asuscomm.com:4443");
});