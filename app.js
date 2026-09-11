const places = [
  { id: 1, name: 'Block 32', type: 'academic', label: 'Computing & Engineering', desc: 'Primary academic hub for computing and engineering with high-capacity computer labs.', meta: 'Moderate noise', distance: '—', keywords: ['study', 'classes', 'cse', 'labs', 'computers'] },
  { id: 2, name: 'Block 34 Kiosks', type: 'food', label: 'Quick Bites', desc: 'High-density engineering block with an active outdoor courtyard and kiosks serving maggi, patties, and tea.', meta: 'Lively', distance: '—', keywords: ['eat', 'food', 'snack', 'coffee', 'tea', 'hangout'] },
  { id: 3, name: 'Block 36', type: 'academic', label: 'Agriculture & Sciences', desc: 'Academic block for sciences with nearby outdoor seating and gathering spaces.', meta: 'Moderate noise', distance: '—', keywords: ['study', 'classes', 'science', 'work'] },
  { id: 4, name: 'Block 38', type: 'academic', label: 'Academic & Project Space', desc: 'Multi-department academic block with seminar rooms and collaborative project workspaces.', meta: 'Moderate noise', distance: '—', keywords: ['study', 'work', 'project', 'focus'] },
  { id: 5, name: 'Central Library', type: 'study', label: 'Silent Study', desc: 'Multi-storey silent study environment with dedicated reading halls and digital labs.', meta: 'Very quiet', distance: '—', keywords: ['study', 'peace', 'quiet', 'focus', 'read', 'books', 'work'] },
  { id: 6, name: 'UniMall (Block 15)', type: 'food', label: 'Shopping & Dining', desc: 'Central shopping and dining complex housing Domino\'s, food courts, and restaurants serving veg and non-veg meals.', meta: 'Lively', distance: '—', keywords: ['eat', 'food', 'meal', 'chicken', 'pizza', 'burger', 'hungry', 'lunch'] },
  { id: 7, name: 'MB Food Square', type: 'food', label: 'Hostel Dining', desc: 'Dedicated food stalls near the hostels famous for chicken roll, biryani, and late-night non-veg meals.', meta: 'Lively', distance: '—', keywords: ['eat', 'food', 'chicken', 'non-veg', 'dinner', 'hungry', 'roll', 'biryani'] },
  { id: 8, name: 'Baldev Raj Mittal Unipolis', type: 'social', label: 'Events & Social Hub', desc: 'Massive covered mega-event structure and social crossroads connecting Blocks 30-38.', meta: 'Lively', distance: '—', keywords: ['friend', 'hang', 'social', 'meet', 'group', 'events'] },
  { id: 9, name: 'Shanti Devi Mittal Auditorium', type: 'event', label: 'Auditorium & Events', desc: 'Large indoor ceremonial auditorium for guest lectures, orientations, and cultural fests.', meta: 'Moderate noise', distance: '—', keywords: ['events', 'lecture', 'fest'] },
  { id: 10, name: 'Indoor Sports Complex', type: 'sports', label: 'Sports & Fitness', desc: 'Olympic-grade multi-purpose indoor athletic arena with courts and fitness center.', meta: 'Lively', distance: '—', keywords: ['sports', 'gym', 'play', 'fitness', 'workout', 'active'] },
  { id: 11, name: 'Main Gate (Gate 1-A)', type: 'transit', label: 'Campus Entrance', desc: 'Primary security checkpoint, bus drop-off point, and visitor reception off the highway.', meta: 'Open 24 Hours', distance: '—', keywords: ['gate', 'bus', 'travel', 'entry', 'outside'] },
  { id: 12, name: 'Campus Gardens', type: 'outdoor', label: 'Parks & Nature', desc: 'Lush green lawns perfect for winter afternoons and outdoor walks.', meta: 'Peaceful', distance: '—', keywords: ['outside', 'outdoor', 'air', 'walk', 'nature', 'park'] }
];
const typeNames = { study: 'Study', food: 'Food & drinks', social: 'Social', outdoor: 'Outdoors' };
const placeGrid = document.querySelector('#placeGrid');
const searchInput = document.querySelector('#searchInput');
const resultCount = document.querySelector('#resultCount');
const resultsTitle = document.querySelector('#resultsTitle');
const toast = document.querySelector('#toast');
let activeFilter = 'all';
let saved = new Set();
let toastTimer;

