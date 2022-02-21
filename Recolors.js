"use strict";

let char; // this will hold the values from the character database
let characterImgs; // this will hold a class from "RoA WebGL Shader.js"
let rgbSliders; // if active, the page will use rgb sliders instead of hsv ones
let customPortrait, customSprite; // will hold user uploaded images
const alphas = [100, 100, 100, 100, 100, 100, 100, 100, 100];
const codeReg = "^([A-Fa-f0-9]+\-)+([A-Fa-f0-9])+$";
const ograReg = "^([A-Fa-f0-9]{6}\-)+([A-Fa-f0-9]){6}$";

const fullCanvas = document.getElementById("fullCanvas");
const animCanvas = document.getElementById("animCanvas");
const sprLCanvas = document.getElementById("spriteL");
const sprRCanvas = document.getElementById("spriteR");
const animDiv = document.getElementById("animDiv");
const spritesDiv = document.getElementById("sContainer");
const charIcon = document.getElementById("selectedIcon");
const codeInput = document.getElementById("codeInput");
const copyToClip = document.getElementById("copyToClip");
const copiedImg = document.getElementById("copyOutImg");
const codeWarning = document.getElementById("row2");
const downImgButton = document.getElementById("downImgButton");
const downMenu = document.getElementById("downMenu");
const defaultFile = document.getElementById("fileupload");
const colorEditor = document.getElementById("colorEditor");
const partList = document.getElementById("partList");
const ogColorList = document.getElementById("ogColorList");
const colorRangeList = document.getElementById("colorRangeList");
const ogButton = document.getElementById("ogButton");
const raButton = document.getElementById("raButton");
const ogInput = document.getElementById("ogInput");
const raInput = document.getElementById("raInput");
const copyOg = document.getElementById("copyOgImg");
const copyRa = document.getElementById("copyRaImg");
const hsvButton = document.getElementById("hsvClick");
const rgbButton = document.getElementById("rgbClick");
const sliderHue = document.getElementById("sliderHue");
const sliderSat = document.getElementById("sliderSat");
const sliderVal = document.getElementById("sliderVal");
const sliderR = document.getElementById("sliderR");
const sliderG = document.getElementById("sliderG");
const sliderB = document.getElementById("sliderB");
const sliderA = document.getElementById("sliderA");
const nowEditingText = document.getElementById("nowEditing");
const editingHex = document.getElementById("editingHex");
const topButtons = document.getElementById("row3");
const loadingDiv = document.getElementById("loadingDiv");
const eaCheck = document.getElementById("EAcheck");
const alphaCheck = document.getElementById("alphaCheck");
const noZoom = document.getElementById("zoomCheck");
const noPixels = document.getElementById("noPixels")
const darkCheck = document.getElementById("darkTheme");


//when the page loads, change to a random character
changeChar(genRnd(0, db.chars.length - 1));

//this will fire everytime we type in the color code input
codeInput.addEventListener("input", codeControl); 
function codeControl() {

    //look if the code length is correct
    if (codeInput.value.length == char.placeholder.length &&
         codeInput.value.match(codeReg)) {
 
        //if correct, set everything to normal
        codeWarning.innerHTML = "";
        codeWarning.style.height = "0px";

        // allow download of the image and enable copy button
        downImgButton.disabled = false;
        copyToClip.disabled = false;

        //automatically execute recolor for some QoL
        mainRecolor();
        createEditor();

    } else {

        //prevent the user from interacting with the copy button
        copyToClip.disabled = true;

        if (!codeInput.value) { // if theres no code

            // just remove the warning text
            codeWarning.innerHTML = "";
            codeWarning.style.height = "0px";
    
            // download button will just download base image
            downImgButton.disabled = false;
    
        } else { // check if its above or below the limit
            if (codeInput.value.length < char.placeholder.length) {
    
                //if its below the limit, warn the user
                const dif = char.placeholder.length - codeInput.value.length;
                codeWarning.innerHTML = "This color code has "+dif+" less characters than it should.";
                codeWarning.style.color = "orange";
        
            } else if (codeInput.value.length > char.placeholder.length) {
        
                //if its above the limit, well thats a big no no
                const dif = codeInput.value.length - char.placeholder.length;
                codeWarning.innerHTML = "This color code has too many characters ("+dif+").";
                codeWarning.style.color = "red";
        
            } else {

                // if the regex failed
                codeWarning.innerHTML = "Invalid code.";
                codeWarning.style.color = "red";
                
            }

            //no downloads allowed without a proper code
            downImgButton.disabled = true;

            // set height to the warning div so it animates
            codeWarning.style.height = "18px";
    
        }

    } 

}


//copy to clipboard button, playing an animation to show feedback
copyToClip.addEventListener("click", () => {
    navigator.clipboard.writeText(codeInput.value);
    // wait for the animation to finish if any
    if (!copiedImg.classList.contains("copiedAnim")) {
        copiedImg.classList.add("copiedAnim");
    }
});
//automatically enable copy animation once current one finishes
copiedImg.addEventListener('animationend', () => {
    copiedImg.classList.remove("copiedAnim");
});
// do the same for the other copy buttons
document.getElementById("copyOg").addEventListener("click", () => {
    navigator.clipboard.writeText(ogButton.innerText);
    if (!copyOg.classList.contains("copiedAnim")) {
        copyOg.classList.add("copiedAnim");
    }
});
copyOg.addEventListener('animationend', () => {
    copyOg.classList.remove("copiedAnim");
});
document.getElementById("copyRa").addEventListener("click", () => {
    navigator.clipboard.writeText(raButton.innerText);
    if (!copyRa.classList.contains("copiedAnim")) {
        copyRa.classList.add("copiedAnim");
    }
});
copyRa.addEventListener('animationend', () => {
    copyRa.classList.remove("copiedAnim");
});


