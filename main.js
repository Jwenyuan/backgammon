var n = 15,  // 棋盘线数
    color = 'black', // 默认黑棋先下
    gobangArr = [],  // 存储棋盘的数据
    win = false,  // 棋子赢的数组
    gobang = document.getElementById('gobang_main'),  // 棋盘
    gobangStatus = document.getElementById('gobang_status'), // 下棋状态
    gobangToolAgain = document.getElementById('gobang_tool_again'),    // 再来一盘
    goBack = document.getElementById('back'),
    canBack = false,
    lineX, // 横坐标
    lineY; // 纵坐标

/**
 * @desc 	添加元素监听
 * @param 	element		棋盘格
 * @param	handler		监听执行函数
*/
function addEvent(element, handler){
    if (element.addEventListener){
        element.addEventListener('click', handler, false);
    } else if (element.attachEvent){
        element.attachEvent('onclick', handler);
    } else {
        element.onclick = handler;
    }
}

/**
 * @desc    棋盘上画格格
 * @param   n   棋盘横纵线条数 格数n-1
 */
function drawGobang(n) {
    // i 横向第几条线，j 纵向第几条线
    for (var i = 0; i < n; i++){
        for (var j = 0; j < n; j++){
            var block = document.createElement('div');
            block.className = 'gobang_block';
            block.id = 'block_'+ i + '_' + j;
            gobang.appendChild(block);
            // 边角的点删除多余边线样式
            if (i === 0) {
                block.className += ' top';
            }
            if (i === n - 1) {
                block.className += ' bottom';
            }
            if (j === 0) {
                    block.className += ' left';
            }
            if (j === n - 1) {
                block.className += ' right';
            }
        }
    }
}
/**
 * @desc     棋盘点击画棋子
 * @param   event   点击事件
*/
function drawPiece(event) {
    var	target = event.target || event.srcElement, // 获取点击元素信息
        targetId = target.id, // 获取点击元素id
        a = +targetId.split('_'),
        i = +targetId.split('_')[1], // 获取行数
        j = +targetId.split('_')[2]; // 获取列数
    if (targetId != 'gobang_main') {
        // 如果点击棋盘交叉点
        if (target.className.indexOf('active') < 0) {
            // 包含active类名的元素表示该位置已有棋子
            target.className = target.className + " active " + color; // 画当前棋子
            if (gobangArr[i]) {
                gobangArr[i][j] = color; // 存棋盘的数据
                chessWin(i, j, color); // 判断是否赢
            } else {
                alert("错误 "+target.id+" "+a+" "+i+" "+j);
            }
            color = color == 'black' ? 'white' : 'black';  // 修改棋子颜色
            if (!win) {
                gobangStatus.innerHTML = color === 'black' ? '<p>轮到黑棋下</p>' : '<p>轮到白棋下</p>';
            }
        }	
    }
}

/**
 * @desc    判断输赢
 * @param   i       当前棋子所在行
 * @param   j       当前棋子所在列
 * @param   color   当前颜色
 */
