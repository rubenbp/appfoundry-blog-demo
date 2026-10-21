interface CompareGame {
	id: string;
	title: string;
	visual: string;
	palette: string;
	fields: Record<string, string>;
}

const table = document.querySelector<HTMLTableElement>('.compare-table');
if (table) {
	let games: CompareGame[] = [];
	try {
		games = JSON.parse(table.dataset.games ?? '[]');
	} catch {
		// The initial comparison and the links still work without the interactive data.
	}
	const byId = new Map(games.map((game) => [game.id, game]));
	const selects = [...table.querySelectorAll<HTMLSelectElement>('[data-compare-select]')];
	const defaults = selects.map((select) => select.value);
	const parameter = (index: number) => `juego${index + 1}`;
	const writeURL = (method: 'pushState' | 'replaceState') => {
		const url = new URL(location.href);
		selects.forEach((item, index) => url.searchParams.set(parameter(index), item.value));
		history[method](null, '', url);
	};
	const render = (select: HTMLSelectElement) => {
		const slot = select.dataset.compareSelect;
		const game = byId.get(select.value);
		if (slot === undefined) return;
		const card = table.querySelector<HTMLElement>(`[data-compare-game="${slot}"]`);
		const empty = table.querySelector<HTMLElement>(`[data-compare-empty="${slot}"]`);
		if (!card || !empty) return;
		card.hidden = !game;
		empty.hidden = !!game;
		if (game) {
			const art = card.querySelector<HTMLElement>('.game-art');
			const image = card.querySelector<HTMLImageElement>('.game-art__scene');
			const link = card.querySelector<HTMLAnchorElement>('.compare-game__link');
			if (art) art.className = `game-art ${game.palette} visual-${game.visual}`;
			if (image) image.src = `/art/${game.visual}.svg`;
			if (link) {
				link.href = `/juegos/${game.id}/`;
				link.replaceChildren(document.createTextNode(game.title + ' '), Object.assign(document.createElement('span'), { textContent: '↗', ariaHidden: 'true' }));
			}
		}
		table.querySelectorAll<HTMLTableRowElement>('[data-compare-field]').forEach((row) => {
			const cell = row.querySelector<HTMLTableCellElement>(`[data-compare-cell="${slot}"]`);
			if (cell) cell.textContent = game?.fields[row.dataset.compareField ?? ''] ?? '—';
		});
	};
	const restore = () => {
		const params = new URLSearchParams(location.search);
		// Without comparison parameters, keep the two editorial starter games.
		if (!selects.some((_, index) => params.has(parameter(index)))) {
			selects.forEach((select, index) => { select.value = defaults[index] ?? ''; });
		} else {
			selects.forEach((select, index) => {
				const id = params.get(parameter(index)) ?? '';
				select.value = byId.has(id) ? id : '';
			});
		}
		selects.forEach(render);
	};
	selects.forEach((select) => {
		select.addEventListener('change', () => {
			render(select);
			writeURL('pushState');
		});
	});
	const initialParams = new URLSearchParams(location.search);
	restore();
	// Even the starter comparison has a shareable URL with all four positions.
	if (!selects.some((_, index) => initialParams.has(parameter(index)))) writeURL('replaceState');
	window.addEventListener('popstate', restore);
}
