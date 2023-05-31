const codePresetSelect = document.getElementById("codePresetSelector");

codePresetSelect.addEventListener("change", codeChange);

function codeChange() {
    
}

/**
 * Gets you the current skin select value
 * @returns {String} Skin currently selected
 */
export function getSkinSelectValue() {
    return codePresetSelect.value;
}

/**
 * Updates the skin select with a new list of provided options
 * @param {Array} list - List of skins available to the current character
 */
export function updateSkinList(list) {
    
    // clear current data
    codePresetSelect.innerHTML = "";

    // for each skin in the list
    for (let i = 0; i < list.length; i++) {
        addSkinEntry(list[i]);
    }

}

/**
 * Adds a new value to the skin select
 * @param {Object} form - Entry object
 */
function addSkinEntry(form) {
    const entry = document.createElement("option");
    entry.text = form.name;
    entry.value = form.name;
    codePresetSelect.add(entry);
}