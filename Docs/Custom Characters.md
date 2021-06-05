<h1 align="center">Custom Characters</h1>

<p align="center"><a href="https://github.com/Readek/RoA-Skin-Recolorer/blob/main/Docs/Game Codes.md">Game Codes</a> - <a href="https://github.com/Readek/RoA-Skin-Recolorer/blob/main/Docs/Custom Skins.md">Custom Skins</a> - Custom Characters - <a href="https://github.com/Readek/RoA-Skin-Recolorer/blob/main/Docs/Stages.md">Stages</a></p>


In the character creator, you can upload the portrait (or any image really) of your character, as well as any srpitesheet you want. You can find these files where you would normally place them for Steam's Workshop (that is: `[steam folder]/steamapps/workshop/content/383980/`).

Spritesheets will automatically animate, taking the last 2 or 1 characters of the filename as the sprite count (like the game does). If your spritesheet doesn't have numbers at the end, you can manually set the sprite count in the recolorer.

Let's use Guadua as an example. Here you have some example images to work with:

<p align="center">

  <img src="https://github.com/Readek/RoA-Skin-Recolorer/blob/main/Docs/Resources/Characters/Guadua/portrait.png" alt="Guadua Portrait">

</p>

<p align="center">

  <img src="https://github.com/Readek/RoA-Skin-Recolorer/blob/main/Docs/Resources/Characters/Guadua/idle_strip8.png" alt="Guadua Idle Spritesheet">

</p>

Colors follow the same logic as the file you would find in your character's folder at `scripts/colors.gml`. The recolorer uses the same shader, after all.

For the Original Colors, use the same values found in `set_color_profile_slot(0, [part num], [r], [g], [b])`:

<p align="center">

  <img src="https://github.com/Readek/RoA-Skin-Recolorer/blob/main/Docs/Resources/Misc/Guadua OC colorsgml.png" alt="Guadua's Original Colors">

</p>

<p align="center">

  <img src="https://github.com/Readek/RoA-Skin-Recolorer/blob/main/Docs/Resources/Misc/Guadua OC recolorer.png" alt="Guadua's Original Colors">

</p>

For Color Ranges, look for the values found in `set_color_profile_slot_range([part num], [h], [s], [v])`:

<p align="center">

  <img src="https://github.com/Readek/RoA-Skin-Recolorer/blob/main/Docs/Resources/Misc/Guadua CR colorsgml.png" alt="Guadua's Original Colors">

</p>

<p align="center">

  <img src="https://github.com/Readek/RoA-Skin-Recolorer/blob/main/Docs/Resources/Misc/Guadua CR recolorer.png" alt="Guadua's Original Colors">

</p>

With that, you should be able to change the colors of your character. You can skip looking for those values for next times using the OC/CR codes displayed below the editor. For example, these are Guadua's codes that were generated after setting the colors and ranges:

OC - `336834-B2CD98-88685D`

CR - `140B13-031712-020923`

To use them, just click on the codes below the editor and paste the 2 codes above.

---

And just because I didnt really have a better place to put this, here's some codes for "existing" characters from the game in case you wanna have fun with those:

<h2>Bradshaw</h2>

<p align="center">

  <img src="https://github.com/Readek/RoA-Skin-Recolorer/blob/main/Docs/Resources/Characters/Wrastor/Bradshaw.png" alt="Bradshaw">

</p>

OC - `247579-2C4874-E6DA19-BBE7C8-595253`

CR - `1B1732-120F1E-1B1E32-1D0528-12053C`

- TODO ragnir, ayala