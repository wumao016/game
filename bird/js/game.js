function Game(ctx,land,bg,pipe,bird,title,tutorial){
	// 刷子 
	this.ctx = ctx;
	// 1 地面
	this.land = land;
	// 2 背景
	this.bg = bg;
	// 帧编号
	this.frameNum =0;
	// 管子属性
	this.pipeArr = [pipe];
	// 鸟属性
	this.bird = bird;
	// title
	this.title = title;
	// tutorial
	this.tutorial = tutorial;
	// 决定管子出现的小的frameNum
	this.pipe_frame = 0;
	this.init();
}
Game.prototype = {
	constructor:Game,
	init:function(){
		this.welcome(); 
	},
	renderBG :function(){
		this.ctx.drawImage(this.bg.pic,0-(this.frameNum*this.bg.speed)%this.bg.pic.width,0);
		this.ctx.drawImage(this.bg.pic,this.bg.pic.width-this.frameNum*this.bg.speed%this.bg.pic.width,0);
		this.ctx.drawImage(this.bg.pic,this.bg.pic.width*2-this.frameNum*this.bg.speed%this.bg.pic.width,0);
	},
	renderLand:function(){
		this.ctx.drawImage(this.land.pic,0-this.frameNum*this.land.speed%this.land.pic.width,400);
		this.ctx.drawImage(this.land.pic,this.land.pic.width-this.frameNum*this.land.speed%this.land.pic.width,400);
		this.ctx.drawImage(this.land.pic,this.land.pic.width*2-this.frameNum*this.land.speed%this.land.pic.width,400);
	},
	start : function(){
		var me = this;
		clearInterval(this.timer);
		this.timer = setInterval(function(){
			me.frameNum++;
			me.pipe_frame++;
			me.clear();
			me.renderBG();
			me.renderLand();
			me.renderPipe();
			me.renderBird();
			me.bird.go(); 
			if(!(me.frameNum%5)){
				me.bird.swing();
			}
			if(!(me.pipe_frame % 150)){
				me.createPipe();
			}
		},20);
	},
	clear: function(){
		this.ctx.clearRect(0,0,500,600);
	},
	// 渲染管子
	renderPipe:function(){
		for(var i =0;i<this.pipeArr.length;i++){
		this.pipeArr[i].move();
		// 图像上的x值：0
		var up_img_x = 0;
		// 渲染上面管子的时候 使用的y值 是 上面管子的高度-上面管子的渲染高度
		var up_img_y = this.pipeArr[i].up.height - this.pipeArr[i].up_length;
		// 截取整个管子的宽度
		var up_img_w =  this.pipeArr[i].up.width;
		// 从xy确定的点开始截取一定的高度 这个距离就是随即出来的值pipeArr[i].up_length
		var up_img_h = this.pipeArr[i].up_length;
		// 绘制到canvas上的x点。 因为管子是从右向左一点点移动。所以就是canvas的宽度减去当前帧数*管子的速度的差
		var up_canvas_x = this.ctx.canvas.width- this.pipeArr[i].iframe * this.pipeArr[i].speed;
		if(up_canvas_x<-up_img_w){
			this.pipeArr.splice(i,1);
			i--;
			continue;
		}
		// 绘制到canvas上的y点。 因为贴顶 所以一直是0 
		var up_canvas_y = 0;
		// 绘制到canvas上的宽高 以原图像尺寸显示
		var up_canvas_w = up_img_w;
		var up_canvas_h = up_img_h;
		this.ctx.drawImage(this.pipeArr[i].up,up_img_x,up_img_y,up_img_w,up_img_h,up_canvas_x,up_canvas_y,up_canvas_w,up_canvas_h);
		// 渲染下面管子 
		// 截取点是从整个图片的左上角开始截取。所以是0,0
		var down_img_x = 0;
		var down_img_y = 0;
		// 截取的宽度是整个图片的宽度
		var down_img_w = up_img_w;
		// 截取的高度是 整个距离（400） 减去 上面管子的长度 再减去固定开口150 就是下面管子的高度
		var down_img_h = this.pipeArr[i].down_length;
		// 上下管子一直是对口。所以x值一致
		var down_canvas_x = up_canvas_x;
		// 下面管子在canvas上的y值。就是上面管子的高度加上150固定开口距离
		var down_canvas_y = up_img_h+this.pipeArr[i].distance;
		// 渲染的宽度是整个图片的宽度
		var down_canvas_w = up_canvas_w;
		// 渲染的高度是下面管子的高度 也就是下面管子的y值
		var down_canvas_h = down_img_h;
		this.ctx.drawImage(this.pipeArr[i].down,down_img_x,down_img_y,down_img_w,down_img_h,down_canvas_x,down_canvas_y,down_canvas_w,down_canvas_h);
		}
	},
	// 渲染鸟
	renderBird:function(){
		// 鸟要旋转。第一步 先将鸟放到坐标系中心
		this.ctx.save();
		// 确定坐标系的y值
		var y = (178+this.bird.y)<0?0:178+this.bird.y;
		// 更改坐标系   
		this.ctx.translate(125,y);
		// 判断鸟是否与管子碰到 
		// 鸟的B点x值 
		var bird_b_x  =  this.bird.x+this.bird.B.x+ 125 ;
		//管子的C点x值
		var up_pipe_c_x = this.ctx.canvas.width -(this.pipeArr[0].speed * this.pipeArr[0].iframe);
		// 鸟的B点的y值
		var bird_b_y = this.bird.B.y + y;
		// 管子的c点的y值
		var up_pipe_c_y = this.pipeArr[0].up_length;
		// 鸟的a点x值 
		var bird_a_x = this.bird.x + this.bird.A.x + 125;
		// 管子的D点的x值
		var up_pipe_d_x =  up_pipe_c_x+this.pipeArr[0].up.width;
		// 判断鸟是否与上面管子碰到  如果鸟的B点的x值大于管子的C点的x值 并且鸟的B点的y值小于管子的C点的Y值 并且鸟的A点的x值 小于管子的D点的x值 说明碰撞到了。
		if( bird_b_x>up_pipe_c_x && bird_b_y < up_pipe_c_y && bird_a_x < up_pipe_d_x ){
			clearInterval(this.timer);
		}
		// 判断鸟与下面管子的碰撞
		// 如果鸟的D点x值大于管子A点x值 并且 鸟的D点y值大于管子A点y值 并且鸟的C点x值小于管子B点x值
		var bird_d_x = bird_b_x; //B和D点x值一致
		var bird_d_y = y + this.bird.D.y ; 
		var bird_c_x = bird_a_x;
		var down_pipe_a_x = up_pipe_d_x-this.pipeArr[0].up.width ;
		var down_pipe_a_y = this.pipeArr[0].up_length+150;
		var down_pipe_b_x = up_pipe_d_x;
		if(bird_d_x > down_pipe_a_x && bird_d_y>down_pipe_a_y && bird_c_x < down_pipe_b_x){
			clearInterval(this.timer);
		}
		// 判断地面
		if(bird_d_y>400){
			clearInterval(this.timer);
		}
		// 判断鸟的状态决定角度的正负性
		if(this.bird.state ==="U"){
		   this.ctx.rotate(-this.bird.f*2/(180/Math.PI));
		}else {
			 this.ctx.rotate(this.bird.f/(180/Math.PI));
		}
    this.ctx.drawImage(this.bird.imgArr[this.bird.idx],-this.bird.width/2,-this.bird.height/2);
    this.ctx.restore();
	},
	// 绑定事件，让用户操作鸟的状态
	bindEvent:function(){
		var me = this;
		this.ctx.canvas.onclick = function(){
			// 调用鸟的方法
			me.bird.energy();
		}
	},
	createPipe:function(){
		// 每当创建一个pipe 其实就是 创建一个Pipe对象并放入pipeArr中
		this.pipeArr.push(new Pipe(this.pipeArr[0].up,this.pipeArr[0].down,this.pipeArr[0].speed))
	},
	welcome:function(){
		var me = this;
		// 让定时器执行 但是执行的内容不是start
		this.timer = setInterval(function(){
			me.frameNum++;
			// 每帧清屏
			me.clear();
			// 渲染背景
			me.renderBG();
			// 渲染地面
			me.renderLand();
			// 渲染title
			me.renderTitle();
			// 渲染tutorial
			me.renderTutorial();
		},20)
	},
	renderTitle : function(){ 
		this.ctx.drawImage(this.title,(this.ctx.canvas.width - this.title.width)/2,this.frameNum>150?150:this.frameNum);
	},
	renderTutorial:function(){
		var flag = this.frameNum>150?  true: false;
		if(flag){
			if(!(this.frameNum%10<5)){
			this.ctx.drawImage(this.tutorial,(this.ctx.canvas.width - this.tutorial.width)/2,170+this.title.height)
			this.begin();
			}
		}
	},
	begin:function(){
		// 保存this
		var me = this;
		// 当点击闪烁的tutorial的时候开始游戏
		this.ctx.canvas.onclick =function(e){
			if(e.offsetX >(me.ctx.canvas.width - me.tutorial.width)/2 && e.offsetX<(me.ctx.canvas.width - me.tutorial.width)/2+me.tutorial.width && e.offsetY>(170+me.tutorial.height) && e.offsetY<(170+me.tutorial.height*2)){
				me.start();
				me.bindEvent();
			}
		}
	}
}