//the recolor function!
function mainRecolor(dl) {

    let rgb = hexDecode(codeInput.value); // translate the color code
    if (rgb != characterImgs.colorIn) { // if the code is not the default one
        rgb.splice(rgb.length - 4); //remove the checksum at the end of the code
    } else { // if default code, we'll modify it later
        rgb = null;
    }

    if (char.name == "Orcane") { // orcane has green and yellow hidden parts
        // copy either given array or og colors
        rgb = rgb ? [...rgb] : [...char.ogColor];
        for (let i = 0; i < 8; i++) {
            // add the 1st colors as the 3rd colors, 2nd to 4th
            rgb[i+8] = rgb[i];
        }
    }

    if (!rgb) {
        rgb = characterImgs.colorIn;
    }

    // add in custom transparency in case the user modified it
    for (let i = 0; i < rgb.length; i++) {
        if ((i+1)%4 == 0) {
            rgb[i] = alphas[((i+1) / 4) - 1] / 100;
        }        
    }

    if (dl) { // if we want to download the image
        characterImgs.download(rgb, dl);
    } else {
        characterImgs.recolor(rgb); // now recolor the images
    }
}
// for when we dont use the color code input
function manualRecolor(rgb) {
    characterImgs.recolor(rgb); // if rgb is empty, will use og colors
}

//whenever the character changes
function changeChar(charNum) {

    // calculate the height of the divs so we dont get jumps when switching to the loading div
    loadingDiv.style.height = (fullCanvas.clientHeight + spritesDiv.clientHeight) + 7 + "px";
    // hide the character images, show the loading div
    loadingDiv.style.display = "flex";
    fullCanvas.style.display = "none";
    spritesDiv.style.display = "none";

    // reset the alphas in case they were modified
    for (let i = 0; i < alphas.length; i++) {
        alphas[i] = 100;
    }

    //look at the database to see whats up
    char = db.chars[charNum];
    //create new character images with this info
    characterImgs = new RoaRecolor(char.ogColor, char.colorRange, eaCheck.checked);
    // save all the new images as promises so we know when they are fully loaded
    const imgPromises = [
        characterImgs.addImage(fullCanvas, "Characters/"+char.name+"/Full.png", "Portrait"),
        characterImgs.addImage(animCanvas, "Characters/"+char.name+"/Idle.png", "Idle Spritesheet"),
        characterImgs.addImage(sprLCanvas, "Characters/"+char.name+"/SpriteL.png", "Sprite Left"),
        characterImgs.addImage(sprRCanvas, "Characters/"+char.name+"/SpriteR.png", "Sprite Right")
    ]
    // when the images finish loading
    Promise.all(imgPromises).then( () => {

        //set a new placeholder text
        codeInput.placeholder = char.placeholder;
        //then clear the current color code
        codeInput.value = null;
        codeControl(); //to reset the warning message if any

        //change the character icon
        charIcon.setAttribute("src", "Characters/"+char.name+"/1.png");

        // do a first paint (ori is the only character that needs an actual recolor)
        if (char.name == "Ori and Sein") {
            manualRecolor(hexDecode("F8F5-FCF8-F5FC-0000-005D-CBF1-FFC8-21A4"));
        } else if (char.name == "Olympia") {
            manualRecolor(hexDecode("EC8D-CAEC-8DCA-B880-53E4-8574-F7F3-F9FF-F9F9-367B-8D4A"));
        } else {
            mainRecolor();
        }

        //adjust the code input width
        resizeInput();

        // create a new color editor
        createEditor();

        // hide the color sliders, show top buttons
        colorEditor.style.display = "none";
        topButtons.style.display = "flex";

        // hide the loading div, show the characters
        loadingDiv.style.display = "none";
        fullCanvas.style.display = "inherit";
        spritesDiv.style.display = "inherit";

        // to remove later
        if (charNum == 16) {
            codeWarning.style.height = "16px";
            codeWarning.innerHTML = "Pomme has missing Hair/Music colors, though color code is correct. Will get fixed soon™"
        }

    })

    // all of this is for the animated idle sprite
    const sprite = new Image();
    sprite.src = "Characters/"+char.name+"/Idle.png";
    sprite.decode().then( () => { // when the image finishes loading

        //change the width of the sprite animation, depending on the character
        animDiv.style.width = (sprite.width / char.idleFC) + "px"; //gets the w of 1 frame
        animDiv.style.height = sprite.height + "px"; // div will have slightly wrong height otherwise
        //now change the variables for the sprite animation
        const r = document.querySelector(':root');
        r.style.setProperty("--spriteMove", -sprite.width + "px"); //end position of the animation
        r.style.setProperty("--spriteCount", char.idleFC); // frame count
        // formula for this one is: 1000 is a second, then divided by 60 gets us an
        // in-game frame, then we multiply by 7 because thats the average frame
        // wait between sprite changes, and then we multiply by the character frame
        // count to know how long the animation is going to take, finally, we divide
        // by 1000 to get the value in seconds for the css variable
        r.style.setProperty("--spriteTime", 1000/60*7*char.idleFC/1000 + "s");

    })    

}

