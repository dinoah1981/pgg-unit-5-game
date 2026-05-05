/* PGG Unit 5 — How Did the World Get This Way?
 * Game content + question bank + simplified continent geometry.
 * Competency tags follow the Unit 5 standards (5.0, 5.11, 5.12, 5.21, 5.22, 5.31, 5.32, 5.41, 5.42, 5.51, 5.52).
 */

// ---- Map geometry: lng/lat polygons in clockwise order, projected equirectangularly to 900x450 ----
const MAP_W = 900;
const MAP_H = 450;
function projXY(lng, lat) {
  return [(lng + 180) * (MAP_W / 360), (90 - lat) * (MAP_H / 180)];
}

const CONTINENTS = {
  // Each value is an array of [lng, lat] pairs forming a simplified outline.
  // These are intentionally chunky so they stay clearly recognizable at low zoom.
  northAmerica: [
    [-168,65],[-160,71],[-140,72],[-110,73],[-90,72],[-78,72],[-65,60],[-55,52],[-66,45],
    [-71,42],[-75,38],[-78,33],[-80,26],[-83,30],[-89,30],[-94,29],[-97,26],[-92,18],
    [-87,15],[-83,9],[-78,8],[-86,14],[-95,16],[-105,19],[-110,23],[-115,30],[-118,33],
    [-122,38],[-124,46],[-130,55],[-150,60],[-165,60],[-168,65]
  ],
  southAmerica: [
    [-78,11],[-72,12],[-60,9],[-50,1],[-43,-3],[-35,-7],[-39,-15],[-43,-23],[-58,-39],
    [-66,-55],[-72,-52],[-74,-44],[-72,-32],[-71,-18],[-78,-7],[-80,-3],[-80,2],[-78,11]
  ],
  greenland: [
    [-44,60],[-32,60],[-22,68],[-22,76],[-30,83],[-44,82],[-55,77],[-54,68],[-44,60]
  ],
  eurasia: [
    [-9,38],[-9,43],[-1,49],[7,51],[12,55],[8,58],[12,65],[25,71],[40,70],[60,72],
    [80,75],[110,74],[140,73],[170,67],[177,69],[170,62],[160,58],[152,49],[142,46],
    [140,40],[135,35],[126,38],[122,31],[112,23],[108,21],[105,11],[99,7],[97,5],
    [86,11],[80,11],[78,8],[73,16],[70,24],[68,25],[60,25],[56,26],[57,22],[54,18],
    [48,13],[43,12],[35,28],[32,32],[30,38],[24,36],[20,38],[13,38],[9,41],[3,42],
    [-3,36],[-9,38]
  ],
  africa: [
    [-9,32],[10,33],[22,32],[33,31],[36,22],[42,14],[48,11],[51,11],[44,5],[42,0],
    [40,-5],[40,-16],[35,-25],[32,-29],[25,-34],[18,-34],[14,-23],[12,-7],[9,0],
    [9,4],[3,6],[-3,5],[-13,8],[-17,14],[-17,21],[-13,28],[-9,32]
  ],
  australia: [
    [114,-22],[114,-34],[122,-34],[137,-36],[144,-39],[150,-37],[153,-28],[145,-16],
    [138,-12],[132,-11],[122,-16],[114,-22]
  ],
  antarctica: [
    [-180,-78],[-150,-74],[-100,-72],[-60,-77],[-30,-69],[0,-69],[40,-68],[80,-67],
    [120,-67],[160,-74],[180,-78],[180,-85],[-180,-85],[-180,-78]
  ],
  britishIsles: [
    [-5,50],[1,51],[2,53],[-1,55],[0,58],[-5,58],[-8,55],[-10,52],[-5,50]
  ],
  japan: [
    [130,33],[134,35],[140,36],[141,41],[144,44],[142,45],[140,39],[136,35],[131,32],[130,33]
  ],
  madagascar: [
    [43,-12],[50,-16],[50,-25],[44,-25],[43,-20],[43,-12]
  ],
  newZealand: [
    [173,-35],[178,-37],[178,-42],[170,-46],[167,-44],[174,-41],[173,-35]
  ],
  iceland: [
    [-24,63],[-14,63],[-13,66],[-21,67],[-24,63]
  ]
};

