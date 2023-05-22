

const formSelect = document.getElementById("formSelector");

//formSelect.addEventListener("change", () => {charChange(charName)})

/**
 * Gets you the current form (skin type) of the character
 * @returns {String} Form currently selected
 */
export function getCurrentFormValue() {
    return formSelect.value;
}

/**
 * Gets you the current form (skin type) of the character
 * @returns {String} Form currently selected
 */
export function getCurrentFormName() {
    return formSelect.selectedOptions[0].text;
}

/**
 * Updates the form select with a new list of provided options
 * @param {Array} list - List of forms available to the current character
 */
export function updateFormList(list) {
    
    // clear current data
    formSelect.innerHTML = "";

    // add new entries
    addFormEntry({name: "Default"});

    // for each skin that has a different recolorable image
    for (let i = 0; i < list.length; i++) {
        addFormEntry(list[i]);
    }

}

/**
 * Adds a new value to the form select
 * @param {Object} form - Entry object
 */
function addFormEntry(form) {
    const entry = document.createElement("option");
    entry.text = form.name;
    entry.value = form.useDefault ? "Default" : form.name;
    formSelect.add(entry);
}