// create the color editor, called whenever we switch character
function createEditor() {

    //clear the part list
    partList.innerHTML = null;

    let count = 0; // keep track of how many parts we have created
    const aCheck = alphaCheck.checked; // so its shorter

    const rgb = hexDecode(codeInput.value); // get the rgb values of the current code

    // check if the current character has hidden parts
    const theLength = char.actualParts ? char.actualParts * 4 : characterImgs.colorIn.length;

    // now for each (editable) part:
    for (let i = 0; i < theLength; i += 4) {
        
        // this is where everything will be stored
        const part = document.createElement("button");
        part.className = "part";
        part.setAttribute("pNum", count); // just a way to know what we will click
        part.addEventListener("click", showSliders);

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
        const red = genColorDiv(rgb[i], rgb[i] + ", 0, 0");
        const green = genColorDiv(rgb[i+1], "0," + rgb[i+1] + ", 0");
        const blue = genColorDiv(rgb[i+2], "0, 0," + rgb[i+2]);

        // add the alpha value
        const alpha = document.createElement("div");
        alpha.classList.add("alphaText");
        alpha.innerHTML = alphas[count] + "%";

        // now add everything we just created to the part div and then to the actual html
        part.appendChild(partName);
        if (!aCheck) part.appendChild(hexDiv);
        part.appendChild(red);
        part.appendChild(green);
        part.appendChild(blue);
        if (aCheck) part.appendChild(alpha);

        partList.appendChild(part);

        count++;
         
    }
}
function genColorDiv(text, bgCol) {
    const colorDiv = document.createElement("div");
    colorDiv.classList.add("colorDiv");

    const rgbColor = document.createElement("div");
    rgbColor.classList.add("rgbColor");
    rgbColor.style.backgroundColor = "rgb(" + bgCol + ")";
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
    switch (char.placeholder.length) {
        case 19: codeInput.style.width = "170px"; break;
        case 24: codeInput.style.width = "215px"; break;
        case 34: codeInput.style.width = "300px"; break;
        case 39: codeInput.style.width = "345px"; break;
        case 49: codeInput.style.width = "430px"; break;
        case 54: codeInput.style.width = "475px"; break;
        default: codeInput.style.width = "555px"; break;    
    }
}


//download image button
downImgButton.addEventListener('click', () => {

    // show the download popout
    showInfo("downInfo");
    
    // clear the download menu
    downMenu.innerHTML = null;

    // for each loaded image
    for (const key in characterImgs.charImgs) {
        
        // create a link (necessary to trigger download)
        const newA = document.createElement("a");
        newA.id = key;
        newA.setAttribute("download", char.name + " " + key + " Recolor"); // downloaded filename

        // create a button
        const newBut = document.createElement("button");
        newBut.classList.add("buttons", "downButt");
        newBut.innerHTML = key; // set its name

        newBut.addEventListener("click", () => {
            mainRecolor(key); // we need to repaint the image to be able to download it
        })

        // add it to the menu
        newA.append(newBut);
        downMenu.appendChild(newA);

    }

});


//randomize button, generates a random valid code based on character parts count
document.getElementById("randomize").addEventListener("click", () => {
    if (char.actualParts) { // for orcane
        randomize(char.actualParts)
    } else {
        randomize(characterImgs.colorIn.length / 4)
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
        // save the image in case we need it
        customPortrait = this.result;
        //add the custom image to the portrait canvas
        characterImgs.addCustom(customPortrait, "Portrait").then( () => { // wait for the img to load

            mainRecolor(); // then show it

            // hide the sprites, then stop recoloring them
            spritesDiv.style.display = "none";
            characterImgs.delete("Idle Spritesheet");
            characterImgs.delete("Sprite Left");
            characterImgs.delete("Sprite Right");

        })
    });
    fileReader.readAsDataURL(newImg); //imma be honest idk what this is but it doesnt work without it

});


// Early Access check
eaCheck.addEventListener("click", () => {
    characterImgs.changeBlend(!eaCheck.checked);
    mainRecolor();
})
// Alpha editing
alphaCheck.addEventListener("click", alphaEdit);
function alphaEdit() {
    if (alphaCheck.checked) {
        sliderA.style.display = "inherit";
    } else {
        sliderA.style.display = "none";
        for (let i = 0; i < alphas.length; i++) {
            alphas[i] = 100;
        }
    }
    createEditor();
}
alphaEdit();
// No point scaling
noPixels.addEventListener("click", noPixelsCheck)
function noPixelsCheck() {
    if (noPixels.checked) {
        fullCanvas.style.imageRendering = "auto";
        document.getElementById("sContainer").style.imageRendering = "auto";
    } else {
        fullCanvas.style.imageRendering = "pixelated";
        fullCanvas.style.imageRendering = "crisp-edges";
        document.getElementById("sContainer").style.imageRendering = "pixelated";
        document.getElementById("sContainer").style.imageRendering = "crisp-edges";
    }
}
noPixelsCheck();
// No scale down
noZoom.addEventListener("click", noZoomCheck);
function noZoomCheck() {
    if (noZoom.checked) {
        fullCanvas.style.maxWidth = "none";
        fullCanvas.style.maxHeight = "none";
    } else {
        fullCanvas.style.maxWidth = "100%";
        fullCanvas.style.maxHeight = "600px";
    }
}
noZoomCheck();
// Dark Theme
darkCheck.addEventListener("click", darkMode);
function darkMode() {
    const r = document.querySelector(':root');
    if (darkCheck.checked) {
        r.style.setProperty("--mainBG", "#202020");
        r.style.setProperty("--bg", "#686868");
        r.style.setProperty("--bgH", "#818181");
        r.style.setProperty("--bgD", "#303030");
    } else {
        r.style.setProperty("--mainBG", "#514188");
        r.style.setProperty("--bg", "#7c6bb4");
        r.style.setProperty("--bgH", "#9484c9");
        r.style.setProperty("--bgD", "#4a368a");
    }
}
darkMode(); // to activate at startup


