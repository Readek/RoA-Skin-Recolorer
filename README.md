<p align="center">

  <img width="500" src="https://cdn.discordapp.com/attachments/574303886869790730/785638990903509022/unknown.png" alt="Preview">

</p>

<h1 align="center">RoA-Skin-Recolorer</h1>


Uses Rivals of Aether's color codes to return a recolored character image.

Go [here](https://readek.github.io/RoA-Skin-Recolorer/) to try it out.

Recolorer v2 is in the works, go [here](https://readek.github.io/RoA-Skin-Recolorer/v2/) to try it.

Can also recolor any image with the same colors as the character (for example, spritesheets).

**Absa**'s `body` part and **Kragg**'s `rock` part will never give correct values. The game does something specific to those, but I have no idea what.

<!-- **Absa**'s `body` part and **Kragg**'s `rock` part have a non-default ingame blend value (that i cant know of without the source code of the game, so i set them at 120%), meaning that the default render you can see before the first recolor won't have the same colors as the original image. -->

Sometimes, result image will not have 100% correct rgb values respect to the ingame colors (having +-1/+-2 difference). I am not sure why this is happening, but it's generally not visible to the human eye.