// Reference points for the labeled markers shown on the world map (helpful in some chapters).
// id is referenced by chapter content; visible:true means it shows as a small dot+label.
const MAP_LANDMARKS = {
  fertileCrescent: { name: "Fertile Crescent",        lng: 44,  lat: 33 },
  nileValley:      { name: "Nile Valley",             lng: 31,  lat: 26 },
  indusValley:     { name: "Indus Valley",            lng: 70,  lat: 28 },
  yellowRiver:     { name: "Yellow River (Huang He)", lng: 113, lat: 35 },
  yangtze:         { name: "Yangtze River",           lng: 112, lat: 31 },
  greenSahara:     { name: "Sahara",                  lng: 5,   lat: 22 },
  britain:         { name: "Britain",                 lng: -1,  lat: 53 },
  bering:          { name: "Bering Land Bridge",      lng: -170, lat: 65 },
  mesoamerica:     { name: "Mesoamerica",             lng: -96, lat: 17 },
  andes:           { name: "Andean Highlands",        lng: -71, lat: -15 },
  caralSupe:       { name: "Caral-Supe (Peru)",       lng: -77, lat: -10 },
  cahokia:         { name: "Cahokia",                 lng: -90, lat: 38 },
};

// ---- The chapters ----
// step types: 'reading' | 'mcq' | 'timeline' | 'map'
// All scored steps include `competency` for the proof report.

