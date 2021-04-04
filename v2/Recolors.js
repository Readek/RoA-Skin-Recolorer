"use strict";
const fullCanvas = document.getElementById("fullCanvas");
const animCanvas = document.getElementById("animCanvas");
const animDiv = document.getElementById("animDiv");
const sprLCanvas = document.getElementById("spriteL");
const sprRCanvas = document.getElementById("spriteR");

let char; // this will hold the values from the character database
let characterImgs;
let maxLength; // limits how many characters there should be in the code input
let playingAnim = false; // to not allow playing an animation until its finished

const spritesDiv = document.getElementById("sContainer");
const charIcon = document.getElementById("selectedIcon");
const codeInput = document.getElementById("codeInput");
const copyToClip = document.getElementById("copyToClip");
const copiedImg = document.getElementById("copied");
const codeWarning = document.getElementById("row2");
const downLink = document.getElementById("downImg");
const downImgButton = document.getElementById("downImg");
const eaCheck = document.getElementById("EAcheck");
const colorEditor = document.getElementById("colorEditor");
const partList = document.getElementById("partList");


//when the page loads, change to a random character
changeChar(genRnd(0, db.chars.length - 1));

//this will fire everytime we type in the color code input
codeInput.addEventListener("input", codeControl); 
function codeControl() {

    //look if the code length is correct or if its above or below the limit
    if (codeInput.value.length == char.placeholder.length) {
 
        //if correct, set everything to normal
        codeWarning.innerHTML = "";
        codeWarning.style.height = "0px";
        copyToClip.style.filter = "brightness(1)";
        copyToClip.style.pointerEvents = "auto";

        //allow download of the image
        downImgButton.style.pointerEvents = "auto";
        downImgButton.style.filter = "grayscale(0)";

        //automatically execute recolor for some QoL
        mainRecolor();
        createEditor();

    } else if (!codeInput.value) {

        //if no code, just disable the copy button
        codeWarning.innerHTML = "";
        codeWarning.style.height = "0px";
        copyToClip.style.filter = "brightness(.8)";
        copyToClip.style.pointerEvents = "none";

        //allow download of the image
        downImgButton.style.pointerEvents = "auto";
        downImgButton.style.filter = "grayscale(0)";

    } else if (codeInput.value.length < char.placeholder.length) {

        //if its below the limit, warn the user
        const dif = char.placeholder.length - codeInput.value.length;
        codeWarning.innerHTML = "This color code has "+dif+" less characters than it should.";
        codeWarning.style.color = "orange";
        codeWarning.style.height = "18px";

        //prevent the user from interacting with the copy button
        copyToClip.style.filter = "brightness(.8)";
        copyToClip.style.pointerEvents = "none";

        //no downloads allowed without a proper code
        downImgButton.style.pointerEvents = "none";
        downImgButton.style.filter = "grayscale(1)";

    } else if (codeInput.value.length > char.placeholder.length) {

        //if its above the limit, well thats a big no no
        const dif = codeInput.value.length - char.placeholder.length;
        codeWarning.innerHTML = "This color code has too many characters ("+dif+").";
        codeWarning.style.color = "red";
        codeWarning.style.height = "18px";

        copyToClip.style.filter = "brightness(.8)";
        copyToClip.style.pointerEvents = "none";

        downImgButton.style.pointerEvents = "none";
        downImgButton.style.filter = "grayscale(1)";

    }

}


//copy to clipboard button, playing an animation to show feedback
copyToClip.addEventListener("click", () => {

    navigator.clipboard.writeText(codeInput.value);

    if (!playingAnim) { //wait for the animation to finish if any
        playingAnim = true;
        copiedImg.classList.add("copiedAnim");
    }
});
//automatically enable copy animation once current one finishes
copiedImg.addEventListener('animationend', () => {
    copiedImg.classList.remove("copiedAnim");
    playingAnim = false;
});



//the recolor function!
function mainRecolor() {
    const hex = codeInput.value; //grab the color code
    let rgb;
    try {
        rgb = hexDecode(hex); //make some sense out of it
        rgb.splice(rgb.length - 4); //remove the checksum at the end of the code
    } catch (e) {
        rgb = char.ogColor; // if the code is not valid, use the default colors
    }
    // Olympia needs some special treatment since the pants colors affect all whites
    if (char.name == "Olympia") {
        rgb.push(char.ogColor[20], char.ogColor[21], char.ogColor[22], char.ogColor[23])
    }
    // now recolor the images
    recolor(rgb);
}

