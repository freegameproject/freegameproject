window.requestAnimationFrame = window.requestAnimationFrame || window.mozRequestAnimationFrame || window.webkitRequestAnimationFrame || window.msRequestAnimationFrame;
width = window.innerWidth;
height = window.innerHeight;
canvas = document.createElement('canvas');
canvas.style.margin = 0;
canvas.style.padding = 0;
document.body.style.margin = 0;
document.body.style.padding = 0;
c = canvas.getContext('2d');
canvas.width = width;
canvas.height = height;
center_x = width / 2;
center_y = height / 2;
canvas.style.width = canvas.width + "px";
canvas.style.height = canvas.height + "px";
document.body.appendChild(canvas);


gesture = false;
select = null;

function handleEvent(event) {
    switch (event.type) {
        case 'touchstart':
            event.preventDefault();
            var touch = event.touches[0]; //获取第一个触点
            touch_x = Number(touch.pageX); //页面触点X坐标
            touch_y = Number(touch.pageY); //页面触点Y坐标
            var x = touch_x;
            var y = touch_y;
            if (requestID === 0) {
                if (c.isPointInPath(x, y)) {

                    restart();
                }
            }


            select = null;

            if (player.x - player.w / 2 < x && player.x + player.w / 2 > x && player.y - player.h / 2 < y && player.y + player.h / 2 > y) {
                select = player;
                cha_x = touch_x - select.x;
                cha_y = touch_y - select.y;
            }

            break;
        case 'touchmove':
            event.preventDefault();
            var touch = event.touches[0]; //获取第一个触点
            touch_x = Number(touch.pageX); //页面触点X坐标
            touch_y = Number(touch.pageY); //页面触点Y坐标
            if (select != null) {
                select.x = touch_x - cha_x;
                select.y = touch_y - cha_y;
            }
            break;
        case 'touchend':
            event.preventDefault();
            break;
        case 'gesturestart':
            player_fires.push({
                role: 'player_fire',
                x: player.x,
                y: player.y,
                w: 10,
                h: 10,
                i: res['player']
            });
            break;
    }
}
canvas.addEventListener('touchstart', handleEvent, false);
canvas.addEventListener('touchmove', handleEvent, false);
canvas.addEventListener('touchend', handleEvent, false);
canvas.addEventListener('gesturestart', handleEvent, false);


var objs = [];
var obj_fires = [];
var player_fires = [];


var res = [];
var loaded = 0;
function load_img(role, src) {
    var img = new Image();
    img.src = src;
    img.setAttribute('role', role);
    img.onload = function () {
        res[this.getAttribute('role')] = this;
        loaded += 1;
    }
}

function add_obj(role, x, y, w, h) {
    var i = res[role];
    objs.push({
        role: role,
        x: x,
        y: y,
        w: w,
        h: h,
        i: i
    });
}

function init_player() {
    var x = center_x;
    var y = height - 50;
    player = {
        role: 'player',
        x: x,
        y: y,
        w: 50,
        h: 50,
        i: res['player']
    };
}


function updateScreen(time) {
    requestID = window.requestAnimationFrame(updateScreen);
    timer += 1;
    if (timer === 100) {
        var x = Math.floor(Math.random() * width);
        var y = -100;
        add_obj('ie', x, y, 30, 30);
        timer = 0;
    }
    c.clearRect(0, 0, canvas.width, canvas.height);

    objs.map(function (obj, index, objs) {
        obj.y += 1;
        if (obj.y > height + obj.h) {
            objs.splice(index, 1);
        }
        onCollide(obj, player, function () {
            gameover();
        })
        c.drawImage(obj.i, obj.x - obj.w / 2, obj.y - obj.h / 2, obj.w, obj.h);
    });


    obj_fire_time += 1;
    if (obj_fire_time === 50) {
        obj_fire_time = 0;
        if (objs.length > 0) {
            var tmp_index = Math.floor(Math.random() * (objs.length - 1));
            obj_fires.push({
                role: 'obj_fires',
                x: objs[tmp_index].x,
                y: objs[tmp_index].y,
                w: 10,
                h: 10,
                i: res['ie']
            });
        }

    }

    obj_fires.map(function (obj, index, obj_fires) {
        obj.y += 2;
        onCollide(obj, player, function () {
            gameover();
        })
        c.drawImage(obj.i, obj.x - obj.w / 2, obj.y - obj.h / 2, obj.w, obj.h);

    });

    /*开火*/
    player_fires.map(function (obj, index, play_fires) {


        obj.y -= 3;
        if (obj.y < -10) {
            play_fires.splice(index, 1);
        }

        objs.map(function (one, i, arr) {

            onCollide(obj, one, function () {
                arr.splice(i, 1);
                play_fires.splice(index, 1);
                die_ie += 1;//消灭一个ie
            })

        });

        obj_fires.map(function (one, i, arr) {

            onCollide(obj, one, function () {
                arr.splice(i, 1);
                play_fires.splice(index, 1);
            })

        });


        c.drawImage(obj.i, obj.x - obj.w / 2, obj.y - obj.h / 2, obj.w, obj.h);

    });


    c.drawImage(player.i, player.x - player.w / 2, player.y - player.h / 2, player.w, player.h);

    c.font = "20px Arial";
    c.fillStyle = "#ff0000";
    c.fillText("已经消灭 " + die_ie + " 个IE", 20, 20);


}

function onCollide(obj_1, obj_2, fn) {
    if (obj_1 != obj_2) {
        if (obj_1.x > 0 && obj_1.y > 0) {
            if (obj_2.x > 0 && obj_2.y > 0) {
                var xx = Math.abs(obj_1.x - obj_2.x);
                var yy = Math.abs(obj_1.y - obj_2.y);
                if (xx < obj_1.w / 2 || xx < obj_2.w / 2) {
                    if (yy < obj_1.h / 2 || yy < obj_2.h / 2) {
                        fn();
                    }
                }
            }
        }

    }
}

function startUpdateScreen() {
    requestID = window.requestAnimationFrame(updateScreen);
}
function stopUpdateScreen() {
    window.cancelAnimationFrame(requestID);
}
function load_finish() {

}
function check_load() {
    if (loaded === res_count) {
        load_finish();
    } else {
        requestID = window.requestAnimationFrame(check_load);
    }
}

function ready(fn) {
    load_finish = fn;
    requestID = window.requestAnimationFrame(check_load);
}
function gameover() {
    c.fillStyle = "#000000";
    c.globalAlpha = 0.5;
    c.fillRect(0, 0, width, height);
    c.globalAlpha = 1;
    c.font = "30px Arial";
    c.fillStyle = "#ff0000";
    c.fillText("Game Over", width / 2 - 270 / 2, height / 2 - 15);
    window.cancelAnimationFrame(requestID);
    requestID = 0;

    c.fillStyle = "#ff0000";
    c.beginPath();
    c.fillStyle = "#ff0000";
    c.rect(10, height - 100, width - 20, 90);
    c.fill();
    c.closePath();
    c.font = "30px Arial";
    c.fillStyle = "#ffffff";
    c.fillText("restart", 30, height - 60);

}
/**/

load_img('ie', 'ie.png');
load_img('player', 'chrome.png');
res_count = 2;
ready(function () {

    restart();
});

function restart() {
    init_player();
    objs.length = 0;
    obj_fires.length = 0;
    player_fires.length = 0;
    timer = 0;
    obj_fire_time = 0;
    die_ie = 0;//死掉的ie数量
    startUpdateScreen();
}


