/* Enhancement layer: visual anchors, better map geometry, and a few extra map questions. */
(function () {
  "use strict";
  const GD = window.GAME_DATA;
  if (!GD || !Array.isArray(GD.CHAPTERS)) return;

  GD.CONTINENTS = {
    northAmerica: [
      [-168,65],[-160,70],[-146,72],[-128,71],[-116,68],[-104,70],[-91,69],[-78,72],[-60,62],[-55,53],[-67,47],[-78,46],[-83,42],[-76,37],[-81,31],[-80,26],[-87,25],[-96,29],[-105,28],[-111,24],[-108,20],[-99,18],[-92,15],[-88,17],[-83,12],[-78,8],[-82,7],[-91,15],[-103,18],[-112,25],[-118,33],[-123,41],[-129,49],[-140,57],[-156,59],[-168,65]
    ],
    southAmerica: [
      [-81,10],[-74,12],[-65,10],[-54,5],[-45,-1],[-36,-7],[-39,-16],[-46,-23],[-53,-31],[-60,-38],[-67,-55],[-73,-52],[-75,-43],[-72,-30],[-70,-18],[-76,-7],[-81,-1],[-81,10]
    ],
    greenland: [[-52,60],[-38,59],[-26,66],[-20,74],[-32,83],[-48,82],[-60,76],[-60,67],[-52,60]],
    eurasia: [
      [-10,36],[-7,43],[-1,49],[7,50],[14,55],[8,61],[18,68],[35,72],[55,70],[75,74],[103,73],[132,72],[160,66],[178,68],[171,61],[155,55],[148,48],[138,45],[139,37],[129,35],[123,31],[113,23],[108,16],[101,8],[96,5],[88,10],[79,7],[75,16],[69,22],[62,24],[57,27],[54,22],[47,14],[41,12],[36,23],[33,31],[28,39],[21,37],[14,40],[7,43],[2,42],[-3,39],[-10,36]
    ],
    africa: [[-17,32],[-5,35],[11,34],[25,32],[34,30],[36,23],[43,14],[51,10],[45,4],[43,-3],[40,-12],[35,-25],[28,-33],[18,-35],[12,-26],[11,-12],[7,-1],[-2,5],[-11,8],[-17,16],[-17,32]],
    australia: [[113,-21],[116,-33],[128,-36],[141,-38],[151,-34],[153,-25],[145,-15],[133,-12],[121,-16],[113,-21]],
    antarctica: [[-180,-77],[-145,-72],[-100,-73],[-62,-78],[-28,-70],[14,-69],[48,-67],[91,-68],[132,-70],[170,-76],[180,-78],[180,-85],[-180,-85],[-180,-77]],
    britishIsles: [[-8,50],[1,51],[2,55],[-3,59],[-8,57],[-10,53],[-8,50]],
    japan: [[130,32],[136,35],[141,38],[145,44],[141,45],[137,39],[131,33],[130,32]],
    madagascar: [[43,-12],[50,-16],[50,-25],[45,-26],[43,-20],[43,-12]],
    newZealand: [[172,-34],[178,-38],[177,-43],[169,-46],[166,-43],[172,-40],[172,-34]],
    iceland: [[-24,63],[-14,63],[-13,66],[-21,67],[-24,63]],
    arabia: [[35,31],[44,30],[52,24],[57,19],[54,13],[45,12],[39,17],[35,31]],
    india: [[68,24],[78,25],[88,22],[85,12],[78,7],[73,12],[68,24]],
    indonesia: [[96,-1],[111,-4],[124,-6],[135,-4],[139,-7],[126,-9],[111,-8],[98,-5],[96,-1]],
    cuba: [[-85,22],[-75,20],[-74,22],[-82,24],[-85,22]]
  };

  GD.MAP_RIVERS = {
    nile: [[31,1],[31,12],[31,22],[31,30]],
    tigrisEuphrates: [[39,37],[42,35],[45,33],[47,31],[48,29]],
    indus: [[74,35],[72,31],[70,28],[68,24]],
    yellowRiver: [[97,36],[105,35],[113,35],[120,37]],
    yangtze: [[99,31],[106,30],[112,31],[121,31]]
  };

  GD.MAP_VISIBLE_LANDMARKS = [
    'fertileCrescent','nileValley','indusValley','yellowRiver','britain','mesoamerica','andes','bering'
  ];

  const miniWorldMap = '<svg viewBox="0 0 360 180" role="img" aria-label="World map visual anchor"><rect width="360" height="180" fill="transparent"/><path d="M28 70 L44 48 L88 45 L126 58 L115 82 L88 92 L72 118 L48 105 Z" fill="#d6bf7f" stroke="#7a6a42"/><path d="M118 96 L143 105 L151 135 L133 166 L112 140 Z" fill="#d6bf7f" stroke="#7a6a42"/><path d="M158 58 L198 42 L255 47 L330 61 L296 82 L241 80 L218 104 L172 95 Z" fill="#d6bf7f" stroke="#7a6a42"/><path d="M170 90 L207 94 L223 128 L206 163 L176 145 L158 116 Z" fill="#d6bf7f" stroke="#7a6a42"/><path d="M260 120 L306 116 L323 140 L291 155 Z" fill="#d6bf7f" stroke="#7a6a42"/></svg>';

  const anchors = {
    ch1: '<div class="visual-anchor"><div class="visual-anchor-title"><span class="icon">⏳</span>Scale check</div><div class="mini-timeline"><div class="timeline-dot"><i></i><b>Earth forms</b></div><div class="timeline-dot"><i></i><b>Pangaea</b></div><div class="timeline-dot"><i></i><b>Ice Age ends</b></div><div class="timeline-dot"><i></i><b>First cities</b></div><div class="timeline-dot"><i></i><b>Today</b></div></div></div>',
    ch2: '<div class="visual-anchor"><div class="visual-anchor-title"><span class="icon">🗺️</span>Geography stacked the deck</div><div class="anchor-grid"><div class="anchor-tile"><strong>Predictable water</strong><span>Regular floods make planting possible.</span></div><div class="anchor-tile"><strong>Fertile soil</strong><span>Silt keeps fields productive.</span></div><div class="anchor-tile"><strong>Useful species</strong><span>Some plants and animals are much easier to domesticate.</span></div><div class="anchor-tile"><strong>Population depth</strong><span>Longer habitation means more accumulated knowledge.</span></div></div></div>',
    ch3: '<div class="visual-anchor"><div class="visual-anchor-title"><span class="icon">🌾</span>The surplus engine</div><div class="causal-chain"><span class="chain-pill">Farming</span><span class="chain-arrow">→</span><span class="chain-pill">Surplus</span><span class="chain-arrow">→</span><span class="chain-pill">Specialists</span><span class="chain-arrow">→</span><span class="chain-pill">Cities</span></div></div>',
    ch4: '<div class="visual-anchor"><div class="visual-anchor-title"><span class="icon">🌊</span>River cradles</div><div class="visual-map-strip">' + miniWorldMap + '<p><b>Nile, Tigris-Euphrates, Indus, and Yellow River</b> all turned water + soil into surplus. The key question is not just “where are rivers?” but “where are rivers reliable and productive enough to feed cities?”</p></div></div>',
    ch5: '<div class="visual-anchor"><div class="visual-anchor-title"><span class="icon">🏙️</span>Why cities matter</div><div class="causal-chain"><span class="chain-pill">Dense population</span><span class="chain-arrow">→</span><span class="chain-pill">Markets</span><span class="chain-arrow">→</span><span class="chain-pill">Writing</span><span class="chain-arrow">→</span><span class="chain-pill">Knowledge compounds</span></div></div>',
    ch6: '<div class="visual-anchor"><div class="visual-anchor-title"><span class="icon">🔬</span>The scientific method</div><div class="anchor-grid"><div class="anchor-tile"><strong>Observe</strong><span>Look at the world directly.</span></div><div class="anchor-tile"><strong>Hypothesize</strong><span>Make a testable claim.</span></div><div class="anchor-tile"><strong>Experiment</strong><span>Check it against evidence.</span></div><div class="anchor-tile"><strong>Revise</strong><span>Change your claim when evidence demands it.</span></div></div></div>',
    ch7: '<div class="visual-anchor"><div class="visual-anchor-title"><span class="icon">⚙️</span>Industry in one chain</div><div class="causal-chain"><span class="chain-pill">Coal</span><span class="chain-arrow">+</span><span class="chain-pill">Steam</span><span class="chain-arrow">→</span><span class="chain-pill">Factories</span><span class="chain-arrow">→</span><span class="chain-pill">Global inequality</span></div></div>',
    ch8: '<div class="visual-anchor"><div class="visual-anchor-title"><span class="icon">🌍</span>How influence spreads</div><div class="causal-chain"><span class="chain-pill">Surplus</span><span class="chain-arrow">→</span><span class="chain-pill">Trade</span><span class="chain-arrow">→</span><span class="chain-pill">Conquest</span><span class="chain-arrow">→</span><span class="chain-pill">Language & religion spread</span></div></div>',
    ch9: '<div class="visual-anchor"><div class="visual-anchor-title"><span class="icon">🦙</span>A parallel story</div><div class="anchor-grid"><div class="anchor-tile"><strong>Later arrival</strong><span>Humans reached the Americas much later.</span></div><div class="anchor-tile"><strong>Harder raw materials</strong><span>Teosinte and few domesticable animals slowed things down.</span></div><div class="anchor-tile"><strong>Same basic engine</strong><span>Surplus still produced settlements and cities.</span></div><div class="anchor-tile"><strong>Different path</strong><span>The timeline changed, not human potential.</span></div></div></div>'
  };

  for (const chapter of GD.CHAPTERS) {
    const reading = Array.isArray(chapter.steps) ? chapter.steps.find((s) => s.type === 'reading') : null;
    if (reading && anchors[chapter.id] && !String(reading.body).includes('visual-anchor')) {
      reading.body = anchors[chapter.id] + reading.body;
    }
  }

  function addMapQuestion(chId, stepObj) {
    const chapter = GD.CHAPTERS.find((c) => c.id === chId);
    if (!chapter) return;
    if (chapter.steps.some((s) => s.type === 'map' && s.prompt === stepObj.prompt)) return;
    chapter.steps.push(stepObj);
  }

  addMapQuestion('ch4', {
    type: 'map',
    competency: '5.41',
    prompt: 'Click on <b>Mesopotamia</b> — the land between the Tigris and Euphrates rivers.',
    targetLng: 44,
    targetLat: 33,
    tolerance: 30,
    explanation: 'Mesopotamia lay in and around modern Iraq. It produced city-states, cuneiform writing, irrigation systems, the wheel, and some of the earliest written law codes.'
  });

  addMapQuestion('ch4', {
    type: 'map',
    competency: '5.41',
    prompt: 'Click on the <b>Yellow River / Huang He</b> region, one of the four earliest river-civilization cradles.',
    targetLng: 113,
    targetLat: 35,
    tolerance: 30,
    explanation: 'The Yellow River crosses northern China. Its destructive floods helped drive the need for strong centralized coordination of irrigation and flood control.'
  });

  addMapQuestion('ch9', {
    type: 'map',
    competency: '5.12',
    prompt: 'Click on the <b>Bering Land Bridge</b> area, where humans likely first entered the Americas from Asia.',
    targetLng: -170,
    targetLat: 65,
    tolerance: 28,
    explanation: 'During the Ice Age, lower sea levels exposed a land bridge connecting Siberia and Alaska. That corridor helped people move into the Americas roughly 15,000–20,000 years ago.'
  });
})();
