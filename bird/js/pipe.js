function Pipe(pipe_down,pipe_up,speed){
	// 上面的管子 开口向下
	this.up =  pipe_down;
	// 下面的管子 开口向上
	this.down = pipe_up;
	// 管子速度默认与地面一致
	this.speed = speed;
	// 管子之间的开口是150px
	this.distance = 150;
	// 管子帧编号
	this.iframe = 0;
	// 上面管子的长度 随即一个0-250之间的数字
	this.up_length = parseInt(Math.random() * 250);
	// 下面的管子的长度。 根据整体400高，开口150 和上面管子的长度计算出来的。
	this.down_length = 400 - 150 - this.up_length;
}
Pipe.prototype.move = function(){
	this.iframe ++;
}