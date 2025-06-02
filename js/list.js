function wordlist(ord, list) {
	tl = 0;
	fl = 20;
	QA = new Array();
	let k = 0;
	let domain = "./src/";
	let jurl = domain + (ord ? "order/" : "disorder/") + list + ".json";
	$.ajaxSettings.async = false;
	$.getJSON(jurl, function (data) {
		tl = data.length;
		let m = mess(k, fragtop(k, tl, fl));
		$.each(data, function (i, item) {
			QA[m[k % fl]] = [item.Question, item.Answer, item.Options];
			k++;
			if (k >= top) { return; }
			else if (k % fl == 0) { m = mess(k, fragtop(k, tl, fl)); }
		})
	});
}

function fragtop(k, tl, fl) {
	let t = fl * (1 + Math.floor(k / fl));
	return fl - ((t > tl) ? (t - tl) : 0);
}

function randAns(opt, ans) {
	if (opt != "") {
		return Math.random() >= 0.5 ? opt : ans;
	}
	else {
		return ans;
	}
}

function insElement(id, obj) {
	let e = document.getElementById(id);
	e.appendChild(obj);
}

function updElement(id, ans, opt) {
	let kn = 0;
	let e = document.getElementById(id).childNodes[0];
	if (e != null) {
		let type = e.tagName;
		let inner = e.innerHTML;
		let p = e.parentNode;
		p.removeChild(e);
		let en = document.createElement(type);
		en.style.color = (inner == ans || inner == opt) ? "green" : "red";
		en.innerHTML = inner;
		p.appendChild(en);
		if (en.style.color == "green") { kn = 1; }
	}
	return kn;
}

function clearChilds(id) {
	let e = document.getElementById(id);
	let childs = e.childNodes;
	for (let i = 0; i < childs.length; i++) {
		e.removeChild(childs[i]);
	}
}

function updChild(id, ans, opt) {
	clearChilds(id);
	let e = document.getElementById(id);
	let c = document.createElement("p");
	if (opt != "") { ans += ("/ " + opt); }
	c.innerHTML = ans;
	e.appendChild(c);
}

function disorganize(arr) {
	let _floor = Math.floor, _random = Math.random,
		len = arr.length, i, j, arri,
		n = _floor(len / 2) + 1;

	while (n--) {
		i = _floor(_random() * len);
		j = _floor(_random() * len);
		if (i !== j) {
			arri = arr[i];
			arr[i] = arr[j];
			arr[j] = arri;
		}
	}
	return arr;
}

function mess(s, n) {
	let arr = new Array(n);
	for (let i = 0; i < n; i++) {
		arr[i] = s + i;
	}
	return disorganize(arr);
}

function vocNum() {
	let obj = document.getElementById("list");
	let index = obj.selectedIndex;
	return parseInt(obj.options[index].value, 10);
}

function chapter() {
	ClearTable();
	InitTable();
	loadQA();
	InitDrag();
	BtnDisable();
	RecBtn();
}

function pageUp() {
	let n = vocNum() - 1;
	if (n >= 1) {
		$("#list").val(n);
		chapter();
	}
}

function pageDown() {
	let n = vocNum() + 1;
	let top = Math.ceil(tl / fl);
	if (n <= top) {
		$("#list").val(n);
		chapter();
	}
}

function BtnDisable() {
	let n = vocNum();
	let nt = Math.ceil(tl / fl);
	if (n <= 1) {
		$("#Previous").attr("disabled", true);
		$("#Next").attr("disabled", false);
	}
	else if (n >= nt) {
		$("#Previous").attr("disabled", false);
		$("#Next").attr("disabled", true);
	}
	else {
		$("#Previous").attr("disabled", false);
		$("#Next").attr("disabled", false);
	}
}

function ClearTable() {
	let table = document.getElementById("ans");
	let rows = table.rows.length;
	for (i = 0; i < rows - 1; i++) {
		let oi = document.getElementById("O" + (i + 1));
		let tr = oi.parentNode;
		tr.parentNode.removeChild(tr);
	}
}

function InitTable() {
	let k = fl * vocNum();
	let n = fl - ((k > tl) ? (k - tl) : 0);
	let tab = document.getElementById("ans");
	let tb = tab.getElementsByTagName("tbody")[0];
	document.getElementById("keys").innerHTML = "Options";
	for (let i = 0; i < n; i++) {
		let tr = document.createElement("tr");
		let td1 = document.createElement("td");
		let td2 = document.createElement("td");
		td2.className = "sheet";
		td2.id = "O" + (i + 1);
		let td3 = document.createElement("td");
		td3.className = "sheet";
		td3.id = "K" + (i + 1);
		let p = document.createElement("p");
		p.id = "Q" + (i + 1);
		let sp = document.createElement("span");
		sp.id = "A" + (i + 1);
		td1.appendChild(p);
		td3.appendChild(sp);
		tr.appendChild(td1);
		tr.appendChild(td2);
		tr.appendChild(td3);
		tb.appendChild(tr);
	}
}

function loadList() {
	let n = Math.ceil(tl / fl);
	let lst = document.getElementById("list");
	document.getElementById("top").innerHTML = n;
	for (let i = 0; i < n; i++) {
		let newOpt = document.createElement("option");
		newOpt.value = i + 1;
		newOpt.innerHTML = newOpt.value;
		lst.appendChild(newOpt);
	}
}

function loadQA() {
	let n = fl * (vocNum() - 1);
	let j = (n + fl > tl) ? (tl - n) : fl;
	let m = mess(1, j);
	for (let i = 0; i < j; i++) {
		let qi = document.getElementById("Q" + (i + 1));
		let ai = document.getElementById("A" + m[i]);
		qi.innerHTML = QA[n + i][0];
		ai.innerHTML = randAns(QA[n + i][2], QA[n + i][1]);
	}
}

function loadKO() {
	let kn = 0;
	let n = fl * (vocNum() - 1);
	let j = (n + fl > tl) ? (tl - n) : fl;
	for (let i = 0; i < j; i++) {
		let ans = QA[n + i][1];
		let opt = QA[n + i][2];
		kn += updElement("O" + (i + 1), ans, opt);
		updChild("K" + (i + 1), ans, opt);
	}
	VaryBtn(kn, j);
}


function VaryBtn(kn, j) {
	let sbm = document.getElementById("Submit");
	sbm.id = "Redo";
	sbm.value = "[ Redo ]";
	document.getElementById("grade").innerHTML = kn + "/" + j;
	document.getElementById("keys").innerHTML = "Keys";
}

function RecBtn() {
	let redo = document.getElementById("Redo");
	redo.id = "Submit";
	redo.value = "[ Submit ]";
	document.getElementById("grade").innerHTML = "Answers";
	document.getElementById("keys").innerHTML = "Options";
}

function mode() {
	let url = window.location.href;
	let isg = parseInt(url.split("?")[1], 10);
	return (isg == 0);
}

function getlist() {
	let url = window.location.href;
	return url.split("&")[1];;
}

$(document).on("click", "#Next", function () {
	pageDown();
});

$(document).on("click", "#Previous", function () {
	pageUp();
});

$(document).on("change", "#list", function () {
	chapter();
});

$(document).on("click", "#Submit", function () {
	loadKO();
});

$(document).on("click", "#Redo", function () {
	chapter();
});

$(document).on("click", "#Quit", function () {
	window.location.href = "index.html";
});

window.onload = function () {
	wordlist(mode(), getlist());
	loadList();
	InitTable();
	loadQA();
	InitDrag();
	BtnDisable();
}