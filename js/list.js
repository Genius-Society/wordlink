 
function wordlist(ord, list){
	
	tl = 0;
	fl = 20;
	QA = new Array();
	
	var k = 0;
	var domain = "https://georgechou21.asuscomm.com:4443";
	var jurl = domain + "/mybackend/wordlist/index.php?list=" + list;
	
	$.ajaxSettings.async = false; 
	$.getJSON(jurl, function (data){
		tl = data.length;
		var m = mess(k, fragtop(k, tl, fl));
		$.each(data,function(i, item){ 
		
			QA[m[k % fl]] = [item.Question, item.Answer, item.Options];
			k++;
			
			if (k >= top) { return; }
			else if (k % fl == 0) { m = mess(k, fragtop(k, tl, fl)); }
			
		})
	});
	
	if (!ord) { QA = disorganize(QA); }
}

function fragtop(k, tl, fl){
	var t = fl * (1 + Math.floor(k / fl));
	return fl - ((t > tl) ? (t - tl) : 0);
}
 
function randAns(opt, ans){
	return (opt != "0" && Math.random() >= 0.5) ? opt : ans;
} 

function insElement(id, obj){
	var e = document.getElementById(id);
	e.appendChild(obj);
}

function updElement(id, ans, opt){
	var kn = 0;
	var e = document.getElementById(id).childNodes[0];
	if (e != null) {
		var type = e.tagName;
		var inner = e.innerHTML; 
		var p = e.parentNode;
		p.removeChild(e);
		
		var en = document.createElement(type);
		en.style.color = (inner == ans || inner == opt) ? "green" : "red";
		en.innerHTML = inner;
		p.appendChild(en);
		
		if (en.style.color == "green") { kn = 1; }
	}
	return kn;
}

function clearChilds(id){
	var e = document.getElementById(id);
	var childs = e.childNodes;
	for (var i = 0 ; i < childs.length ; i++){
		e.removeChild(childs[i]);
	}
}

function updChild(id, ans, opt){
	clearChilds(id);
	
	var e = document.getElementById(id);
	var c = document.createElement("p");
	if (opt != "0") { ans += ("/ " + opt); }
	c.innerHTML = ans;
	e.appendChild(c);
}

function disorganize(arr){
	var _floor = Math.floor, _random = Math.random, 
        len = arr.length, i, j, arri, 
        n = _floor(len / 2) + 1; 
    while(n--){ 
        i = _floor(_random() * len); 
        j = _floor(_random() * len); 
        if(i !== j){ 
            arri = arr[i]; 
            arr[i] = arr[j]; 
            arr[j] = arri;
        } 
    } 
    return arr;
}

function mess(s, n){
	var arr = new Array(n);
	for (var i = 0 ; i < n ; i++){
		arr[i] = s + i;
	}
    return disorganize(arr);
} 

/*------------------------------------------------------------*/

function vocNum(){
	var obj = document.getElementById("list");
	var index = obj.selectedIndex;
	return parseInt(obj.options[index].value, 10);
} 

function chapter(){
	ClearTable();
	InitTable();
	loadQA();
	InitDrag(); 
	BtnDisable();
	RecBtn();
}

function pageUp(){
	var n = vocNum() - 1;
	if (n >= 1) {
		$("#list").val(n);
		chapter();
	}
}

function pageDown(){
	var n = vocNum() + 1;
	var top = Math.ceil(tl / fl);
	if (n <= top) {
		$("#list").val(n);
		chapter();
	}
}

function BtnDisable(){ 
	var n = vocNum();
	var nt = Math.ceil(tl / fl);
	
	if (n <= 1) {
		$("#Previous").attr("disabled",true);
		$("#Next").attr("disabled",false);
	}
	else if (n >= nt){ 
		$("#Previous").attr("disabled",false);
		$("#Next").attr("disabled",true);
	}
	else {
		$("#Previous").attr("disabled",false);
		$("#Next").attr("disabled",false);
	}
	
}
 
