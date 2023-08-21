// this script was made out of examples that can be found at https://webgl2fundamentals.org

const vertexShaderSource = `#version 300 es

// the vertex shader RoA uses is much more complicated, but here we
// don't care about lighting so this is just the example shader

// an attribute is an input (in) to a vertex shader.
// It will receive data from a buffer
in vec2 a_position;
in vec2 a_texCoord;

// Used to pass in the resolution of the canvas
uniform vec2 u_resolution;

// Used to pass the texture coordinates to the fragment shader
out vec2 v_texCoord;

// all shaders have a main function
void main() {

  // convert the position from pixels to 0.0 to 1.0
  vec2 zeroToOne = a_position / u_resolution;

  // convert from 0->1 to 0->2
  vec2 zeroToTwo = zeroToOne * 2.0;

  // convert from 0->2 to -1->+1 (clipspace)
  vec2 clipSpace = zeroToTwo - 1.0;

  gl_Position = vec4(clipSpace * vec2(1, -1), 0, 1);

  // pass the texCoord to the fragment shader
  // The GPU will interpolate this value between points.
  v_texCoord = a_texCoord;
}
`;

const fragmentShaderSource = `#version 300 es

// fragment shaders don't have a default precision so we need
// to pick one. RoA's shader uses high precision.
precision highp float;
#define LOWPREC lowp // not sure what this does


// our character image
uniform sampler2D u_image;


// the texCoords passed in from the vertex shader.
in vec2 v_texCoord;

const int maxcolors = 9; // the maximum number of colors to be changed (9 is RoA's limit)

uniform vec4 colorIn[maxcolors];        // color to replace
uniform vec4 colorOut[maxcolors];       // desired color
uniform vec4 colorTolerance[maxcolors]; // HSVA tolerances
uniform vec4 blend[maxcolors];          // 1 = regular shading, 0 = EA shading
uniform int special;                    // certain skins use a modified shared logic


vec3 rgb_to_hsv(vec3 col)
{
    float H = 0.0;
    float S = 0.0;
    float V = 0.0;
    
    float M = max(col.r, max(col.g, col.b));
    float m = min(col.r, min(col.g, col.b));
    
    V = M;
    
    float C = M - m;
    
    if (C > 0.0)
    {
        if (M == col.r) H = mod( (col.g - col.b) / C, 6.0);
        if (M == col.g) H = (col.b - col.r) / C + 2.0;
        if (M == col.b) H = (col.r - col.g) / C + 4.0;
        H /= 6.0;
        S = C / V;
    }
    
    return vec3(H, S, V);
}

vec3 hsv_to_rgb(vec3 col)
{
    float H = col.r;
    float S = col.g;
    float V = col.b;
    
    float C = V * S;
    
    H *= 6.0;
    float X = C * (1.0 - abs( mod(H, 2.0) - 1.0 ));
    float m = V - C;
    C += m;
    X += m;
    
    if (H < 1.0) return vec3(C, X, m);
    if (H < 2.0) return vec3(X, C, m);
    if (H < 3.0) return vec3(m, C, X);
    if (H < 4.0) return vec3(m, X, C);
    if (H < 5.0) return vec3(X, m, C);
    else         return vec3(C, m, X);
}

// we need to declare an output for the fragment shader
out vec4 outColor;

// now this is where we get serious
void main() {

  // the current pixel we're looking at
  vec4 colorPixel = texture( u_image, v_texCoord );
  
  // to modify later if needed
  vec4 colorResult = colorPixel;
  
  // current pixel but in hsv, to compare the values with color ranges
  vec4 colorHSV = vec4( rgb_to_hsv( colorPixel.rgb ), colorPixel.a);


  // for every primary color / color part (max = 9) (won't break if no values found)
  for (int i=0; i< maxcolors; i+=1) {

    // og color in hsv (primary color)
    vec4 colorInHSV = vec4( rgb_to_hsv( colorIn[i].rgb ), colorIn[i].a);
    
    // see the hsv difference comparing the current pixel to the primary color
    vec4 colorDelta = colorHSV - colorInHSV;
    
    if (abs(colorDelta.r)>0.5) colorDelta.r -= sign(colorDelta.r);

    if ( all( lessThanEqual( abs(colorDelta), colorTolerance[i] ) ) ) {

      // this is our desired color
      vec4 tColorOut = colorOut[i];

      if (special == 8) { // THE SUMMIT KRAGG EXPERIENCE
        
        if (i == 0) { // for the first part (Kraggs rock)
  
          // this is the point in absolute pixels where the fade happens
          float effectY = 900.0/1292.0;
  
          if (effectY > v_texCoord.y){
  
            // all pixels above that will be white-ish
            tColorOut.r = 0.81960;
            tColorOut.g = 0.83529;
            tColorOut.b = 0.86667;
  
          } else if (v_texCoord.y < effectY + 16.0 / 1292.0){
  
            // pixels below will be as normal, but with a faded dithered transition
  
            // current coordinates in absolute pixels
            float corx = 1044.0 - v_texCoord.x * 1044.0;
            float cory = 1292.0 - v_texCoord.y * 1292.0;
  
            // some weird math for the dither effect idk
            float t_y = floor(cory * 0.25) * 4.0;
            float t_a = (t_y - 900.0)*0.125;
            float t_dither = (t_a * 4.0);
            float t_x = floor(corx * 0.5) + mod(t_dither, 4.0);
  
            // determines the color blend for the gradient
            t_y = floor((1292.0 - cory) * 0.25) * 4.0;
            t_a = (t_y - 900.0)*0.0625;
  
            // final colors of the pixel
            if (mod(t_x, 4.0) < 2.0){
                tColorOut.r = mix(0.81960,colorOut[i].r,t_a);
                tColorOut.g = mix(0.83529,colorOut[i].g,t_a);
                tColorOut.b = mix(0.86667,colorOut[i].b,t_a);
            }
            
          }

        }

      } else if (special == 12){ // THE DREAMSCAPE FORSBURN EXPERIENCE

        if (i == 5){ // only happens to cloak 2

          // we implemented this one as best as we could i swear
      
          // current coordinates in absolute pixels
          float intX = v_texCoord.x * 1352.0;
          float intY = v_texCoord.y * 1376.0;

          float playerX = 1352.0 - intX;
          float playerY = 1376.0 - intY;
          float fade = 1.0 - clamp((intY - 464.0)/556.0, 0.0, 1.0); //0 at bottom, 1 at top


          float r1 = colorOut[3].r;
          float g1 = colorOut[3].g;
          float b1 = colorOut[3].b;
          float r2 = colorOut[4].r;
          float g2 = colorOut[4].g;
          float b2 = colorOut[4].b;
          float temp_time = 137.0; //random number
          float t_x = floor((playerX - v_texCoord.x) * 0.5);
          float t_y = floor((playerY - v_texCoord.y) * 0.5);
          float modx1 = mod(t_x,64.0);
          float mody1 = mod(t_y,64.0);
          float isStar1 = float((modx1 == 0.0 && mody1 == 0.0) || (modx1 == 32.0 && mody1 == 32.0));
          float shine_value1 = 0.5 + 0.5 * sin(t_y + floor(temp_time*0.04)) * cos(t_x + floor(temp_time*0.02));
          float modx2 = mod(t_x,40.0);
          float mody2 = mod(t_y,40.0);
          float isStar2 = float((modx2 == 8.0 && mody2 == 16.0) || (modx2 == 24.0 && mody2 == 0.0));
          float shine_value2 = 0.5 + 0.5 * cos(t_y - floor(temp_time*0.03)) * sin(t_x - floor(temp_time*0.06));
          
          tColorOut.r = mix((r2-r1)*fade + r1, 1.0, isStar1 * shine_value1 + isStar2 * shine_value2);
          tColorOut.g = mix((g2-g1)*fade + g1, 1.0, isStar1 * shine_value1 + isStar2 * shine_value2);
          tColorOut.b = mix((b2-b1)*fade + b1, 1.0, isStar1 * shine_value1 + isStar2 * shine_value2);
        
        }

      }
      

      vec4 colorOutHSV = vec4( rgb_to_hsv( tColorOut.rgb ), tColorOut.a);
    
      // we will add the hsv difference to the desired color
      // i agree this looks more complicated than it should
      colorResult = mix(
        tColorOut,
        vec4 ( hsv_to_rgb( vec3( mod( colorOutHSV.r + colorDelta.r, 1.0 ),
        clamp( colorOutHSV.g + colorDelta.g, 0.0, 1.0 ),
        clamp( colorOutHSV.b + colorDelta.b, 0.0, 1.0 ) ) ), 
        clamp( tColorOut.a + colorDelta.a, 0.0, 1.0) ),
        blend[i].x
      );
      
      // if the alpha was modified, we will always use the lower of the 2
      colorResult.a = min(colorResult.a, colorPixel.a);

    }
  }

  // the final color to be displayed
  outColor = colorResult;

}
`;

