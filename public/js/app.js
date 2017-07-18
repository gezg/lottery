
class DrawGrid {
    constructor(args) {
        let defaultOption = {
            el: '#canvas',
            width: 756,
            height: 1122,
            x: 0,
            y: 0,
            colors: {
            	normal: '#000',
            	red: '#c00',
            	blue: '#0300ed',
            	size: '#77076B',
            	single: '#19236A',
            	wihte: '#fff'
            },
            data: []
        }
        this.option = Object.assign(defaultOption, args || {});

        this.canvas = document.querySelector(this.option.el);

        this.canvas.width = this.option.width;
        this.canvas.height = this.option.height;
        this.grid = 21;
        this.ctx = this.canvas.getContext('2d');

        this.drawRect();
    }
    //最外圈框
    drawRect(){
    	var _this = this,
    		grid    = _this.grid,
    		ctx  = _this.ctx,
            x  = _this.option.x,
            y = _this.option.y;
    	//填充面板背景色
    	ctx.beginPath();
        ctx.fillStyle = '#fff';
        ctx.fillRect(x, y, _this.option.width ,_this.option.height);
        //填充奖号背景色
        ctx.beginPath();
        ctx.fillStyle = '#efefef';
        ctx.fillRect(x + grid, y + grid * 2 + 8, grid * 3 ,_this.option.height);
        //填充和值深色背景色
        ctx.fillRect(x + grid * 18, y + grid * 2 + 8, grid * 8 ,_this.option.height);
        ctx.beginPath();
        ctx.fillStyle = '#f8f8f8';
        ctx.fillRect(x + grid * 10, y + grid * 2 + 8, grid * 8 ,_this.option.height);
        _this.drawHeader();
    }
    //绘制线
    drawLine(fromX, fromY, toX, toY ,bold ,colorType){
    	var _this   = this, 
            ctx     = _this.ctx;
    	if(bold === 'diagonal'){
    		ctx.lineWidth = 1.5;
    	}else{
    		ctx.lineWidth = bold == 'bold' ? .5 : .1;
    	}
        ctx.beginPath();
        ctx.strokeStyle = colorType ? _this.option.colors[colorType] : '#000';
        ctx.moveTo(fromX ,fromY);
        ctx.lineTo(toX ,toY);
        ctx.stroke();
        ctx.closePath();
    }
    //绘制头部格子
    drawHeader(){
        var _this   = this, 
            ctx     = _this.ctx,
            grid    = _this.grid,
            width   = _this.option.width,
            height  = _this.option.height,
            x  = _this.option.x,
            y = _this.option.y;
        ctx.beginPath();
        //横线 保留前方一个格子 淡颜色
        _this.drawLine(x + grid , y + grid + 8 ,width ,grid + 8);
        //横线 深色
        _this.drawLine(x , y + grid * 2 + 8 ,width ,grid * 2 + 8 ,'bold');
        //画所有的竖线
        for (var i = 1; i < 36; i++) {
            var bold = _this.isBold(i);
            _this.drawLine(x + grid * i , y + (bold ? 0 : grid + 8) ,grid * i ,height ,_this.isBold(i));
            _this.drawHeaderText(i);
        }
        if(_this.option.data.length){
            _this.drawTheNo();
        }
    }
    //绘制头部文字
    drawHeaderText(i){
        var grid = 21;
        //期号
        if(i === 1){
            this.drawText('期' ,1 ,21 ,'head');
            this.drawText('号' ,1 ,44 ,'head');
        }
        //奖号
        if(i > 1 && i < 5){
            this.drawText(i - 1 ,(i - 1) * grid + 5 ,grid * 2 + 6 ,'head');
            if(i === 2){
                this.drawText('奖号' ,(i - 1) * grid + 12 ,grid + 1 ,'head');
            }
        }
        //组选分布图
        if(i > 4 && i < 11){
            this.drawText(i - 4 ,(i - 1) * grid + 5 ,grid * 2 + 6 ,'head');
            if(i === 5){
                this.drawText('组选分布图' ,(i - 1) * grid + 12 ,grid + 1 ,'head');
            }
        }
        //和值
        if(i > 10 && i < 27){
            this.drawText(i - 8 ,(i - 1) * grid + (i - 8 > 9 ? -1 : 5) ,grid * 2 + 6 ,'head');
            if(i === 11){
                this.drawText('和值' ,350 ,grid + 1 ,'head');
            }
        }
        //大小
        if(i == 27){
            this.drawText('大小' ,(i - 1) * grid ,grid * 2 + 4 ,'head');
            this.drawText('大小' ,(i - 1) * grid ,grid + 1 ,'head');
        }
        //单双
        if(i == 29){
            this.drawText('单双' ,(i - 1) * grid ,grid * 2 + 4 ,'head');
            this.drawText('单双' ,(i - 1) * grid ,grid + 1 ,'head');
        }
        //和值
        if(i > 29){
            this.drawText(i - 30 , i * grid + 5 ,grid * 2 + 6 ,'head');
            if(i === 30){
                this.drawText('跨度' ,(i + 2) * grid ,grid + 1 ,'head');
            }
        }
    }
    //绘制奖号
    drawTheNo(){
    	var _this 	= this,
    		i 		= 0,
    		len 	= _this.option.data.length,
    		grid    = _this.grid,
    		width 	= _this.option.width;
    	for (; i < len; i++) {
    		var item = _this.option.data[i];
    		var height = grid * 3 + (grid * i) + 8;
    		var nextItem = _this.option.data[i + 1];
    		_this.drawNums(item ,height ,nextItem);
    		_this.drawLine(0, height, width, height ,item.issue == 87 ? 'bold' : null);
    	}
        _this.drawReady();
    }
    drawReady(){
        if(this.option.ready){
            this.option.ready.call(this);
        }
    }
    /**
     * [绘制连号]
     * @param  {[type]} nums   [description]
     * @param  {[type]} height [description]
     */
    drawArc(nums ,height){
    	var _this 	= this,
    		grid    = _this.grid,
    	    num1 = nums[0],
    		num2 = nums[1],
    		num3 = nums[2],
    		sAngle = grid / 2;
    	_this.ctx.fillStyle = '#296A86';
    	_this.ctx.beginPath();
		_this.ctx.arc(grid * 3 + num1 * grid + sAngle, height - sAngle + 2, 10.5, 0, 2 * Math.PI);
		_this.ctx.fill();
		_this.ctx.beginPath();
		_this.ctx.arc(grid * 3 + num2 * grid + sAngle, height - sAngle + 2, 10.5, 0, 2 * Math.PI);
		_this.ctx.fill();
		_this.ctx.beginPath();
		_this.ctx.arc(grid * 3 + num3 * grid + sAngle, height - sAngle + 2, 10.5, 0, 2 * Math.PI);
		_this.ctx.fill();
		_this.ctx.stroke();
    }

