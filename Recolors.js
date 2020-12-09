/* This is where the image is going to appear */
const mainImg = document.getElementById("resultImg");
const mainCa = document.createElement("canvas");
const mainCo = mainCa.getContext("2d");


/* Character Properties */

class Character {
    constructor(charName, parts, imgsrc = false) {

        //this is the base image that we will split in different isolated colors
        const image = new Image();
        if (imgsrc) {
            image.src = imgsrc;
        } else {
            image.src = "Characters/"+charName+"/Full.png";
        }
        image.onload = () => {

            //change the size of the main canvas
            mainCa.width = image.width;
            mainCa.height = image.height;

            //draw it so we can look at it later
            mainCo.drawImage(image, 0, 0);

            //create the different parts of the character that will be recolored
            this.charParts = [];
            for (let i = 0; i < parts.length; i++) {
                this.charParts.push(new Part(parts[i]));
            }

            //Ori is the only character that has to be recolored for startup
            if (charName == "Ori and Sein") {
                charCanvas.recolor(hexDecode("F5F2-F9F5-F2F9-0000-005D-CBF1-0000-0000"));
            }
            
            //when thats finished, add the result to the webpage image
            //we are not using the canvas itself since it cant be resized if it overflows
            mainImg.src = mainCa.toDataURL();
        };

    }

    //rgb code will already be decoded here
    recolor(rgb) {
        for (let i = 0; i < this.charParts.length; i++) {
            this.charParts[i].recolor(rgb[i]);
        }
    };
}


/* Character Parts */

class Part {
    constructor(inColors) {

        const subs = [];
        //each part will have different colors deviating from the original for shading
        for (let i = 0; i < inColors.length; i++) {
            if (i == 0) {
                //main part, final color wont get modified
                subs.push(new SubPart(inColors[0]));
            } else {
                //for subparts, color is decided in reference to the main part, so we need the delta
                const ogHSV = rgb2hsv(inColors[0][0],inColors[0][1],inColors[0][2]);
                const newHSV = rgb2hsv(inColors[i][0],inColors[i][1],inColors[i][2]);
                const colorDelta = []
                colorDelta[0] = ogHSV[0] - newHSV[0];
                colorDelta[1] = ogHSV[1] - newHSV[1];
                colorDelta[2] = ogHSV[2] - newHSV[2];
         
                //i dont know what this does but it was in the ingame code so
                if (Math.abs(colorDelta[0])>0.5) colorDelta[0] -= Math.sign(colorDelta[0]);

                //add a new sub part that will add the color diference to the main color
                subs.push(new SubPart(inColors[i], colorDelta));
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

        //color difference from the original color in hsv
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

                //add the values to make it brighter or darker
                hsv[0] = hsv[0] - colorRange[0] //ingame shader adds % 1 to this? https://pastebin.com/kXsTD1Vu
                hsv[1] = clamp((hsv[1] - colorRange[1]), 0.0, 1.0);
                hsv[2] = clamp((hsv[2] - colorRange[2]), 0.0, 1.0);

                //just in case it somehow gets out of range
                function clamp(num, min, max) {
                    return num <= min ? min : num >= max ? max : num;
                }

                //convert back to rgb
                const charRgb = hsv2rgb(hsv[0], hsv[1], [hsv[2]]);

                //we like to work with int values
                charRgb[0] = charRgb[0] * 255
                charRgb[1] = charRgb[1] * 255
                charRgb[2] = charRgb[2] * 255

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
                    //since we are not changing alpha value [i+3], 100% transparent pixels
                    //won't show any change even if we actually recolored them
                }

                //the result will be added to the main canvas
                ctx.putImageData(imgData, 0, 0);
                mainCo.drawImage(can, 0, 0);

            }
        }
    }
}


/* Color Conversions */