/* 
    colorIn         // original color, array of 4 [rgba] values for each color
    colorOut        // desired color, same as above
    colorTolerance  // color range, array of 4 [hsva] values
        
    // arrays need to have their values on a single array,
    // the GLSL shader will then separate them every 4 values
*/


testGL() // test if the user is actually able to do this
function testGL() {
  if (!document.createElement("canvas").getContext("webgl2")) {
    const infoEl = document.getElementById("noWGL");
    infoEl.parentElement.style.display = "flex";
    infoEl.style.display = "block";
  }
}


// time to create our recolored character!
export class RoaRecolor {

  char;

  gl;
  positionBuffer;
  offset;

  available = true;

  constructor(canvas) {

    // initialize stuff
    this.canvas = canvas;
    this.glLocs = {};
    this.initializeShader();

  }

  /** Starts up the shader values */
  initializeShader() {

    // it's WebGL time, get ready to not understand anything (don't worry i dont either)
    const gl = this.canvas.getContext("webgl2", { premultipliedAlpha: false });

    // create the shader with the text above, then create the program
    const vertexShader = compileShader(gl, gl.VERTEX_SHADER, vertexShaderSource);
    const fragmentShader = compileShader(gl, gl.FRAGMENT_SHADER, fragmentShaderSource);
    const program = createProgram(gl, vertexShader, fragmentShader);

    // look up where the vertex data needs to go.
    const positionAttributeLocation = gl.getAttribLocation(program, "a_position");
    const texCoordAttributeLocation = gl.getAttribLocation(program, "a_texCoord");

    // lookup uniforms
    this.glLocs.resolutionLoc = gl.getUniformLocation(program, "u_resolution");
    this.glLocs.imageLocation = gl.getUniformLocation(program, "u_image");
    // RoA specific uniforms
    this.glLocs.colorInLoc = gl.getUniformLocation(program, "colorIn");
    this.glLocs.colorOutLoc = gl.getUniformLocation(program, "colorOut");
    this.glLocs.colorToleranceLoc = gl.getUniformLocation(program, "colorTolerance");
    this.glLocs.blendLoc = gl.getUniformLocation(program, "blend");
    this.glLocs.specialLoc = gl.getUniformLocation(program, "special");

    // Create a vertex array object (attribute state)
    const vao = gl.createVertexArray();
    // and make it the one we're currently working with
    gl.bindVertexArray(vao);

    // Create a buffer and put a single pixel space rectangle in it (2 triangles)
    const positionBuffer = gl.createBuffer();

    // Turn on the attribute
    gl.enableVertexAttribArray(positionAttributeLocation);

    // Bind it to ARRAY_BUFFER (think of it as ARRAY_BUFFER = positionBuffer)
    gl.bindBuffer(gl.ARRAY_BUFFER, positionBuffer);

    // Tell the attribute how to get data out of positionBuffer (ARRAY_BUFFER)
    const size = 2;          // 2 components per iteration
    const type = gl.FLOAT;   // the data is 32bit floats
    const normalize = false; // don't normalize the data
    const stride = 0;        // 0 = move forward size * sizeof(type) each iteration to get the next position
    const offset = 0;        // start at the beginning of the buffer
    gl.vertexAttribPointer(positionAttributeLocation, size, type, normalize, stride, offset);

    // provide texture coordinates for the rectangle.
    const texCoordBuffer = gl.createBuffer();
    gl.bindBuffer(gl.ARRAY_BUFFER, texCoordBuffer);
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array([
        0.0,  0.0,
        1.0,  0.0,
        0.0,  1.0,
        0.0,  1.0,
        1.0,  0.0,
        1.0,  1.0,
    ]), gl.STATIC_DRAW);