//whenever the character changes
function changeChar(charNum) {

    // clear that custom img and restore the sprites in case we changed it earlier
    spritesDiv.style.display = "flex";

    //look at the database to see whats up
    char = db.chars[charNum];
    //create new character images with this info
    characterImgs = new RoaRecolor(char.ogColor, char.colorRange, eaCheck.checked);
    // save all the new images as promises so we know when they are fully loaded
    const imgPromises = [
        characterImgs.addImage(fullCanvas, "Characters/"+char.name+"/Full.png", "Full"),
        characterImgs.addImage(animCanvas, "Characters/"+char.name+"/Idle.png", "Idle"),
        characterImgs.addImage(sprLCanvas, "Characters/"+char.name+"/SpriteL.png", "SpriteL"),
        characterImgs.addImage(sprRCanvas, "Characters/"+char.name+"/SpriteR.png", "SpriteR")
    ]
    // when the images finish loading, then recolor them with the og colors to do a first paint
    Promise.all(imgPromises).then( () => {
        // ori is the only character that needs an actual recolor
        if (char.name == "Ori and Sein") {
            recolor(hexDecode("F5F2-F9F5-F2F9-0000-005D-CBF1-FFC7-2038"));
        } else {
            recolor(char.ogColor);
        }
    })

    //change the width of the sprite animation, depending on the character
    const sprite = new Image();
    sprite.src = "Characters/"+char.name+"/Idle.png";
    sprite.decode().then( () => { // when the image finishes loading
        animDiv.style.width = (sprite.width / char.idleFC) + "px"; //gets the w of 1 frame
        animDiv.style.height = sprite.height + "px"; //all frames have the same h
        //now change the values for the sprite animation
        const r = document.querySelector(':root');
        r.style.setProperty("--spriteMove", -sprite.width + "px"); //end position of the animation
        r.style.setProperty("--spriteCount", char.idleFC);
        // formula for this one is: 1000 is a second, then divided by 60 gets us an
        // in-game frame, then we multiply by 7 because thats the average frame
        // wait between sprite changes, and then we multiply by the character frame
        // count to know how long the animation is going to take, finally, we divide
        // by 1000 to get the value in seconds for the css variable
        r.style.setProperty("--spriteTime", 1000/60*7*char.idleFC/1000 + "s");
    })


    //set a new placeholder text and a new limit
    codeInput.placeholder = char.placeholder;
    maxLength = char.placeholder.length;
    //then clear the current color code
    codeInput.value = "";
    codeControl(); //to reset the warning message if any

    //change the character icon
    charIcon.setAttribute("src", "Characters/"+char.name+"/1.png");

    //adjust the code input width
    resizeInput();

    //make the copy button unclickable and show some feedback
    copyToClip.style.filter = "brightness(.8)";
    copyToClip.style.pointerEvents = "none";

    //update the dowloaded image name
    downLink.setAttribute("download", char.name + " Recolor.png");

    // update the color editor
    createEditor();

}

// create the color editor, called whenever we switch character
function createEditor() {

    //clear the part list
    partList.innerHTML = null;

    let count = 0; // this is just for the part name

    let rgb;
    try {
        rgb = hexDecode(codeInput.value); // get the rgb values of the current code
    } catch (e) {
        rgb = char.ogColor; // if the code is not valid, use the default colors
    }

    // check if the current character has hidden parts
    const theLength = char.actualParts ? char.actualParts * 4 : char.ogColor.length;

    // now for each (editable) part:
    for (let i = 0; i < theLength; i += 4) {
        
        // this is where everything will be stored
        const part = document.createElement("div");
        part.className = "part";

        // get the part name and colorize its background
        const partName = document.createElement("div");
        partName.innerHTML = char.partNames[count];
        partName.classList.add("partName");
        partName.style.backgroundColor = "rgb(" + rgb[i] + ", " + rgb[i+1] + ", " + rgb[i+2] + ")";

        // lets also add the hex code for each part
        const hexDiv = document.createElement("div");
        hexDiv.classList.add("hexDiv");
        hexDiv.innerHTML = "#" + rgbToHex(rgb[i], rgb[i+1], rgb[i+2]);

        // add the rgb values with a cool colored icon next to them
        const red = genColorDiv(rgb[i], "rgb(" + rgb[i] + ", 0, 0)");
        const green = genColorDiv(rgb[i+1], "rgb(0," + rgb[i+1] + ", 0)");
        const blue = genColorDiv(rgb[i+2], "rgb(0, 0," + rgb[i+2] + ")");

        // now add everything we just created to the part div and then to the actual html
        part.appendChild(partName);
        part.appendChild(hexDiv);
        part.appendChild(red);
        part.appendChild(green);
        part.appendChild(blue);

        partList.appendChild(part);

        count++;
         
    }
}
function genColorDiv(text, bgCol) {
    const colorDiv = document.createElement("div");
    colorDiv.classList.add("colorDiv");

    const rgbColor = document.createElement("div");
    rgbColor.classList.add("rgbColor");
    rgbColor.style.backgroundColor = bgCol;
    colorDiv.appendChild(rgbColor);

    const colorText = document.createElement("div");
    colorText.innerHTML = text;
    colorDiv.appendChild(colorText);

    return colorDiv;
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

        //depending on the char num, set elemental background
        if (i < 3) { //fire
            newDiv.style.backgroundColor = "#ba6464"
        } else if (i < 6) { //air
            newDiv.style.backgroundColor = "#bd8ac1"
        } else if (i < 9) { //earth
            newDiv.style.backgroundColor = "#6ca577"
        } else if (i < 12) { //water
            newDiv.style.backgroundColor = "#6673ad"
        } else if (i < 14) { //but everything changed when the indie characters attacked
            newDiv.style.backgroundColor = "#c9b4d3"
        } else { // but nobody expected the workshop inquisition
            newDiv.style.backgroundColor = "#a1a1a1"
        }

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
    } else if (maxLength == 54) {
        codeInput.style.width = "475px";
    } else {
        codeInput.style.width = "555px";
    }
}