// called when the user clicks on a part
function showSliders() {
    
    // show the color sliders, hide buttons
    colorEditor.style.display = "block";
    topButtons.style.display = "none";

    // this tells us what part has been clicked
    const partNum = this.getAttribute("pNum");

    // change the text of the active part
    nowEditingText.innerHTML = char.partNames[partNum];

    // tell the sliders what to change
    sliderR.setAttribute("num", partNum * 4);
    sliderG.setAttribute("num", partNum * 4 + 1);
    sliderB.setAttribute("num", partNum * 4 + 2);
    sliderHue.setAttribute("num", partNum * 4);
    sliderSat.setAttribute("num", partNum * 4 + 1);
    sliderVal.setAttribute("num", partNum * 4 + 2);
    sliderA.setAttribute("num", partNum);

    const rgb = hexDecode(codeInput.value);

    // update the slider values to the current part's
    if (rgbSliders) {
        sliderR.value = rgb[partNum * 4];
        sliderG.value = rgb[partNum * 4 + 1];
        sliderB.value = rgb[partNum * 4 + 2];
    } else {
        const hsv = rgb2hsv(rgb[partNum * 4], rgb[partNum * 4 + 1], rgb[partNum * 4 + 2])
        sliderHue.value = hsv[0];
        sliderSat.value = hsv[1];
        sliderVal.value = hsv[2];

        // update the slider color
        const cssRgb = hsv2rgb(hsv[0] / 360, 1, 1);
        cssRgb[0] = cssRgb[0] * 255;
        cssRgb[1] = cssRgb[1] * 255;
        cssRgb[2] = cssRgb[2] * 255;
        sliderSat.style.background = "linear-gradient(to right, white, rgb(" + cssRgb[0] + ", " + cssRgb[1] + ", " + cssRgb[2] + ")";
        sliderVal.style.background = "linear-gradient(to right, black, rgb(" + cssRgb[0] + ", " + cssRgb[1] + ", " + cssRgb[2] + ")";
    }
    sliderA.value = alphas[partNum];
    
    // change the color of the "now editing" indicator
    editingHex.style.backgroundColor = "rgb(" + rgb[partNum*4] + ", " + rgb[partNum*4+1] + ", " + rgb[partNum*4+2] + ")";

}

document.getElementById("hideEditor").addEventListener("click", hideSliders);
function hideSliders() {
    colorEditor.style.display = "none";
    topButtons.style.display = "flex";
}

sliderHue.oninput = sliderMoved;
sliderSat.oninput = sliderMoved;
sliderVal.oninput = sliderMoved;
sliderR.oninput = sliderMoved;
sliderG.oninput = sliderMoved;
sliderB.oninput = sliderMoved;
sliderA.oninput = alphaMoved;

function sliderMoved() {

    // get the current code
    const rgb = hexDecode(codeInput.value);

    const newRgb = [];
    const num = Number(this.getAttribute("num"));
    const num2 = num-(num%4);

    if (rgbSliders) { // if rgb mode

        // modify the rgb values with the new ones from the sliders
        for (let i = 0; i < rgb.length; i++) {
            if (i == num) {
                newRgb[i] = Number(this.value);
            } else {
                newRgb.push(rgb[i]);
            }
        }

    } else { // hsv mode

        const rgbFromHsv = hsv2rgb(sliderHue.value / 360, sliderSat.value / 100, sliderVal.value / 100);
        rgbFromHsv[0] = Math.round(rgbFromHsv[0] * 255);
        rgbFromHsv[1] = Math.round(rgbFromHsv[1] * 255);
        rgbFromHsv[2] = Math.round(rgbFromHsv[2] * 255);

        // modify the rgb values with the new ones from the sliders
        for (let i = 0; i < rgb.length; i++) {
            if (i == num2 || i == num2 + 1 || i == num2 + 2) {
                newRgb[i] = rgbFromHsv[i%4];
            } else {
                newRgb.push(rgb[i]);
            }
        }

        // if changing the hue, update the colors of the other sliders
        if (this === sliderHue) {
            const cssRgb = hsv2rgb(this.value / 360, 1, 1);
            cssRgb[0] = cssRgb[0] * 255;
            cssRgb[1] = cssRgb[1] * 255;
            cssRgb[2] = cssRgb[2] * 255;
            sliderSat.style.background = "linear-gradient(to right, white, rgb(" + cssRgb[0] + ", " + cssRgb[1] + ", " + cssRgb[2] + ")";
            sliderVal.style.background = "linear-gradient(to right, black, rgb(" + cssRgb[0] + ", " + cssRgb[1] + ", " + cssRgb[2] + ")";
        }

    }

    // display a new code
    genCodeManual(newRgb)

    // update the color on the "now editing" indicator
    editingHex.style.backgroundColor = "rgb(" + newRgb[num2] + ", " + newRgb[num2+1] + ", " + newRgb[num2+2] + ")";

}

function alphaMoved() {

    const num = Number(this.getAttribute("num"));
    alphas[num] = this.value;
    createEditor();
    mainRecolor();

}