    // Turn on the attribute
    gl.enableVertexAttribArray(texCoordAttributeLocation);

    // Tell the attribute how to get data out of texCoordBuffer (ARRAY_BUFFER)
    gl.vertexAttribPointer(texCoordAttributeLocation, size, type, normalize, stride, offset);

    // Create a texture.
    const texture = gl.createTexture();

    // make unit 0 the active texture uint
    // (ie, the unit all other texture commands will affect
    gl.activeTexture(gl.TEXTURE0 + 0);

    // Bind it to texture unit 0' 2D bind point
    gl.bindTexture(gl.TEXTURE_2D, texture);

    // Set the parameters so we don't need mips and so we're not filtering
    // and we don't repeat at the edges
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.NEAREST);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.NEAREST);

    // Tell it to use our program (pair of shaders)
    gl.useProgram(program);

    // Bind the attribute/buffer set we want.
    gl.bindVertexArray(vao);

    // store to be used outside this function
    this.gl = gl;
    this.positionBuffer = positionBuffer;
    this.offset = offset;

  }

  updateData(char, colIn, colRan, blend, special) {

    this.char = char;
    this.updateColorData(colIn, colRan);
    this.updateBlend(blend);
    this.updateSpecial(special);

  }

  /**
   * Updates the shader color data values
   * @param {Array} colIn - Incoming original color data
   * @param {Array} colRan - Character's color ranges
   */
  updateColorData(colIn, colRan) {

    // create new arrays with the provided data
    const ogCols = Array(36).fill(0); // max of 9 parts * 4 because of rgba
    const colTol = Array(36).fill(0);

    // add a one to the final range so it recolors black borders
    const finalRan = [...colRan];
    finalRan.push(0, 0, 0, 1);

    // add in the new colors
    for (let i = 0; i < colIn.length; i++) {
      ogCols[i] = colIn[i];
    }
    for (let i = 0; i < finalRan.length; i++) {
      colTol[i] = finalRan[i];
    }
    

    // update the shader values
    this.gl.uniform4fv(this.glLocs.colorInLoc, div255(ogCols));
    this.gl.uniform4fv(this.glLocs.colorToleranceLoc, divHSV(colTol));

    // store for later, just in case
    this.colorIn = colIn;
    this.colorTolerance = colRan;

  }

  /**
   * Determines shading blend
   * @param {Boolean} blend - False for regular shading, true for retro
   */
  updateBlend(blend) {

    let finalBlend = [];

    // this is a variable that the shader will use for Early Access colors
    // apparently, the game will also use this value for some character's parts
    // if 0, the color will have no shading
    if (blend) {
      finalBlend = Array(36).fill(0);
    } else {
      finalBlend = Array(36).fill(1);
      if (this.char == "Kragg" || this.char == "Absa") {
        for (let i = 0; i < 4; i++) {
          if (i < 4) {
            if (this.char == "Kragg") {
              // some kragg skins use 1.2 blend, but most of them (including custom
              // skin) use 1.1 so thats what we will use for all of them
              finalBlend[i] = 1.1;
            } else if (this.char == "Absa") {
              finalBlend[i] = 1.2;
            }
          }
        }
      }
    }

    // aaaand make it happen
    this.gl.uniform4fv(this.glLocs.blendLoc, finalBlend);
    
  }

  /**
   * Determines if special shader logic will be used
   * @param {Number} number - Special code
   */
  updateSpecial(number) {
    this.gl.uniform1i(this.glLocs.specialLoc, number);
  }


  /**
   * Updates the shader image to be used
   * @param {String} imgPath - Path to the image to add
   */
  async addImage(imgPath) {

    const skinImg = new Image();
    skinImg.src = imgPath;  // MUST BE SAME DOMAIN!!!
    await skinImg.decode(); // wait for the image to be loaded

    this.canvas.width = skinImg.width;
    this.canvas.height = skinImg.height;

    const gl = this.gl;

    // Upload the image into the texture
    const mipLevel = 0;               // the largest mip
    const internalFormat = gl.RGBA;   // format we want in the texture
    const srcFormat = gl.RGBA;        // format of data we are supplying
    const srcType = gl.UNSIGNED_BYTE; // type of data we are supplying
    gl.texImage2D(gl.TEXTURE_2D, mipLevel, internalFormat, srcFormat, srcType, skinImg);

    // Tell WebGL how to convert from clip space to pixels
    gl.viewport(0, 0, gl.canvas.width, gl.canvas.height);

    // Clear the canvas
    gl.clearColor(0, 0, 0, 0);
    gl.clear(gl.COLOR_BUFFER_BIT | gl.DEPTH_BUFFER_BIT);

    // Pass in the canvas resolution so we can convert from
    // pixels to clipspace in the shader
    gl.uniform2f(this.glLocs.resolutionLoc, gl.canvas.width, gl.canvas.height);

    // Tell the shader to get the texture from texture unit 0
    gl.uniform1i(this.imageLocation, 0);

    // Bind the position buffer so gl.bufferData that will be called
    // in setRectangle puts data in the position buffer
    gl.bindBuffer(gl.ARRAY_BUFFER, this.positionBuffer);

    // Set a rectangle the same size as the image.
    setRectangle(gl, 0, 0, skinImg.width, skinImg.height);

  }

  // this will be called on each paint
  render(colorOut, dl) {

    // if no code is sent, use the original colors
    const finalOut = colorOut ? colorOut : this.colorIn;

    // this is to clean up remaining values from previous codes
    const actualFinalOut = Array(36).fill(0);
    for (let i = 0; i < finalOut.length; i++) {
      actualFinalOut[i] = finalOut[i];
    }
    actualFinalOut[finalOut.length + 3] = 1; // alpha for last value
    
    // Pass in the uniform to the shader
    this.gl.uniform4fv(this.glLocs.colorOutLoc, div255(actualFinalOut));

    // Draw the rectangle.
    const primitiveType = this.gl.TRIANGLES;
    const count = 6;
    this.gl.drawArrays(primitiveType, this.offset, count);

    // to take an image out of a gl canvas, you need to capture it before
    // the main thread has finished, so it can only be done here
    // this will activate when the user downloads the image
    if (dl) {
      document.getElementById(dl).href = this.canvas.toDataURL()
    }

  }

  setAvailable(state) {
    this.available = state;
  }
  
}


