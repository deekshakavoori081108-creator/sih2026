export interface StoryChapterData {
  chapterNumber: number;
  title: string;
  topic: string;
  narrativeText: string;
  culturalContext: string;
  cliffhanger: string;
  teaserForNextLevel: string;
  interactiveChoices: string[];
}

export const CURATED_STORIES: Record<string, StoryChapterData[]> = {
  'Ramayana & Epics': [
    {
      chapterNumber: 1,
      title: 'The Whispering Forest of Dandaka',
      topic: 'Ramayana & Epics',
      narrativeText: `The dense canopy of the Dandakaranya forest filtered the afternoon sunlight into streaks of radiant emerald and gold. Prince Rama walked with calm, measured grace along the mossy path, his great Kodanda bow slung effortlessly across his shoulder. Beside him, Devi Sita observed the harmony of the jungle—deer grazing peacefully by lotus-filled brooks and rishis chanting sacred verses in humble hermitages.

Behind them, Lakshmana kept keen watch, his hand resting lightly on the hilt of his sword. For years, the sages had lived in anxiety due to disruptive forces disturbing their quiet pursuit of knowledge and astronomy. As evening approached, the hermit Sage Agastya welcomed the royal travelers to his ashrama. The venerable sage presented Rama with divine instruments of light and defense, forged with celestial wisdom.

"O Rama," Agastya spoke, his voice resonating with ancient peace. "True strength does not lie in the power to dominate, but in the restraint to protect the innocent and uphold the cosmic balance of Dharma. But remember, the greatest challenges test not your weapons, but your compassion and patience."

As the sage completed his blessing, a sharp hush fell across the forest. The birds suddenly ceased their evening chorus. From the deep shadows of the northern ridge, a faint golden luminescence began to pulse through the trees.`,
      culturalContext: 'Dandakaranya symbolizes self-discipline, resilience in adversity, and the sanctity of environmental coexistence celebrated in Vedic philosophy.',
      cliffhanger: 'Rama and Lakshmana stepped forward as a creature unlike any they had ever seen emerged from the mist—a deer with a coat that shimmered like pure molten gold and horns sparkling with diamonds. But as Sita drew near in wonder, the golden deer looked directly into Rama\'s eyes and whispered an ancient riddle in clear human speech!',
      teaserForNextLevel: 'What secret warning did the golden deer speak? Complete 2 more mini-game levels to unlock Chapter 2: The Enigma of the Golden Mirage!',
      interactiveChoices: [
        'Attempt to communicate with the enigmatic deer using the language of forest sages',
        'Inspect the surrounding foliage for hidden illusions or deceptive mirages',
        'Consult Sage Agastya\'s astronomical star-chart for impending omens'
      ]
    },
    {
      chapterNumber: 2,
      title: 'The Bridge of Floating Stones',
      topic: 'Ramayana & Epics',
      narrativeText: `The roaring southern ocean lashed against the rocky cliffs of Rameshwaram, its deep blue waves foaming with unrestrained fury. Across the vast waters lay the island citadel of Lanka, where the noble ideals of righteousness hung in the balance. Before the mighty sea stood Prince Rama, his hands folded in reverent meditation, seeking passage through peaceful communion with nature.

When three days passed without concession, the young vanara engineers Nala and Nila stepped forward. Trained in the architectural arts of their divine forefather Vishwakarma, they examined the porous volcanic basalt and sandstone boulders along the coastline.

"Every stone bears weight," Nila proclaimed, holding up a porous coral boulder. "Yet when infused with the supreme vibration of Truth and unity, the law of buoyancy bends to our collective will!"

With boundless energy, millions of forest workers and even a tiny brown squirrel carrying small pebbles banded together. Boulder after boulder was inscribed with sacred glyphs and placed into the surging foam. Miraculously, the heavy stones did not sink; they floated, interlocking into a stable, gleaming highway of stone across the cerulean expanse.`,
      culturalContext: 'The building of Rama Setu teaches teamwork, civil engineering principles of buoyant density, and the dignity of every contribution, immortalized by the story of the diligent squirrel.',
      cliffhanger: 'Just as the final keystone was lowered into the ocean, the waters beneath the center of the bridge began to boil violently into a giant whirlpool. A colossal metallic trident surfaced from the abyss, holding a glowing crystalline orb that cast an eerie scarlet glow across the sky!',
      teaserForNextLevel: 'Who commands the depths beneath Rama Setu? Triumph in 2 mini-games to unlock Chapter 3: The Guardian of the Ocean Trench!',
      interactiveChoices: [
        'Dive into the swirling waters to examine the submerged ocean mechanism',
        'Form a defensive shield with the vanara engineers using magnetic stones',
        'Summon the water sages to interpret the ancient crest on the trident'
      ]
    }
  ],
  'Indus Valley Civilization': [
    {
      chapterNumber: 1,
      title: 'The Secret Cistern of Mohenjo-daro',
      topic: 'Indus Valley Civilization',
      narrativeText: `The morning mist lifted over the baked-brick avenues of Mohenjo-daro, revealing an architectural triumph four and a half thousand years ahead of its time. High atop the western citadel stood young apprentice architect Tara, holding a graduated measuring rod made of polished ivory and shell.

Below her stretched the great city: streets laid out in a precise north-south and east-west grid, houses built with standardized kiln-fired bricks conforming to the golden 1:2:4 ratio, and underground terracotta drains covered with removable limestone inspection slabs for civic maintenance. There were no towering palace fortresses or displays of imperial vanity—instead, the city celebrated communal wells, public baths, and shared civic granaries.

Tara was tasked by the municipal water master with inspecting the foundation vaults of the Great Bath. As she descended the smooth gypsum-mortared brick staircase into the drained reservoir, her fingertips brushed against a watertight bitumen layer applied millennia ago to prevent seepage.

Suddenly, her ivory rod tapped against an unusual hollow stone at the lowest drainage conduit—a stone marked with the carved seal of an unknown mythical beast.`,
      culturalContext: 'Harappan civilization was built on egalitarian civic planning, sophisticated public hygiene, standardized trade metrics, and peaceful coexistence rather than military conquest.',
      cliffhanger: 'As Tara applied gentle pressure to the stone, a concealed counterweight shifted with a low rumble. The floor beneath the conduit slid backward, revealing a secret descending tunnel filled with glowing terracotta oil lamps that had just automatically ignited!',
      teaserForNextLevel: 'What ancient hydraulic secret lies beneath the Great Bath? Play 2 mini-games to unlock Chapter 2: The subterranean Archive of Lothal!',
      interactiveChoices: [
        'Step cautiously into the illuminated subterranean corridor with a bronze stylus',
        'Alert the city council elders and return with municipal surveyors',
        'Record the mysterious seal impression on a fresh wet clay tablet'
      ]
    }
  ],
  'Ancient Egypt & Mesopotamia': [
    {
      chapterNumber: 1,
      title: 'The Riddle of the Black Stele',
      topic: 'Ancient Egypt & Mesopotamia',
      narrativeText: `The twilight sky over the river Euphrates turned the color of hammered copper. In the great scribal academy of Babylon, young scribe Samir sat cross-legged, smoothing moist river clay with a triangular wooden reed called a cuneus. All around him, fellow scholars inscribed economic receipts, astronomical calculations, and legal charters.

At the center of the royal plaza stood the famous monument: a seven-foot tall stele of black volcanic diorite, upon which King Hammurabi had commanded 282 legal decrees to be engraved in crisp Akkadian cuneiform. The laws declared protection for widows, fair wages for laborers, and severe accountability for careless builders whose structures harmed citizens.

Samir\'s master, the chief archivist, gestured to the very base of the stele. "Look closely at the foundation symbols, Samir. While ordinary eyes see only legal proclamations, the master stonecutters hid the astronomical keys to predicting the great river inundations."

As Samir held his oil lamp closer to examine the microscopic foundation wedges, he noticed that the cuneiform signs were not static. The basalt surface was composed of interlocking mechanical rings.`,
      culturalContext: 'Mesopotamian law codes and cuneiform writing established early precedents for written contracts, civic accountability, and mathematical astronomy.',
      cliffhanger: 'The innermost basalt ring suddenly clicked into alignment. A thin ray of lunar light beamed through the temple aperture, striking the center of the stele and projecting a constellation star-map onto the scribal courtyard wall—one that revealed a hidden chamber inside the Temple of Marduk!',
      teaserForNextLevel: 'What star map did Hammurabi conceal? Win 2 mini-game challenges to unlock Chapter 2: The Sky-Watchers of the Ziggurat!',
      interactiveChoices: [
        'Transcribe the luminous stellar coordinates onto a clay cylinder',
        'Follow the alignment of the moonbeam toward the ziggurat gate',
        'Decode the mathematical equation inscribed within the constellation lines'
      ]
    }
  ],
  'Space Exploration': [
    {
      chapterNumber: 1,
      title: 'Touchdown on the South Pole',
      topic: 'Space Exploration',
      narrativeText: `Mission Operations Complex (MOX) at ISRO Telemetry, Tracking and Command Network in Bengaluru was wrapped in pin-drop silence. Hundreds of scientists and telemetry engineers stared at giant telemetry screens displaying the altitude trajectory of the Vikram lander, descending towards the southern polar highlands of the Moon.

Fifteen years of perseverance, failures overcome, and relentless innovation led to this very moment. The rough braking phase had ended flawlessly. The lander\'s Hazard Detection and Avoidance Cameras scanned the boulder-strewn lunar regolith 100 meters below, searching for a level landing site near crater Manzinus C.

"Touchdown thrusters cut off! Velocity zero!" the mission director announced, his voice trembling before the room erupted into cheers of historic triumph. India had become the first civilization in human history to land a scientific payload in the frigid, cratered South Pole of the Moon.

Within hours, the ramp deployed and the Pragyan rover rolled onto the silvery soil, leaving the national emblem and ISRO logo embossed in the eternal lunar dust. Its Laser-Induced Breakdown Spectroscope (LIBS) immediately began firing micro-pulses at the surface rocks.`,
      culturalContext: 'Space exploration inspires youth in scientific inquiry, international cooperation, and STEM breakthroughs that solve Earth\'s energy and resource challenges.',
      cliffhanger: 'The LIBS spectrometer returned an unmistakable chemical fingerprint: deep beneath the regolith lay an anomalous crystalline structure of pure elemental titanium encasing a strange geothermal heat signature that was steadily rising!',
      teaserForNextLevel: 'What did Pragyan uncover in the lunar ice? Clear 2 mini-games to unlock Chapter 2: The Echoes of the Shackleton Crater!',
      interactiveChoices: [
        'Direct Pragyan\'s alpha particle X-ray spectrometer toward the anomaly core',
        'Transmit high-definition thermal imaging back to the Deep Space Network',
        'Command the rover to initiate deep seismic pulse diagnostics'
      ]
    }
  ]
};

