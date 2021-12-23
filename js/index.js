let currentValue = 1;
const timeout = 0.75;
const radios = document.querySelectorAll('.swappy-radios input');
const fakeRadios = document.querySelectorAll('.swappy-radios .radio');


const firstRadioY = document.querySelector('.swappy-radios label:nth-of-type(1) .radio').getBoundingClientRect().y;
const secondRadioY = document.querySelector('.swappy-radios label:nth-of-type(2) .radio').getBoundingClientRect().y;
const indicitiveDistance = secondRadioY - firstRadioY;


fakeRadios.forEach(function(radio) {
  radio.style.cssText = `transition: background 0s ${timeout}s;`;
});

const css = `.radio::after {transition: opacity 0s ${timeout}s;}`
const head = document.head;
const style = document.createElement('style');
style.type = 'text/css';
style.appendChild(document.createTextNode(css));
head.appendChild(style);


radios.forEach(function(radio, i) {
	
  radio.parentElement.setAttribute('data-index', i + 1);
  
  radio.addEventListener('change', function() {
	  
    temporarilyDisable();
	
    removeStyles();
    const nextValue = this.parentElement.dataset.index;

    const oldRadio = document.querySelector(`[data-index="${currentValue}"] .radio`);
    const newRadio = this.nextSibling;
    const oldRect = oldRadio.getBoundingClientRect();
    const newRect = newRadio.getBoundingClientRect();
	
    const yDiff = Math.abs(oldRect.y - newRect.y);
	
    const dirDown = oldRect.y - newRect.y > 0 ? true : false;
	
    const othersToMove = [];
    const lowEnd = Math.min(currentValue, nextValue);
    const highEnd = Math.max(currentValue, nextValue);

    const inBetweenies = range(lowEnd, highEnd, dirDown);
    let othersCss = '';
    inBetweenies.map(option => {
		
      const staggerDelay = inBetweenies.length > 1 ? 0.1 / inBetweenies.length * option : 0;
      othersCss += `
        [data-index="${option}"] .radio {
          animation: moveOthers ${timeout - staggerDelay}s ${staggerDelay}s;
        }
      `;
    });
    
    const css = `
      ${othersCss}
      [data-index="${currentValue}"] .radio { 
        animation: moveIt ${timeout}s; 
      }
      @keyframes moveIt {
        0% { transform: translateX(0); }
        33% { transform: translateX(-3rem) translateY(0); }
        66% { transform: translateX(-3rem) translateY(${dirDown ? '-' : ''}${yDiff}px); }
        100% { transform: translateX(0) translateY(${dirDown ? '-' : ''}${yDiff}px); }
      }
      @keyframes moveOthers {
        0% { transform: translateY(0); }
        33% { transform: translateY(0); }
        66% { transform: translateY(${dirDown ? '' : '-'}${indicitiveDistance}px); }
        100% { transform: translateY(${dirDown ? '' : '-'}${indicitiveDistance}px); }
      }
  `;
    appendStyles(css);
    currentValue = nextValue;
  });
});

function appendStyles(css) {
  const head = document.head;
  const style = document.createElement('style');
  style.type = 'text/css';
  style.id = 'swappy-radio-styles'; 
  style.appendChild(document.createTextNode(css));
  head.appendChild(style);
}
function removeStyles() {
  const node = document.getElementById('swappy-radio-styles');
  if (node && node.parentNode) {
    node.parentNode.removeChild(node);
  }
}
function range(start, end, dirDown) {
  let extra = 1;
  if (dirDown) {
      extra = 0;
  }
  return [...Array(end - start).keys()].map(v => start + v + extra);
}
function temporarilyDisable() {
    radios.forEach((item) => {
      item.setAttribute('disabled', true);
      setTimeout(() => { 
        item.removeAttribute('disabled');
      }, timeout * 1000);
    });
}

let isRand = 0;

$("span.red").click(function(e) {
    $("#theme").attr("href", "css/theme-red.css"); 
	isRand = 0;
});

$("span.green").click(function(e) {
    $("#theme").attr("href", "css/theme-green.css"); 
	isRand = 1;
});
 
$("input.red").change(function(e) {
    $("#theme").attr("href", "css/theme-red.css"); 
	isRand = 0;
});

$("input.green").change(function(e) {
    $("#theme").attr("href", "css/theme-green.css"); 
	isRand = 1;
}); 

$("#gb").click(function(e) {
	window.location.href = "test.html?" + isRand + "&" + $(".select-set").text();
});