//this one will delete the "-" from the codes, then split each color for every 6 characters
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

    // this is the ingame code translated from https://pastebin.com/kXsTD1Vu
    // i didnt manage to get it working right for some reason

    /* r = r/255, g = g/255, b = b/255;

    let H, S, V;
 
    const M = Math.max(r, Math.max(g, b));
    const m = Math.min(r, Math.min(g, b));
 
    V = M;
 
    const C = M - m;
 
    if (C > 0)
    {
        if (M == r) H = 6 % ( (g - b) / C);
        if (M == g) H = (b - r) / C + 2.0;
        if (M == b) H = (r - g) / C + 4.0;
        H /= 6;
        S = C / V;
    }
 
    return [H, S, V]; */


    //now this actually gives us the correct values

    r = r/255, g = g/255, b = b/255;
    const max = Math.max(r, g, b), min = Math.min(r, g, b);
    let h, s, v = max;

    const d = max - min;
    s = max == 0 ? 0 : d / max;

    if (max == min) {
        h = 0; // achromatic
    } else {
        switch(max){
            case r: h = (g - b) / d + (g < b ? 6 : 0); break;
            case g: h = (b - r) / d + 2; break;
            case b: h = (r - g) / d + 4; break;
        }
        h /= 6;
    }

    return [h, s, v];
  }


function hsv2rgb(H, S, V) {

    // translated from https://pastebin.com/kXsTD1Vu

    let C = V * S;
 
    H *= 6;
    let X = C * (1 - Math.abs( H % 2 - 1 ));
    let m = V - C;
    C += m;
    X += m;
 
    if (H < 1) return [C, X, m];
    if (H < 2) return [X, C, m];
    if (H < 3) return [m, C, X];
    if (H < 4) return [m, X, C];
    if (H < 5) return [X, m, C];
    else       return [C, m, X];
}


