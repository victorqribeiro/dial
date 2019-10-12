const init = function(){

	const div = document.createElement('div');

	const input = document.createElement('input');
	
	const btn = document.createElement('button');
	
	btn.innerText = "Clear";
	
	btn.addEventListener("click", e => {
		input.value = "";
	});
	
	input.type = "text";
	
	div.append(input);
	
	div.append(btn);
	
	document.body.appendChild( div );
	
	const func = function(value){
		input.value += value;
	}

	const rd = new RotaryDial({callback: func});
	
}

init();
