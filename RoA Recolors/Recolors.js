/* This is where the image is going to appear */
const mainCa = document.createElement("canvas");
const mainCo = mainCa.getContext("2d");
document.getElementById("mainCanvas").appendChild(mainCa);
mainCa.className = "charCanvas";


/*  */
char = new orcane;

function elBoton() {
    const hex = document.getElementById("body").value;
    const rgb = hexDecode(hex);
    char.recolor(rgb);
}


/* Character Properties */

function orcane() {

    this.width = 308;
    this.height = 289;

    mainCa.width = this.width;
    mainCa.height = this.height;

    //this is the base image that we will split in different separated colors
    this.image = new Image();
    this.image.src = "Characters/Orcane.png";
    this.image.onload = () => {
        //draw it so we can look at it later
        mainCo.drawImage(this.image, 0, 0);

        //create the different parts of the character that will be recolored
        //constructor: [rgb values of the 3 original parts], [the 2 hsv color differences from the original color]
        body = new part([[59, 73, 135], [44, 53, 113], [29, 33, 91]], [[3, 5, -9], [7, 11, -17]]);
        belly = new part([[205, 247, 247], [130, 173, 177], [74, 104, 116]], [[5, 10, -28], [17, 19, -52]]);
    }

    this.recolor = (rgb) => {
        body.recolor(rgb[0]);
        belly.recolor(rgb[1]);
    }
}


/* Character Parts */

function part(inColors, range) {

    const subs = [];
    //each part will always have 3 different colors (normal, dark, darker)
    subs[0] = new subPart(inColors[0]); //final color wont get modified
    subs[1] = new subPart(inColors[1], range[0]); //range defines darkness
    subs[2] = new subPart(inColors[2], range[1]);

    this.recolor = function(rgb) {
        for (let i = 0; i < subs.length; i++) {
            subs[i].recolor(rgb);
        }
    }
}

function subPart(inColor, range = 0) {
    //this canvas will be added onto the main canvas
    this.canvas = document.createElement("canvas"),
    this.canvas.width = mainCa.width;
    this.canvas.height = mainCa.height;
    this.context = this.canvas.getContext("2d");

    //values of the original colors of the part
    this.r = inColor[0];
    this.g = inColor[1];
    this.b = inColor[2];

    //darkness difference in hsv for the color
    this.colorRange = range;

    //create a separate image containing only this color, add it to the part's canvas
    const imgData = mainCo.getImageData(0, 0, mainCa.width, mainCa.height);
    let i;
    const l = imgData.data.length;
    for (i = 0; i < l; i += 4) {
        if (imgData.data[i] == this.r && imgData.data[i + 1] == this.g && imgData.data[i+2] == this.b) {
            imgData.data[i] = this.r;
            imgData.data[i+1] = this.g;
            imgData.data[i+2] = this.b;
        } else {
            imgData.data[i+3] = 0;
        }
    }
    this.context.putImageData(imgData, 0, 0);
    mainCo.drawImage(this.canvas, 0, 0);

    //this is where the magic happens    
    this.recolor = (rgb) => {

        if (!this.colorRange) {
            //if no color range, use the regular value
            recolorChar(rgb, this.context, this.canvas);
        } else {

            //convert the sent rgb to hsv
            const hsv = rgb2hsv(rgb[0], rgb[1], rgb[2]);

            //add the values to make it darker
            hsv[0] += this.colorRange[0];
            hsv[1] += this.colorRange[1];
            hsv[2] += this.colorRange[2];

            //convert back to rgb
            const charRgb = hsv2rgb(hsv[0], hsv[1], [hsv[2]]);

            //then recolor
            recolorChar(charRgb, this.context, this.canvas);
        }

        function recolorChar(rgb, ctx, can) {

            //we will recolor this image
            const imgData = ctx.getImageData(0, 0, mainCa.width, mainCa.height);
        
            //run through each pixel of the image and change its rgb value
            let i;
            const l = imgData.data.length;
            for (i = 0; i < l; i += 4) {
                imgData.data[i] = rgb[0];
                imgData.data[i+1] = rgb[1];
                imgData.data[i+2] = rgb[2];
            }
        
            //the result will be added to the main canvas
            ctx.putImageData(imgData, 0, 0);
            mainCo.drawImage(can, 0, 0);
            
        }
    }
}


/* color Conversions */

function hexDecode(hex) {

    let newHex = "";
    for (let i = 0; i < hex.length; i++) {
        if (hex.charAt(i) != "-") {
            newHex += hex.charAt(i);
        }
    }
    const charHex = newHex.match(/.{1,6}/g);
    const charRGB = [];
    
    for (let i = 0; i < charHex.length; i++) {
        charRGB.push(hex2rgb(charHex[i]));
    }

    return charRGB;
}


function hex2rgb(hex) {
    const rgb = [];
    const bigint = parseInt(hex, 16);
    rgb[0] = (bigint >> 16) & 255;
    rgb[1] = (bigint >> 8) & 255;
    rgb[2] = bigint & 255;
    return rgb;
}


function rgb2hsv (r, g, b) {

    //code from https://github.com/netbeast/colorsys, a bit modified

    const RGB_MAX = 255;
    const HUE_MAX = 360;
    const SV_MAX = 100;
  
    // It converts [0,255] format, to [0,1]
    r = (r === RGB_MAX) ? 1 : (r % RGB_MAX / parseFloat(RGB_MAX))
    g = (g === RGB_MAX) ? 1 : (g % RGB_MAX / parseFloat(RGB_MAX))
    b = (b === RGB_MAX) ? 1 : (b % RGB_MAX / parseFloat(RGB_MAX))
  
    var max = Math.max(r, g, b)
    var min = Math.min(r, g, b)
    var h, s, v = max
  
    var d = max - min
  
    s = max === 0 ? 0 : d / max
  
    if (max === min) {
      h = 0 // achromatic
    } else {
      switch (max) {
        case r:
          h = (g - b) / d + (g < b ? 6 : 0)
          break
        case g:
          h = (b - r) / d + 2
          break
        case b:
          h = (r - g) / d + 4
          break
      }
      h /= 6
    }
  
    h = Math.round(h * HUE_MAX)
    s = Math.round(s * SV_MAX)
    v = Math.round(v * SV_MAX)

    return [h, s, v];
  }


function hsv2rgb(h, s, v) {
    var r, g, b, i, f, p, q, t;

    h = h / 360;
    s = s / 100;
    v = v / 100;

    i = Math.floor(h * 6);
    f = h * 6 - i;
    p = v * (1 - s);
    q = v * (1 - f * s);
    t = v * (1 - (1 - f) * s);
    switch (i % 6) {
        case 0: r = v, g = t, b = p; break;
        case 1: r = q, g = v, b = p; break;
        case 2: r = p, g = v, b = t; break;
        case 3: r = p, g = q, b = v; break;
        case 4: r = t, g = p, b = v; break;
        case 5: r = v, g = p, b = q; break;
    }

    r = Math.round(r * 255)
    g = Math.round(g * 255)
    b = Math.round(b * 255)
    return [r, g, b]  
}