//just a simple random function
function genRnd(min, max) {
    return Math.floor(Math.random() * (max - min + 1) ) + min;
}


//download image button
downImgButton.addEventListener('click', () => {
    if (codeInput.value) { //if theres a code
        // image has to be repainted to be dowloaded
        const hex = codeInput.value;
        const rgb = hexDecode(hex);
        characterImgs.download(rgb, "Full");
    } else { //if there's no code, just download it as if it had the default colors
        characterImgs.download(characterImgs.colorIn, "Full");
    }
});


//randomize button, generates a random valid code based on character parts count
document.getElementById("randomize").addEventListener("click", () => {
    if (char.actualParts) { // for orcane & olympia
        randomize(char.actualParts)
    } else {
        randomize(char.ogColor.length / 4)
    }
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

    //check the code, this is just to force recoloring the image
    codeControl();

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
        //add the custom image to the "full render" canvas
        characterImgs.addCustom(this.result, "Full").then( () => { // wait for the img to load
            recolor(char.ogColor); // then show it
            spritesDiv.style.display = "none"; // hide the sprites
        })
    });
    fileReader.readAsDataURL(newImg); //imma be honest idk what this is but it doesnt work without it

    //clear the input code
    codeInput.value = "";
});

eaCheck.addEventListener("click", (e) => {
    if (!eaCheck.checked) {
        characterImgs.blend = blend1;
        mainRecolor();
    } else {
        characterImgs.blend = blend0;
        mainRecolor();
    }
})


// yes this is a separate function just for orcane's sprite greenness
function recolor(rgb) {
    if (char.name == "Orcane") {
        for (let i = 0; i < 4; i++) {
            const newRgb = [];
            for (let i = 0; i < rgb.length; i++) {
                newRgb.push(rgb[i]);               
            }
            for (let i = 0; i < 4; i++) {
                newRgb[i+8] = rgb[i];
            }
            characterImgs.recolor(newRgb);
        }
    } else {
        characterImgs.recolor(rgb);
    }
}

function hexDecode(hex) {

    // delete those "-" from the code
    let newHex = "";
    for (let i = 0; i < hex.length; i++) {
        if (hex.charAt(i) != "-") {
            newHex += hex.charAt(i);
        }
    }

    // split each color for every 6 characters
    const charHex = newHex.match(/.{1,6}/g);

    // create an array for the shader with rgba values
    const charRGB = [];    
    for (let i = 0; i < charHex.length; i++) {
        const newArr = hex2rgb(charHex[i]);
        charRGB.push(newArr[0], newArr[1], newArr[2], 1); //r, g, b, a
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

var slider0 = document.getElementById("slider0");
var slider1 = document.getElementById("slider1");
var slider2 = document.getElementById("slider2");

slider0.oninput = sliderMoved;
slider1.oninput = sliderMoved;
slider2.oninput = sliderMoved;

function sliderMoved() {
    const hex = codeInput.value; //grab the color code
    const rgb = hexDecode(hex);
    const newRgb = [];
    for (let i = 0; i < rgb.length; i++) {
        if (i == this.id.substring(6)) {
            newRgb[i] = this.value;
        } else {
            newRgb.push(rgb[i]);
        }
    }
    recolor(newRgb);
}

function componentToHex(c) {
    const hex = c.toString(16);
    return hex.length == 1 ? "0" + hex : hex;
}
function rgbToHex(r, g, b) {
    return componentToHex(r) + componentToHex(g) + componentToHex(b);
}