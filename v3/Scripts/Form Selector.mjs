

const formSelect = document.getElementById("formSelector");

//formSelect.addEventListener("change", () => {charChange(charName)})

/**
 * Gets you the current form (skin type) of the character
 * @returns {String} Form currently selected
 */
export function getCurrentForm() {
    return formSelect.value;
}

/**
 * Updates the form select with a new list of provided options
 * @param {Array} list - List of forms available to the current character
 */
export function updateFormList(list) {
    
    // clear current data
    formSelect.innerHTML = "";

    // add new entries
    addFormEntry("Default");

    // for each skin that has a different recolorable image
    for (let i = 0; i < list.length; i++) {
        addFormEntry(list[i]);
    }

}

/**
 * Adds a new value to the form select
 * @param {String} text - Entry text
 */
function addFormEntry(text) {
    const entry = document.createElement("option");
    entry.text = text;
    entry.value = text;
    formSelect.add(entry);
}