hsvButton.addEventListener("click", () => {
    rgbSliders = false;
    changeSliders();
})
rgbButton.addEventListener("click", () => {
    rgbSliders = true;
    changeSliders();
})
function changeSliders() {

    // show and hide the sliders
    const slidersHSV = document.getElementsByClassName("sliderHSV");
    const slidersRGB = document.getElementsByClassName("sliderRGB");
    if (rgbSliders) {
        for (let i = 0; i < slidersHSV.length; i++) {
            slidersHSV[i].style.display = "none";
            slidersRGB[i].style.display = "inherit";
        }
        hsvButton.style.backgroundColor = "var(--mainBG)";
        rgbButton.style.backgroundColor = "var(--bg)";
    } else {
        for (let i = 0; i < slidersHSV.length; i++) {
            slidersHSV[i].style.display = "inherit";
            slidersRGB[i].style.display = "none";
        }
        hsvButton.style.backgroundColor = "var(--bg)";
        rgbButton.style.backgroundColor = "var(--mainBG)";
    }

    // change the slider values
    const rgb = hexDecode(codeInput.value);
    if (rgbSliders) {
        sliderR.value = rgb[sliderR.getAttribute("num")];
        sliderG.value = rgb[sliderG.getAttribute("num")];
        sliderB.value = rgb[sliderB.getAttribute("num")];
    } else {
        const hsv = rgb2hsv(rgb[sliderHue.getAttribute("num")], rgb[sliderSat.getAttribute("num")], rgb[sliderVal.getAttribute("num")])
        sliderHue.value = hsv[0];
        sliderSat.value = hsv[1];
        sliderVal.value = hsv[2];

        // update the slider color
        const cssRgb = hsv2rgb(hsv[0] / 360, 1, 1);
        cssRgb[0] = cssRgb[0] * 255;
        cssRgb[1] = cssRgb[1] * 255;
        cssRgb[2] = cssRgb[2] * 255;
        sliderSat.style.background = "linear-gradient(to right, white, rgb(" + cssRgb[0] + ", " + cssRgb[1] + ", " + cssRgb[2] + ")";
        sliderVal.style.background = "linear-gradient(to right, black, rgb(" + cssRgb[0] + ", " + cssRgb[1] + ", " + cssRgb[2] + ")";
    }
    
}


function genCodeManual(rgb) {

    // this is mostly the randomize code

    // get the number of parts we will recolor
    const colorNum = char.actualParts ? char.actualParts : characterImgs.colorIn.length / 4;

    // add in the rgb values in hex form
    let finalCode = "";
    for (let i = 0; i < colorNum * 4; i += 4) {
        finalCode += rgbToHex(rgb[i], rgb[i+1], rgb[i+2])        
    }

    //generate a valid checksum (this is only for the game, the webpage doesn't need this)
	let checksum = 0;
    let count = 0;
	for (let i = 0; i < colorNum*4; i += 4)
	{
		checksum += (count + 101) * rgb[i];
		checksum += (count + 102) * rgb[i+1];
		checksum += (count + 103) * rgb[i+2];
        count++;
	}
    checksum = checksum % 256;
    finalCode += checksum.toString(16).toUpperCase().padStart(2, '0');
	if (colorNum % 2 == 0)
	{
		finalCode += "00";
    }

    //put the code in the code input, separating the full color code with "-" every 4 characters    
    codeInput.value = finalCode.match(/.{1,4}/g).join("-").toUpperCase();

    //check the code, this is just to force recoloring the image
    codeControl();

}


// lets see that edit character mode
document.getElementById("editChar").addEventListener("click", () => {

    // show a bit of info just in case
    showInfo("infoCE");

    // show hidden elements and hide useless ones
    const proEls = document.getElementsByClassName("proMode");
    for (let i = 0; i < proEls.length; i++) {
        proEls[i].style.display = "flex";
    }
    const casualEls = document.getElementsByClassName("casualMode");
    for (let i = 0; i < casualEls.length; i++) {
        casualEls[i].style.display = "none";
    }

    // move some stuff around
    document.getElementById("outColorsBot").insertAdjacentElement("beforeend", codeInput);
    document.getElementById("outColorsBot").insertAdjacentElement("beforeend", copyToClip);
    document.getElementById("row3").style.paddingBottom = "10px"
    codeInput.style.width = "345px";

    // create the new editors for both ogColors and colorRanges
    createProEditor(true);
    createProEditor();

    // portrait will be treated as custom from now on unless theres already an image
    if (!customPortrait) {
        customPortrait = "Characters/"+char.name+"/Full.png";
    }

    // from now on, ask for confirmation if the user leaves
    askForConfExit();
    
})

