import {activities, createQuestions} from './maths.js';
import {createMeadow} from './meadow.js?v=glitter1';
(() => {
  'use strict';
  const $ = id => document.getElementById(id);
  let stars = 0, first = 2, second = 3, solved = false, bag = [], previous = '';
  let mode = 'multiplication', current;
  const cheers = ['“A sparkling star! You did it!”', '“Pip is doing a happy tail wag!”', '“Your brain is getting stronger!”', '“High hoof! That was magical!”'];
  const timers = new Map();
  const meadow = createMeadow($('jump-arena'));
  if (meadow) { $('jump-arena').classList.add('three-d'); document.body.classList.add('immersive'); }
  let lane = 1;
  function selectLane(index) {
    lane = Math.max(0, Math.min(2,index));
    meadow?.lane(lane);
    document.querySelectorAll('.answer-hoop').forEach((button,i)=>button.classList.toggle('active-lane',i===lane));
  }
  function move(direction) { if (!jumping && !solved) selectLane(lane+direction); }
  function jumpSelected() { document.querySelectorAll('.answer-hoop')[lane]?.click(); }
  $('move-left').addEventListener('click',()=>move(-1));
  $('move-right').addEventListener('click',()=>move(1));
  $('jump-button').addEventListener('click',jumpSelected);
  document.addEventListener('keydown',event=>{
    if (!$('start-screen').hidden || $('question-area').hidden || event.target.tagName === 'SELECT' || event.altKey || event.ctrlKey || event.metaKey) return;
    if (event.key==='ArrowLeft' || event.key==='ArrowRight') {event.preventDefault();move(event.key==='ArrowLeft'?-1:1);}
    if (event.key==='ArrowUp') {event.preventDefault();if(!event.repeat)jumpSelected();}
    if ((event.code==='Space'||event.key==='Enter') && (event.target===document.body || event.target.closest('#jump-arena, .movement-controls'))) {event.preventDefault();if(!event.repeat)jumpSelected();}
  });
  let chosenFriend = 'luna', jumping = false, roundVersion = 0;
  let flight, advanceTimer;
  for (const name of ['luna', 'pip']) {
    $('choose-' + name).addEventListener('click', () => {
      if (jumping) return;
      chosenFriend = name; meadow?.select(name);
      $('jumper').src = `assets/${name}.svg`;
      for (const other of ['luna', 'pip']) $('choose-' + other).setAttribute('aria-pressed', String(other === name));
    });
  }
  function choices() {
    const correct = current.answer;
    const values = new Set([correct]);
    while (values.size < 3) values.add(1 + Math.floor(Math.random() * (mode === 'multiplication' ? 81 : 30)));
    const answers = [...values];
    for (let i = answers.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [answers[i], answers[j]] = [answers[j], answers[i]];
    }
    $('answer-choices').replaceChildren(...answers.map(value => {
      const button = document.createElement('button');
      button.className = 'answer-hoop'; button.textContent = value;
      button.setAttribute('aria-label', `Jump through ${value}`);
      button.addEventListener('click', () => jumpAnswer(value, button));
      return button;
    }));
    selectLane(1);
  }
  async function jumpAnswer(value, button) {
    if (solved || jumping) return;
    flight?.cancel();
    selectLane([...document.querySelectorAll('.answer-hoop')].indexOf(button));
    jumping = true;
    const version = roundVersion;
    const buttons = [...document.querySelectorAll('.answer-hoop')];
    buttons.forEach(choice => choice.disabled = true);
    const avatar = $('jumper');
    const origin = avatar.getBoundingClientRect(), target = button.getBoundingClientRect();
    const x = target.left + target.width / 2 - origin.left - origin.width / 2;
    const y = target.top + target.height / 2 - origin.top - origin.height / 2;
    button.classList.add('selected');
    const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    $('feedback').textContent = `${chosenFriend === 'luna' ? 'Luna' : 'Pip'} is jumping through ${value}!`;
    if (meadow) {
      await meadow.jump(lane);
    } else {
    flight = avatar.animate([
      {transform:'translate(0,0) scale(1)'},
      {transform:`translate(${x * .4}px, ${y - 8}px) scale(1.1)`,offset:.3},
      {transform:`translate(${x}px, ${y}px) scale(.65)`,offset:.55},
      {transform:`translate(${x}px, ${y}px) scale(.65)`,offset:.7},
      {transform:`translate(${x}px, 0px) scale(1)`,offset:1}
    ], {duration:reduced?350:1800, easing:'ease-in-out',fill:'forwards'});
    try { await flight.finished; } catch { return; }
    }
    if (version !== roundVersion) return;
    jumping = false;
    if (value !== current.answer) {
      meadow?.reset();
      button.classList.add('miss'); button.disabled = true;
      buttons.filter(choice => !choice.classList.contains('miss')).forEach(choice => choice.disabled = false);
      animate(chosenFriend, 'nuzzle');
      $('cheer').textContent = '“Let’s try another hoop!”';
      $('feedback').textContent = 'Try another hoop 💜'; $('feedback').className = 'retry';
      buttons.find(choice => !choice.disabled)?.focus();
      return;
    }
    button.classList.add('correct');
    awardStar();
  }
  function animate(id, action) {
    const friend = $(id);
    clearTimeout(timers.get(id));
    friend.classList.remove('dance', 'nuzzle');
    void friend.offsetWidth;
    friend.classList.add(action);
    timers.set(id, setTimeout(() => friend.classList.remove(action), 1400));
  }
  function magic(symbols) {
    const pieces = Array.from({length:8}, (_, i) => {
      const piece = document.createElement('span');
      piece.className = 'magic-piece';
      piece.textContent = symbols[i % symbols.length];
      piece.style.setProperty('--left', `${8 + i * 11}%`);
      piece.style.animationDelay = `${i * 70}ms`;
      return piece;
    });
    $('magic').replaceChildren(...pieces);
    setTimeout(() => pieces.forEach(piece => piece.remove()), 2300);
  }
  function highFive() {
    animate('luna', 'dance'); magic(['✨', '🌈', '💜']);
    $('cheer').textContent = '“High hoof! You’re magical!”';
  }
  function petPip() {
    animate('pip', 'nuzzle'); magic(['💕', '🐾', '💛']);
    $('cheer').textContent = '“Woof! More cuddles, please!”';
  }
  $('luna').addEventListener('click', highFive);
  $('high-five').addEventListener('click', highFive);
  $('pip').addEventListener('click', petPip);
  $('pet').addEventListener('click', petPip);
  function makeBag() {
    bag = createQuestions(mode, $('table').value);
    for (let i = bag.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [bag[i], bag[j]] = [bag[j], bag[i]];
    }
    if (bag.length > 1 && JSON.stringify(bag[bag.length - 1]) === previous) [bag[0], bag[bag.length - 1]] = [bag[bag.length - 1], bag[0]];
  }
  function progress() {
    $('star-count').textContent = stars;
    $('progress-text').textContent = `${stars} / 10`;
    $('trail').setAttribute('aria-label', `${stars} of 10 stars`);
    $('trail').replaceChildren(...Array.from({length:10}, (_, i) => {
      const part = document.createElement('span');
      if (i < stars) part.className = 'earned';
      return part;
    }));
  }
  function question() {
    roundVersion++; clearTimeout(advanceTimer); flight?.cancel(); meadow?.reset(); jumping = false;
    if (!bag.length) makeBag();
    current = bag.pop(); ({first, second} = current); previous = JSON.stringify(current); solved = false;
    $('math-operator').textContent = current.operator;
    document.querySelector('.equation').classList.toggle('fraction-question', mode === 'fractions');
    $('first').textContent = first; $('second').textContent = second;
    choices();
    $('hint').hidden = true; $('hint-button').hidden = false;
    $('feedback').className = ''; $('feedback').textContent = 'You’ve got this! 💜';
    document.querySelector('.answer-hoop').focus();
  }
  function reset() {
    document.querySelector('.scene').classList.remove('party');
    $('magic').replaceChildren();
    stars = 0; bag = []; progress();
    $('question-area').hidden = false; $('celebration').hidden = true; $('feedback').hidden = false;
    $('cheer').textContent = '“Let’s play!”';
    question();
  }
  function awardStar() {
    if(meadow) meadow.celebrate();
    else {
      const avatar=$('jumper').getBoundingClientRect(),arena=$('jump-arena').getBoundingClientRect();
      const glitter=document.createElement('div');glitter.className='fallback-glitter';glitter.setAttribute('aria-hidden','true');
      glitter.style.left=`${avatar.left-arena.left+avatar.width*(chosenFriend==='luna'?.7:.2)}px`;
      glitter.style.top=`${avatar.top-arena.top+avatar.height*.2}px`;
      for(let i=0;i<16;i++){const spark=document.createElement('span');spark.textContent='✦';const angle=i*Math.PI/8;spark.style.setProperty('--gx',`${Math.cos(angle)*95}px`);spark.style.setProperty('--gy',`${Math.sin(angle)*95}px`);spark.style.color=['#d677ff','#ed9a00','#ec50b7'][i%3];glitter.append(spark)}
      $('jump-arena').append(glitter);setTimeout(()=>glitter.remove(),1500);
    }
    solved = true; stars++; progress();
    animate('luna', 'dance'); animate('pip', 'dance'); magic(['⭐', '✨', '💖']);
    $('hint-button').hidden = true; $('hint').hidden = true;
    $('feedback').textContent = `Yes! ${first} ${current.operator} ${second} = ${current.answer} ⭐`;
    $('feedback').className = 'success'; $('cheer').textContent = cheers[(stars - 1) % cheers.length];
    if (stars === 10) {
      const version=roundVersion;
      advanceTimer=setTimeout(()=>{
      if(version!==roundVersion)return;
      document.querySelector('.scene').classList.add('party');
      $('cheer').textContent = '“You did it! Party time!”';
      $('question-area').hidden = true; $('celebration').hidden = false; $('again').focus();
      },1600);
    } else {
      const version = roundVersion;
      advanceTimer = setTimeout(() => { if (version === roundVersion) question(); }, 1600);
    }
  }
  $('hint-button').addEventListener('click', () => {
    const hint = $('hint'); hint.hidden = !hint.hidden;
    if (hint.hidden) return;
    hint.replaceChildren();
    const text = document.createElement('div');
    text.textContent = current.hint;
    const groups = document.createElement('div'); groups.className = 'groups'; groups.setAttribute('aria-hidden','true');
    for (let i = 0; mode === 'multiplication' && i < first; i++) {
      const group = document.createElement('span'); group.className = 'group'; group.textContent = '●'.repeat(second); groups.append(group);
    }
    hint.append(text, groups);
  });
  $('restart').addEventListener('click', reset);
  $('again').addEventListener('click', reset);
  $('table').addEventListener('change', () => { bag = []; if (stars === 10) reset(); else question(); });
  function openMenu() {
    roundVersion++; clearTimeout(advanceTimer); flight?.cancel(); meadow?.reset(); jumping = false;
    $('start-screen').hidden = false;
    document.querySelector('main').inert = true;
    document.querySelector('header').inert = true;
    document.querySelector(`[data-mode="${mode}"]`).focus();
  }
  $('change-activity').addEventListener('click', openMenu);
  document.querySelectorAll('[data-mode]').forEach(button => button.addEventListener('click', () => {
    mode = button.dataset.mode;
    $('activity-name').textContent = activities[mode].name;
    $('table').hidden = mode !== 'multiplication';
    $('start-screen').hidden = true;
    document.querySelector('main').inert = false;
    document.querySelector('header').inert = false;
    reset();
  }));
  openMenu();
})();