const CHAPTERS = [

  // -------------------------------------------------------------------- 1
  {
    id: "ch1",
    title: "Chapter 1 — The Geologic Story",
    subtitle: "How a 4.5-billion-year-old planet shaped everything that came after.",
    steps: [
      {
        type: "reading",
        title: "Earth is unimaginably old",
        body: `<p>The Earth is roughly <b>4.5 billion years old</b>. If that history were squeezed into a single year, recorded human civilization would only fill the last <b>30 seconds</b> before midnight on December 31.</p>
        <p>For most of that time, Earth looked nothing like today. Around <b>335 million years ago</b>, almost all land was joined into a single supercontinent called <b>Pangaea</b>. Then, slowly, the plates carrying the continents drifted apart — pulling Africa from South America, opening the Atlantic Ocean, raising mountains where plates collided.</p>
        <p>Climate also shifted dramatically. Ice sheets advanced and retreated. The most recent <b>Ice Age ended around 12,000 years ago</b> — and that single event reshaped where humans could live, what plants grew, and what animals were available to hunt.</p>`
      },
      {
        type: "mcq",
        competency: "5.11",
        question: "About how old is the Earth?",
        options: ["About 6,000 years","About 4 million years","About 4.5 billion years","About 14 billion years"],
        correctIdx: 2,
        explanation: "Earth is about 4.5 billion years old. (14 billion is the age of the universe; 4 million is roughly when our hominin ancestors split off; 6,000 is a religious calculation, not a scientific one.)"
      },
      {
        type: "mcq",
        competency: "5.11",
        question: "What was Pangaea?",
        options: [
          "An ancient empire that ruled most of Europe",
          "A single supercontinent that contained almost all of Earth's land",
          "The first city built by humans",
          "A type of dinosaur"
        ],
        correctIdx: 1,
        explanation: "Pangaea was the supercontinent — about 335 million years ago, today's continents were fused together as one giant landmass."
      },
      {
        type: "timeline",
        competency: "5.11",
        prompt: "Drag these moments into order, oldest at the top.",
        items: [
          { label: "Earth forms",                    year: -4500000000 },
          { label: "Pangaea exists as a supercontinent", year: -335000000 },
          { label: "End of the last Ice Age",          year: -10000 },
          { label: "First river civilizations emerge", year: -3500 },
          { label: "Today",                            year: 2026 },
        ],
        explanation: "Earth (4.5 billion years ago) → Pangaea (335 million) → end of last Ice Age (~12,000 years ago) → first river civilizations (~5,500 years ago) → today. Notice how recent recorded human history really is."
      }
    ]
  },

  // -------------------------------------------------------------------- 2
  {
    id: "ch2",
    title: "Chapter 2 — Why There?",
    subtitle: "Civilization didn't appear randomly. Geography stacked the deck.",
    steps: [
      {
        type: "reading",
        title: "The lottery of geography",
        body: `<p>Once the Ice Age ended, humans were spread thinly across the planet. So why did the very first farming villages appear in some places — and not others? The lessons in this unit pointed at a few stubborn factors:</p>
        <ul>
          <li><b>Climate predictability.</b> A river that floods at the same time every year is a gift; a river that floods unpredictably is a disaster. The Nile flooded almost like clockwork from June through September.</li>
          <li><b>Soil fertility.</b> Annual flooding leaves behind <b>silt</b> — fine, nutrient-rich soil. The Fertile Crescent and the Nile both got resupplied this way.</li>
          <li><b>Vegetation type.</b> Open grasslands with wild wheat and barley were a head-start kit for farming. Dense rainforest, despite all its water, was actually a terrible place to start crops.</li>
          <li><b>Domesticable plants and animals.</b> Some species are easy to tame. Many, including most large American mammals, simply are not.</li>
          <li><b>Population depth.</b> The Levant had been continuously inhabited for <b>over 100,000 years</b>. The Americas had been inhabited for only about <b>15,000–20,000</b> years by the end of the Ice Age. More time meant more accumulated knowledge.</li>
        </ul>`
      },
      {
        type: "mcq",
        competency: "5.12",
        question: "Why was the Amazon Basin a poor candidate for the birth of farming, even though it has tons of water?",
        options: [
          "It's too cold for crops to grow.",
          "Dense rainforest blocks sunlight, the soil is thin and acidic, and flooding is unpredictable.",
          "There were no humans living anywhere near it.",
          "There were no rivers there."
        ],
        correctIdx: 1,
        explanation: "Climate alone isn't the answer — the type of vegetation matters. Triple-canopy rainforest blocks the sunlight ground crops need, the soil is surprisingly poor, and Amazonian flooding isn't predictable enough to plant by."
      },
      {
        type: "mcq",
        competency: "5.12",
        question: "Why did the Nile Valley make permanent settlement easy, while the Sahara around 8,000 BCE did not?",
        options: [
          "The Nile flooded predictably each year and left fertile silt; the Sahara was drying out and its lakes were disappearing.",
          "The Sahara was underwater and the Nile was a desert.",
          "The Sahara was already ruled by a single empire.",
          "Egyptians had time machines."
        ],
        correctIdx: 0,
        explanation: "Predictability is the magic word. You can't farm a place where the water is unreliable. The Sahara's grasslands were turning to desert; the Nile flooded the same way every year and rebuilt its soil for free."
      },
      {
        type: "map",
        competency: "5.12",
        prompt: "Click on the <b>Fertile Crescent</b> — the region between the Tigris and Euphrates rivers, where wild wheat and barley grew naturally.",
        targetLng: 44,
        targetLat: 33,
        tolerance: 30,
        explanation: "The Fertile Crescent sweeps from modern-day Iraq up through Syria and into southern Turkey. It's where the wild ancestors of wheat, barley, lentils and chickpeas all grew within walking distance of each other."
      }
    ]
  },

  // -------------------------------------------------------------------- 3
  {
    id: "ch3",
    title: "Chapter 3 — The Neolithic Turning Point",
    subtitle: "When humans stopped chasing food and started growing it.",
    steps: [
      {
        type: "reading",
        title: "The shift that changed everything",
        body: `<p>For most of the human story we were <b>nomadic hunter-gatherers</b>. Small bands followed game animals and ripe wild plants from place to place. Population stayed low. There wasn't much extra time — survival ate the day.</p>
        <p>Then, starting around <b>10,000–9,500 BCE</b> in the Fertile Crescent, something extraordinary happened. People started <b>planting</b> wild grains on purpose. They started <b>taming</b> animals — sheep and goats first, then cattle. They built <b>permanent settlements</b>. We call this the <b>Neolithic Revolution</b>, and it didn't happen all at once: it spread, slowly, region by region, over thousands of years.</p>
        <p>The most important word here is <b>surplus</b>. For the first time, a small number of farmers could grow more food than they themselves needed. That extra — that surplus — fed people who didn't farm: priests, soldiers, scribes, traders, builders. <b>Specialization of labor</b> became possible. Without surplus, none of the rest of human history happens.</p>`
      },
      {
        type: "mcq",
        competency: "5.21",
        question: "Match the term to its meaning. <b>Surplus</b> means…",
        options: [
          "Producing only enough food to barely survive",
          "A person who moves from place to place",
          "Extra resources beyond what is needed to survive",
          "A flood that overflows onto land"
        ],
        correctIdx: 2,
        explanation: "Surplus = extras. Once farmers can grow more than they personally need, others are freed up to do specialized work — and civilization gets unlocked."
      },
      {
        type: "mcq",
        competency: "5.21",
        question: "Which of these is NOT one of the three main developments of the Neolithic Revolution?",
        options: [
          "Farming (growing crops)",
          "Domestication of animals",
          "Permanent settlement",
          "The steam engine"
        ],
        correctIdx: 3,
        explanation: "The steam engine arrived during the Industrial Revolution, thousands of years later. Neolithic = farming + animal domestication + permanent settlement."
      },
      {
        type: "mcq",
        competency: "5.12",
        question: "Why did wheat become a useful crop within ~1,000 years, while corn (from teosinte) took 4,000–6,000 years?",
        options: [
          "Wild wheat already had large, nutritious, easy-to-harvest seeds. Wild teosinte had a tiny, hard cob — humans had to selectively breed it for thousands of years before it was useful.",
          "Wheat farmers were smarter than corn farmers.",
          "Corn was originally a flower, not a grain.",
          "It's a myth — they took the same amount of time."
        ],
        correctIdx: 0,
        explanation: "Available raw materials matter. The Fertile Crescent's wild plants were already 90% of the way to being food crops. The Americas' teosinte was barely edible — turning it into corn was a multi-millennium domestication project."
      },
      {
        type: "timeline",
        competency: "5.0",
        prompt: "Order these milestones from earliest to most recent.",
        items: [
          { label: "Last Ice Age ends",                          year: -10000 },
          { label: "Wheat & barley domesticated in Fertile Crescent", year: -9500 },
          { label: "Maize useful as a food crop in Mesoamerica",    year: -3500 },
          { label: "Scientific Revolution in Europe",              year: 1600 },
          { label: "Industrial Revolution begins in Britain",      year: 1760 },
        ],
        explanation: "Notice the ~6,000-year gap between Old World and New World agriculture — and the much shorter gap between the Scientific and Industrial Revolutions. Innovation accelerates as it builds on itself."
      }
    ]
  },

  // -------------------------------------------------------------------- 4
  {
    id: "ch4",
    title: "Chapter 4 — Rivers & First Civilizations",
    subtitle: "The four cradles where the very first cities appeared.",
    steps: [
      {
        type: "reading",
        title: "Why rivers, every time?",
        body: `<p>Here's something striking: the <b>four earliest civilizations</b> all grew up along big, fertile rivers — and they did it independently, without copying each other.</p>
        <ul>
          <li><b>Nile (Egypt)</b> — Predictable annual flooding deposited rich black silt. Surrounding deserts protected Egypt from invasion. Gave us hieroglyphic writing and the pyramids.</li>
          <li><b>Tigris &amp; Euphrates (Mesopotamia)</b> — The "land between the rivers." Floods were powerful but <b>unpredictable</b>, so people built canals. Few natural barriers meant frequent invasions. Gave us the wheel and the first written code of laws (Hammurabi's Code).</li>
          <li><b>Indus (modern Pakistan / NW India)</b> — Monsoon rains and rich plains. Famous for grid-pattern city planning and early plumbing systems.</li>
          <li><b>Yellow River / Huang He (China)</b> — So prone to catastrophic flooding it was nicknamed <b>"China's Sorrow."</b> The danger forced strong centralized government to coordinate flood control. Gave us early silk production.</li>
        </ul>
        <p>The pattern is the same everywhere: <i>rivers → fertile soil → food surplus → cities → specialization → writing, laws, monumental architecture.</i></p>`
      },
      {
        type: "mcq",
        competency: "5.41",
        question: "Why is the Yellow River nicknamed \"China's Sorrow\"?",
        options: [
          "It's salty and undrinkable.",
          "It frequently floods catastrophically and unpredictably.",
          "It dried up completely 2,000 years ago.",
          "Pirates ruled it for centuries."
        ],
        correctIdx: 1,
        explanation: "The Yellow River's huge silt load and unpredictable flooding could wipe out whole settlements. Managing it required strong, centralized leadership — which shaped Chinese government for thousands of years."
      },
      {
        type: "mcq",
        competency: "5.41",
        question: "Which civilization is most famous for grid-patterned city streets and early plumbing/sewage systems?",
        options: ["Egypt (Nile)","Mesopotamia (Tigris & Euphrates)","Indus Valley","Yellow River (China)"],
        correctIdx: 2,
        explanation: "The Indus cities like Mohenjo-Daro and Harappa were laid out on grids and had remarkably advanced plumbing — features that wouldn't appear again in Europe for thousands of years."
      },
      {
        type: "map",
        competency: "5.12",
        prompt: "Click on the <b>Nile River Valley</b>, where annual flooding made one of the world's earliest civilizations possible.",
        targetLng: 31,
        targetLat: 26,
        tolerance: 28,
        explanation: "The Nile cuts north through Egypt and empties into the Mediterranean. It's the world's longest river — and for thousands of years, almost the entire population of Egypt lived along its narrow green strip."
      },
      {
        type: "map",
        competency: "5.12",
        prompt: "Click on the <b>Indus Valley</b> — site of cities like Mohenjo-Daro and Harappa.",
        targetLng: 70,
        targetLat: 28,
        tolerance: 30,
        explanation: "The Indus runs through modern Pakistan into the Arabian Sea. Its civilization peaked around 2600–1900 BCE, contemporaneous with Egypt's Old Kingdom and Mesopotamian city-states."
      }
    ]
  },

  // -------------------------------------------------------------------- 5
  {
    id: "ch5",
    title: "Chapter 5 — Cities, Specialization & Surplus",
    subtitle: "Why piling humans together changed the rules of the game.",
    steps: [
      {
        type: "reading",
        title: "The compounding power of cities",
        body: `<p>A reliable food surplus created an opening: <b>not everybody had to farm</b>. Some people could specialize. A potter could make pots all day, trading them for the food a farmer grew. Specialists got better at their craft. Better tools and techniques spread.</p>
        <p>As populations clustered, <b>cities</b> appeared. Cities did something villages couldn't: they let strangers exchange ideas. <b>Markets</b> mixed goods from far away. <b>Writing systems</b> meant knowledge no longer died with the person who held it — it could be recorded, copied, and built upon. Each generation didn't have to start over.</p>
        <p>This is the engine. <i>Surplus → cities → specialization → recorded knowledge → faster progress.</i> Everything that came later — the Scientific Revolution, the Industrial Revolution, the modern world — runs on this engine.</p>`
      },
      {
        type: "mcq",
        competency: "5.22",
        question: "What does \"specialization of labor\" mean?",
        options: [
          "Everyone in a city does the same job.",
          "People focus on different specific jobs (potter, scribe, soldier, farmer) and trade with each other.",
          "Only kings are allowed to work.",
          "All work is done by machines."
        ],
        correctIdx: 1,
        explanation: "Specialization is what surplus unlocks. When farmers grow more than they need, other people are freed up to become specialists. Specialists get better, faster, and more inventive at their narrow task."
      },
      {
        type: "mcq",
        competency: "5.41",
        question: "Why does writing matter so much for the long-term progress of human civilization?",
        options: [
          "It allows people to send angry letters.",
          "It lets each generation build on past discoveries instead of having to learn everything from scratch.",
          "It makes people taller.",
          "It only helps with religion, not science."
        ],
        correctIdx: 1,
        explanation: "Writing turns knowledge into something that compounds. You can read what someone wrote 500 years ago and pick up where they left off. Without writing, every generation has to relearn the basics."
      },
      {
        type: "timeline",
        competency: "5.22",
        prompt: "Put the causal chain in order — what comes first?",
        items: [
          { label: "Neolithic Revolution (farming begins)", year: 1 },
          { label: "Food surplus",                          year: 2 },
          { label: "Cities (urbanization)",                 year: 3 },
          { label: "Job specialization",                    year: 4 },
          { label: "Writing & shared knowledge",            year: 5 },
          { label: "Scientific Revolution",                 year: 6 },
        ],
        explanation: "This is the spine of the whole unit: farming → surplus → cities → specialization → recorded knowledge → eventually, a Scientific Revolution. Each step depends on the last."
      }
    ]
  },

  // -------------------------------------------------------------------- 6
  {
    id: "ch6",
    title: "Chapter 6 — The Scientific Revolution",
    subtitle: "When humans stopped trusting authority and started checking for themselves.",
    steps: [
      {
        type: "reading",
        title: "From \"because we said so\" to \"prove it\"",
        body: `<p>For most of human history, when you wanted to know something — why the sun moves, what causes disease, what's at the bottom of the ocean — you asked a religious authority, a philosopher, or simply trusted what people had always believed. Knowledge came from <b>tradition</b>.</p>
        <p>Starting in Europe roughly between <b>1500 and 1700</b>, a different idea took hold: <b>empiricism</b>. The word means <i>knowledge built from real-world observation and evidence</i>. Instead of asking "what does Aristotle say?", you'd ask "what happens when I drop these two cannonballs and time them?"</p>
        <p>This produced the <b>scientific method</b>: observe, form a hypothesis, run an experiment, test, revise. Galileo, Newton, Copernicus, Vesalius — all built on this approach. Crucially, none of it would have happened without the previous 9,000 years of cities, universities, writing, and accumulated knowledge from the Neolithic Revolution. The Scientific Revolution was a <b>continuation</b>, not a fresh start.</p>`
      },
      {
        type: "mcq",
        competency: "5.21",
        question: "What is empiricism?",
        options: [
          "Believing whatever the king says is true.",
          "The idea that knowledge should come from observation and evidence in the real world.",
          "A form of magic.",
          "An ancient religion."
        ],
        correctIdx: 1,
        explanation: "Empiricism = build your understanding from what you can actually observe and test, not from tradition or authority. It's the core idea of the Scientific Revolution."
      },
      {
        type: "mcq",
        competency: "5.22",
        question: "How did the Neolithic Revolution help make the Scientific Revolution possible — thousands of years later?",
        options: [
          "It directly invented the telescope.",
          "It produced the surplus, cities, writing, and accumulated knowledge that scientists later built on.",
          "It had no connection at all.",
          "It taught people Latin."
        ],
        correctIdx: 1,
        explanation: "No farming surplus, no cities. No cities, no universities or specialists. No specialists, no centuries-deep tradition of recorded knowledge. The Scientific Revolution stood on top of a 9,000-year-tall stack."
      }
    ]
  },

  // -------------------------------------------------------------------- 7
  {
    id: "ch7",
    title: "Chapter 7 — Farming to Factories",
    subtitle: "How the industrial age unlocked life-changing benefits — and devastating harms.",
    steps: [
      {
        type: "reading",
        title: "The Industrial Revolution",
        body: `<p>By the mid-1700s, all of these threads — surplus, cities, specialization, scientific method — combined into a new explosion: the <b>Industrial Revolution</b>, starting in <b>Britain</b>. Britain had abundant <b>coal</b>, the necessary capital, scientific institutions, and access to global trade routes. James Watt's improved <b>steam engine</b> (1769) replaced muscle and water with concentrated energy. Later the <b>internal combustion engine</b> did it again with oil.</p>
        <p>The benefits were genuinely staggering: life expectancy roughly doubled in industrialized countries within two centuries. Diseases like cholera and typhoid were defeated through public sanitation reforms. Goods, people, and ideas moved across oceans in days instead of months.</p>
        <p>The harms were just as real. Factories employed children in dangerous conditions — the British <b>Sadler Report (1832)</b> documented kids losing limbs and dying in mills. European industrial powers raced to seize natural resources abroad, partitioning Africa for rubber, minerals, and labor — including the brutal forced-labor system in the <b>Belgian Congo</b>. Industrialization made global inequality far larger than it had ever been.</p>`
      },
      {
        type: "mcq",
        competency: "5.31",
        question: "Which technology, more than any other, defines the start of the Industrial Revolution?",
        options: ["The compass","The steam engine","The internet","The microscope"],
        correctIdx: 1,
        explanation: "The improved steam engine (James Watt, 1769) replaced muscle and water power with concentrated, transportable energy. The internal combustion engine later did the same trick with oil."
      },
      {
        type: "map",
        competency: "5.31",
        prompt: "Click on <b>Britain</b> — where the Industrial Revolution began, fueled by abundant coal.",
        targetLng: -1,
        targetLat: 53,
        tolerance: 22,
        explanation: "Britain had several rare advantages stacked together: deep coal seams close to navigable rivers, a strong scientific community, capital from global trade, and political stability. That combination is why industrialization started there first."
      },
      {
        type: "mcq",
        competency: "5.32",
        question: "Industrialization brought benefits AND harms. Which of these is a HARM the unit lessons emphasized?",
        options: [
          "Cleaner air over major cities",
          "Longer hand-written letters",
          "Brutal child labor in factories and forced labor in colonies (e.g., the Belgian Congo)",
          "The invention of pizza"
        ],
        correctIdx: 2,
        explanation: "The Sadler Report exposed industrial child labor in Britain. King Leopold's rule of the Congo Free State enslaved Congolese workers to harvest rubber, with amputations as punishment. Industrial progress and human suffering were tightly intertwined."
      },
      {
        type: "timeline",
        competency: "5.32",
        prompt: "Order the causal chain that runs from Neolithic farming all the way to industry.",
        items: [
          { label: "Agriculture",       year: 1 },
          { label: "Specialization",    year: 2 },
          { label: "Scientific discovery", year: 3 },
          { label: "Industrialization", year: 4 },
          { label: "Urbanization (modern factory cities)", year: 5 },
        ],
        explanation: "Farming → specialization → systematic science → industrial production → modern cities crowded with factory workers. Each link enabled the next."
      }
    ]
  },

  // -------------------------------------------------------------------- 8
  {
    id: "ch8",
    title: "Chapter 8 — Cultural Dominance",
    subtitle: "Why some cultures, languages and religions ended up everywhere — and others didn't.",
    steps: [
      {
        type: "reading",
        title: "The chain from surplus to global reach",
        body: `<p>Notice the same engine running again. <b>Surplus</b> made <b>cities</b> possible. Cities became hubs for <b>trade</b>. Trade routes brought <b>sustained contact</b> between distant societies. Sustained contact, very often, eventually led to <b>conquest</b>.</p>
        <p>Whichever cultures sat on top of richer agricultural surpluses — and later, on top of industrial military and shipping technology — projected their languages, religions, and political institutions outward. After about <b>1500 CE</b>, European powers used ships, gunpowder, and disease to spread their cultures across the entire planet, and to disrupt or destroy many local ones.</p>
        <p>This is why English, Spanish, French and Portuguese are spoken on continents where they didn't originate. It's not because those cultures were "better." It's because they happened to be sitting at the front of the geography-and-technology chain when the global era opened.</p>`
      },
      {
        type: "timeline",
        competency: "5.42",
        prompt: "Order this causal chain that explains how some cultures spread globally.",
        items: [
          { label: "Food surplus",       year: 1 },
          { label: "Cities",             year: 2 },
          { label: "Trade",              year: 3 },
          { label: "Sustained contact between societies", year: 4 },
          { label: "Conquest & cultural dominance", year: 5 },
        ],
        explanation: "Surplus → cities → trade → contact → conquest. This same chain explains why European languages and religions spread globally after 1500 — it wasn't superiority; it was timing and geographic luck compounding for thousands of years."
      },
      {
        type: "mcq",
        competency: "5.42",
        question: "Why do so many people in the Americas, Africa, and parts of Asia speak European languages today?",
        options: [
          "Because European cultures are inherently better.",
          "Because the chain of geography → surplus → ships → industry put European powers ahead at the moment global travel and conquest became possible after about 1500.",
          "Because Europeans invented all languages.",
          "It's a random coincidence."
        ],
        correctIdx: 1,
        explanation: "It's the long chain of geographic luck and accumulated technology — not cultural superiority. Different starting positions on the geography lottery rippled forward into very unequal global outcomes."
      }
    ]
  },

  // -------------------------------------------------------------------- 9 — Americas parallel
  {
    id: "ch9",
    title: "Chapter 9 — Meanwhile, in the Americas",
    subtitle: "The same story played out — just thousands of years later, and shaped by very different raw materials.",
    steps: [
      {
        type: "reading",
        title: "A parallel revolution, on a delay",
        body: `<p>Humans first reached the Americas across the <b>Bering Land Bridge</b> roughly <b>15,000–20,000 years ago</b> — only after the Old World had already been continuously inhabited for over 100,000 years.</p>
        <p>So when the Ice Age ended, people in the Americas were still relatively new arrivals, with thinner populations and shallower local knowledge. They also had much rougher raw material to work with: <b>teosinte</b> (corn's wild ancestor) had a tiny, almost inedible cob and took 4,000–6,000 years of careful selective breeding to become useful corn. There were no horses, no cattle, no wild sheep — the largest domesticable American animal was the <b>llama</b>, useful as a pack animal but too small to pull a plow.</p>
        <p>And yet — same playbook. Surplus emerged. Permanent settlements emerged. Cities emerged.</p>
        <ul>
          <li><b>Caral-Supe (modern Peru, ~2600 BCE)</b> — among the oldest known cities in the Americas, contemporaneous with the Egyptian pyramids.</li>
          <li><b>Olmec (~1500 BCE), Maya (~250 CE), Aztec (~1300 CE)</b> — successive Mesoamerican civilizations centered on maize agriculture.</li>
          <li><b>Inca (~1400 CE)</b> — ran the largest empire in pre-Columbian America from the Andes, without writing or wheels but with a sophisticated road system and quipu knot records.</li>
          <li><b>Cahokia (~1050 CE, near modern St. Louis)</b> — at its peak, larger than London at the same date.</li>
        </ul>
        <p>The Americas weren't "behind" because of any difference in human ability. They were on a delay because of <b>geography</b> — late arrival, fewer domesticable species, megafauna extinctions around 10,000 BCE that disrupted hunting before farming could fully take root.</p>`
      },
      {
        type: "mcq",
        competency: "5.12",
        question: "Why did civilization in the Americas develop a few thousand years AFTER civilization in the Old World?",
        options: [
          "Because Americans were less intelligent.",
          "Because humans arrived in the Americas tens of thousands of years later, and the available plants and animals were much harder to domesticate.",
          "Because the Americas had no rivers.",
          "Because of the Inca calendar."
        ],
        correctIdx: 1,
        explanation: "Geography, not ability. Humans got to the Americas later, with shallower local knowledge, and faced harder raw materials (teosinte instead of wheat; no horses or cattle). Same revolution — different starting conditions, different timeline."
      },
      {
        type: "mcq",
        competency: "5.21",
        question: "What was the largest animal in the Americas that humans could domesticate?",
        options: ["The horse","The bison","The llama","The aurochs"],
        correctIdx: 2,
        explanation: "Llamas (~250 lbs) could carry small loads but couldn't be ridden or pull a plow. Compare that to the Old World's horses, cattle, donkeys — and you see why farming scaled up much faster on the Eurasian side."
      },
      {
        type: "map",
        competency: "5.12",
        prompt: "Click on <b>Mesoamerica</b> — the region where maize was domesticated and the Olmec, Maya, and Aztec civilizations rose.",
        targetLng: -96,
        targetLat: 17,
        tolerance: 28,
        explanation: "Mesoamerica covers southern Mexico and parts of Central America. This is where the long, slow domestication of teosinte into corn finally produced enough surplus for major cities."
      },
      {
        type: "map",
        competency: "5.12",
        prompt: "Click on the <b>Andean Highlands</b> — where the Inca empire later flourished and where potatoes and llamas were first domesticated.",
        targetLng: -71,
        targetLat: -15,
        tolerance: 28,
        explanation: "The Andes run down the western spine of South America. Highland farming there produced potatoes, quinoa, and the llama — the foundation for the Inca, who built the largest empire in pre-Columbian America."
      }
    ]
  },

  // -------------------------------------------------------------------- 10 — preview only, untested
  {
    id: "ch10",
    title: "Chapter 10 — What's Next (preview)",
    subtitle: "These are the political consequences of the chain — coming up in the next lessons.",
    steps: [
      {
        type: "reading",
        title: "Where the same engine takes us next",
        body: `<p>You've reached the edge of what we've covered so far. The next two big competencies of this unit (5.51 and 5.52) extend the same causal chain into the political world. You haven't been graded on these yet — this is just a heads-up:</p>
        <ul>
          <li><b>5.51</b> — Agricultural surplus didn't just create cities. It also created <b>rulers, taxation, armies, written laws, and social hierarchies</b> — the seeds of organized states.</li>
          <li><b>5.52</b> — After 1500 CE, when industrializing European states started competing with each other, that competition produced <b>colonialism</b> and ultimately the modern <b>nation-state system</b>: the borders, governments, and patterns of power and inequality you see on a world map today.</li>
        </ul>
        <p>The same engine — surplus → cities → trade → conquest — is also: surplus → rulers → laws → states → empires → today's political map. That's where the unit goes next.</p>`
      }
    ]
  }

];

// ----- Final synthesis question shown after Ch10 — also scored -----
const FINAL_SYNTHESIS = [
  {
    type: "mcq",
    competency: "5.0",
    question: "Looking across the whole story, what single best summarizes the answer to \"how did the world get this way?\"",
    options: [
      "One culture invented everything that mattered, and everyone else copied them.",
      "Geography, technology, economics, and culture compounded over thousands of years — small early advantages snowballed into huge later differences.",
      "It was all an accident with no patterns.",
      "Modern science was the only thing that mattered."
    ],
    correctIdx: 1,
    explanation: "That's the central thesis of the unit. The world we live in is the product of many overlapping histories — geologic, technological, economic, cultural — compounding over very long timescales. None of it was inevitable, but none of it was random either."
  }
];

// Public exports onto window for app.js to grab
window.GAME_DATA = {
  CHAPTERS,
  FINAL_SYNTHESIS,
  CONTINENTS,
  MAP_LANDMARKS,
  MAP_W,
  MAP_H,
  projXY
};
