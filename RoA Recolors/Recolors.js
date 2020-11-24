/* This is where the image is going to appear */
const mainCa = document.createElement("canvas");
const mainCo = mainCa.getContext("2d");
document.getElementById("mainCanvas").appendChild(mainCa);
mainCa.className = "charCanvas";


/* Character Properties */

class Character {
    constructor(charName, parts) {

        //this is the base image that we will split in different separated colors
        const image = new Image();
        image.src = "Characters/"+charName+".png";
        image.onload = () => {

            //change the size of the main canvas
            mainCa.width = image.width;
            mainCa.height = image.height;

            //draw it so we can look at it later
            mainCo.drawImage(image, 0, 0);

            //create the different parts of the character that will be recolored
            this.charParts = [];
            for (let i = 0; i < parts.length; i++) {
                this.charParts.push(new Part(parts[i][0], parts[i][1]));
            }            
        };

    }

    recolor(rgb) {
        for (let i = 0; i < this.charParts.length; i++) {
            this.charParts[i].recolor(rgb[i]);
        }
    };
}


/* Character Parts */

class Part {
    constructor(inColors, range) {

        const subs = [];
        //each part will have different colors deviating from the original for shading
        for (let i = 0; i < inColors.length; i++) {
            if (i == 0) {
                subs.push(new SubPart(inColors[0])); //final color wont get modified
            } else {
                subs.push(new SubPart(inColors[i], range[i-1])); //range defines darkness
            }
            
        }

        this.recolor = function (rgb) {
            for (let i = 0; i < subs.length; i++) {
                subs[i].recolor(rgb);
            }
        };

    }
}

class SubPart {
    constructor(inColor, range = false) {
        //this canvas will be added onto the main canvas
        const canvas = document.createElement("canvas");
        canvas.width = mainCa.width;
        canvas.height = mainCa.height;
        const context = canvas.getContext("2d");

        //values of the original colors of the part
        let r = inColor[0];
        let g = inColor[1];
        let b = inColor[2];

        //darkness difference in hsv for the color
        const colorRange = range;

        //create a separate image containing only this color, add it to the part's canvas
        const imgData = mainCo.getImageData(0, 0, mainCa.width, mainCa.height);
        let i = 0;
        const l = imgData.data.length;
        for (i; i < l; i += 4) {
            if (imgData.data[i] == r && imgData.data[i + 1] == g && imgData.data[i + 2] == b) {
                imgData.data[i] = r;
                imgData.data[i + 1] = g;
                imgData.data[i + 2] = b;
            } else {
                imgData.data[i + 3] = 0;
            }
        }
        context.putImageData(imgData, 0, 0);

        //this is where the magic happens    
        this.recolor = (rgb) => {

            if (!colorRange) {
                //if no color range, use the regular value
                recolorChar(rgb, context, canvas);
            } else {

                //convert the sent rgb to hsv
                const hsv = rgb2hsv(rgb[0], rgb[1], rgb[2]);

                //add the values to make it darker
                hsv[0] += colorRange[0];
                hsv[1] += colorRange[1];
                hsv[2] += colorRange[2];

                //convert back to rgb
                const charRgb = hsv2rgb(hsv[0], hsv[1], [hsv[2]]);

                //then recolor
                recolorChar(charRgb, context, canvas);
            }

            function recolorChar(rgb, ctx, can) {

                //we will recolor this image
                const imgData = ctx.getImageData(0, 0, mainCa.width, mainCa.height);

                //run through each pixel of the image and change its rgb value
                let i = 0;
                const l = imgData.data.length;
                for (i; i < l; i += 4) {
                    imgData.data[i] = rgb[0];
                    imgData.data[i + 1] = rgb[1];
                    imgData.data[i + 2] = rgb[2];
                }

                //the result will be added to the main canvas
                ctx.putImageData(imgData, 0, 0);
                mainCo.drawImage(can, 0, 0);

            }
        }
    }
}


/* Color Conversions */

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
  
    h = h * HUE_MAX
    s = s * SV_MAX
    v = v * SV_MAX

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


/* Character Database */

// Each part will follow the same structure:
// [the rgb values of the original parts]
// [the hsv color differences from the original color]
const etalus = {
    body: [
        [[251, 250, 252], [200, 182, 226], [129, 100, 168]],
        [[-5, 18, -10], [-4, 39, -33]]
    ],
    ice: [
        [[180, 230, 230], [130, 173, 177], [74, 104, 116]],
        [[5, 5, -21], [17, 14, -45]]
    ],
    shading: [
        [[67, 68, 87], [50, 51, 62]],
        [[-2, -4, -10]]
    ]
}
const orcane = {
    body: [
        [[59, 73, 135], [44, 53, 113], [29, 33, 91]],
        [[3, 5, -9], [7, 11, -17]]
    ],
    belly: [
        [[205, 247, 247], [130, 173, 177], [74, 104, 116]],
        [[5, 10, -28], [17, 19, -52]]
    ]
}


/* Actual webpage code */

function elBoton() {
    const hex = document.getElementById("body").value;
    const rgb = hexDecode(hex);
    char.recolor(rgb);
}

let char;
char = new Character("Etalus", [etalus.body, etalus.ice, etalus.shading]);

