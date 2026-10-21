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
	table.querySelectorAll<HTMLSelectElement>('[data-compare-select]').forEach((select) => {
		select.addEventListener('change', () => {
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
		});
	});
}
