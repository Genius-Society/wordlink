function DeviceType()
{
	var system = {
		win : false,
		mac : false,
		xll : false
	};

	var p = navigator.platform;
	var ua = navigator.userAgent.toLowerCase();	
	
	system.win = p.indexOf("Win") == 0;
	system.mac = p.indexOf("Mac") == 0;
	system.x11 = (p == "X11") || (p.indexOf("Linux") == 0);
	
	return (system.win||system.mac||system.xll);
}

var isPC = DeviceType();

function AbsLeft(element)
{
	var left = element.offsetLeft;
	var parent = element.offsetParent;
	while(parent != null)
	{
		left += parent.offsetLeft;
		parent = parent.offsetParent;
	}
	return left;
}

function AbsTop(element)
{
	var top = element.offsetTop;
	var parent = element.offsetParent;
	while(parent != null)
	{
		top += parent.offsetTop;
		parent = parent.offsetParent;
	}
	return top; 
}

function AbsRight(Obj)
{
	var w = Obj.offsetWidth;
	return AbsLeft(Obj) + w;
}

function AbsBottom(Obj)
{
	var h = Obj.offsetHeight;
	return AbsTop(Obj) + h;
}

function  isButt(Obj,Con)
{
	
	var a1 = AbsLeft(Obj);
	var b1 = AbsTop(Obj);
	var c1 = AbsRight(Obj);
	var d1 = AbsBottom(Obj);
	
	var a2 = AbsLeft(Con);
	var b2 = AbsTop(Con);
	var c2 = AbsRight(Con);
	var d2 = AbsBottom(Con);
	
	return (a1 >= a2 && b1 >= b2 && c1 <= c2 && d1 <= d2);

}

function Dist(Obj,Con)
{
	
	var a1 = AbsLeft(Obj);
	var b1 = AbsTop(Obj);
	var c1 = AbsRight(Obj);
	var d1 = AbsBottom(Obj);
	
	var a2 = AbsLeft(Con);
	var b2 = AbsTop(Con);
	var c2 = AbsRight(Con);
	var d2 = AbsBottom(Con);
	
	var x1 = 0.5 * parseFloat((a1 + c1));
	var y1 = 0.5 * parseFloat((b1 + d1));
	var x2 = 0.5 * parseFloat((a2 + c2));
	var y2 = 0.5 * parseFloat((b2 + d2));
	
	var d = Math.sqrt((x1 - x2) * (x1 - x2) + (y1 - y2) * (y1 - y2));
	var t = 0.5 * parseFloat(Math.abs((d2 - b2)));
	
	return (d < t);
}

function getScrollTop() 
{
	var scrollPos = 0;
	if (window.pageYOffset) { scrollPos = window.pageYOffset; }
	else if (document.compatMode && document.compatMode != "BackCompat") { scrollPos = document.documentElement.scrollTop; }
	else if (document.body) { scrollPos = document.body.scrollTop; }
	return scrollPos;   
}