/* Character Database */
// Each part will include arrays with the original part rgb values
// First array from each part is always the color provided by the color code
const db = {
    "chars": [
        {
            name : "Clairen",
            parts : [
                [ //body
                    [65, 54, 80], [43, 37, 51]
                ],
                [ //suit
                    [69, 69, 89], [50, 51, 62]
                ],
                [ //cloak (3rd part is just 2 tiny pixels left in the render with a slight color dif)
                    [170, 34, 74], [113, 29, 54], [169, 34, 73]
                ],
                [ //armor
                    [181, 181, 181], [125, 125, 125]
                ],
                [ //belt
                    [255, 230, 99], [220, 160, 48]
                ],
                [ //plasma 1
                    [255, 13, 106], [196, 68, 166], [255, 155, 193]
                ],
                [ //plasma 2
                    [0, 255, 247], [85, 221, 229], [60, 189, 226], [170, 255, 253], [170, 188, 211]
                ]
            ],
            placeholder : "0000-0000-0000-0000-0000-0000-0000-0000-0000-0000-0000"
        },
        {
            name : "Forsburn",
            parts : [
                [ //cloak 1 (3rd part are the tiny pixels of the belt)
                    [116, 110, 108], [76, 72, 72], [119, 108, 109]
                ],
                [ //body
                    [128, 96, 28], [170, 149, 58], [88, 55, 17]
                ],
                [ //fire 1 (2nd part, for some reason the 3 eye pixels are slighty different)
                    [255, 233, 0], [255, 228, 0]
                ],
                [ //fire 2 (2nd part same as above)
                    [255, 127, 0], [255, 124, 0]
                ],
                [ //fire 3
                    [170, 0, 0], [122, 25, 14], [83, 17, 9]
                ],
                [ //cloak 2 (does not appear in the render)
                    [36, 34, 36]
                ],
                [ //skull
                    [255, 255, 228], [193, 193, 157]
                ]
            ],
            placeholder : "0000-0000-0000-0000-0000-0000-0000-0000-0000-0000-0000"
        },
        {
            name : "Zetterburn",
            parts : [
                [ //body
                    [122, 90, 78], [84, 54, 52], [57, 37, 36]
                ],
                [ //face (1st part does not appear on the main render oh my god Dan)
                    [220, 203, 105], [193, 176, 68], [128, 96, 28], [75, 56, 16], [158, 176, 53], [91, 102, 24]
                ],
                [ //fire 1
                    [255, 233, 0]
                ],
                [ //fire 2
                    [255, 127, 0]
                ],
                [ //fire 3
                    [170, 0, 0]
                ]
            ],
            placeholder : "0000-0000-0000-0000-0000-0000-0000-0000"
        },
        {
            name : "Wrastor",
            parts : [
                [ //body
                    [168, 87, 143], [129, 60, 116], [98, 50, 93], [207, 130, 170]
                ],
                [ //hands (why isnt this called wings??)
                    [97, 68, 96], [66, 40, 70]
                ],
                [ //scarf
                    [141, 231, 255], [94, 190, 215], [94, 195, 222], [67, 154, 177]
                ],
                [ //belly
                    [246, 173, 197]
                ],
                [ //beak
                    [230, 218, 25], [179, 157, 26], [120, 105, 18]
                ]
            ],
            placeholder : "0000-0000-0000-0000-0000-0000-0000-0000"
        },
        {
            name : "Absa",
            parts : [
                [ //body (this part is all wrong but the 1st array, i have no idea whats happening here)
                    [120, 121, 161], [87, 87, 122], [60, 60, 78], [50, 51, 62], [34, 35, 42]
                ],
                [ //hair (1st part does not appear in renders Dan you're making me cry)
                    [231, 121, 185], [217, 135, 205], [164, 88, 168]
                ],
                [ //lightning
                    [130, 173, 177], [205, 247, 247]
                ],
                [ //horns
                    [187, 155, 143], [136, 104, 93]
                ],
                [ //belly
                    [214, 215, 244], [163, 164, 217]
                ]
            ],
            placeholder : "0000-0000-0000-0000-0000-0000-0000-0000"
        },
        {
            name : "Elliana",
            parts : [
                [ //mech
                    [213, 128, 87], [159, 83, 51], [113, 48, 21], [234, 198, 157]
                ],
                [ //trim
                    [150, 156, 145], [80, 87, 78], [37, 44, 29], [200, 207, 192]
                ],
                [ //body
                    [175, 145, 200], [223, 210, 243], [114, 70, 144]
                ],
                [ //propellers
                    [157, 212, 84], [133, 170, 58], [85, 112, 53]
                ],
                [ //weapons (this one does not appear in the render)
                    [137, 198, 194], [214, 235, 235], [94, 150, 152]
                ],
                [ //clothes
                    [72, 69, 60]
                ]
            ],
            placeholder : "0000-0000-0000-0000-0000-0000-0000-0000-0000-0000"
        },
        {
            name : "Sylvanos",
            parts : [
                [ //body
                    [50, 54, 40], [41, 45, 33], [32, 35, 25]
                ],
                [ //leaves
                    [126, 167, 87], [92, 132, 56], [61, 81, 42]
                ],
                [ //bark
                    [145, 86, 70], [97, 61, 48], [68, 49, 42]
                ],
                [ //petals 1
                    [196, 44, 69], [153, 29, 48], [113, 29, 54]
                ],
                [ //petals 2
                    [242, 208, 134], [224, 114, 100]
                ]
            ],
            placeholder : "0000-0000-0000-0000-0000-0000-0000-0000"
        },
        {
            name : "Maypul",
            parts : [
                [ //body (1st part is not on the render Dan why)
                    [113, 155, 111], [108, 155, 113], [73, 118, 81], [55, 90, 65]
                ],
                [ //belly
                    [228, 225, 173], [192, 183, 142], [156, 141, 110], [181, 162, 126]
                ],
                [ //leaf
                    [169, 245, 124], [89, 164, 74]
                ],
                [ //marks
                    [65, 62, 55], [46, 42, 37]
                ],
                [ //vines
                    [195, 135, 101], [145, 86, 70]
                ]
            ],
            placeholder : "0000-0000-0000-0000-0000-0000-0000-0000"
        },
        {
            name : "Kragg",
            parts : [
                [ //rock (this part is all wrong but the 1st array, i have no idea whats happening here)
                    [136, 104, 93], [187, 155, 143], [99, 70, 61], [217, 199, 193], [172, 136, 128], [133, 100, 108], [109, 77, 80]
                ],
                [ //skin
                    [121, 173, 100], [65, 129, 66], [45, 89, 46]
                ],
                [ //armor
                    [213, 216, 221], [139, 141, 167], [103, 105, 127]
                ],
                [ //shading
                    [60, 36, 36]
                ]
            ],
            placeholder : "0000-0000-0000-0000-0000-0000-0000"
        },
        {
            name : "Orcane",
            parts : [
                [ //body
                    [59, 73, 135], [44, 53, 113], [29, 33, 91]
                ],
                [ //belly
                    [205, 247, 247], [130, 173, 177], [74, 104, 116]
                ]
            ],
            placeholder : "0000-0000-0000-0000"
        },
        {
            name : "Etalus",
            parts : [
                [ //body
                    [251, 250, 252], [200, 182, 226], [129, 100, 168]
                ],
                [ //ice
                    [180, 230, 230], [130, 173, 177], [74, 104, 116]
                ],
                [ //shading
                    [67, 68, 87], [50, 51, 62]
                ]
            ],
            placeholder : "0000-0000-0000-0000-0000"
        },
        {
            name : "Ranno",
            parts : [
                [ //body light
                    [58, 210, 228], [49, 167, 181], [40, 124, 134], [203, 223, 235], [127, 160, 215]
                ],
                [ //body dark
                    [44, 53, 113], [59, 73, 135], [29, 33, 91]
                ],
                [ //pants
                    [255, 124, 0], [203, 70, 4], [149, 52, 3]
                ],
                [ //bandages
                    [193, 193, 157], [156, 141, 110], [255, 255, 228]
                ],
                [ //poison
                    [182, 244, 48], [163, 207, 43], [144, 169, 37], [255, 233, 0], [175, 189, 31], [255, 255, 97]
                ]
            ],
            placeholder : "0000-0000-0000-0000-0000-0000-0000-0000"
        },
        {
            name : "Ori and Sein",
            parts : [
                [ //body (1st part not in render yada yada)
                    [243, 235, 253], [240, 232, 250], [197, 179, 223], [127, 98, 165]
                ],
                [ //detail (same here)
                    [253, 238, 253], [250, 235, 250], [224, 181, 224], [165, 99, 165]
                ],
                [ //eyes
                    [69, 255, 64]
                ],
                [ //sein
                    [93, 203, 241], [160, 255, 255], [70, 153, 181], [47, 102, 121]
                ],
                [ //energy (not shown on render)
                    [255, 200, 33], [229, 134, 25]
                ]
            ],
            placeholder : "0000-0000-0000-0000-0000-0000-0000-0000"
        },
        {
            name : "Shovel Knight",
            parts : [
                [ //armor light, 
                    [58, 210, 228], [49, 167, 181], [40, 124, 134]
                ],
                [ //armor dark
                    [59, 73, 135], [44, 53, 113]
                ],
                [ //trim
                    [255, 255, 0], [255, 160, 0]
                ],
                [ //horns
                    [220, 203, 105], [200, 126, 30]
                ]
            ],
            placeholder : "0000-0000-0000-0000-0000-0000-0000"
        }
    ]
}



