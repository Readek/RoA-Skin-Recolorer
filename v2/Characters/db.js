/* Character Database */
/* "ogColor" values are RGBA, "colorRange" values are HSVA */
/* These values come from the Character Templates on the Workshop */
const db = {
    "chars": [
        {
            name : "Clairen",
            ogColor : [
                65, 54, 80, 1,      // Body
                69, 69, 89, 1,      // Suit
                170, 34, 74, 1,     // Cape
                181, 181, 181, 1,   // Armor
                255, 230, 99, 1,    // Belt
                255, 13, 106, 1,    // Plasma
                0, 255, 247, 1,     // Plasma Tipper
                /* 0, 255, 0, 1     // CSS Highlight (for internal reference) */
            ],
            colorRange : [
                4, 7, 12, 1,        // Body
                6, 5, 17, 1,        // Suit
                4, 7, 25, 1,        // Cape
                4, 1, 25, 1,        // Armor
                13, 18, 15, 1,      // Belt
                24, 60, 30, 1,      // Plasma
                40, 85, 50, 1,      // Plasma Tipper
                /* 0, 0, 0, 1       // CSS Highlight */
            ],
            partNames : ["Body", "Suit", "Cloak", "Armor", "Belt", "Plasma 1", "Plasma 2"],
            idleFC : 6,
            placeholder : "0000-0000-0000-0000-0000-0000-0000-0000-0000-0000-0000"
        },
        {
            name : "Forsburn",
            ogColor : [
                116, 110, 108, 1,   // Cloak
                128, 96, 28, 1,     // Body
                255, 233, 0, 1,     // Yellow Flame
                255, 127, 0, 1,     // Orange Flame
                170, 0, 0, 1,       // Red Flame
                36, 34, 36, 1,      // Dark Cloak
                255, 255, 228, 1    // Skull
            ],
            colorRange : [
                36, 10, 30, 1,      // Cloak
                29, 25, 60, 1,      // Body
                18, 10, 10, 1,      // Yellow Flame
                18, 10, 10, 1,      // Orange Flame
                18, 15, 50, 1,      // Red Flame
                18, 10, 10, 1,      // Dark Cloak
                4, 15, 30, 1        // Skull
            ],
            partNames : ["Cloak 1", "Body", "Fire 1", "Fire 2", "Fire 3", "Cloak 2", "Skull"],
            idleFC : 8,
            placeholder : "0000-0000-0000-0000-0000-0000-0000-0000-0000-0000-0000"
        },
        {
            name : "Zetterburn",
            ogColor : [
                122, 90, 78, 1,     // Body
                220, 203, 105, 1,   // Hands
                255, 233, 0, 1,     // Yellow flame
                255, 127, 0, 1,     // Orange flame
                170, 0, 0, 1        // Red Flame
            ],
            colorRange : [
                36, 30, 40, 1,      // Body
                24, 30, 60, 1,      // Hands
                18, 90, 5, 1,       // Yellow flame
                18, 10, 10, 1,      // Orange flame
                18, 14, 20, 1       // Red Flame
            ],
            partNames : ["Body", "Face", "Fire 1", "Fire 2", "Fire 3"],
            idleFC : 8,
            placeholder : "0000-0000-0000-0000-0000-0000-0000-0000"
        },
        {
            name : "Wrastor",
            ogColor : [
                168, 87, 143, 1,    // Body
                97, 68, 96, 1,      // Hands
                141, 231, 255, 1,   // Scarf
                246, 173, 197, 1,   // Belly
                230, 218, 25, 1     // Beak
            ],
            colorRange : [
                27, 13, 50, 1,      // Body
                18, 15, 30, 1,      // Hands
                27, 30, 50, 1,      // Scarf
                18, 5, 40, 1,       // Belly
                18, 5, 60, 1        // Beak
            ],
            partNames : ["Body", "Hands", "Scarf", "Belly", "Beak"],
            idleFC : 8,
            placeholder : "0000-0000-0000-0000-0000-0000-0000-0000"
        },
        {
            name : "Absa",
            ogColor : [
                120, 121, 161, 1,   // Body
                231, 121, 185, 1,   // Hair
                130, 173, 177, 1,   // Lightning
                187, 155, 143, 1,   // Horns
                214, 215, 244, 1    // Belly
            ],
            colorRange : [
                8, 20, 80, 1,       // Body
                54, 15, 60, 1,      // Hair
                18, 30, 50, 1,      // Lightning
                4, 15, 60, 1,       // Horns
                18, 15, 15, 1,      // Belly
            ],
            partNames : ["Body", "Hair", "Lightning", "Horns", "Belly"],
            idleFC : 24,
            placeholder : "0000-0000-0000-0000-0000-0000-0000-0000"
        },
        {
            name : "Elliana",
            ogColor : [
                213, 128, 87, 1,    // Mech
                150, 156, 145, 1,   // Trim
                175, 145, 200, 1,   // Snek
                157, 212, 84, 1,    // Propellers
                137, 198, 194, 1,   // Weapons
                72, 69, 60, 1       // Clothes
            ],
            colorRange : [
                15, 27, 41, 1,      // Mech
                16, 28, 45, 1,      // Trim
                11, 24, 23, 1,      // Snek
                20, 29, 60, 1,      // Propellers
                8, 23, 19, 1,       // Weapons
                17, 4, 11, 1        // Clothes
            ],
            partNames : ["Mech", "Trim", "Body", "Propellers", "Weapons", "Clothes"],
            idleFC : 7,
            placeholder : "0000-0000-0000-0000-0000-0000-0000-0000-0000-0000"
        },
        {
            name : "Sylvanos",
            ogColor : [
                50, 54, 40, 1,      // Body
                126, 167, 87, 1,    // Leaves
                145, 86, 70, 1,     // Bark (haha)
                196, 44, 69, 1,     // Petals 1
                242, 208, 134, 1    // Petals 2
            ],
            colorRange : [
                4, 5, 8, 1,         // Body
                4, 17, 60, 1,       // Leaves
                4, 15, 31, 1,       // Bark
                10, 8, 34, 1,       // Petals 1
                36, 11, 8, 1,       // Petals 2
            ],
            partNames : ["Body", "Leaves", "Bark", "Petals 1", "Petals 2"],
            idleFC : 8,
            placeholder : "0000-0000-0000-0000-0000-0000-0000-0000"
        },
        {
            name : "Maypul",
            ogColor : [
                113, 155, 111, 1,   // Body
                228, 225, 173, 1,   // Belly
                169, 245, 124, 1,   // Leaf
                65, 62, 55, 1,      // Mark
                195, 135, 101, 1    // Vines
            ],
            colorRange : [
                45, 33, 80, 1,      // Body
                36, 56, 60, 1,      // Belly
                54, 7, 70, 1,       // Leaf
                54, 15, 35, 1,      // Mark
                15, 25, 55, 1       // Vines
            ],
            partNames : ["Body", "Belly", "Leaf", "Marks", "Vines"],
            idleFC : 6,
            placeholder : "0000-0000-0000-0000-0000-0000-0000-0000"
        },
        {
            name : "Kragg",
            ogColor : [
                136, 104, 93, 1,    // Rock
                121, 173, 93, 1,    // Chitin
                213, 216, 221, 1,   // Armor
                60, 36, 36, 1       // Dark Rock
            ],
            colorRange : [
                54, 29, 80, 1,      // Rock
                36, 50, 60, 1,      // Chitin
                27, 20, 65, 1,      // Armor
                0, 0, 0, 1          // Dark Rock
            ],
            partNames : ["Rock", "Skin", "Armor", "Shading"],
            idleFC : 6,
            placeholder : "0000-0000-0000-0000-0000-0000-0000"
        },
        {
            name : "Orcane",
            ogColor : [
                59, 73, 135, 1,     // Body
                205, 247, 247, 1,   // Belly
                0, 255, 0, 1,       // Highlight (golden skin only)
                /* 29, 33, 91, 1    // Dark (not sure what this is for?) */
            ],
            colorRange : [
                18, 30, 40, 1,      // Body
                22, 30, 65, 1,      // Belly
                2, 0, 0, 0,         // Highlight
                /* 3, 0, 0, 0       // Dark */
            ],
            partNames : ["Body", "Belly"],
            idleFC : 8,
            placeholder : "0000-0000-0000-0000",
            actualParts : 2
        },
        {
            name : "Etalus",
            ogColor : [
                251, 250, 252, 1,   // Body
                180, 230, 230, 1,   // Ice
                67, 68, 87, 1,      // Dark Ice
                /* 253, 252, 255, 1,// Ice Change Back?
                251, 250, 252       // Body Go Back?  */
            ],
            colorRange : [
                15, 41, 70, 1,      // Body
                54, 15, 50, 1,      // Ice
                4, 10, 50, 1,       // Dark Ice
                /* 0, 0, 0, 1,      // Ice Change Back?
                0, 0, 0, 1          // Body Go Back?  */
            ],
            partNames : ["Body", "Ice", "Shading"],
            idleFC : 14,
            placeholder : "0000-0000-0000-0000-0000"
        },
        {
            name : "Ranno",
            ogColor : [
                58, 210, 228, 1,    // Body Light
                44, 53, 113, 1,     // Body Dark
                255, 124, 0, 1,     // Pants
                193, 193, 157, 1,   // Bandages
                182, 244, 48, 1,    // Poison
                /* 255, 0, 0, 1,    // CSS Highlight (for internal referencing)
                36, 208, 255, 1     // CSS Highlight (what's actually displayed) */
            ],
            colorRange : [
                44, 62, 50, 1,      // Body Light
                5, 8, 10, 1,        // Body Dark
                18, 5, 45, 1,       // Pants
                22, 11, 30, 1,      // Bandages
                27, 22, 33, 1,      // Poison
                /* 0, 0, 0, 1       //  */
            ],
            partNames : ["Body Light", "Body Dark", "Pants", "Bandages", "Poison"],
            idleFC : 6,
            placeholder : "0000-0000-0000-0000-0000-0000-0000-0000"
        },
        {
            name : "Ori and Sein",
            ogColor : [ // reminder, these are the sprite colors, default palette uses different colors
                243, 235, 253, 1,   // Body 1
                253, 238, 253, 1,   // Body 2
                69, 255, 64, 1,     // Eyes
                93, 203, 241, 1,    // Sein
                255, 200, 33, 1,    // Energy
                /* 255, 0, 0, 1     // CSS Highlight */
            ],
            colorRange : [
                4, 40, 40, 1,       // Body 1
                4, 40, 40, 1,       // Body 2
                54, 40, 10, 1,      // Eyes
                54, 40, 60, 1,      // Sein
                54, 40, 40, 1,      // Energy
                /* 0, 0, 0, 1       // CSS Highlight */
            ],
            partNames : ["Body", "Detail", "Eyes", "Sein", "Energy"],
            idleFC : 8,
            placeholder : "0000-0000-0000-0000-0000-0000-0000-0000"
            /* for reference these are the values for the default skin from the template
                248, 245, 252, 1    // Body 1
                248, 245, 252, 1    // Body 2
                0, 0, 0, 1          // Eyes
                93, 203, 241, 1     // Sein
                255, 200, 33, 1     // Energy
                36, 208, 255, 1     // CSS Highlight (every palette will use this slot)
            */
        },
        {
            name : "Shovel Knight",
            ogColor : [
                58, 210, 228, 1,    // Armor Light
                59, 73, 135, 1,     // Armor Dark
                255, 255, 0, 1,     // Trim
                220, 203, 105, 1,   // Horns
                /* 255, 0, 0, 1,    // CSS Highlight (for internal reference)
                36, 208, 255, 1     // CSS Highlight (what's actually displayed) */
            ],
            colorRange : [
                8, 61, 37, 1,       // Armor Light
                8, 13, 37, 1,       // Armor Dark
                26, 91, 1, 1,       // Trim
                18, 42, 37, 1,      // Horns
                /* 0, 0, 0, 1       // CSS Highlight */
            ],
            partNames : ["Armor Light", "Armor Dark", "Trim", "Horns"],
            idleFC : 6,
            placeholder : "0000-0000-0000-0000-0000-0000-0000"
        },
        {
            name : "Mollo",
            ogColor : [
                171, 106, 152, 1,   // PURPLE FUR
                214, 170, 137, 1,   // TAN FUR
                107, 31, 31, 1,     // RED CLOTH
                74, 55, 76, 1,      // SHIRT
                255, 71, 71, 1,     // BOMBS
                255, 145, 54, 1,    // EMBERS
                41, 0, 46, 1        // EYES?
            ],
            colorRange : [
                7, 5, 15, 1,        // PURPLE FUR
                8, 19, 13, 1,       // TAN FUR
                1, 15, 25, 1,       // RED CLOTH
                3, 22, 16, 1,       // SHIRT
                4, 17, 40, 1,       // BOMBS
                22, 14, 46, 1,      // EMBERS
                2, 36, 27, 1        // EYES?
            ],
            partNames : ["Purple Fur", "Tan Fur", "Red Cloth", "Shirt", "Bombs", "Embers", "Eyes"],
            idleFC : 8,
            placeholder : "0000-0000-0000-0000-0000-0000-0000-0000-0000-0000-0000"
        },
        {
            name : "Hodan",
            ogColor : [
                167, 231, 231, 1,   // FX
                231, 84, 84, 1,     // Skin
                139, 79, 40, 1,     // Pads
                64, 64, 255, 1,     // Towel Main
                255, 255, 128, 1,   // Towel Strip
                242, 249, 251, 1,   // Fur 1
                192, 219, 255, 1,   // Fur 2
                161, 181, 255, 1    // Fur 3
            ],
            colorRange : [
                18, 21, 52, 1,      // FX
                1, 37, 23, 1,       // Skin
                33, 19, 14, 1,      // Pads
                1, 27, 26, 1,       // Towel Main
                1, 1, 1, 1,         // Towel Strip
                1, 1, 1, 1,         // Fur 1
                0, 0, 0, 1,         // Fur 2
                0, 0, 0, 1          // Fur 3
            ],
            partNames : ["FX", "Skin", "Pads", "Towel 1", "Towel 2", "Fur 1", "Fur 2", "Fur 3"],
            idleFC : 8,
            placeholder : "0000-0000-0000-0000-0000-0000-0000-0000-0000-0000-0000-0000-0000"
        },
        {
            name : "Pomme",
            ogColor : [
                233, 190, 224, 1,   // Skin
                99, 41, 76, 1,      // Jacket
                35, 13, 64, 1,      // Outfit
                116, 16, 80, 1,     // Eye
                183, 101, 184, 1,   // Hair
                243, 155, 233, 1    // Effects
            ],
            colorRange : [
                13, 12, 8, 1,       // Skin
                2, 10, 27, 1,       // Jacket
                12, 10, 12, 1,      // Outfit
                14, 14, 25, 1,      // Eye
                18, 4, 24, 1,       // Hair
                1, 12, 3, 1         // Effects
            ],
            partNames : ["Skin", "Jacket", "Outfit", "Eye", "Hair", "Effects"],
            idleFC : 12,
            placeholder : "0000-0000-0000-0000-0000-0000-0000-0000-0000-0000"
        },
        {
            name : "Olympia",
            ogColor : [
                236, 141, 202, 1,   // Gauntlets
                166, 115, 75, 1,    // Fur
                219, 119, 101, 1,   // Tail,Ear
                240, 236, 236, 1,   // Pants
                54, 123, 141, 1,    // Eyes
                255, 249, 249, 1    // Shine (this one overrides some "Pants" colors)

            ],
            colorRange : [
                20, 50, 50, 1,      //Gauntlets
                55, 50, 50, 1,      //Fur
                15, 40, 1, 1,       //Tail/Ear
                10, 1, 50, 1,       //Pants
                10, 75, 40, 1,      //Eye
                5, 5, 0, 1          //Shine
            ],
            partNames : ["Gauntlets", "Fur", "Tail/Ear", "Pants", "Eyes"],
            idleFC : 7,
            placeholder : "0000-0000-0000-0000-0000-0000-0000-0000",
            actualParts : 5
        }

    ]
}