// shaders need the rbga values on a [0~1] range
function div255(array) {
  const newArray = [];
  for (let i = 1; i < array.length + 1; i++) {
    if (i % 4 != 0) {
      newArray[i-1] = array[i-1]/255;
    } else {
      newArray[i-1] = array[i-1];
    }
  }
  return newArray;
}
//same for hsva
function divHSV(array) {
  const newArray = [];
  let count = 0;
  for (let i = 0; i < array.length; i++) {
    count++;
    if (count == 1) {
      newArray[i] = array[i]/360;
    } else if (count == 2 || count == 3) {
      newArray[i] = array[i]/100;
    } else {
      newArray[i] = array[i];
      count = 0;
    }
  }
  return newArray;
}

function setRectangle(gl, x, y, width, height) {
  const x1 = x;
  const x2 = x + width;
  const y1 = y;
  const y2 = y + height;
  gl.bufferData(gl.ARRAY_BUFFER, new Float32Array([
     x1, y1,
     x2, y1,
     x1, y2,
     x1, y2,
     x2, y1,
     x2, y2,
  ]), gl.STATIC_DRAW);
}

/**
  * Creates and compiles a shader.
  *
  * @param {!WebGLRenderingContext} gl The WebGL Context.
  * @param {string} shaderSource The GLSL source code for the shader.
  * @param {number} shaderType The type of shader, VERTEX_SHADER or
  *     FRAGMENT_SHADER.
  * @return {!WebGLShader} The shader.
*/
function compileShader(gl, shaderType, shaderSource) {
  // Create the shader object
  const shader = gl.createShader(shaderType);
  
  // Set the shader source code.
  gl.shaderSource(shader, shaderSource);
  
  // Compile the shader
  gl.compileShader(shader);
  
  // Check if it compiled
  const success = gl.getShaderParameter(shader, gl.COMPILE_STATUS);
  if (!success) {
    // Something went wrong during compilation; get the error
    throw "could not compile shader:" + gl.getShaderInfoLog(shader);
  }
  
  return shader;
}

/**
  * Creates a program from 2 shaders.
  *
  * @param {!WebGLRenderingContext) gl The WebGL context.
  * @param {!WebGLShader} vertexShader A vertex shader.
  * @param {!WebGLShader} fragmentShader A fragment shader.
  * @return {!WebGLProgram} A program.
*/
function createProgram(gl, vertexShader, fragmentShader) {
  // create a program.
  const program = gl.createProgram();
  
  // attach the shaders.
  gl.attachShader(program, vertexShader);
  gl.attachShader(program, fragmentShader);
  
  // link the program.
  gl.linkProgram(program);
  
  // Check if it linked.
  const success = gl.getProgramParameter(program, gl.LINK_STATUS);
  if (!success) {
      // something went wrong with the link
      throw ("program filed to link:" + gl.getProgramInfoLog (program));
  }
  
  return program;

};