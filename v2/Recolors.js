"use strict";

let char; // this will hold the values from the character database
let characterImgs;
let maxLength; // limits how many characters there should be in the code input
let playingAnim = false; // to not allow playing an animation until its finished
let rgbSliders = false; // if active, the page will use rgb sliders instead of hsv ones

const fullCanvas = document.getElementById("fullCanvas");
const animCanvas = document.getElementById("animCanvas");
const sprLCanvas = document.getElementById("spriteL");
const sprRCanvas = document.getElementById("spriteR");
const animDiv = document.getElementById("animDiv");
const spritesDiv = document.getElementById("sContainer");
const charIcon = document.getElementById("selectedIcon");
const codeInput = document.getElementById("codeInput");
const copyToClip = document.getElementById("copyToClip");
const copiedImg = document.getElementById("copied");
const codeWarning = document.getElementById("row2");
const downLink = document.getElementById("downImg");
const downImgButton = document.getElementById("downImg");
const colorEditor = document.getElementById("colorEditor");
const partList = document.getElementById("partList");
const ogColorList = document.getElementById("ogColorList");
const colorRangeList = document.getElementById("colorRangeList");
const hsvButton = document.getElementById("hsvClick");
const rgbButton = document.getElementById("rgbClick");
const sliderHue = document.getElementById("sliderHue");
const sliderSat = document.getElementById("sliderSat");
const sliderVal = document.getElementById("sliderVal");
const sliderR = document.getElementById("sliderR");
const sliderG = document.getElementById("sliderG");
const sliderB = document.getElementById("sliderB");
const nowEditingText = document.getElementById("nowEditing");
const editingHex = document.getElementById("editingHex");
const topButtons = document.getElementById("row3");
const hideSlidsButton = document.getElementById("hideEditor");
const loadingDiv = document.getElementById("loadingDiv");
const eaCheck = document.getElementById("EAcheck");
const x4Down = document.getElementById("x4Down")
const darkCheck = document.getElementById("darkTheme");


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

    // hide the characters, show the loading div
    loadingDiv.style.height = (fullCanvas.clientHeight + spritesDiv.clientHeight) + 17 + "px";
    loadingDiv.style.display = "flex";
    fullCanvas.style.display = "none";
    spritesDiv.style.display = "none";

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

        // hide the loading div, show the characters
        loadingDiv.style.display = "none";
        fullCanvas.style.display = "block";
        spritesDiv.style.display = "flex";

    })

    const sprite = new Image();
    sprite.src = "Characters/"+char.name+"/Idle.png";
    sprite.decode().then( () => { // when the image finishes loading

        //change the width of the sprite animation, depending on the character
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

        // hide the color sliders, show top buttons
        colorEditor.style.display = "none";
        topButtons.style.display = "flex";
    })    

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
        rgb = characterImgs.colorIn; // if the code is not valid, use the default colors
    }

    // check if the current character has hidden parts
    const theLength = char.actualParts ? char.actualParts * 4 : characterImgs.colorIn.length;

    // now for each (editable) part:
    for (let i = 0; i < theLength; i += 4) {
        
        // this is where everything will be stored
        const part = document.createElement("div");
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

    // image has to be repainted to be dowloaded
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

    // this is like the recolor function but will activate a download once its finished
    characterImgs.download(rgb, "Full");

});


//randomize button, generates a random valid code based on character parts count
document.getElementById("randomize").addEventListener("click", () => {
    if (char.actualParts) { // for orcane & olympia
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

    // hide the color sliders
    colorEditor.style.display = "none";

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

            // hide the sprites, then stop recoloring them
            spritesDiv.style.display = "none";
            characterImgs.delete("Idle");
            characterImgs.delete("SpriteL");
            characterImgs.delete("SpriteR");

        })
    });
    fileReader.readAsDataURL(newImg); //imma be honest idk what this is but it doesnt work without it

    //clear the input code
    codeInput.value = "";
});


// show config menu if clicking on the config button
const configMenu = document.getElementById("configMenu");
document.getElementById("config").addEventListener("click", () => {
    configMenu.classList.toggle("hide");
})
// close the dropdown menu if the user clicks outside of it
window.onclick = (e) => {
    if (!e.target.matches('#config') && !e.target.matches('#configIcon') && !e.target.matches('path')) {
        
        if (!configMenu.classList.contains('hide')) {
            configMenu.classList.add('hide');
        }
    }
} 


/* SETTINGS */