export function getCuratedChapter(topic: string, chapterNumber: number): StoryChapterData {
  const chapters = CURATED_STORIES[topic] || CURATED_STORIES['Ramayana & Epics'];
  const found = chapters.find(c => c.chapterNumber === chapterNumber);
  if (found) return found;

  // Dynamically generate a rich structured fallback chapter if higher chapter number
  return {
    chapterNumber,
    title: `The Mystery of ${topic} — Chronicle ${chapterNumber}`,
    topic,
    narrativeText: `The journey across the great horizons of ${topic} deepened as new revelations emerged. Guided by ancient wisdom and courageous resolve, our seekers uncovered forgotten manuscripts preserved within subterranean vaults. Each line of text revealed how previous generations harmonized ethical philosophy with scientific ingenuity.

Through persistent trials, the seekers learned that every historical era faced pivotal moments where greed clashed with justice, and superstition was conquered by reasoned inquiry. With each puzzle solved, their bond strengthened, illuminating path markers carved into the living rock of ancient sanctuaries.

Yet, true knowledge requires testing. As the grand archway of the inner sanctum slowly opened under the light of aligned celestial bodies, an intricate mechanism hummed to life.`,
    culturalContext: `Learning civilizational history fosters cultural pride, critical thinking, and the realization that ethics and technological curiosity have always advanced human prosperity hand in hand.`,
    cliffhanger: `At the center of the dais stood an ancient pedestal bearing three illuminated puzzle spheres. As their hands approached, a voice echoed through the stone hall: "Choose the seal of Wisdom, of Compassion, or of Truth—for the wrong choice seals this doorway forever!"`,
    teaserForNextLevel: `Which seal opens the inner vault? Conquer 2 more mini-game levels to unlock Chapter ${chapterNumber + 1}!`,
    interactiveChoices: [
      'Analyze the geometric carving on the Seal of Wisdom',
      'Examine the ancient inscriptions along the Seal of Truth',
      'Test the resonance of the Seal of Compassion with a tuning frequency'
    ]
  };
}