/* Actual webpage code */

let currentChar; // this will hold the values from the db just above
let charCanvas; // this will be used for the canvases
let maxLength; // limits how many characters there should be in the code input
let playingAnim = false; // to not allow playing an animation until its finished

const charIcon = document.getElementById("selectedIcon");
const codeInput = document.getElementById("codeInput");
const copyToClip = document.getElementById("copyToClip");
const copiedImg = document.getElementById("copied");
const codeWarning = document.getElementById("row2");
const downLink = document.getElementById("downImg");
const downImgButton = document.getElementById("downImg");


//when the page loads, change to a random character
changeChar(genRnd(0, db.chars.length - 1));

//this will fire everytime we type in the color code input
codeInput.addEventListener("input", codeControl); 
function codeControl() {

    //look if the code length is correct or if its above or below the limit
    if (codeInput.value.length == currentChar.placeholder.length) {

        //if correct, set everything to normal
        codeWarning.innerHTML = "";
        codeWarning.style.height = "0px";
        copyToClip.style.filter = "brightness(1)";
        copyToClip.style.pointerEvents = "auto";

        //automatically execute recolor for some QoL
        mainRecolor();

    } else if (!codeInput.value) {

        //if no code, just disable the copy button
        codeWarning.innerHTML = "";
        codeWarning.style.height = "0px";
        copyToClip.style.filter = "brightness(.8)";
        copyToClip.style.pointerEvents = "none";

    } else if (codeInput.value.length < currentChar.placeholder.length) {

        //if its below the limit, warn the user
        const dif = currentChar.placeholder.length - codeInput.value.length;
        codeWarning.innerHTML = "This color code has "+dif+" less characters than it should.";
        codeWarning.style.color = "orange";
        codeWarning.style.height = "18px";

        //prevent the user from interacting with the copy button
        copyToClip.style.filter = "brightness(.8)";
        copyToClip.style.pointerEvents = "none";

    } else if (codeInput.value.length > currentChar.placeholder.length) {

        //if its above the limit, well thats a big no no
        codeWarning.innerHTML = "This color code has too many characters.";
        codeWarning.style.color = "red";
        codeWarning.style.height = "18px";

        copyToClip.style.filter = "brightness(.8)";
        copyToClip.style.pointerEvents = "none";

    }

}


