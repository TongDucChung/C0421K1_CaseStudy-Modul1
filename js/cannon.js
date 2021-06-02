function Cannon(mapWidth, mapHeight,x,y){
    this.mapWidth = mapWidth;
    this.mapHeight = mapHeight;
    this.radius = 10;
    this.speed = 5;
    this.power = 3;
    this.cx = x;
    this.cy = y;
    this.angle = 0;
    this.balls = [];
    this.cannonHeight = this.radius/2;
    this.cannonWidth = this.cannonHeight*4;
    this.hp=200;
    this.isDeath=false
}
    Cannon.prototype.draw = function(context){
        context.beginPath();
        context.fillStyle = "blue";
        context.arc(this.cx,this.cy,this.radius,0,Math.PI*2,true);
        context.closePath();
        context.fill();

        context.save();
        context.translate(this.cx, this.cy);
        context.rotate(this.angle);
        context.beginPath();
        context.fillStyle = "red";
        context.rect(0, -this.cannonHeight / 2, this.cannonWidth, this.cannonHeight);

        context.fill();
        context.closePath();
        context.restore();

        // yellow circle
        context.beginPath();
        context.fillStyle = "yellow";
        context.arc(this.cx, this.cy, this.radius / 2, 0, Math.PI * 2, true);
        context.closePath();
        context.fill();

        for(var i=0;i<this.balls.length;i++)
        {
            this.balls[i].draw(context);
        }
    }

Cannon.prototype.update = function(map){
    if(!map.contain(this.cx,this.cy+this.radius)) //thả cannon xuống nhìn cho cool
        this.cy += this.speed;
    for(var i=0;i<this.balls.length;i++) {
        var item = this.balls[i];
        var x = Math.floor(item.cx);
        var y = Math.floor(item.cy);
        if(item.update() || map.collide(x,y))
        {
            this.balls.splice(i,1);
        }
    }
}
// targetX,targetY là vị trí của chuột trên canvas
Cannon.prototype.fire = function(targetX, targetY){
    var dx = targetX - this.cx;
    var dy = targetY - this.cy;
    // tính độ lớn của lực bắn dựa trên độ xa gần vị trí con trỏ của cannon
    var power = Math.floor(Math.sqrt(dx*dx+dy*dy)/20);

    if(this.balls.length == 1)
        return;
    var dirX = Math.cos(this.angle);
    var dirY = Math.sin(this.angle);

    var startX = this.cx + this.cannonWidth * dirX;//tọa độ bắt đầu
    var startY = this.cy + this.cannonWidth * dirY;

    var ball = new Ball(this.mapWidth,this.mapHeight,startX,startY,dirX,dirY,power);
    this.balls.push(ball);
}
Cannon.prototype.rotate = function(targetX, targetY){
    var dx = targetX - this.cx;
    var dy = targetY - this.cy;
    this.angle = Math.atan2(dy,dx);// Tính góc
}
Cannon.prototype.resetSpeed = function() {
    this.speedX = 0;
    this.speedY = 0;
}
Cannon.prototype.moveUp = function() {
    this.speedY = -this.power;
}
Cannon.prototype.moveDown = function() {
    this.speedY = this.power;
}
Cannon.prototype.moveLeft = function() {
    this.speedX = -this.power;
}
Cannon.prototype.moveRight = function() {
    this.speedX = this.power;}

Cannon.prototype.handleInputs = function(e){
    this.speedX = 0;
    this.speedY = 0;
    if(this.isFalling || this.isDeath)
        return;
    switch(e.keyCode)
    {
        case 37: // left arrow
            this.move(-SPEED);
            break;
        case 39: // right arrow
            this.move(SPEED);
            break;
        default:
            break;
    }
}
//xét va chạm
Cannon.prototype.calculateDamage = function(ball){
    if(this.isDeath)
        return 0;
    var dx = this.cx - ball.cx;
    var dy = this.cy - ball.cy;
    var d =  Math.sqrt(dx*dx+dy*dy);

    if(d<=ball.damageRange){

        var hp_lost = Math.floor(ball.energy+(200-100*d/ball.damageRange));
        this.hp -= hp_lost;

        if(this.hp<=0)
        {
            this.hp = 0;
            this.isDeath = true;
        }
        return hp_lost;
    }
    return 0;
}

