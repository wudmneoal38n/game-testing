(() => {
  'use strict';
  const $ = id => document.getElementById(id);
  let stars = 0, first = 2, second = 3, solved = false, bag = [], previous = '';
  const cheers = ['“A sparkling star! You did it!”', '“Pip is doing a happy tail wag!”', '“Your brain is getting stronger!”', '“High hoof! That was magical!”'];
  function makeBag() {
    const selected = $('table').value;
    bag = [];
    for (let a = 1; a <= 9; a++) for (let b = 1; b <= 9; b++) {
      if (selected === 'mixed' || a === Number(selected)) bag.push([a, b]);
    }
    for (let i = bag.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [bag[i], bag[j]] = [bag[j], bag[i]];
    }
    if (bag.length > 1 && bag[bag.length - 1].join(',') === previous) [bag[0], bag[bag.length - 1]] = [bag[bag.length - 1], bag[0]];
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
    if (!bag.length) makeBag();
    [first, second] = bag.pop(); previous = `${first},${second}`; solved = false;
    $('first').textContent = first; $('second').textContent = second;
    $('answer').value = ''; $('answer').disabled = false; $('check').disabled = false;
    $('next').hidden = true; $('hint').hidden = true; $('hint-button').hidden = false;
    $('feedback').className = ''; $('feedback').textContent = 'You’ve got this! 💜';
    $('answer').focus();
  }
  function reset() {
    stars = 0; bag = []; progress();
    $('question-area').hidden = false; $('celebration').hidden = true; $('feedback').hidden = false;
    $('cheer').textContent = '“Let’s play!”';
    question();
  }
  $('answer-form').addEventListener('submit', event => {
    event.preventDefault();
    if (solved) return;
    const value = $('answer').value.trim();
    if (!/^\d{1,2}$/.test(value)) {
      $('feedback').textContent = 'Type a number ✏️';
      $('feedback').className = 'retry'; return;
    }
    if (Number(value) !== first * second) {
      $('feedback').textContent = 'Try again 💜 Need a hint?';
      $('feedback').className = 'retry'; $('answer').select(); return;
    }
    solved = true; stars++; progress();
    $('answer').disabled = true; $('check').disabled = true; $('hint-button').hidden = true; $('hint').hidden = true;
    $('feedback').textContent = `Yes! ${first} × ${second} = ${first * second}. A star for you! ⭐`;
    $('feedback').className = 'success'; $('cheer').textContent = cheers[(stars - 1) % cheers.length];
    if (stars === 10) {
      $('question-area').hidden = true; $('celebration').hidden = false; $('again').focus();
    } else { $('next').hidden = false; $('next').focus(); }
  });
  $('hint-button').addEventListener('click', () => {
    const hint = $('hint'); hint.hidden = !hint.hidden;
    if (hint.hidden) return;
    hint.replaceChildren();
    const text = document.createElement('div');
    text.textContent = `${first} groups of ${second}. Count the dots!`;
    const groups = document.createElement('div'); groups.className = 'groups'; groups.setAttribute('aria-hidden','true');
    for (let i = 0; i < first; i++) {
      const group = document.createElement('span'); group.className = 'group'; group.textContent = '●'.repeat(second); groups.append(group);
    }
    hint.append(text, groups);
  });
  $('next').addEventListener('click', question);
  $('restart').addEventListener('click', reset);
  $('again').addEventListener('click', reset);
  $('table').addEventListener('change', () => { bag = []; if (stars === 10) reset(); else question(); });
  reset();
})();