//copy to clipboard button, playing an animation to show feedback
copyToClip.addEventListener("click", () => {
    if (!playingAnim) {
        playingAnim = true;
        navigator.clipboard.writeText(codeInput.value);
        copiedImg.classList.add("copiedAnim");
    }
});
copiedImg.addEventListener('animationend', () => {
    copiedImg.classList.remove("copiedAnim");
    playingAnim = false;
});



//the recolor function!
function mainRecolor() {
    const hex = codeInput.value; //grab the color code
    const rgb = hexDecode(hex); //make some sense out of it
    charCanvas.recolor(rgb); //recolor the image!
    mainImg.src = mainCa.toDataURL(); //update the image!
}


//whenever the character changes
function changeChar(charNum) {

    //look at the database to see whats up
    currentChar = db.chars[charNum];
    //create a new character with this info
    charCanvas = new Character(currentChar.name, currentChar.parts);

    //set a new placeholder text and a new limit
    codeInput.placeholder = currentChar.placeholder;
    maxLength = currentChar.placeholder.length;
    //then clear the current color code
    codeInput.value = "";
    codeControl(); //to reset the warning message if any

    //change the character icon
    charIcon.setAttribute("src", "Characters/"+currentChar.name+"/1.png");

    //adjust the code input width
    resizeInput();

    //make the recolor button unclickable and show some feedback
    copyToClip.style.filter = "brightness(.8)";
    copyToClip.style.pointerEvents = "none";

    //update the dowloaded image name
    downLink.setAttribute("download", currentChar.name + " Recolor.png");

}

