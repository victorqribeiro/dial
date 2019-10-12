class RotaryDial {

	constructor({
		size,
		discFillColor,
		discStrokeColor,
		circlesFillColor,
		circlesStrokeColor,
		circlesHighlightColor,
		textFillColor,
		textStrokeColor,
		arrowFillColor,
		arrowStrokeColor,
		callback} = {}){
	
		this.canvasSize = size || 400;
	
		this.size = this.canvasSize-2;
		
		this.discFillColor = discFillColor || 'transparent';
		
		this.discStrokeColor = discStrokeColor || 'black';
		
		this.circlesFillColor = circlesFillColor || 'black';
		
		this.circlesStrokeColor = circlesStrokeColor || 'transparent';
		
		this.circlesHighlightColor = circlesHighlightColor || 'red';
		
		this.textFillColor = textFillColor || 'white';
		
		this.textStrokeColor = textStrokeColor || 'transparent';
		
		this.arrowFillColor = arrowFillColor || 'black';
		
		this.arrowStrokeColor = arrowStrokeColor || 'transparent';
	
		this.canvas = document.createElement('canvas');
		
		this.canvas.width = this.w = this.canvasSize;
		
		this.canvas.height = this.h = this.canvasSize;
		
		this.w2 = this.w / 2;
		
		this.h2 = this.h / 2;
		
		this.TWOPI = Math.PI * 2;
		
		this.offset = this.size * 0.25;
		
		this.outerCircle = this.size/2;
		
		this.innerCircle = this.outerCircle-this.offset;
		
		this.c = this.canvas.getContext('2d');
		
		this.c.font = this.size * 0.08+"px Arial";
		
		this.c.textAlign = "center";
		
		this.a = 1;
		
		this.clicking = false;
		
		this.number = null;
		
		this.callback = callback || console.log;
	
		document.body.appendChild(this.canvas);
		
		this.draw();
		
		this.addEvent();
		
	}
	
	draw(){
	
		this.c.clearRect(0,0,this.w,this.h);
		
		this.c.beginPath();
		
		this.c.arc(this.w2, this.h2, this.outerCircle, 0, this.TWOPI, false );
		
		this.c.moveTo(this.w2+this.innerCircle, this.h2 );
		
		this.c.arc(this.w2, this.h2, this.innerCircle, this.TWOPI, 0, true);
		
		this.c.fillStyle = this.discFillColor;
		
		this.c.fill();
		
		this.c.strokeStyle = this.discStrokeColor;
		
		this.c.stroke();
		
		this.c.save();
		
		this.c.translate(this.w2, this.h2);
		
		for(let i = 0; i < 10; i++){
		
			const a = this.a+i/2;
			
			const center = this.innerCircle + (this.outerCircle-this.innerCircle)/2;
			
			const x = Math.floor(Math.cos(a)*center);
			
			const y = Math.floor(Math.sin(a)*center);
			
			const n = (10-i)%10;
			
			this.c.beginPath();
			
			this.c.arc(x, y, this.size * 0.08, 0, this.TWOPI);
			
			this.c.fillStyle = this.circlesFillColor;
			
			this.c.strokeStyle = this.circlesStrokeColor;
			
			if( this.number != null && this.number%10 == n)
			
				this.c.fillStyle = this.circlesHighlightColor
				
			this.c.fill();
			
			this.c.stroke();
			
			this.c.fillStyle = this.textFillColor;
			
			this.c.strokeStyle = this.textStrokeColor;
			
			this.c.fillText(n, x, y+this.size * 0.02);
			
			this.c.strokeText(n, x, y+this.size * 0.02);
			
		}
		
		this.c.restore();
		
		this.c.beginPath()
		
		this.c.moveTo(this.w - this.size * 0.08, this.h2);
		
		this.c.lineTo(this.w, this.h2 - this.size * 0.04);
		
		this.c.lineTo(this.w, this.h2 + this.size * 0.04);
		
		this.c.closePath();
		
		this.c.fillStyle = this.arrowFillColor;
		
		this.c.strokeStyle = this.arrowStrokeColor;
		
		this.c.fill();
		
		this.c.stroke();

		
	}


	addEvent(){
	
		this.canvas.addEventListener('mousedown', e => { this.isClicking(e) });
		
		this.canvas.addEventListener('mouseup', _ => { this.result() });
		
		this.canvas.addEventListener('mouseout', _ => { this.clear() });
	
		this.canvas.addEventListener('mousemove', e => { this.rotate(e) });
		
		this.canvas.addEventListener('touchstart', e =>{ this.isClicking(e) });

		this.canvas.addEventListener('touchmove', e =>{ this.rotate(e) });

		this.canvas.addEventListener('touchend', _ => { this.result() });
	
	}
	
	result(){
	
		if( this.number )

			this.callback( this.number%10 )

		this.clear() 
		
	}
	
	isClicking(e){
	
		e.preventDefault()
	
		const pos = this.getPos(e);
		
		const dist = this.getDist( pos.x, pos.y, this.w2, this.h2 )
		
		if( dist > this.size/2 || dist < this.size/2-this.offset )
			
			return
	
		this.lastAngle = Math.atan2( pos.y - this.h2, pos.x - this.w2 );
		
		this.number = null;
	
		this.clicking = true;
			
	}
	
	getDist(x1, y1, x2, y2){
		
		return Math.sqrt( (x2-x1) ** 2 + (y2-y1) ** 2);
		
	}
	
	getPos(e){
	
		e.preventDefault();
	
		let x, y;
		
		const rect = this.canvas.getBoundingClientRect();
	
		const _x = this.canvas.width/rect.width;
		const _y = this.canvas.height/rect.height;
	
		if( e.touches ){
		
			x = e.targetTouches[0].clientX * _x;
			
			y = (e.targetTouches[0].clientY-rect.y) * _y;
			
		}else{
		
			x = e.offsetX * _x;
			
			y = e.offsetY * _y;
			
		}
		
		return {x, y};
	
	}
	
	clear(){
	
			this.number = null;
		
			this.clicking = false;
			
			this.goBack();
			
	}
	
	rotate(e){
	
			if( !this.clicking || this.a >= this.TWOPI) return;
			
			if( this.a < 1 ){
			
				this.a = 1;
				
				return;
				
			}
			
			const pos = this.getPos(e);
			
			const dist = this.getDist( pos.x, pos.y, this.w2, this.h2 )
		
			if( dist > this.size/2 || dist < this.size/2-this.offset ){
				
				this.clear()
					
				return
				
			}
			
			const n = Math.floor((this.a-1.1) / (this.TWOPI-0.8) * 11);
			
			this.number = n > 0 ? n : null;
			
			this.newAngle = Math.atan2( pos.y - this.h2, pos.x - this.w2 );
		
			const delta = (this.a - (this.lastAngle - this.newAngle));
		
			this.a = delta > 0 ? delta : this.TWOPI+delta;
			
			this.lastAngle = this.newAngle;
			
			this.draw();
	}
	
	goBack(){
	
		if( this.a > 1 ){
		
			this.a -= 0.1
			
			this.draw();
			
			requestAnimationFrame( _=>{ this.goBack() } );
			
			if( this.a - 1 < 0.05 )
			
				this.a = 1;
		}
	}

}
