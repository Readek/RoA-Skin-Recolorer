"use strict";
const fullCanvas = document.getElementById("fullCanvas");
const animCanvas = document.getElementById("animCanvas");
const animDiv = document.getElementById("animDiv");

let char; // this will hold the values from the character database
let maxLength; // limits how many characters there should be in the code input
let playingAnim = false; // to not allow playing an animation until its finished
let customImg = null; // this will hold a custom uploaded img

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
function mainRecolor(ss = false) {
    const hex = codeInput.value; //grab the color code
    const rgb = hexDecode(hex); //make some sense out of it
    // now recolor the images
    if (!customImg) { // if this is not a custom image, recolor render and sprites
        render(fullCanvas, "Characters/"+char.name+"/Full.png", rgb, ss);
        render(animCanvas, "Characters/"+char.name+"/Idle.png", rgb, false);
    } else { // if it is, just recolor that custom image
        render(fullCanvas, customImg, rgb, ss);
    }

}


//whenever the character changes
function changeChar(charNum) {

    // clear that custom img and restore the sprites in case we changed it earlier
    animDiv.style.display = "flex";
    customImg = null;

    //look at the database to see whats up
    char = db.chars[charNum];
    //create new character images with this info
    addImg(fullCanvas, "Characters/"+char.name+"/Full.png", char.ogColor, char.colorRange);
    addImg(animCanvas, "Characters/"+char.name+"/Idle.png", char.ogColor, char.colorRange);

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

    //make the recolor button unclickable and show some feedback
    copyToClip.style.filter = "brightness(.8)";
    copyToClip.style.pointerEvents = "none";

    //update the dowloaded image name
    downLink.setAttribute("download", char.name + " Recolor.png");

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
        }
        else if (i < 9) { //earth
            newDiv.style.backgroundColor = "#6ca577"
        }
        else if (i < 12) { //water
            newDiv.style.backgroundColor = "#6673ad"
        } else { //but everything changed when the indie characters attacked
            newDiv.style.backgroundColor = "#c9b4d3"
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
    } else {
        codeInput.style.width = "475px";
    }
}


//just a simple random function
function genRnd(min, max) {
    return Math.floor(Math.random() * (max - min + 1) ) + min;
}


//download image button
downImgButton.addEventListener('click', () => {
    // we need to repaint the image to get a screenshot of it before it internaly clears
    if (codeInput.value) { //if theres a code
        mainRecolor(true);
    } else { //just donwload the base image, im sure someone out there will want the default one
        downImgButton.href = "Characters/" + char.name + "/Full.png";
    }
});


//randomize button, generates a random valid code based on character parts count
document.getElementById("randomize").addEventListener("click", () => {
    randomize(char.ogColor.length / 4)
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
        customImg = this.result;
        addImg(fullCanvas, customImg, char.ogColor, char.colorRange);
        // hide the sprites
        animDiv.style.display = "none";
    });
    fileReader.readAsDataURL(newImg); //imma be honest idk what this is but it doesnt work without it

    //clear the input code
    codeInput.value = "";
});


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