function createProEditor(ogOrRange) {
    
    let count = 0;

    // clear the old and dusty contents
    if (ogOrRange) {
        ogColorList.innerHTML = null;
    } else {
        colorRangeList.innerHTML = null;
    }

    for (let i = 0; i < characterImgs.colorIn.length; i += 4) {
        
        // this is where everything will be stored
        const part = document.createElement("div");
        part.className = "proPart";

        // get the part name and colorize its background
        const partName = document.createElement("div");
        partName.innerHTML = char.partNames[count];
        partName.classList.add("partName");

        partName.style.backgroundColor = "rgb(" + characterImgs.colorIn[i] +
            ", " + characterImgs.colorIn[i+1] + ", " + characterImgs.colorIn[i+2] + ")";

        // depending on ogcolors or ranges, add inputs to edit them
        let sub1, sub2, sub3;
        if (ogOrRange) {
            sub1 = genNumInp(characterImgs.colorIn[i], 255, i, true);
            sub2 = genNumInp(characterImgs.colorIn[i+1], 255, i+1, true);
            sub3 = genNumInp(characterImgs.colorIn[i+2], 255, i+2, true);
        } else {
            sub1 = genNumInp(characterImgs.colorTolerance[i], 359, i, false);
            sub2 = genNumInp(characterImgs.colorTolerance[i+1], 100, i+1, false);
            sub3 = genNumInp(characterImgs.colorTolerance[i+2], 100, i+2, false);
        }

        // now add everything we just created to the part div and then to the actual html
        part.appendChild(partName);
        part.appendChild(sub1);
        part.appendChild(sub2);
        part.appendChild(sub3);
        if (ogOrRange) {
            ogColorList.appendChild(part);
        } else {
            colorRangeList.appendChild(part);
        }

        count++;
        
    }

    // finally, generate the code below the editor
    genOgRanCode(ogOrRange);

}

// generates an input element to change the internal character values
function genNumInp(color, max, colorNum, ogOrRange) {
    const newPart = document.createElement("input");
    newPart.setAttribute("type", "number");
    newPart.setAttribute("min", "0");
    newPart.setAttribute("max", max);
    newPart.setAttribute("partNum", colorNum);
    newPart.value = color;
    newPart.classList.add("numInput");

    if (ogOrRange) {
        newPart.setAttribute("ogOrRange", "og");
    } else {
        newPart.setAttribute("ogOrRange", "range");
    }

    newPart.addEventListener("input", updateOgRange)

    return newPart;
}

// generates the code of either ogColors or colorRanges
function genOgRanCode(ogOrRange) {

    let code = "";
    const arrayToTake = ogOrRange ? characterImgs.colorIn : characterImgs.colorTolerance;

    for (let i = 0; i < arrayToTake.length; i++) {
        if ((i+1)%4 != 0) {
            code += componentToHex(arrayToTake[i]).toUpperCase();
        } else {
            if (i != arrayToTake.length - 1) { // if its the last one, dont add "-"
                code += "-";
            }
        }
    }

    ogOrRange ? ogButton.innerText = code : raButton.innerText = code;

}

// gets called every time a number input gets updated
function updateOgRange() {
    const num = Number(this.getAttribute("partNum"));
    const num2 = num-(num%4);

    if (this.getAttribute("ogOrRange") == "og") {
        characterImgs.changeOg(num, this.value);
        mainRecolor();
        genOgRanCode(true);
    } else {
        characterImgs.changeRange(num, this.value);
        mainRecolor();
        genOgRanCode();
    }

    // update the color indicator of the part
    ogColorList.childNodes[num2/4].firstChild.style.backgroundColor = "rgb(" + characterImgs.colorIn[num2] +
    ", " + characterImgs.colorIn[num2+1] + ", " + characterImgs.colorIn[num2+2] + ")";
    colorRangeList.childNodes[num2/4].firstChild.style.backgroundColor = "rgb(" + characterImgs.colorIn[num2] +
    ", " + characterImgs.colorIn[num2+1] + ", " + characterImgs.colorIn[num2+2] + ")";
}

// when clicking on the og/ra codes
ogButton.addEventListener("click", showCodeInfo);
raButton.addEventListener("click", showCodeInfo);
function showCodeInfo() {
    showInfo("ograChange");
    ogInput.focus();
}
document.getElementById("updateOgra").addEventListener("click", translateCode);
function translateCode() {

    // create new arrays
    const splitOg = ogInput.value.split("-");
    const splitRa = raInput.value.split("-");

    // translate everything to rgb
    const finalOg = [];
    const finalRa = [];

    for (let i = 0; i < splitOg.length; i++) {
        const rgbOg = hex2rgb(splitOg[i]);
        const rgbRa = hex2rgb(splitRa[i]);
        for (let i = 0; i < rgbOg.length; i++) {
            finalOg.push(rgbOg[i]);
            finalRa.push(rgbRa[i]);
        }
        finalOg.push(1);
        finalRa.push(1);
    }

    // update the shader
    characterImgs = new RoaRecolor(finalOg, finalRa, eaCheck.checked);
    if (customPortrait) {
        characterImgs.addImage(fullCanvas, customPortrait, "Portrait").then(mainRecolor);
    }
    if (customSprite) {
        characterImgs.addImage(animCanvas, customSprite, "Spritesheet").then(mainRecolor);
    }
    // update the char values in case they changed
    partCount = finalOg.length / 4;
    changePlaceholder(finalOg.length / 4);
    codeInput.value = null;
    codeControl();
    // redo the editors to show updated values
    createProEditor(true);
    createProEditor();
    createEditor();
    // update the render
    mainRecolor();
}

// check if the oc/cr codes are right
ogInput.addEventListener("input", codeControlPro);
raInput.addEventListener("input", codeControlPro);
function codeControlPro() {

    // if code has hex characters or "-", AND has 6 chars per segment, AND both have same length
    if (ogInput.value.match(codeReg) && raInput.value.match(codeReg) &&
     ogInput.value.length == raInput.value.length) {
        document.getElementById("updateOgra").disabled = false;
    } else {
        document.getElementById("updateOgra").disabled = true;
    }

}


