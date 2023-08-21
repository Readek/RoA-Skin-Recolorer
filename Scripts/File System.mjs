/**
 * Returns parsed json data from a local file
 * @param {String} jPath - Path to local file
 * @returns {Object?} - Parsed json object
*/
export async function getJson(jPath) {

    // the browser version
    try {
        return await (await fetch(jPath + ".json")).json();
    } catch (e) {
        console.log(e);
        return null;
    }

}