//create the character dropdown menu
charSwitcher();
function charSwitcher() {
    const drop = document.getElementById("charDropdown");
    const row1 = document.getElementById("charRow1");
    const row2 = document.getElementById("charRow2");
    const row3 = document.getElementById("charRow3");

    for (let i = 0; i < db.chars.length; i++) {
        
        //create a new div that will have the char info
        const newDiv = document.createElement('div');
        newDiv.className = "charEntry";
        newDiv.setAttribute("data-tooltip", db.chars[i].name);
        newDiv.setAttribute("data-tooltip-delay", "none");

        //if the div gets clicked, update the character to be recolored
        newDiv.addEventListener("click", () => {
            changeChar(i);
            drop.parentElement.blur();
        });

        //create the character image, randomized icon just because we can
        const newImg = document.createElement('img');
        newImg.setAttribute("src",
            "Characters/"+db.chars[i].name+"/"+genRnd(2, 3)+".png"
        );
        newImg.className = "iconImage";

        //add it to the div we created before
        newDiv.appendChild(newImg);

        //now add it to the actual interface
        if (i <= 5) {
            row1.appendChild(newDiv);
        } else if (i <= 11) {
            row2.appendChild(newDiv);
        } else {
            row3.appendChild(newDiv);
        }

    }
}


//adjust the input width depending on code length
function resizeInput() {
    if (maxLength == 19) {
        codeInput.style.width = "170px";
    } else if (maxLength == 24) {
        codeInput.style.width = "215px";
    } else if (maxLength == 34) {
        codeInput.style.width = "300px";
    } else if (maxLength == 39) {
        codeInput.style.width = "345px";
    } else if (maxLength == 49) {
        codeInput.style.width = "430px";
    } else {
        codeInput.style.width = "475px";
    }
}


//just a simple random function
function genRnd(min, max) {
    return Math.floor(Math.random() * (max - min + 1) ) + min;
}


//download image button, adds the canvas to the download
downImgButton.addEventListener('click', () =>
    downImgButton.href = mainCa.toDataURL()
);


//randomize button, generates a random valid code based on character parts count
document.getElementById("randomize").addEventListener("click", () => {
    randomize(currentChar.parts.length)
});
function randomize(colorNum) {

    //code from https://github.com/ErrorThreeOThree/ROAColorCodeBot

    //randomize the rgb values
	const r = [...Array(colorNum)].map(() => Math.floor(Math.random() * 256));
	const g = [...Array(colorNum)].map(() => Math.floor(Math.random() * 256));
    const b = [...Array(colorNum)].map(() => Math.floor(Math.random() * 256));
    
    //generate a valid checksum (this is only for the game, the webpage doesn't need this)
	let checksum = 0;
	for (let i = 0; i < colorNum; i++)
	{
		checksum += (i + 101) * r[i];
		checksum += (i + 102) * g[i];
		checksum += (i + 103) * b[i];
	}
    checksum = checksum % 256;
    
    //convert the rgb values to hex, add those and the checksum to a single string
    let code = "";
    let i = 0;
	for (i; i < colorNum; i++)
	{
		code += r[i].toString(16).toUpperCase().padStart(2, '0');
		code += g[i].toString(16).toUpperCase().padStart(2, '0');
		code += b[i].toString(16).toUpperCase().padStart(2, '0');
	}
	code += checksum.toString(16).toUpperCase().padStart(2, '0');
	if (i % 2 == 0)
	{
		code += "00";
    }
    
    //put the code in the code input, separating the full color code with "-" every 4 characters    
    codeInput.value = code.match(/.{1,4}/g).join("-");

    //check the code, this is just to allow the recolor button to be clicked
    codeControl();

    //automatically click the recolor button to show the results
    mainRecolor();

}


//file upload button
const defaultFile = document.getElementById("fileupload");
//when clicking on the fake upload image button, click on the hidden upload file button
document.getElementById("uplImg").addEventListener("click", () => {
    defaultFile.click();
});
//if we got a file
defaultFile.addEventListener("change", () => {
    const newImg = defaultFile.files[0]; //store the selected file

    //read file with some magic i dont really understand
    const fileReader = new FileReader();
    fileReader.addEventListener("load", function () {
        //create a new character using the current values, but adding a new image as 'result'
        charCanvas = new Character(currentChar.name, currentChar.parts, this.result);
    });
    fileReader.readAsDataURL(newImg); //imma be honest idk what this is but it doesnt work without it
});