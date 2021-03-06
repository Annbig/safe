window.requestAnimFrame = (function () {
    return window.requestAnimationFrame ||
        window.webkitRequestAnimationFrame ||
        window.mozRequestAnimationFrame ||
        function (callback) {
            window.setTimeout(callback, 1000 / 15);
        };
})();


$(function () {
    //绘制画布
    var canvas = document.getElementById('index_canvas');
    //设置画布的宽高
    var outWidth = $($('.canvas_wrap')[0]).width(),
        outHeight = $($('.canvas_wrap')[0]).height();
    canvas.height = outHeight;
    canvas.width = outWidth;

    var shape = canvas.getContext('2d');

    var timeRun;

    //画布中心点及滚动半径，滚动幅度
    var target = {
        x: outerWidth / 2,
        y: outHeight / 2
    };
    var r = 100, speed = 5;
    //设置点的数组，起始点和结束点
    var points = [];

    init();
    drawNotChange();
    animate();

    function init() {
        for (var i = 0; i < 8; i++) {
            var x = target.x + r * Math.cos(Math.PI * 2 * i / 8);
            var y = target.y + r * Math.sin(Math.PI * 2 * i / 8);
            points.push({
                x: x,
                y: y,
                startX: x,
                startY: y,
                endX: x,
                endY: y,
                circleX: x,
                circleY: y
            })
        }
        for (var i = 0; i < points.length; i++) {
            getEndPoint(points, points[i]);
        }
    }

    //绘制不可变的图像
    function drawNotChange() {
        var img = document.createElement('img');
        img.src = './images/timg.jpeg';
        shape.drawImage(img, 0, 0);
        // for(var j=0;j<points.length;j++){
        //     shape.fillStyle = '#f0f';
        //     shape.beginPath();
        //     shape.arc(points[j].x, points[j].y, 5, 0, Math.PI * 2, true);
        //     shape.closePath();
        //     shape.fill();
        // }
        
        for (var j = 0; j < points.length; j++) {
            shape.beginPath();
            for (var k = 0; k < points.length; k++) {
                shape.moveTo(points[j].x, points[j].y);
                shape.lineTo(points[k].x, points[k].y);
                var grd = shape.createLinearGradient(points[j].x, points[j].y, points[k].x, points[k].y); //（xStart,yStart）起点，（xEnd,yEnd）终点
                grd.addColorStop(0, '#666'); //offset范围是0~1之间的浮点数，color是关键颜色
                grd.addColorStop(1, '#eee');
                shape.strokeStyle = grd;
                shape.globalAlpha = 0.5;
            }
            shape.closePath();
            shape.stroke();
        }
    }

    //动画
    function animate() {
        //requestAnimFrame(animate);
        timeRun = setInterval(function () {
            shape.clearRect(0, 0, outWidth, outHeight);
            drawNotChange();
            for (item in points) {
                draw(points[item]);
            }
        }, 100);

    }
    function draw(point) {
        var translatex = speed, translatey = speed;
        var maxX = Math.max(point.startX, point.endX);
        var maxY = Math.max(point.startY, point.endY);

        if (point.startY.toFixed(2) == point.endY.toFixed(2)) {
            point.startX > point.endX ? point.circleX = point.startX - speed : point.circleX = point.startX + speed;
        } else if (point.startX.toFixed(2) == point.endX.toFixed(2)) {
            point.startY > point.endY ? point.circleY = point.startY - speed : point.circleY = point.startY + speed;
        } else {
            point.startX > point.endX ? point.circleX = point.startX - speed : point.circleX = point.startX + speed;
            point.circleY = ((point.startX - point.circleX) * point.endY + (point.circleX - point.endX) * point.startY) / (point.startX - point.endX);
        }

        if (point.circleX < Math.min(point.startX, point.endX) || point.circleX > Math.max(point.startX, point.endX) ||
            point.circleY < Math.min(point.startY, point.endY) || point.circleY > Math.max(point.startY, point.endY)) {
            point.circleX = point.endX;
            point.circleY = point.endY;
            point.startX = point.endX;
            point.startY = point.endY;

            getEndPoint(points, point);
        }
        shape.globalAlpha = 1;
        shape.fillStyle = '#f00';
        shape.beginPath();
        shape.arc(point.circleX, point.circleY, 5, 0, Math.PI * 2, true);
        shape.closePath();
        shape.fill();
        point.startX = point.circleX;
        point.startY = point.circleY;
    }

    //监听鼠标事件
    canvas.onmouseover = function (e) {
        window.clearInterval(timeRun);
        shape.clearRect(0, 0, outWidth, outHeight);
        drawNotChange();
        for (item in points) {
            shape.fillStyle = '#f00';
            shape.beginPath();
            shape.arc(points[item].circleX, points[item].circleY, 5, 0, Math.PI * 2, true);
            shape.closePath();
            shape.fill();
        }
    }
    canvas.onmouseout = function (e) {
        animate();
    }
});

//随机获取下一个结束点
function getEndPoint(points, point) {
    var index = Math.floor(Math.random() * 8);
    var end_point = points[index];
    if (end_point.x != point.startX || end_point.y != point.startY) {
        point.endX = end_point.x;
        point.endY = end_point.y;
    }
    // if (JSON.stringify(new_point) != JSON.stringify(endpoint) && JSON.stringify(new_point) != JSON.stringify(startpoint)) {
    //     return new_point;
    // }
    // return getEndPoint(points, endpoint, startpoint);
}