(() => {
  'use strict';
  const sample = window.VAYAM_DASHBOARD_SAMPLE;
  const byId = id => document.getElementById(id);
  const integer = value => Number.isFinite(Number(value)) ? Math.max(0, Math.round(Number(value))) : 0;
  const format = value => new Intl.NumberFormat('en').format(integer(value));
  const svgNS = 'http://www.w3.org/2000/svg';
  let current = sample;

  function svg(tag, attrs = {}) {
    const element = document.createElementNS(svgNS, tag);
    for (const [name, value] of Object.entries(attrs)) element.setAttribute(name, String(value));
    return element;
  }

  function text(tag, value, className) {
    const element = document.createElement(tag);
    element.textContent = String(value);
    if (className) element.className = className;
    return element;
  }

  function validReport(input) {
    if (!input || input.schemaVersion !== 1 || typeof input.label !== 'string') throw new Error('This is not a Vayam dashboard report.');
    const summary = input.summary;
    if (!summary || ['visitors', 'visits', 'productInterest', 'handoffs'].some(key => !Number.isFinite(Number(summary[key])))) {
      throw new Error('The report is missing one or more overview measures.');
    }
    for (const [key, limit] of Object.entries({trend: 366, countries: 80, sources: 20, cities: 80, products: 50, sections: 30, funnel: 20})) {
      if (!Array.isArray(input[key]) || input[key].length > limit) throw new Error('The ' + key + ' report is missing or too large.');
    }
    if (input.trend.some(row => !Array.isArray(row) || row.length !== 3 || row.some(value => !Number.isFinite(Number(value))))) {
      throw new Error('Daily trend rows must contain a day number, visitors and handoffs.');
    }
    return input;
  }

  function renderTrend(rows) {
    const chart = byId('trend-chart');
    chart.replaceChildren();
    if (!rows.length) return;
    const left = 38, right = 884, top = 20, bottom = 225;
    const max = Math.max(10, ...rows.map(row => integer(row[1])));
    const x = index => left + (right - left) * index / Math.max(1, rows.length - 1);
    const y = value => bottom - (bottom - top) * integer(value) / (max * 1.13);
    for (let step = 0; step < 4; step++) {
      const gy = top + step * (bottom - top) / 3;
      chart.appendChild(svg('line', {x1:left, x2:right, y1:gy, y2:gy, stroke:'#e5ebe2', 'stroke-width':1}));
      const label = svg('text', {x:2, y:gy + 4, fill:'#8b9a8a', 'font-size':11});
      label.textContent = String(Math.round(max * 1.13 * (1 - step / 3)));
      chart.appendChild(label);
    }
    const path = rows.map((row, index) => (index ? 'L' : 'M') + x(index).toFixed(1) + ' ' + y(row[1]).toFixed(1)).join(' ');
    chart.appendChild(svg('path', {d:path + ' L' + x(rows.length - 1).toFixed(1) + ' ' + bottom + ' L' + left + ' ' + bottom + ' Z',fill:'#e8eee5'}));
    rows.forEach((row, index) => {
      const handoff = integer(row[2]);
      if (!handoff) return;
      const bar = svg('rect', {x:x(index)-3,y:bottom-Math.min(42,handoff*10),width:6,height:Math.min(42,handoff*10),rx:3,fill:'#ba6030'});
      const hint = svg('title'); hint.textContent = 'Day ' + row[0] + ': ' + handoff + ' handoffs';
      bar.appendChild(hint);
      chart.appendChild(bar);
    });
    chart.appendChild(svg('path', {d:path,fill:'none',stroke:'#12392b','stroke-width':3,'stroke-linecap':'round','stroke-linejoin':'round'}));
    rows.forEach((row, index) => {
      if (index !== 0 && index !== rows.length - 1 && index % Math.max(1, Math.floor(rows.length / 7)) !== 0) return;
      const dot = svg('circle', {cx:x(index),cy:y(row[1]),r:4,fill:'#12392b',stroke:'#fffdf7','stroke-width':2});
      const hint = svg('title'); hint.textContent = 'Day ' + row[0] + ': ' + format(row[1]) + ' visitors';
      dot.appendChild(hint);
      chart.appendChild(dot);
    });
    const axis = byId('trend-axis');
    axis.replaceChildren();
    for (let i = 0; i < Math.min(5, rows.length); i++) {
      const row = rows[Math.round(i * (rows.length - 1) / Math.max(1, Math.min(5, rows.length) - 1))];
      axis.appendChild(text('span', 'Day ' + row[0]));
    }
  }

  function renderBars(id, rows, options = {}) {
    const target = byId(id);
    target.replaceChildren();
    const max = Math.max(1, ...rows.map(row => integer(row.value)));
    rows.forEach(row => {
      const item = text('div', '', 'bar-row');
      if (!options.noCode) item.appendChild(text('span', row.code || '—', 'code'));
      const middle = text('div', '');
      const meta = text('div', '', 'bar-meta');
      meta.appendChild(text('strong', row.name || 'Unknown'));
      middle.appendChild(meta);
      const track = text('div', '', 'track');
      const fill = document.createElement('i');
      fill.style.width = Math.max(2, integer(row.value) / max * 100) + '%';
      track.appendChild(fill);
      middle.appendChild(track);
      item.appendChild(middle);
      item.appendChild(text('span', format(row.value), 'count'));
      target.appendChild(item);
    });
  }

  function renderSources(rows) {
    const total = rows.reduce((sum, row) => sum + integer(row.value), 0);
    byId('source-total').firstChild.textContent = format(total);
    const palette = ['#e8894a', '#12392b', '#8ca765', '#d9c9a8', '#a2b7b4', '#885d48'];
    let cursor = 0;
    const stops = rows.map((row, index) => {
      const start = cursor;
      cursor += total ? integer(row.value) / total * 100 : 0;
      return palette[index % palette.length] + ' ' + start.toFixed(2) + '% ' + cursor.toFixed(2) + '%';
    });
    byId('source-donut').style.background = total ? 'conic-gradient(' + stops.join(',') + ')' : '#e5e8df';
    byId('source-donut').setAttribute('aria-label', 'Source mix across ' + format(total) + ' visits');
    const list = byId('source-list');
    list.replaceChildren();
    rows.forEach((row, index) => {
      const item = text('div', '', 'source-item');
      const dot = document.createElement('i'); dot.style.background = palette[index % palette.length];
      item.appendChild(dot);
      item.appendChild(text('span', row.name || 'Unknown'));
      item.appendChild(text('strong', format(row.value)));
      list.appendChild(item);
    });
  }

  function renderCities(rows) {
    const target = byId('city-list');
    target.replaceChildren();
    rows.forEach(row => {
      const item = text('div', '', 'city-row');
      item.appendChild(text('strong', row.name || 'Unknown'));
      item.appendChild(text('small', row.country || ''));
      item.appendChild(text('b', format(row.value)));
      target.appendChild(item);
    });
  }

  function renderSections(rows) {
    const target = byId('section-bars');
    target.replaceChildren();
    const max = Math.max(1, ...rows.map(row => integer(row.value)));
    rows.forEach(row => {
      const item = text('div', '', 'section-row');
      item.appendChild(text('span', row.name || 'Unknown'));
      const track = text('div', '', 'track');
      const fill = document.createElement('i');
      fill.style.width = Math.max(2, integer(row.value) / max * 100) + '%';
      track.appendChild(fill);
      item.appendChild(track);
      item.appendChild(text('strong', format(row.value)));
      target.appendChild(item);
    });
  }

  function renderFunnel(rows) {
    const target = byId('funnel-steps');
    target.replaceChildren();
    rows.forEach((row, index) => {
      const item = text('div', '', 'funnel-step');
      item.appendChild(text('span', String(index + 1).padStart(2, '0') + ' / ' + (row.name || 'Stage')));
      item.appendChild(text('strong', format(row.count)));
      item.appendChild(text('small', row.detail || ''));
      target.appendChild(item);
    });
  }

  function render(data, importedName = '') {
    current = validReport(data);
    byId('period-label').textContent = String(current.label).slice(0, 100);
    byId('metric-visitors').textContent = format(current.summary.visitors);
    byId('metric-visits').textContent = format(current.summary.visits);
    byId('metric-products').textContent = format(current.summary.productInterest);
    byId('metric-handoffs').textContent = format(current.summary.handoffs);
    renderTrend(current.trend);
    renderBars('country-bars', current.countries);
    renderSources(current.sources);
    renderCities(current.cities);
    renderBars('product-bars', current.products, {noCode:true});
    renderSections(current.sections);
    renderFunnel(current.funnel);
    const banner = byId('mode-banner');
    banner.classList.toggle('real', !!importedName);
    banner.querySelector('strong').textContent = importedName ? 'IMPORTED FILE · SOURCE UNVERIFIED' : 'DESIGN PREVIEW · ILLUSTRATIVE DATA';
    banner.querySelector('span').textContent = importedName ?
      'Showing ' + importedName + ' in this tab only. Verify report provenance before decisions.' :
      'Figures below are synthetic examples for layout review. They are not Vayam visitor statistics.';
  }

  byId('import-button').addEventListener('click', () => byId('import-file').click());
  byId('import-file').addEventListener('change', async event => {
    const file = event.target.files?.[0];
    if (!file) return;
    try {
      if (file.size > 2_000_000) throw new Error('Choose a report smaller than 2 MB.');
      render(JSON.parse(await file.text()), file.name.slice(0, 100));
    } catch (error) {
      const banner = byId('mode-banner');
      banner.querySelector('strong').textContent = 'REPORT NOT LOADED';
      banner.querySelector('span').textContent = error.message;
    }
    event.target.value = '';
  });
  byId('reset-demo').addEventListener('click', () => render(sample));
  render(sample);
})();