    drawNums(data, height, nextItem){
    	if(!data) return;
    	var _this 	= this,
    		grid    = _this.grid,
    	    num1 = data.nums[0],
    		num2 = data.nums[1],
    		num3 = data.nums[2],
    		numDouble = num1,
    	 	colorType = 'normal';
    	//判断双号
    	if(num1 == num2){
    		colorType = 'red';
    		numDouble = num1;
    	}
    	if(num2 == num3){
    		colorType = 'red';
    		numDouble = num2;
    	}
    	//判断豹子号
    	if(num1 == num2 && num1 == num3){
    		colorType = 'blue'
    	}
    	//期号
    	_this.drawText(data.issue ,1 ,height - 4 ,'issue');
    	height = height - 2;
    	//奖号
    	_this.drawText(num1 ,grid + 4 ,height - 1, colorType);
    	_this.drawText(num2 ,grid * 2 + 4 ,height - 1, colorType);
    	_this.drawText(num3 ,grid * 3 + 4 ,height - 1, colorType);
    	//组选分布图
    	if(colorType == 'normal'){
    		colorType = 'normal';
    		if(num2 - num1 === 1 && num3 - num2 === 1){
	    		_this.drawArc(data.nums ,height);
	    		colorType = 'wihte';
	    	}
    		_this.drawText(num1 ,grid * 3 + num1 * grid + 4 ,height, colorType);
    		_this.drawText(num2 ,grid * 3 + num2 * grid + 4 ,height, colorType);
    		_this.drawText(num3 ,grid * 3 + num3 * grid + 4 ,height, colorType);
    		colorType = 'normal';
    	}else if(colorType == 'red'){
    		if(numDouble != num1){
    			_this.drawText(num1 ,grid * 3 + num1 * grid + 4 ,height, 'normal');
    		}else if(numDouble != num2){
    			_this.drawText(num2 ,grid * 3 + num2 * grid + 4 ,height, 'normal');
    		}else if(numDouble != num3){
    			_this.drawText(num3 ,grid * 3 + num3 * grid + 4 ,height, 'normal');
    		}
    		_this.drawText(numDouble ,grid * 3 + num2 * grid + 4 ,height, colorType);
    		
    	}else if(colorType == 'blue'){
    		_this.drawText(num1 ,grid * 3 + num1 * grid + 4 ,height, colorType);
    	}
    	//和值
    	var sum = num1 + num2 + num3,
    		sumLeft = grid * 10 + (sum - 3) * grid + 4;
    	_this.drawText(sum , (sum > 9 ? sumLeft - 5 : sumLeft),height, colorType);
    	_this.drarDiagonal(sumLeft ,height, nextItem ,sum ,'sum');
    	//大小
    	var size = sum > 9 ? '大' : '小',
    		sizeLeft = grid * (sum > 9 ? 26 : 27);
    	_this.drawText(size , sizeLeft,height, 'size');
    	//单双
    	var single = sum % 2 === 0,
    		singleName = single ? '双' : '单',
    		singleLeft = grid * (single ? 29 : 28);
    	_this.drawText(singleName , singleLeft,height, 'single');
    	//跨度
    	var cut = num3 - num1,
    		cutLeft = grid * 29 + (cut + 1) * grid + 4;
    	_this.drawText(cut , cutLeft,height, colorType);
    	_this.drarDiagonal(cutLeft ,height, nextItem ,cut ,'cut');
    }
    /**
     * 绘制斜线
     * 
     * @param  {[Number]} fromX     [开始x点]
     * @param  {[Number]} fromY     [开始y点]
     * @param  {[Object]} nextItem  [下一个对象的数据]
     * @param  {[Number]} item      [当前对象的值]
     * @param  {[String]} type      [是和值还是跨度]
     */
    drarDiagonal(fromX ,fromY, nextItem ,item ,type){
    	if(nextItem){
    		var _this 	= this,
	    		grid    = _this.grid,
	    	    num1 = nextItem.nums[0],
	    		num2 = nextItem.nums[1],
	    		num3 = nextItem.nums[2],
	    		colorType = 'normal';
	    //判断双号
    	if(num1 == num2){
    		colorType = 'red';
    	}
    	if(num2 == num3){
    		colorType = 'red';
    	}
    	//判断豹子号
    	if(num1 == num2 && num1 == num3){
    		colorType = 'blue'
    	}

    	if(type === 'sum'){
    		var sum = num1 + num2 + num3,
    			sumLeft = grid * 10 + (sum - (sum > item ? 3 : 2)) * grid + 4;

    		var startX = sum < item ? fromX : fromX + 16,
    			startY = sum < item ? fromY - 3 :fromY - 6,
    			endX   = sumLeft - 5,
    			endY   = fromY + grid - 12;

    		if(sum - item == 1){
                startX = startX - 10;
    			startY = startY + 6;
    		}

    		if(item - sum == 1){
                startX = startX - 5;
                startY = startY - 1;
    			endX   = endX - 10;
    			endY   = endY - 5;
    		}

    		if(sum === item){
    			startX = startX - 10;
    			startY = startY + 3;
    			endX = endX - 10;
    			endY = endY - 3;
    		}
    		_this.drawLine(startX, startY, endX, endY,'diagonal' ,colorType);
    	}

    	if(type === 'cut'){
    		var cut = num3 - num1,
    			sumLeft = grid * 30 + grid * cut;

    		var startX = cut < item ? fromX : fromX + 16,
    			startY = cut < item ? fromY - 3 :fromY - 6,
    			endX   = cut < item ? sumLeft + grid : sumLeft,
    			endY   = fromY + grid - 12;

    		if(cut - item == 1){
    			startX = startX - 6;
    			startY = startY + 8;
    			endX = endX + 1;
    		}

    		if(item - cut == 1){
    			startX = startX - 2;
    			endX   = endX - 5;
    			endY   = endY - 3;
    		}

    		if(cut === item){
    			startX = endX + grid / 2;
    			startY = startY + 3;
    			endX = endX + grid / 2;
    			endY = endY - 3;
    		}
    		_this.drawLine(startX, startY, endX, endY,'diagonal' ,colorType);
    	}
    	}
    }
    //绘制文字
    drawText(text ,x ,y ,type){
        var _this = this,ctx = _this.ctx;
        var colors = _this.option.colors;

        _this.ctx.beginPath();
		ctx.fillStyle = "#000";
		ctx.fillStyle = colors[type]
        switch(type){
            case 'head':
                ctx.font = "bold 20px Arial";
                break;
            case 'issue':
        		ctx.font = "17px Arial";
                break;
            case 'normal':
                ctx.font = "bold 22px Arial";
                break;
            case 'red':
                ctx.font = "bold 22px Arial";
                break;
            case 'wihte':
                ctx.font = "bold 20px Arial";
                break;
            case 'sum':
                ctx.font = "bold 22px Arial";
                break;
            case 'blue':
                ctx.font = "bold 22px Arial";
                break;
            case 'size':
                ctx.font = "bold 22px Arial";
                break;
            case 'single':
                ctx.font = "bold 22px Arial";
                break;
        }
        ctx.fillText(text, x, y);
    }
    //判断是否需要间隔线
    isBold(i){
        if(i == 1 || i == 4 || i == 10 || i == 26 || i == 28 || i == 30){
            return 'bold';
        }
        return null;
    }
    refresh(){
    	this.ctx.clearRect(1 ,1 , this.option.width - 2,this.option.height - 2);
    	this.drawRect();
    }
}