// Early Access check
eaCheck.addEventListener("click", () => {
    if (!eaCheck.checked) {
        characterImgs.changeBlend(1);
        mainRecolor();
    } else {
        characterImgs.changeBlend(0);
        mainRecolor();
    }
})
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
darkMode();


function recolor(rgb) {
    if (rgb) {
        if (char.name == "Orcane") { // orcane has a greenish hidden part
            const newRgb = [];
            for (let i = 0; i < rgb.length; i++) {
                newRgb.push(rgb[i]);               
            }
            for (let i = 0; i < 4; i++) {
                newRgb[i+8] = rgb[i];
            }
            characterImgs.recolor(newRgb);
        } else {
            characterImgs.recolor(rgb);
        }    if (char.name == "Orcane") {
            const newRgb = [];
            for (let i = 0; i < rgb.length; i++) {
                newRgb.push(rgb[i]);               
            }
            for (let i = 0; i < 4; i++) {
                newRgb[i+8] = rgb[i];
            }
            characterImgs.recolor(newRgb);
        } else {
            characterImgs.recolor(rgb);
        }
    } else {
        characterImgs.recolor(); // if no colors, will use original ones
    }
}


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

    let rgb;
    try {
        const hex = codeInput.value;
        rgb = hexDecode(hex);
    } catch (error) {
        rgb = char.ogColor; // if the code is not valid, use the default colors
    }
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
    
    // change the color of the "now editing" indicator
    editingHex.style.backgroundColor = "rgb(" + rgb[partNum*4] + ", " + rgb[partNum*4+1] + ", " + rgb[partNum*4+2] + ")";

}

hideSlidsButton.addEventListener("click", hideSliders);
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

function sliderMoved() {

    // get the current code
    let rgb;
    try {
        const hex = codeInput.value;
        rgb = hexDecode(hex);
    } catch (error) {
        rgb = char.ogColor; // if the code is not valid, use the default colors
    }

    const newRgb = [];
    const num = Number(this.getAttribute("num"));
    const num2 = num-(num%4);

    if (rgbSliders) {

        // modify the rgb values with the new ones from the sliders
        for (let i = 0; i < rgb.length; i++) {
            if (i == num) {
                newRgb[i] = Number(this.value);
            } else {
                newRgb.push(rgb[i]);
            }
        }

    } else {

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

// RGB sliders
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
            slidersRGB[i].style.display = "inline";
        }
        hsvButton.style.backgroundColor = "var(--mainBG)";
        rgbButton.style.backgroundColor = "var(--bg)";
    } else {
        for (let i = 0; i < slidersHSV.length; i++) {
            slidersHSV[i].style.display = "inline";
            slidersRGB[i].style.display = "none";
        }
        hsvButton.style.backgroundColor = "var(--bg)";
        rgbButton.style.backgroundColor = "var(--mainBG)";
    }

    // change the slider values
    let rgb;
    try {
        const hex = codeInput.value;
        rgb = hexDecode(hex);
    } catch (error) {
        rgb = char.ogColor; // if the code is not valid, use the default colors
    }
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
    const colorNum = char.actualParts ? char.actualParts : char.ogColor.length / 4;

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
    codeInput.value = finalCode.match(/.{1,4}/g).join("-");

    //check the code, this is just to force recoloring the image
    codeControl();

}


