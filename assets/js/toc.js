(function () {
  const content = document.querySelector('#content') || document.querySelector('main') || document.body;
  const headings = content ? content.querySelectorAll('h2, h3') : [];
  const toc = document.querySelector('#page-toc .toc-list');
  if (!toc || !headings.length) return;

  const slugify = (s) =>
    s.toLowerCase().trim()
      .replace(/[^\w\- ]+/g, '')
      .replace(/\s+/g, '-');

  // Ensure unique ids
  const used = new Set();
  headings.forEach(h => {
    if (!h.id) {
      const base = slugify(h.textContent);
      let id = base || 'section';
      let i = 2;
      while (document.getElementById(id) || used.has(id)) id = `${base}-${i++}`;
      h.id = id;
      used.add(id);
    }
  });

  // Build links
  headings.forEach(h => {
    const li = document.createElement('li');
    li.className = h.tagName === 'H3' ? 'toc-h3' : 'toc-h2';

    const a = document.createElement('a');
    a.href = `#${h.id}`;
    a.textContent = h.textContent;
    a.addEventListener('click', (e) => {
      e.preventDefault();
      document.getElementById(h.id).scrollIntoView({ behavior: 'smooth', block: 'start' });
      history.replaceState(null, '', `#${h.id}`);
    });

    li.appendChild(a);
    toc.appendChild(li);
  });

  // Scrollspy to highlight current section
  let activeId = null;
  const setActive = (id) => {
    if (activeId === id) return;
    activeId = id;
    toc.querySelectorAll('li').forEach(li => li.classList.remove('is-active'));
    const active = toc.querySelector(`a[href="#${CSS.escape(id)}"]`);
    if (active) active.parentElement.classList.add('is-active');
  };

  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => { if (entry.isIntersecting) setActive(entry.target.id); });
  }, { rootMargin: '0px 0px -75% 0px', threshold: 0.1 });

  headings.forEach(h => observer.observe(h));
})();