function chessWin(i, j, color) {
    var row,
        col,
        count = 1;  // 连续同一个颜色棋子的个数
    lineX = i;
    lineY = j;
    // 垂直方向循环判断
    for (row = i - 1; row >= 0 && row > i - 5; row--) {
        // 向上查询有几个相同颜色棋子
        if (gobangArr[row] && gobangArr[row][j] === color) {
            count++;
            isWin(count, color);
        } else {
            // 如果不符合条件跳出循环
            break;
        }
    }
    for (row = i + 1; row < n && row < i + 5; row++) {
        // 向下查询有几个相同颜色棋子
        if (gobangArr[row] && gobangArr[row][j] === color) {
            count++;
            isWin(count, color);
        } else {
            // 碰到不符合跳出循环
            break;
        }
    }
    // 新的方向 初始值置为1
    count = 1;

    // 水平方向循环判断
    for (col = j - 1; col >= 0 && col > j - 5; col--) {
        // 向左查询有几个相同颜色棋子
        if (gobangArr[i] && gobangArr[i][col] === color) {
            count++;
            isWin(count, color);
        } else {
            // 碰到不符合跳出循环
            break;
        }
    }
    for (col = j + 1; col < n && col < j + 5; col++){
        // 向右查询有几个相同颜色棋子
        if (gobangArr[i] && gobangArr[i][col] == color) {
            count++;
            isWin(count, color);
        } else {
            // 碰到不符合跳出循环
            break;
        }
    }
    // 新方向查询
    count = 1;

    // 45°方向循环判断
    for (row = i - 1, col = j - 1; row >= 0 && col >= 0 && row > i - 5 && col > j - 5; row-- , col--){
        // 左上查询有几个相同颜色旗子
        if (gobangArr[row] && gobangArr[row][col] == color) {
            count++;
            isWin(count, color);
        } else {
            // 碰到不同色跳出循环
            break;
        }
    }
    for (row = i + 1, col = j + 1; row < n && col < n && row < i + 5 && col < j + 5; row++ , col++){
        // 右下查询有几个相同颜色旗子
        if (gobangArr[row] && gobangArr[row][col] == color) {
            count++;
            isWin(count, color);
        } else {
            // 碰到不同色跳出
            break;
        }
    }
    // 新方向查询
    count = 1;

    // 135°方向循环判断
    for (row = i - 1, col = j + 1; row >= 0 && col < n && row > i - 5 && col < j + 5; row-- , col++){
        // 右上查询
        if (gobangArr[row] && gobangArr[row][col] == color) {
            count++;
            isWin(count, color);
        } else {
            // 不同色跳出
            break;
        }
    }
    for (row = i + 1, col = j - 1; row < n && col >= 0 && row < i + 5 && col > j - 5; row++ , col--){
        // 左下查询
        if (gobangArr[row] && gobangArr[row][col] == color) {
            count++;
            isWin(count, color);
        } else {
            // 不同色跳出
            break;
        }
    }
    // 全部情况均未赢 置为初始值
    count = 1;
    canBack = true;
}

/**
 * @desc    判断是否赢了
 * @param {*} count 
 * @param {*} color 
 */
function isWin(count, color) {
    if(count === 5){
        if(color === 'black') {
            gobangStatus.innerHTML ='<p>黑棋赢了</p>';
            alert('黑棋赢了');
        } else {
            gobangStatus.innerHTML ='<p>白棋赢了</p>';
            alert('白棋赢了');
        }
        win = true;
        canBack = false;
        if (element.removeEventListener){
            element.removeEventListener(type, handler, false);
        } else if (element.detachEvent){
            element.detachEvent('on' + type, handler);
        } else {
            element['on' + type] = null;
        }
    } else {
        win = false;
        canBack = true;
    }
}

/**
 * @desc    清空棋盘数据，初始化
 */
function resetGobang() {
    var i, j;
    //  初始化数组数据
    for (i = 0; i < n; i++) {
        var tempData = [];
        for (j = 0; j < n; j++) {
            tempData.push('');
        }
        gobangArr[i] = tempData;
    }
    // 设置默认数据
    color = 'black';
    gobangStatus.innerHTML = '<p>默认黑棋先下</p>';
    addEvent(gobang, drawPiece);
    // 清除棋子
    var divClassName,
        divGroup = gobang.getElementsByTagName('div'),
        len = divGroup.length;
    for (i = 0; i < len; i++){
        if (typeof (divGroup[i]) === 'object') {
            // 如果存在当前遍历dom获取dom类名
            divClassName = divGroup[i].getAttribute('class');
            if (typeof (divClassName) === 'string') {
                // 如果存在类名
                if (divClassName.indexOf('active white') > 0) {
                    // 如果是已下白棋，删除active white两个类实现清空白棋
                    divClassName = divClassName.replace('active white', '');
                    divGroup[i].setAttribute('class', divClassName);
                }
                if (divClassName.indexOf('active black') > 0) {
                    // 如果是已下黑棋，删除active black两个类实现清空黑棋
                    divClassName = divClassName.replace('active black', '');
                    divGroup[i].setAttribute('class', divClassName);
                }
            }
        }
    }
}
/**
 * @desc    悔棋按钮被点击
 */
function handleBackClick() {
    if (canBack) {
        canBack = false;
        let domId = 'block_' + lineX + '_' + lineY;
        let canBackDom = document.getElementById(domId);
        canBackDom.className = 'gobang_block';
        gobangArr[lineX][lineY] = '';
        color = color == 'black' ? 'white' : 'black';  // 修改棋子颜色
    }

}

resetGobang();
drawGobang(n);
// 添加棋盘格监听
addEvent(gobang, drawPiece);  // 点击棋盘，进行下棋
// 新开一局监听
addEvent(gobangToolAgain, resetGobang);
addEvent(goBack, handleBackClick)