// lets see that edit character mode
document.getElementById("editChar").addEventListener("click", () => {

    // show a bit of info just in case
    document.getElementById("infoCE").style.display = "flex";

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
        let sub1, sub2, sub3, sub4;
        if (ogOrRange) {
            sub1 = genNumInp(characterImgs.colorIn[i], 255, i, true);
            sub2 = genNumInp(characterImgs.colorIn[i+1], 255, i+1, true);
            sub3 = genNumInp(characterImgs.colorIn[i+2], 255, i+2, true);
            sub4 = genNumInp(characterImgs.colorIn[i+3], 1, i+3, true);
        } else {
            sub1 = genNumInp(characterImgs.colorTolerance[i], 359, i, false);
            sub2 = genNumInp(characterImgs.colorTolerance[i+1], 100, i+1, false);
            sub3 = genNumInp(characterImgs.colorTolerance[i+2], 100, i+2, false);
            sub4 = genNumInp(characterImgs.colorTolerance[i+3], 1, i+3, false);   
        }

        // now add everything we just created to the part div and then to the actual html
        part.appendChild(partName);
        part.appendChild(sub1);
        part.appendChild(sub2);
        part.appendChild(sub3);
        part.appendChild(sub4);
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

    if (ogOrRange) {
        
        for (let i = 0; i < characterImgs.colorIn.length; i++) {
            code += characterImgs.colorIn[i];
            if (i != characterImgs.colorIn.length - 1) { // if its the last one, dont add "-"
                code += "-"            
            }
        }

        document.getElementById("ogColorInput").value = code;

    } else {

        for (let i = 0; i < characterImgs.colorTolerance.length; i++) {
            code += characterImgs.colorTolerance[i];
            if (i != characterImgs.colorTolerance.length - 1) {
                code += "-"            
            }
        }

        document.getElementById("colorRangeInput").value = code;
        
    }

}

// gets called every time a number input gets updated
function updateOgRange() {
    if (this.getAttribute("ogOrRange") == "og") {
        characterImgs.changeOg(this.getAttribute("partNum"), this.value);
        mainRecolor();
        genOgRanCode(true);
    } else {
        characterImgs.changeRange(this.getAttribute("partNum"), this.value);
        mainRecolor();
        genOgRanCode();
    }
}

// if someone pastes a code on the code inputs
document.getElementById("ogColorInput").addEventListener("input", translateCode);
document.getElementById("colorRangeInput").addEventListener("input", translateCode);
function translateCode() {

    const splitCode = this.value.split("-"); // create a new array
    if (this.id == "ogColorInput") {
        characterImgs.changeOg(0,0,splitCode); // will update the shader
        createProEditor(true); // redo the editor to show updated values
    } else {
        characterImgs.changeRange(0,0,splitCode);
        createProEditor();
    }
    mainRecolor(); // update the render

}


// its character creator time
const defaultFilePor = document.getElementById("fileuploadPor");
const defaultFileSpr = document.getElementById("fileuploadSpr");
let firstImg = true;
document.getElementById("newChar").addEventListener("click", () => {

    // show a bit of info just in case
    document.getElementById("infoNC").style.display = "flex";

    // show hidden elements and hide useless ones
    const proEls = document.getElementsByClassName("showCustom");
    for (let i = 0; i < proEls.length; i++) {
        proEls[i].style.display = "flex";
    }
    const casualEls = document.getElementsByClassName("hideCustom");
    for (let i = 0; i < casualEls.length; i++) {
        casualEls[i].style.display = "none";
    }

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
    char.partNames = newNames;
    char.actualParts = null; // so code doesnt have to worry about this later
    downLink.setAttribute("download", "Custom Recolor.png"); //update the dowloaded image name
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

        if (characterImgs.charImgs["Full"]) {
            characterImgs.addCustom(this.result, "Full").then( () => {
                recolor();
            })
        } else {
            characterImgs.addImage(fullCanvas, this.result, "Full").then( () => {
                recolor();
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

        if (characterImgs.charImgs["Idle"]) {
            characterImgs.addCustom(this.result, "Idle").then( () => {
                recolor();
            })
        } else {
            characterImgs.addImage(animCanvas, this.result, "Idle").then( () => {
                recolor();
                spritesDiv.style.display = "flex";
                document.getElementById("frameCountDiv").style.display = "inline";
                document.getElementById("frameCountInp").addEventListener("change", updateFC);
            })
        }

        const sprite = new Image();
        sprite.src = this.result;
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

    // show hidden elements and hide useless ones
    const proEls = document.getElementsByClassName("proMode");
    for (let i = 0; i < proEls.length; i++) {
        proEls[i].style.display = "flex";
    }
    document.getElementById("row4").style.display = "flex";
    // create the new editors for both ogColors and colorRanges
    createProEditor(true);
    createProEditor();
}

let partCount = 2;
document.getElementById("addOg").addEventListener("click", () => {addOrRemoveRow(true)});
document.getElementById("addRa").addEventListener("click", () => {addOrRemoveRow(true)});
document.getElementById("removeOg").addEventListener("click", () => {addOrRemoveRow()});
document.getElementById("removeRa").addEventListener("click", () => {addOrRemoveRow()});
function addOrRemoveRow(add) {
    
    if (add) {
        characterImgs.addRow();
        partCount++;
    } else {
        characterImgs.removeRow();
        partCount--;
    }
    changePlaceholder(partCount);
    codeInput.value = null;
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


// lets just slap an event listener to every ok button
const okButts = document.getElementsByClassName("okButton");
for (let i = 0; i < okButts.length; i++) {
    okButts[i].addEventListener("click", hideInfoUI);
}
function hideInfoUI() { // this will work with any info UI with the same structure
    this.parentElement.parentElement.style.display = "none";
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