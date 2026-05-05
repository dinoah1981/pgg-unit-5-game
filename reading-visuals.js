/* Second-pass reading visual layer.
   Adds chapter-scene cards to reading screens only; it does not alter gameplay logic or scoring. */
(function () {
  "use strict";

  const GD = window.GAME_DATA;
  if (!GD || !Array.isArray(GD.CHAPTERS)) return;

  const scenes = {
    ch1: {
      kicker: "Geologic lens",
      title: "Human history is the final blink.",
      big: "The point is scale: continents, climates, and ice ages shaped the stage long before written history began.",
      lens: "As you read, separate Earth-time from human-time. The story is ancient, but civilization is extremely recent.",
      chips: ["4.5B-year Earth", "Pangaea", "Ice Age ends"],
      art: "time"
    },
    ch2: {
      kicker: "Geography lens",
      title: "Civilization did not appear randomly.",
      big: "Early agriculture depended on a rare bundle: reliable water, fertile soil, useful wild species, and accumulated local knowledge.",
      lens: "Watch for why water alone is not enough. Predictability and domestication matter just as much.",
      chips: ["Predictable floods", "Silt", "Domesticable species"],
      art: "map"
    },
    ch3: {
      kicker: "Turning point",
      title: "Surplus changes the rules.",
      big: "Farming mattered because it created extra food. Extra food made permanent settlements and specialized jobs possible.",
      lens: "Track the causal chain: farming does not automatically equal civilization; surplus is the hinge.",
      chips: ["Farming", "Surplus", "Specialization"],
      art: "wheat"
    },
    ch4: {
      kicker: "River-civilization lens",
      title: "Rivers became civilization engines.",
      big: "The first cities clustered near rivers because rivers could renew soil, move goods, and concentrate people.",
      lens: "Compare the rivers. Predictable floods and dangerous floods both shaped government and settlement differently.",
      chips: ["Nile", "Indus", "Yellow River"],
      art: "river"
    },
    ch5: {
      kicker: "Urban lens",
      title: "Cities make knowledge compound.",
      big: "Cities put strangers, specialists, markets, and records in the same place. That let ideas accumulate across generations.",
      lens: "Look for the transition from survival work to specialized work, and from memory to written knowledge.",
      chips: ["Cities", "Markets", "Writing"],
      art: "city"
    },
    ch6: {
      kicker: "Evidence lens",
      title: "Knowledge starts getting tested.",
      big: "The Scientific Revolution did not appear from nowhere; it sat on top of surplus, cities, universities, writing, and specialists.",
      lens: "Watch for the difference between authority-based knowledge and evidence-based knowledge.",
      chips: ["Observe", "Experiment", "Revise"],
      art: "science"
    },
    ch7: {
      kicker: "Industrial lens",
      title: "Energy turns into power.",
      big: "Steam, coal, factories, and empires produced real gains and real harms at the same time.",
      lens: "Do not flatten industrialization into progress only. Track benefits, exploitation, and inequality together.",
      chips: ["Coal", "Steam", "Factory cities"],
      art: "factory"
    },
    ch8: {
      kicker: "Cultural-power lens",
      title: "Culture spreads through power.",
      big: "Languages and religions spread globally because trade, conquest, ships, disease, and industry changed who had reach.",
      lens: "Avoid the false explanation of superiority. The unit’s explanation is compounding geography and technology.",
      chips: ["Trade", "Conquest", "Language"],
      art: "ships"
    },
    ch9: {
      kicker: "Americas lens",
      title: "Same engine, different starting materials.",
      big: "The Americas developed complex societies through the same surplus engine, but with later arrival and harder domesticates.",
      lens: "The key comparison is not ability. It is timing, plants, animals, and geography.",
      chips: ["Teosinte", "Llamas", "Andes"],
      art: "mountains"
    },
    ch10: {
      kicker: "Preview lens",
      title: "Surplus becomes politics.",
      big: "The same chain that made cities also made rulers, laws, taxation, armies, states, empires, and modern borders.",
      lens: "Read this as a bridge: economic surplus creates political organization.",
      chips: ["Rulers", "States", "Borders"],
      art: "borders"
    }
  };

  function artSvg(kind) {
    const common = 'viewBox="0 0 260 180" role="img" aria-hidden="true"';
    const sky = '<rect x="0" y="0" width="260" height="180" rx="18" class="scene-fill-paper" opacity="0.72"/>';
    const svgs = {
      time: `<svg ${common}>${sky}<circle cx="130" cy="90" r="58" class="scene-soft-line"/><circle cx="130" cy="90" r="36" class="scene-soft-line"/><path d="M130 90 L130 42 M130 90 L172 116" class="scene-line"/><path d="M58 138 C92 154 166 154 204 138" class="scene-soft-line"/><circle cx="78" cy="60" r="9" class="scene-fill-gold"/><circle cx="184" cy="58" r="6" class="scene-fill-accent"/></svg>`,
      map: `<svg ${common}>${sky}<path d="M32 82 C54 45 93 50 111 72 C136 50 178 50 206 80 C184 106 148 105 124 92 C95 113 57 111 32 82Z" class="scene-fill-land"/><path d="M70 88 C94 78 106 88 124 92 M138 78 C158 82 179 79 198 88" class="scene-soft-line"/><circle cx="128" cy="91" r="7" class="scene-fill-accent"/><path d="M128 91 L128 126" class="scene-line"/></svg>`,
      wheat: `<svg ${common}>${sky}<path d="M62 146 C94 112 118 90 131 42 C142 91 166 113 198 146" class="scene-soft-line"/><path d="M131 48 L131 151" class="scene-line"/><path d="M131 66 C106 60 95 46 86 34 M131 82 C104 81 91 70 78 58 M131 98 C108 103 95 96 78 86 M131 66 C156 60 167 46 176 34 M131 82 C158 81 171 70 184 58 M131 98 C154 103 167 96 184 86" class="scene-line"/><circle cx="131" cy="48" r="7" class="scene-fill-gold"/></svg>`,
      river: `<svg ${common}>${sky}<path d="M18 126 C60 99 74 112 101 86 C130 58 166 78 241 40" class="scene-soft-line"/><path d="M20 142 C68 116 92 128 119 102 C148 74 184 93 244 58" class="scene-soft-line"/><rect x="72" y="86" width="26" height="42" class="scene-fill-gold"/><rect x="105" y="72" width="31" height="56" class="scene-fill-accent"/><rect x="146" y="90" width="26" height="38" class="scene-fill-teal"/><path d="M62 128 H184" class="scene-line"/></svg>`,
      city: `<svg ${common}>${sky}<rect x="44" y="82" width="36" height="58" class="scene-fill-gold"/><rect x="90" y="58" width="44" height="82" class="scene-fill-teal"/><rect x="146" y="76" width="34" height="64" class="scene-fill-accent"/><rect x="190" y="96" width="28" height="44" class="scene-fill-gold"/><path d="M35 141 H228 M102 74 H122 M102 92 H122 M102 110 H122 M52 99 H71 M153 94 H172" class="scene-line"/></svg>`,
      science: `<svg ${common}>${sky}<path d="M83 132 L143 52 M109 96 L180 132" class="scene-line"/><circle cx="146" cy="49" r="19" class="scene-soft-line"/><path d="M154 42 L164 32 M161 54 L176 57 M137 35 L130 22" class="scene-soft-line"/><rect x="58" y="128" width="82" height="12" rx="6" class="scene-fill-teal"/><circle cx="189" cy="126" r="15" class="scene-fill-gold"/></svg>`,
      factory: `<svg ${common}>${sky}<path d="M42 138 H220 V92 L178 112 V92 L136 112 V92 L94 112 V70 H64 V138Z" class="scene-fill-land"/><path d="M64 70 V47 H95 V70 M82 47 C82 31 113 33 107 17" class="scene-soft-line"/><path d="M55 138 H228 M78 119 H98 M122 119 H142 M166 119 H186" class="scene-line"/><circle cx="196" cy="53" r="9" class="scene-fill-accent"/></svg>`,
      ships: `<svg ${common}>${sky}<path d="M50 124 C83 140 169 140 210 124" class="scene-soft-line"/><path d="M58 102 H202 L183 128 H78Z" class="scene-fill-land"/><path d="M130 102 V38 M130 44 L176 84 H130 M130 52 L90 90 H130" class="scene-line"/><circle cx="208" cy="56" r="14" class="scene-fill-gold"/></svg>`,
      mountains: `<svg ${common}>${sky}<path d="M28 142 L76 65 L111 142 Z" class="scene-fill-land"/><path d="M83 142 L139 43 L209 142 Z" class="scene-fill-gold"/><path d="M142 142 L191 80 L236 142 Z" class="scene-fill-teal"/><path d="M76 65 L91 91 L65 91 M139 43 L158 79 L123 79" class="scene-line"/><circle cx="68" cy="128" r="7" class="scene-fill-accent"/></svg>`,
      borders: `<svg ${common}>${sky}<path d="M42 50 H218 V138 H42Z" class="scene-fill-land"/><path d="M86 50 V138 M132 50 V138 M176 50 V138 M42 94 H218" class="scene-soft-line"/><path d="M62 116 C89 84 103 106 130 78 C159 49 180 77 199 62" class="scene-line"/><circle cx="132" cy="94" r="8" class="scene-fill-accent"/></svg>`
    };
    return svgs[kind] || svgs.map;
  }

  function chipMarkup(chips) {
    return (chips || []).map((chip) => `<span class="scene-chip">${chip}</span>`).join("");
  }

  function sceneMarkup(scene) {
    return `<section class="reading-scene">
      <div class="reading-scene-copy">
        <p class="reading-scene-kicker">${scene.kicker}</p>
        <h3 class="reading-scene-title">${scene.title}</h3>
        <p class="reading-scene-big">${scene.big}</p>
        <div class="scene-chip-row">${chipMarkup(scene.chips)}</div>
        <div class="reading-lens"><b>Reading lens</b><span>${scene.lens}</span></div>
      </div>
      <div class="reading-scene-art">${artSvg(scene.art)}</div>
    </section>`;
  }

  GD.CHAPTERS.forEach((chapter) => {
    const scene = scenes[chapter.id];
    if (!scene || !Array.isArray(chapter.steps)) return;
    const reading = chapter.steps.find((step) => step.type === "reading");
    if (!reading || !reading.body || reading.body.includes("reading-scene")) return;
    reading.body = sceneMarkup(scene) + reading.body;
  });
})();