function Drag()
{
 //初始化
 this.initialize.apply(this, arguments)
}
Drag.prototype = {
 //初始化
 initialize : function (drag, options)
 {
  this.drag = this.$(drag);
  this._x = this._y = this._h = this._ch = 0;
  this._moveWheel = this.bind(this, this.moveWheel);	 
  this._moveDrag = this.bind(this, this.moveDrag);
  this._stopDrag = this.bind(this, this.stopDrag);

  this.setOptions(options);

  this.handle = this.$(this.options.handle);
  this.maxContainer = this.$(this.options.maxContainer);

  this.maxTop = Math.max(this.maxContainer.clientHeight, this.maxContainer.scrollHeight) - this.drag.offsetHeight; 
  this.maxLeft = Math.max(this.maxContainer.clientWidth, this.maxContainer.scrollWidth) - this.drag.offsetWidth; 
  
  this.onStart = this.options.onStart;
  this.onMove = this.options.onMove;
  this.onStop = this.options.onStop;

  this.handle.style.cursor = "move";
 
  this.addHandler(this.handle, (isPC ? "mousedown" : "touchstart"), this.bind(this, this.startDrag)) 
 }, 
 changeLayout : function (iLeft, iTop)
 { 
   (
  iTop + this.drag.offsetParent.offsetTop < 0 && (iTop = -this.drag.offsetParent.offsetTop),
  iLeft + this.drag.offsetParent.offsetLeft < 0 && (iLeft = -this.drag.offsetParent.offsetLeft),
  iTop + this.drag.offsetParent.offsetTop > this.maxTop && (iTop = this.maxTop - this.drag.offsetParent.offsetTop),
  iLeft + this.drag.offsetParent.offsetLeft > this.maxLeft && (iLeft = this.maxLeft - this.drag.offsetParent.offsetLeft)
  ); 
 
   this.drag.style.position = "absolute";
   this.drag.style.left = iLeft + "px";
   this.drag.style.top = iTop + "px";  
   this.drag.style.zIndex = "99";
 }, 

 changeScroll : function (dh)
 { 
	 var ot = parseFloat(this.drag.style.top);
	 var nt = ot + dh;
	 this.drag.style.top = nt + "px";	 
 },	
	
 embedSpan : function ()
 {
	 var mbx = document.getElementById("mbox");
	 var con = mbx.getElementsByClassName("sheet");
	 
	 var ch = null;
	 
	 
	 for(var i = 0 ; i < con.length ; i++)
	 {
		 if((con[i] != this.handle.parentNode) && (isButt(this.handle, con[i]) || Dist(this.handle, con[i])))
		 {
			 if(con[i].childNodes[0] != null) 
			 {
				 ch = con[i].childNodes[0];
				 this.handle.parentNode.append(ch);
				 
			 }
			 con[i].append(this.handle);
			 break;
		 }
	 }
	 
	 if(isPC)
	 {
	 	this.handle.style.position = "relative";
	 	this.handle.style = "margin: 5px auto;";
	 	this.handle.style.cursor = "move"; 
	 }
	 else
	 {
		 var p = this.handle.parentNode;
		 var dl = (p.offsetWidth - this.handle.offsetWidth) * 0.5;
		 var dt = (p.offsetHeight - this.handle.offsetHeight) * 0.5 - 5;
		 this.changeLayout(p.offsetLeft + dl, p.offsetTop + dt);
		 
		 var cp = ch.parentNode;
		 var dlc = (cp.offsetWidth - ch.offsetWidth) * 0.5;
		 var dtc = (cp.offsetHeight - ch.offsetHeight) * 0.5;
		 
		 $(ch).offset({top:AbsTop(cp) + dtc,left:AbsLeft(cp) + dlc}); 
	 }

 },
 startDrag : function (event)
 {  
  var event = event || window.event;

  this._x = (isPC ? event.clientX : event.touches[0].clientX) - this.drag.offsetLeft;
  this._y = (isPC ? event.clientY : event.touches[0].clientY) - this.drag.offsetTop;
  this._h = this._ch = getScrollTop();

  if(isPC)
  {
	  this.addHandler(document, "scroll", this._moveWheel);	 
  	  this.addHandler(document, "mousemove", this._moveDrag);
  	  this.addHandler(document, "mouseup", this._stopDrag);
  }
  else
  {
	  this.addHandler(document, "touchmove", this._moveDrag);
  	  this.addHandler(document, "touchend", this._stopDrag);
  }
  
  event.preventDefault && event.preventDefault();
  this.handle.setCapture && this.handle.setCapture();

  this.onStart()
 },
	
 moveWheel : function ()
 {
	 var dh = getScrollTop() - this._ch;
	 this.changeScroll(dh);
	 this._ch = getScrollTop();
 },
	
 moveDrag : function (event)
 {
  var event = event || window.event;

  var iTop = (isPC ? event.clientY : event.touches[0].clientY) - this._y + getScrollTop() - this._h; 
  var iLeft = (isPC ? event.clientX : event.touches[0].clientX) - this._x; 
 
  this.changeLayout(iLeft, iTop);
  
  event.preventDefault && event.preventDefault();
 
  this.onMove() 
 },
 stopDrag : function ()
 { 
 
  if(isPC)
  {
  	this.removeHandler(document, "scroll", this._moveWheel);	 
  	this.removeHandler(document, "mousemove", this._moveDrag);
  	this.removeHandler(document, "mouseup", this._stopDrag); 
  }
  else
  {
	this.removeHandler(document, "touchmove", this._moveDrag);
  	this.removeHandler(document, "touchend", this._stopDrag);  
  }
  
  this.handle.releaseCapture && this.handle.releaseCapture(); 
  
  this.onStop();
  
  this.embedSpan();
  },
  
 setOptions : function (options)
 {
  this.options =
  {
   handle:   this.drag,
   maxContainer: document.getElementById("mbox"), //指定限制容器 
   onStart:  function () {}, //开始时回调函数
   onMove:   function () {}, //拖拽时回调函数
   onStop:   function () {}  //停止时回调函数
  };
  for (var p in options) this.options[p] = options[p]
 },
 //获取id
 $ : function (id)
 {
  return typeof id === "string" ? document.getElementById(id) : id
 },
 //添加绑定事件
 addHandler : function (oElement, sEventType, fnHandler)
 {
  return oElement.addEventListener ? oElement.addEventListener(sEventType, fnHandler, false) : oElement.attachEvent("on" + sEventType, fnHandler)
 },
 //删除绑定事件
 removeHandler : function (oElement, sEventType, fnHandler)
 {
  return oElement.removeEventListener ? oElement.removeEventListener(sEventType, fnHandler, false) : oElement.detachEvent("on" + sEventType, fnHandler)
 },
 //绑定事件到对象
 bind : function (object, fnHandler)
 {
  return function ()
  {
   return fnHandler.apply(object, arguments) 
  }
 }
};


function InitDrag()
{	
	var tab = document.getElementById("ans"); 
	var spn = tab.getElementsByTagName("span"); 
	for (var i = 0 ; i < spn.length ; i++){ new Drag(spn[i]); }
	
}

window.onresize = function()
{
	InitDrag();
}