// its character creator time
const defaultFilePor = document.getElementById("fileuploadPor");
const defaultFileSpr = document.getElementById("fileuploadSpr");
let firstImg = true;
document.getElementById("newChar").addEventListener("click", () => {

    // show a bit of info just in case
    showInfo("infoNC");

    // show hidden elements and hide useless ones
    const proEls = document.getElementsByClassName("showCustom");
    for (let i = 0; i < proEls.length; i++) {
        proEls[i].style.display = "flex";
    }
    const casualEls = document.getElementsByClassName("hideCustom");
    for (let i = 0; i < casualEls.length; i++) {
        casualEls[i].style.display = "none";
    }

    // display the top buttons just in case they were hidden
    topButtons.style.display = "inherit";

    // move some stuff around
    document.getElementById("outColorsBot").insertAdjacentElement("beforeend", codeInput);
    document.getElementById("outColorsBot").insertAdjacentElement("beforeend", copyToClip);
    document.getElementById("row3").style.paddingBottom = "10px"
    codeInput.style.width = "345px";

    // change the names for the parts
    const newNames = [];
    for (let i = 0; i < 9; i++) {
        newNames.push("Part " + (i+1));        
    }
    char.name = "Custom Character"; // will be used as download filename
    char.partNames = newNames;
    char.actualParts = null; // so code doesnt have to worry about this later
    changePlaceholder(2);
    codeInput.value = null;

})

document.getElementById("uplPor").addEventListener("click", () => {
    defaultFilePor.click();
})
document.getElementById("uplSpr").addEventListener("click", () => {
    defaultFileSpr.click();
})
defaultFilePor.addEventListener("change", () => {
    const newImg = defaultFilePor.files[0];

    const fileReader = new FileReader();
    fileReader.addEventListener("load", function () {

        if (firstImg) {
            // create default values, 1 for ogs and 0 for ranges
            let basicOg = [], basicRange = [];
            for (let i = 0; i < 8; i++) {
                basicOg.push(1);
                if (i==3 || i==7) {
                    basicRange.push(1)
                } else {
                    basicRange.push(0);
                }          
            }
            characterImgs = new RoaRecolor(basicOg, basicRange, eaCheck.checked);
            showCustomUI();
            createEditor();
        }

        customPortrait = this.result;

        // check if this is not the first image added
        if (characterImgs.charImgs["Full"]) {
            characterImgs.addCustom(customPortrait, "Portrait").then( () => {
                mainRecolor();
            })
        } else {
            characterImgs.addImage(fullCanvas, customPortrait, "Portrait").then( () => {
                mainRecolor();
                fullCanvas.style.display = "flex";
            })
        }
        firstImg = false;

    });
    fileReader.readAsDataURL(newImg);
});
defaultFileSpr.addEventListener("change", () => {
    const newImg = defaultFileSpr.files[0];

    const fileReader = new FileReader();
    fileReader.addEventListener("load", function () {

        if (firstImg) {
            let basicOg = [], basicRange = [];
            for (let i = 0; i < 8; i++) {
                basicOg.push(1);
                if (i==3 || i==7) {
                    basicRange.push(1)
                } else {
                    basicRange.push(0);
                }          
            }
            characterImgs = new RoaRecolor(basicOg, basicRange, eaCheck.checked);
            showCustomUI();
            createEditor();
        }

        customSprite = this.result;

        if (characterImgs.charImgs["Spritesheet"]) {
            characterImgs.addCustom(customSprite, "Spritesheet").then( () => {
                mainRecolor();
            })
        } else {
            characterImgs.addImage(animCanvas, customSprite, "Spritesheet").then( () => {
                mainRecolor();
                spritesDiv.style.display = "flex";
                document.getElementById("frameCountDiv").style.display = "inline";
                document.getElementById("frameCountInp").addEventListener("change", updateFC);
            })
        }

        const sprite = new Image();
        sprite.src = customSprite;
        sprite.decode().then( () => {
            let frameCount = 6; // default to 6 if file has no numbers at the end
            // if the name of the file has at least 2 characters AND those are numbers
            if (newImg.name.length >= 6 && Number(newImg.name.substr(newImg.name.length - 6, 2))) {
                frameCount = newImg.name.substr(newImg.name.length - 6, 2);
            } else if (Number(newImg.name.substr(newImg.name.length - 5, 1))) {
                frameCount = newImg.name.substr(newImg.name.length - 5, 1);
            }
            // same as regular idle sprites
            animDiv.style.width = (sprite.width / frameCount) + "px";
            animDiv.style.height = sprite.height + "px";
            const r = document.querySelector(':root');
            r.style.setProperty("--spriteMove", -sprite.width + "px");
            r.style.setProperty("--spriteCount", frameCount);
            r.style.setProperty("--spriteTime", 1000/60*7*frameCount/1000 + "s");
            document.getElementById("frameCountInp").value = frameCount;
            
            char.idleImg = sprite;
        })
        firstImg = false;

    });
    fileReader.readAsDataURL(newImg);
});
function updateFC() {
    const sprite = char.idleImg;
    animDiv.style.width = (sprite.width / this.value) + "px";
    const r = document.querySelector(':root');
    r.style.setProperty("--spriteCount", this.value);
    r.style.setProperty("--spriteTime", 1000/60*7*this.value/1000 + "s");
}