function renderPlaces(items = places) {
  resultCount.textContent = `${items.length} ${items.length === 1 ? 'place' : 'places'}`;
  placeGrid.innerHTML = items.length ? items.map(place => `
    <article class="place-card">
      <div class="place-visual visual-${place.type}"><span class="visual-label">${place.label}</span><button class="save-place ${saved.has(place.id) ? 'saved' : ''}" data-save="${place.id}" aria-label="${saved.has(place.id) ? 'Remove' : 'Save'} ${place.name}">${saved.has(place.id) ? '♥' : '♡'}</button></div>
      <h3>${place.name}</h3><p class="place-desc">${place.desc}</p>
      <div class="place-footer"><span>${place.meta}</span><span class="distance">↗ ${place.distance}</span></div>
    </article>`).join('') : '<div class="empty-state">No places match that filter yet. Try asking Copilot in your own words.</div>';
}

function showToast(message) { clearTimeout(toastTimer); toast.textContent = message; toast.classList.add('show'); toastTimer = setTimeout(() => toast.classList.remove('show'), 2600); }

function searchPlaces(query) {
  const text = query.toLowerCase();
  const has = (...terms) => terms.some(term => text.includes(term));
  let filtered = places;
  if (has('study', 'peace', 'quiet', 'focus', 'read', 'work')) filtered = places.filter(place => place.type === 'study' || place.name === 'Brew & Books');
  else if (has('eat', 'food', 'meal', 'coffee', 'drink', 'hungry', 'snack')) filtered = places.filter(place => place.type === 'food');
  else if (has('friend', 'hang', 'social', 'meet', 'group')) filtered = places.filter(place => place.type === 'social' || place.type === 'food');
  else if (has('outside', 'outdoor', 'air', 'walk', 'nature')) filtered = places.filter(place => place.type === 'outdoor');
  resultsTitle.textContent = query.trim() ? 'Here’s what I found for you' : 'Places that feel right';
  renderPlaces(activeFilter === 'all' ? filtered : filtered.filter(place => place.type === activeFilter));
  document.querySelector('#results').scrollIntoView({ behavior: 'smooth', block: 'start' });
}

document.querySelector('#searchForm').addEventListener('submit', event => { event.preventDefault(); searchPlaces(searchInput.value); });
document.querySelectorAll('[data-prompt]').forEach(button => button.addEventListener('click', () => { searchInput.value = button.dataset.prompt; searchPlaces(button.dataset.prompt); }));
document.querySelector('#filterToggle').addEventListener('click', () => { const row = document.querySelector('#filterRow'); row.hidden = !row.hidden; });
document.querySelector('#filterRow').addEventListener('click', event => { if (!event.target.matches('.filter-chip')) return; activeFilter = event.target.dataset.filter; document.querySelectorAll('.filter-chip').forEach(chip => chip.classList.toggle('active', chip === event.target)); searchPlaces(searchInput.value); });
placeGrid.addEventListener('click', event => { const button = event.target.closest('[data-save]'); if (!button) return; const id = Number(button.dataset.save); saved.has(id) ? saved.delete(id) : saved.add(id); document.querySelector('#savedCount').textContent = saved.size; renderPlaces(searchInput.value ? places.filter(place => place.type === activeFilter || activeFilter === 'all') : places.filter(place => activeFilter === 'all' || place.type === activeFilter)); showToast(saved.has(id) ? 'Saved to your places' : 'Removed from saved places'); });
renderPlaces();