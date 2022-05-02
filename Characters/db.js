/*
    Character Database

    "ogColor" values are RGBA, "colorRange" values are HSVA 

    These values come from the Character Templates on the Workshop

    Some values from the templates were wrong or outdated:
    Kragg: Skin from "121, 173, 93" to "121, 173, 100"
*/

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
                121, 173, 100, 1,   // Chitin
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
                0, 255, 0, 1,       // Highlight
                255, 255, 0, 1      // Highlight Golden
            ],
            colorRange : [
                18, 30, 40, 1,      // Body
                22, 30, 65, 1,      // Belly
                2, 0, 0, 0,         // Highlight
                2, 0, 0, 0          // Highlight Golden
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
                251, 250, 252, 1    // Body Go Back?  */
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
                175, 96, 136, 1,    // Body
                244, 212, 173, 1,   // Fluff
                145, 47, 41, 1,     // Cloth
                74, 53, 76, 1,      // Wings
                255, 71, 71, 1,     // Bombs
                255, 145, 52, 1,    // Embers
                40, 0, 45, 1        // Eyes
            ],
            colorRange : [
                7.2, 6, 30, 1,      // Body
                21.6, 19, 29, 1,    // Fluff
                7.2, 15, 34, 1,     // Cloth
                4.42, 22, 18, 1,    // Wings
                0.72, 33, 46, 1,    // Bombs
                23.4, 14, 46, 1,    // Embers
                3.6, 36, 27, 1      // Eyes
            ],
            partNames : ["Body", "Fluff", "Cloth", "Wings", "Bombs", "Embers", "Eyes"],
            idleFC : 8,
            placeholder : "0000-0000-0000-0000-0000-0000-0000-0000-0000-0000-0000"
        },
        {
            name : "Hodan",
            ogColor : [
                137, 232, 255, 1,   // Steam
                231, 84, 84, 1,     // Body
                139, 79, 40, 1,     // Hands
                82, 82, 235, 1,     // Towel
                255, 220, 66, 1,    // Towel Stripe
                253, 253, 253, 1,   // Fur 1
                201, 220, 232, 1,   // Fur 2
            ],
            colorRange : [
                18, 39, 37, 1,      // Steam
                0.72, 37, 23, 1,    // Body
                11.88, 19, 30, 1,   // Hands
                7.2, 27, 32, 1,     // Towel
                21.6, 5.5, 2, 1,    // Towel Stripe
                0.72, 0.2, 0.2, 1,  // Fur 1
                15.12, 28, 9, 1,    // Fur 2
            ],
            partNames : ["Steam", "Body", "Hands", "Towel", "T. Stripe", "Fur 1", "Fur 2"],
            idleFC : 8,
            placeholder : "0000-0000-0000-0000-0000-0000-0000-0000-0000-0000-0000"
        },
        {
            name : "Pomme",
            ogColor : [
                233, 190, 224, 1,   // Skin
                167, 83, 132, 1,    // Jacket
                103, 49, 137, 1,    // Clothes
                177, 47, 102, 1,    // Eyes
                183, 101, 184, 1,   // Hair
                219, 74, 195, 1     // Music
                
            ],
            colorRange : [
                12.996, 19, 36, 1,  // Skin
                3.996, 26, 37, 1,   // Jacket
                12.024, 26, 37, 1,  // Clothes
                3.6, 1, 1, 1,       // Eyes
                18, 13, 34, 1,      // Hair
                1.872, 48, 16.5, 1  // Music
            ],
            partNames : ["Skin", "Jacket", "Clothes", "Eyes", "Hair", "Music"],
            idleFC : 12,
            placeholder : "0000-0000-0000-0000-0000-0000-0000-0000-0000-0000"
        },
        {
            name : "Olympia",
            ogColor : [
                236, 141, 202, 1,   // Right Crystal
                141, 236, 175, 1,   // Left Crystal
                184, 128, 83, 1,    // Body
                228, 133, 116, 1,   // Tail
                247, 243, 249, 1,   // Pants
                255, 249, 249, 1,   // Shine
                54, 123, 141, 1,    // Eyes
            ],
            colorRange : [
                21.6, 50, 50, 1,     // Crystal Light
                21.6, 50, 50, 1,     // Crystal Dark
                12.6, 15, 36, 1,     // Body
                5.04, 2, 25, 1,      // Tail
                10.8, 6, 50, 1,      // Pants
                5.04, 5, 0, 1,       // Shine
                9.72, 75, 40, 1,     // Eyes
            ],
            partNames : ["R. Crystal", "L. Crystal", "Body", "Tail", "Pants", "Shine", "Eyes"],
            idleFC : 10,
            placeholder : "0000-0000-0000-0000-0000-0000-0000-0000-0000-0000-0000"
        }

    ]
}