function ClearTable(){
	var table = document.getElementById("ans");
	var rows = table.rows.length;
	
    for(i = 0 ; i < rows - 1 ; i++){
		var oi = document.getElementById("O" + (i + 1));
		var tr = oi.parentNode;
		tr.parentNode.removeChild(tr);
    }
}  
 
function InitTable(){
	
	var k = fl * vocNum(); 
	var n = fl - ((k > tl) ? (k - tl) : 0); 

	var tab = document.getElementById("ans");
	var tb = tab.getElementsByTagName("tbody")[0];
	document.getElementById("keys").innerHTML = "Options";
	
	for (var i = 0 ; i < n ; i++){
		
		var tr = document.createElement("tr");
		 			
		var td1 = document.createElement("td");
		var td2 = document.createElement("td"); 
		td2.className = "sheet";
		td2.id = "O" + (i + 1);
		var td3 = document.createElement("td");
		td3.className = "sheet";
		td3.id = "K" + (i + 1);
		
		var p = document.createElement("p");
		p.id = "Q" + (i + 1); 		
		var sp = document.createElement("span");
		sp.id = "A" + (i + 1);
		
		td1.appendChild(p);
		td3.appendChild(sp);
		
		tr.appendChild(td1);
		tr.appendChild(td2);
		tr.appendChild(td3);
		
		tb.appendChild(tr); 
	}
} 

function loadList(){ 
	var n = Math.ceil(tl / fl);
	var lst = document.getElementById("list");
	document.getElementById("top").innerHTML = n;
	for (var i = 0 ; i < n ; i++) {
		var newOpt = document.createElement("option");
		newOpt.value = i + 1;
		newOpt.innerHTML = newOpt.value;
		lst.appendChild(newOpt);
	} 
} 
 
function loadQA(){
	
	var n = fl * (vocNum() - 1); 
	var j = (n + fl > tl) ? (tl - n) : fl;
	var m = mess(1, j); 
	
	for (var i = 0 ; i < j ; i++) {
		var qi = document.getElementById("Q" + (i + 1));
		var ai = document.getElementById("A" + m[i]);
		qi.innerHTML = QA[n + i][0];
		ai.innerHTML = randAns(QA[n + i][2], QA[n + i][1]);
	} 
	
}

function loadKO(){
	
	var kn = 0;
	var n = fl * (vocNum() - 1);
	var j = (n + fl > tl) ? (tl - n) : fl;
	
	for (var i = 0 ; i < j ; i++) {
		var ans = QA[n + i][1];
		var opt = QA[n + i][2];
		kn += updElement("O" + (i + 1), ans, opt);
		updChild("K" + (i + 1), ans, opt); 
	}
	
	VaryBtn(kn, j);
	
} 


function VaryBtn(kn, j){ 
	var sbm = document.getElementById("Submit");
	sbm.id = "Redo";
	sbm.value = "[ Redo ]";
	
	document.getElementById("grade").innerHTML = kn + "/" + j;
	document.getElementById("keys").innerHTML = "Keys";
}

function RecBtn(){ 
	var redo = document.getElementById("Redo");
	redo.id = "Submit";
	redo.value = "[ Submit ]";
	
	document.getElementById("grade").innerHTML = "Answers";
	document.getElementById("keys").innerHTML = "Options";
}

function mode(){
	var url = window.location.href;
	var isg = parseInt(url.split("?")[1], 10);
	return (isg == 0);
} 

function getlist()
{
	var url = window.location.href;
	return url.split("&")[1];;
}

$(document).on("click","#Next",function(){
	pageDown(); 
});

$(document).on("click","#Previous",function(){
	pageUp(); 
});

$(document).on("change","#list",function(){
	chapter();
});

$(document).on("click","#Submit",function(){
	loadKO();
});

$(document).on("click","#Redo",function(){
	chapter();
});

$(document).on("click","#Quit",function(){
	window.location.href = "index.html";
});

window.onload = function() {
	wordlist(mode(), getlist()); 
	loadList();
	InitTable();
	loadQA();
	InitDrag(); 
	BtnDisable();
}