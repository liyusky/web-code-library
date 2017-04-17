function plate(json) {
    var thisDom = null; //当前构造器
    this.plateDom = null; //圆环进度器
    this.progressLeftDom = null; //左进度条
    this.progressRightDom = null; //右进度条
    this.maskLeftDom = null; //左遮罩层
    this.maskRightDom = null; //右遮罩层
    this.cursorDom = null; //游标
    this.insideCircleDom = null; //内圆
    this.currentMoneyDom = null; //当前金额展示区
    this.repayMoneyDom = null; //偿还金额展示区
    this.center = null; //圆盘中心点
    this.mark = null; //是否允许滑动
    this.flag = null; //是否加载完动画
    this.money = null; //需要显示的数字
    this.step = null; //步长
    this.deg = null; //滑动的角度
    this.layout = null; //布局参量
    this.init = function() { //初始化
        this.initDom();
        this.setLayoutParam();
        this.initLayout();
        this.initParam();
        this.initAction();
        this.initEvent();
    };
    this.initDom = function() { //初始化Dom
        this.plateDom = $api.byId('plate');
        this.progressLeftDom = $api.byId('progress-left');
        this.progressRightDom = $api.byId('progress-right');
        this.maskLeftDom = $api.byId('mask-left');
        this.maskRightDom = $api.byId('mask-right');
        this.cursorDom = $api.byId('cursor');
        this.insideCircleDom = $api.byId('inside-circle');
        this.currentMoneyDom = $api.byId('current-money');
        this.repayMoneyDom = $api.byId("repay-money")
            ? $api.byId("repay-money")
            : null;
    };
    this.setLayoutParam = function() { //设置布局参数
        var plateSize;
        var symbol;
        if (json.size && json.size.num) {
            plateSize = json.size.num;
            if (json.size.symbol) {
                symbol = json.size.symbol;
            } else {
                symbol = "rem";
            }
        } else {
            plateSize = $api.cssVal(this.plateDom, "width").slice(0, -2);
            symbol = "px";
        }
        this.layout = {
            plate: {
                size: {
                    num: plateSize,
                    str: plateSize + symbol
                }
            },
            circle: {
                border: {
                    ratio: 0.05,
                    num: plateSize * 0.05,
                    str: plateSize * 0.05 + symbol
                },
                radius: {
                    ratio: 0.84,
                    num: plateSize * 0.84,
                    str: plateSize * 0.84 + symbol
                }
            },
            outHoop: {
                border: {
                    ratio: 0.08,
                    num: plateSize * 0.08,
                    str: plateSize * 0.08 + symbol
                }
            },
            cursor: {
                base: {
                    size: {
                        ratio: 0.13,
                        num: plateSize * 0.13,
                        str: plateSize * 0.13 + symbol
                    },
                    position: {
                        ratio: 0.04,
                        num: plateSize * 0.04,
                        str: plateSize * 0.04 + symbol
                    }
                },
                body: {
                    size: {
                        ratio: 0.09,
                        num: plateSize * 0.09,
                        str: plateSize * 0.09 + symbol
                    },
                    position: {
                        ratio: 0.06,
                        num: plateSize * 0.06,
                        str: plateSize * 0.06 + symbol
                    }
                },
                hat: {
                    size: {
                        ratio: 0.03,
                        num: plateSize * 0.03,
                        str: plateSize * 0.03 + symbol
                    },
                    position: {
                        ratio: 0.09,
                        num: plateSize * 0.09,
                        str: plateSize * 0.09 + symbol
                    }
                },
                origin: {
                    vertical: {
                        ratio: 0.5,
                        num: plateSize * 0.5,
                        str: plateSize * 0.5 + symbol
                    }
                }
            }
        };
    };
    this.initLayout = function() { //初始化布局
        var str = "width: " + this.layout.plate.size.str + ";";
        str += "height: " + this.layout.plate.size.str + ";";
        $api.css(this.plateDom, str);
        str = "border-width: " + this.layout.circle.border.str + " 0 " + this.layout.circle.border.str + " " + this.layout.circle.border.str + ";";
        str += "border-top-left-radius: " + this.layout.circle.radius.str + ";";
        str += "border-bottom-left-radius: " + this.layout.circle.radius.str + ";";
        $api.css(this.progressLeftDom, str);
        $api.css(this.maskLeftDom, str);
        str = "border-width: " + this.layout.circle.border.str + " " + this.layout.circle.border.str + " " + this.layout.circle.border.str + " 0;";
        str += "border-top-right-radius: " + this.layout.circle.radius.str + ";";
        str += "border-bottom-right-radius: " + this.layout.circle.radius.str + ";";
        $api.css(this.progressRightDom, str);
        $api.css(this.maskRightDom, str);
        $api.css($api.dom(".outside-hoop"), "border: " + this.layout.outHoop.border.str + " solid #fff");
        str = "width: " + ($api.cssVal(this.insideCircleDom, "width").slice(0, -2) * 1 + 2) + "px;";
        str += "height: " + ($api.cssVal(this.insideCircleDom, "height").slice(0, -2) * 1 + 2) + "px;";
        $api.attr(this.insideCircleDom, "style", str);
        $api.css(this.cursorDom, "-webkit-transform-origin: center " + this.layout.cursor.origin.vertical.str + ";");
        str = "width: " + this.layout.cursor.base.size.str + ";";
        str += "height: " + this.layout.cursor.base.size.str + ";";
        str += "top: " + this.layout.cursor.base.position.str + ";";
        str += "left: " + this.layout.cursor.base.position.str + ";";
        $api.css($api.dom(".cursor-base"), str);
        str = "width: " + this.layout.cursor.body.size.str + ";";
        str += "height: " + this.layout.cursor.body.size.str + ";";
        str += "top: " + this.layout.cursor.body.position.str + ";";
        str += "left: " + this.layout.cursor.body.position.str + ";";
        $api.css($api.dom(".cursor-body"), str);
        str = "width: " + this.layout.cursor.hat.size.str + ";";
        str += "height: " + this.layout.cursor.hat.size.str + ";";
        str += "top: " + this.layout.cursor.hat.position.str + ";";
        str += "left: " + this.layout.cursor.hat.position.str + ";";
        $api.css($api.dom(".cursor-hat"), str);
    };
    this.initParam = function() { //初始化常用数
        var plateOffset = $api.offset(this.plateDom);
        this.center = {
            X: plateOffset.l * 1 + plateOffset.w * 0.5, //中心点 x
            Y: plateOffset.t * 1 + plateOffset.h * 0.5 //中心点 y
        };
        this.money = {
            count: json.money.whole.length,
            current: json.money.current === "undefined"
                ? json.money.current
                : json.money.whole[0], //当前的钱
            max: json.money.whole[json.money.whole.length - 1], //最大的钱数
            whole: json.money.whole, //所有额度
            rate: json.money.rate / 100,
            phase: 0
        };
        this.deg = {
            current: 0, //当前游标旋转角度
            appoint: Math.floor(270 * (this.money.whole.indexOf(this.money.current) * 1 + 1) / this.money.count), //当前金额对应角度
            previous: 0,
            direction: 1,
            unit: 270 / this.money.count,
            phase: 0
        };
        this.step = {
            average: this.money.max / 270, //步长
            current: 0,
            whole: []
        };
        this.flag = false;
        for (var i = 0; i < this.money.count; i++) {
            var step = 0;
            if (i === 0) {
                step = this.money.whole[0] / this.deg.unit;
            } else {
                step = (this.money.whole[i] - this.money.whole[i - 1]) / this.deg.unit;
            }
            this.step.whole.push(step);
        }
        this.step.current = this.step.whole[this.money.whole.indexOf(this.money.current)];
        thisDom = this;
    };
    this.initAction = function() { //初始化动画
        this.animate(); //自动滑动到某位置
    };
    this.initEvent = function() { //初始化事件
        this.cursorDom.addEventListener("touchstart", this.moveStart, false); //游标活动
    };
    this.moveStart = function(e) { //移动开始函数
        thisDom.mark = true;
        if (thisDom.flag) {
            thisDom.deg.previous = thisDom.deg.current;
            document.addEventListener("touchmove", thisDom.moving, false); //绑定移动事件
            document.addEventListener("touchend", thisDom.moveEnd, false); //鼠标抬起解除移动
        }
    };
    this.moving = function(e) { //移动中函数
        e.preventDefault();
        var touch = e.targetTouches[0];
        if (thisDom.mark) {
            var finaldX = touch.pageX - thisDom.center.X; //鼠标关于中心点的坐标 x
            var finaldY = thisDom.center.Y - touch.pageY; //鼠标关于中心点的坐标 y
            thisDom.deg.current = 90 - Math.floor(Math.atan2(finaldY, finaldX) * 180 / Math.PI); //鼠标与 y 轴夹角
            if (thisDom.deg.current >= 0) {
              var index = Math.floor(thisDom.deg.current / thisDom.deg.unit);
              thisDom.step.current = thisDom.step.whole[index];
              thisDom.deg.phase = index * thisDom.deg.unit;
              thisDom.money.phase = index === 0 ? 0 : thisDom.money.whole[index - 1];
            }
            thisDom.setRotate(thisDom.deg.current); //设置游标 进度条 位置
        }
    };
    this.moveEnd = function(e) { //移动结束函数
        e.preventDefault();
        document.removeEventListener("touchmove", thisDom.moving, false);
        document.removeEventListener("touchend", thisDom.moveEnd, false);
        thisDom.mark = false;
        thisDom.flag = false;
        thisDom.regression();
    };
    this.setRotate = function(deg) { //设置游标 进度条 位置
        if (deg >= 0 && deg <= 180) { // 右半区 进度效果显示
            $api.css(this.maskLeftDom, "z-index: 4;"); //左遮罩层层级
            $api.css(this.progressLeftDom, "-webkit-transform: rotate(" + deg + "deg);"); //左进度条位置
            $api.css(this.progressRightDom, "-webkit-transform: rotate(0deg);"); //右进度条位置
            $api.text(this.currentMoneyDom, Math.floor((deg - this.deg.phase) * this.step.current) + this.money.phase); //数字显示
            $api.css(this.cursorDom, "-webkit-transform: rotate(" + deg + "deg);"); //游标位置
        } else if (deg <= 270 && deg > 180) { // 左下区 进度效果显示
            $api.css(this.maskLeftDom, "z-index: 0;"); //左遮罩层层级
            $api.css(this.progressLeftDom, "-webkit-transform: rotate(180deg);"); //左进度条位置
            $api.css(this.progressRightDom, "-webkit-transform: rotate(" + (deg - 180) + "deg);"); //右进度条位置
            $api.text(this.currentMoneyDom, Math.floor((deg - this.deg.phase) * this.step.current) + this.money.phase); //数字显示
            $api.css(this.cursorDom, "-webkit-transform: rotate(" + deg + "deg);"); //游标位置
        } else if (deg < 0) { //鼠标位于禁区
            document.removeEventListener("touchmove", this.moving, false); //解除事件
            document.removeEventListener("touchend", this.moveEnd, false); //解除事件
            thisDom.mark = false;
            var rightDeg = this.progressRightDom.style.webkitTransform.split("(")[1].split("deg")[0] * 1; //右进度条旋转角度
            if (rightDeg > 0) { //最大旋转
                $api.css(this.cursorDom, "-webkit-transform: rotate(270deg);");
                $api.css(this.progressRightDom, "-webkit-transform: rotate(90deg);");
                $api.text(this.currentMoneyDom, this.money.max);
            }
            else { //最小旋转
                $api.css(this.cursorDom, "-webkit-transform: rotate(0deg);");
                $api.css(this.progressLeftDom, "-webkit-transform: rotate(0deg);");
                $api.text(this.currentMoneyDom, 0);
                this.deg.current = 0;
                this.deg.phase = 0;
                this.step.current = this.step.whole[0];
                this.money.phase = 0;
                this.regression();
            }
        }
    };
    this.animate = function() { //动画
        thisDom.setRotate(thisDom.deg.current); //设置游标 进度条 位置
        thisDom.animateControl();
    };
    this.animateControl = function() { //动画控制
        if (this.deg.current === this.deg.appoint) { //到达指定到位置
            if (this.deg.appoint === 0) {
                this.money.current = 0;
            }
            $api.text(this.currentMoneyDom, this.money.current); //展示当前的数字
            this.flag = true;
            if (this.repayMoneyDom !== null) {
                $api.text(this.repayMoneyDom, Math.floor(this.money.current * (this.money.rate * 7 + 1)));
            }
        } else { //没有指定到位置
            thisDom.deg.current += thisDom.deg.direction;
            setTimeout(thisDom.animate, 20); //递归  渲染
        }
    };
    this.regression = function() { //位置回归
        if (this.deg.current < 0) {
            this.flag = true;
            return false;
        }
        var index = Math.floor(this.deg.current / this.deg.unit);
        var difference = null;
        if (index === this.money.count) {
          this.flag = true;
          return false;
        }

        if(this.deg.current < this.deg.unit){
          this.deg.direction = 1;
        }
        else if (this.deg.current < this.deg.previous) {
          this.deg.direction = -1;
        } else if (this.deg.current > this.deg.previous) {
          this.deg.direction = 1;
          index++;
        } else {
          this.flag = true;
          return false;
        }

        if (index === 0) {
          this.money.current = this.money.whole[0];
          this.deg.appoint = Math.floor(this.deg.unit);
        }
        else {
          this.money.current = this.money.whole[index - 1];
          this.deg.appoint = Math.floor(this.deg.unit * index);
        }

        this.animate();
    };
}
