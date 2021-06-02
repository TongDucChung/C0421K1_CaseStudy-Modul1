let Map = function (width, height) {
    var canvas = document.createElement("canvas");
    canvas.width = width;
    canvas.height = height;
    var context = canvas.getContext("2d");
    var offsetX = 0;
    var imageData = null;
    // create map, để vẽ địa hình nhìn giống núi non ta dùng lineTo() vẽ và lặp nó lại
    context.beginPath();
    context.moveTo(0, Math.floor(Math.random() * canvas.height));
    context.fillStyle = "green";
    context.fillRect(600, 400, 300, 600);
    context.fillRect(0, 500, 300, 100);
    context.fillStyle = "blue";
    context.fillRect(300, 150, 60, 20);
    context.fillRect(500    , 150, 60, 20);
    context.fillRect(400, 150, 60, 20);

    imageData = context.getImageData(0, 0, canvas.width, canvas.height);
    this.draw = function (context) {
        offsetX++;
        if (offsetX > width)
            offsetX = 0;
        context.drawImage(canvas, 0, 0, width, height);
    };
    // check xem vị trí có phải alpha=0 không(khoảng trắng)
    this.contain = function (x, y) {
        if (!imageData)
            return false;
        var index = Math.floor((x + y * width) * 4 + 3);
        return imageData.data[index] != 0;
    }

    this.collide = function (x, y) {
        if (this.contain(x, y)) {
            context.save();
            context.globalCompositeOperation = "destination-out";
            context.fillStyle = "rgba(0,0,0,1)";
            context.beginPath();
            context.arc(x, y, 20, 0, Math.PI * 2, );
            context.fill();
            context.restore();
            imageData = context.getImageData(0, 0, width, height);
            return true;
        } else if (this.contain(x, y))
            return false;
    };
}