function showCustomUI() {

    document.getElementById("introCustom").style.display = "none";

    document.getElementById("randomize").style.display = "inherit";
    downImgButton.style.display = "inherit";

    // show hidden elements and hide useless ones
    const proEls = document.getElementsByClassName("proMode");
    for (let i = 0; i < proEls.length; i++) {
        proEls[i].style.display = "flex";
    }
    document.getElementById("row4").style.display = "flex";
    // create the new editors for both ogColors and colorRanges
    createProEditor(true);
    createProEditor();

    // from now on, ask for confirmation if the user leaves
    askForConfExit();

}

let partCount = 2;
document.getElementById("addOg").addEventListener("click", () => {addOrRemoveRow(true)});
document.getElementById("addRa").addEventListener("click", () => {addOrRemoveRow(true)});
document.getElementById("removeOg").addEventListener("click", () => {addOrRemoveRow()});
document.getElementById("removeRa").addEventListener("click", () => {addOrRemoveRow()});
function addOrRemoveRow(add) {

    const og = characterImgs.colorIn;
    const ra = characterImgs.colorTolerance;
    
    if (add) {
        for (let i = 0; i < 4; i++) {
            if (i != 3) {
                og.push(1);
                ra.push(0);
            } else {
                og.push(1);
                ra.push(1);
            }        
        }
        partCount++;
    } else {
        og.splice(og.length - 4);
        ra.splice(ra.length - 4);
        partCount--;
    }

    // we need to add a new class each time since it wont update non-shown parts otherwise
    characterImgs = new RoaRecolor(og, ra, eaCheck.checked);
    if (customPortrait) {
        characterImgs.addImage(fullCanvas, customPortrait, "Portrait").then(mainRecolor);
    }
    if (customSprite) {
        characterImgs.addImage(animCanvas, customSprite, "Spritesheet").then(mainRecolor);
    }

    changePlaceholder(partCount);
    codeInput.value = null;
    codeControl();
    createEditor();
    createProEditor(true);
    createProEditor();

    if (characterImgs.colorIn.length >= 36) {
        document.getElementById("addOg").disabled = true;
        document.getElementById("addRa").disabled = true;
    } else if (characterImgs.colorIn.length <= 4) {
        document.getElementById("removeOg").disabled = true;
        document.getElementById("removeRa").disabled = true;
    } else {
        document.getElementById("addOg").disabled = false;
        document.getElementById("addRa").disabled = false;
        document.getElementById("removeOg").disabled = false;
        document.getElementById("removeRa").disabled = false;
    }

}

function changePlaceholder(colorNum) {
    switch (colorNum) { // impresive code i know
        case 1:
            char.placeholder = "0000-0000"; break;
        case 2:
            char.placeholder = "0000-0000-0000-0000"; break;
        case 3:
            char.placeholder = "0000-0000-0000-0000-0000"; break;
        case 4:
            char.placeholder = "0000-0000-0000-0000-0000-0000-0000"; break;
        case 5:
            char.placeholder = "0000-0000-0000-0000-0000-0000-0000-0000"; break;
        case 6:
            char.placeholder = "0000-0000-0000-0000-0000-0000-0000-0000-0000-0000"; break;
        case 7:
            char.placeholder = "0000-0000-0000-0000-0000-0000-0000-0000-0000-0000-0000"; break;
        case 8:
            char.placeholder = "0000-0000-0000-0000-0000-0000-0000-0000-0000-0000-0000-0000-0000"; break;
        case 9:
            char.placeholder = "0000-0000-0000-0000-0000-0000-0000-0000-0000-0000-0000-0000-0000-0000"; break;
        default: break;
    }
}

// will show the black background as well as the element itself
function showInfo(infoID) {
    const infoEl = document.getElementById(infoID);
    infoEl.parentElement.style.display = "flex";
    infoEl.style.display = "block";
    codeControlPro();
}

// lets just slap an event listener to every ok button
const okButts = document.getElementsByClassName("okButton");
for (let i = 0; i < okButts.length; i++) {
    okButts[i].addEventListener("click", hideInfoUI);
}
function hideInfoUI() { // this will work with any info UI with the same structure
    this.parentElement.parentElement.style.display = "none";
    this.parentElement.style.display = "none";
}


function hexDecode(hex) {

    try {
        // delete those "-" from the code
        let newHex = hex.replace(/-/g, "");

        // split each color for every 6 characters
        const charHex = newHex.match(/.{1,6}/g);

        // create an array for the shader with rgba values
        const charRGB = [];
        for (let i = 0; i < charHex.length; i++) {
            const newArr = hex2rgb(charHex[i]);
            charRGB.push(newArr[0], newArr[1], newArr[2], 1); //r, g, b, a
        }
        return charRGB;
    } catch (e) { // if it fails, use the original colors
        return characterImgs.colorIn;
    }

    
}

function hex2rgb(hex) {
    const rgb = [];
    const bigint = parseInt(hex, 16);
    rgb[0] = (bigint >> 16) & 255;
    rgb[1] = (bigint >> 8) & 255;
    rgb[2] = bigint & 255;
    return rgb;
}
function componentToHex(c) {
    const hex = c.toString(16);
    return hex.length == 1 ? "0" + hex : hex;
}
function rgbToHex(r, g, b) {
    return componentToHex(r) + componentToHex(g) + componentToHex(b);
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

function rgb2hsv (r, g, b) {

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

    h = h * 360;
    s = s * 100;
    v = v * 100;

    return [h, s, v];

}

//just a simple random function
function genRnd(min, max) {
    return Math.floor(Math.random() * (max - min + 1) ) + min;
}


function askForConfExit() {
    window.addEventListener('beforeunload', function (e) {
        e.preventDefault();
        e.returnValue = '';
    });
}
