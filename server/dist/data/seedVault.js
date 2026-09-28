export const VAULT_MODULES = [
    {
        id: 'vault_space_chandrayaan',
        type: 'SPACE',
        title: 'Chandrayaan-3: Conquering the Lunar South Pole',
        subtitle: 'India\'s historic mission to the water ice craters of the Moon',
        pointsCost: 150,
        badgeAwarded: 'Lunar Pathfinder',
        icon: '🚀',
        accentColor: '#3b82f6',
        summary: 'Explore the rocket science, trajectory mechanics, autonomous hazard detection, and scientific payloads behind Chandrayaan-3.',
        learningOutcomes: [
            'Understand how LVM3 rocket overcame Earth\'s gravitational pull using slingshot orbits',
            'Discover why the Lunar South Pole is the most sought-after location in modern astronomy',
            'Analyze the chemical analysis conducted by the Pragyan rover on sulfur and titanium deposits'
        ],
        sections: [
            {
                heading: '1. The Gravity Slingshot: Orbital Mechanics Made Simple',
                content: `Instead of taking a straight, fuel-heavy blast towards the Moon, ISRO utilized Earth's gravity in a series of five elliptical orbital raises called Earth-Bound Manoeuvres. By firing thrusters at perigee (closest point to Earth), the spacecraft harnessed kinetic momentum like a cosmic slingshot, drastically saving fuel and ensuring mission success.`,
                interactiveFact: 'Chandrayaan-3 traveled over 384,000 kilometers using less total fuel budget than the production cost of many Hollywood sci-fi films!'
            },
            {
                heading: '2. The 15 Minutes of Terror: Autonomous Descent',
                content: `Because radio signals take 1.3 seconds each way to travel between Earth and the Moon, human engineers could not steer the lander during landing. Vikram had to make split-second calculations entirely autonomously using its Laser Altimeters, Lander Hazard Detection and Avoidance Camera (LHDAC), and throttleable liquid engines.`,
                interactiveFact: 'Vikram analyzed thousands of surface pictures per second to avoid craters larger than 30 centimeters.'
            },
            {
                heading: '3. Pragyan\'s Discoveries: Water Ice & Ancient Regolith',
                content: `The Pragyan rover deployed its Laser-Induced Breakdown Spectroscope (LIBS) and Alpha Particle X-ray Spectrometer (APXS). It confirmed the presence of Sulfur, Iron, Calcium, and Chromium, providing vital clues about ancient volcanic activity and subsurface water-ice crucial for future human colonies.`,
                diyActivity: 'Moon Crater Experiment: Fill a flat pan with flour and top with cocoa powder. Drop marbles from different heights to simulate meteorite impact craters and observe the ejecta blanket patterns!'
            }
        ]
    },
    {
        id: 'vault_laws_child_safety',
        type: 'LAWS',
        title: 'Real-Life Civic Rights: Child Safety & POCSO Protections',
        subtitle: 'Know your constitutional rights, digital boundaries, and child safety laws',
        pointsCost: 120,
        badgeAwarded: 'Civic Guardian',
        icon: '⚖️',
        accentColor: '#f59e0b',
        summary: 'A child-friendly, empowering guide to understanding constitutional rights, personal boundaries, the POCSO Act, and safe reporting mechanisms.',
        learningOutcomes: [
            'Recognize safe vs. unsafe physical and digital boundaries',
            'Understand how the POCSO Act and Childline 1098 protect every minor without fear',
            'Learn the difference between Fundamental Rights and Fundamental Duties'
        ],
        sections: [
            {
                heading: '1. The Golden Rule of Body Autonomy: Safe & Unsafe Touch',
                content: `Every child has the absolute right to safety, respect, and dignity. The law explicitly guarantees that your body belongs to you. Safe touch makes you feel loved and protected (like a parent\'s hug or a doctor examining you with a parent present). If anything makes you feel uncomfortable, confused, or frightened, you have the full right to say NO and immediately tell a trusted adult.`,
                interactiveFact: 'Remember the Three-Step Rule: Say NO clearly, GO away from the situation immediately, and TELL a trusted guardian or teacher.'
            },
            {
                heading: '2. Understanding the POCSO Act & Childline 1098',
                content: `The Protection of Children from Sexual Offences (POCSO) Act is a special law passed to ensure the safety and welfare of children under the age of 18. The law makes it mandatory for any adult who suspects harm to report it immediately. It ensures child-friendly courts, confidential statements, and round-the-clock emergency assistance through toll-free helpline 1098.`,
                interactiveFact: 'Childline 1098 is a free, 24/7 emergency phone service available across all of India to protect children in need of care and safety.'
            },
            {
                heading: '3. Digital Safety & Cyber Anti-Bullying Rights',
                content: `The internet is an incredible library for learning, but cyber-bullying, harassment, and unauthorized photo sharing are illegal. Never share your passwords, home address, or school details with online acquaintances. Under digital safety regulations, children have the legal right to have harmful content removed and perpetrators held accountable.`,
                diyActivity: 'Family Safety Code Activity: Create a secret verbal family password with your parents that only you and they know, to verify any unexpected messages or emergency situations!'
            }
        ]
    },
    {
        id: 'vault_science_diy_optics',
        type: 'SCIENCE',
        title: 'Hands-on Science: Optics, Light & Archimedes Buoyancy',
        subtitle: 'Exciting DIY physical science experiments you can build at home',
        pointsCost: 100,
        badgeAwarded: 'Junior Polymath',
        icon: '🔬',
        accentColor: '#10b981',
        summary: 'Turn your kitchen and living room into a physics laboratory. Master light refraction, pinhole cameras, and fluid density buoyancy.',
        learningOutcomes: [
            'Understand how convex lenses bend light rays to create real vs virtual images',
            'Build a working DIY pinhole camera using a cardboard box',
            'Demystify Archimedes\' principle of buoyant force using water and eggs'
        ],
        sections: [
            {
                heading: '1. Build Your Own Pinhole Camera (Camera Obscura)',
                content: `Thousands of years ago, philosophers like Mozi and Alhazen discovered that light travels in straight lines. If you poke a tiny pinhole into an opaque shoe box lined with black paper on the inside and wax paper at the back, an upside-down, colored living picture of the outside world is projected onto the translucent screen!`,
                diyActivity: 'Items needed: A shoebox, aluminum foil, a needle, and parchment/tracing paper. Cut a 2-inch square hole in one end, tape foil over it, pierce with a pin, and watch daylight scenes focus on the other side!'
            },
            {
                heading: '2. The Magic Egg: Archimedes Buoyancy & Density',
                content: `Why does a heavy steel cargo ship float while a tiny steel coin sinks to the bottom? Archimedes realized that any object placed in a fluid experiences an upward buoyant force equal to the weight of fluid it displaces. When you add salt to plain water, you increase the water\'s mass per unit volume (density).`,
                interactiveFact: 'The Dead Sea is nearly 10 times saltier than the ocean, making it almost impossible for human swimmers to sink!'
            },
            {
                heading: '3. Lemon Battery: Chemical to Electrical Energy',
                content: `Zinc and copper metals react with the citric acid in lemons to create a galvanic cell. Electrons flow from the zinc screw through the electrolyte to the copper coin, generating around 0.9 volts of clean electrical potential—enough to power a digital watch or mini LED!`,
                diyActivity: 'Connect 4 lemons in series with galvanized screws and copper pennies to illuminate a small red LED bulb in your classroom!'
            }
        ]
    }
];
