/**
 * HiddenObjectGame — pure game logic, no DOM. Find the lucky charm.
 *
 *   const g = new HiddenObjectGame({ spots, hideable, wrong, generic, already, labels });
 *     wrong   { [spotId]: lines }  — lines that belong to that object
 *     generic fallback lines for objects that have none of their own
 *     already lines for re-searching; "{label}" becomes the object's label
 *   g.search('camera') → { result: 'wrong' | 'found' | 'already' | 'over', message, tries }
 *   g.restart()        → hides the charm under a new random object
 *
 * Repeated or spammed searches can never break state: after a win every search
 * returns 'over' until restart(), and messages never repeat back-to-back.
 */
export class HiddenObjectGame {
  constructor({ spots, hideable, wrong, generic = [], already, labels = {}, random = Math.random }) {
    this.spots = new Set(spots);
    this.hideable = hideable.filter((id) => this.spots.has(id));
    this.wrongLines = wrong;
    this.genericLines = generic;
    this.alreadyLines = already;
    this.labels = labels;
    this.random = random;
    this.lastLine = null;
    this.lastTarget = null;
    this.restart();
  }

  restart() {
    const pool = this.hideable.length > 1 ? this.hideable.filter((id) => id !== this.lastTarget) : this.hideable;
    this.target = pool[Math.floor(this.random() * pool.length)];
    this.lastTarget = this.target;
    this.searched = new Set();
    this.tries = 0;
    this.found = false;
    return this.target;
  }

  pickLine(list) {
    if (list.length < 2) return list[0];
    let line;
    do line = list[Math.floor(this.random() * list.length)]; while (line === this.lastLine);
    this.lastLine = line;
    return line;
  }

  search(id) {
    if (!this.spots.has(id)) return { result: 'ignored' };
    if (this.found) return { result: 'over', tries: this.tries };
    if (this.searched.has(id)) {
      const label = this.labels[id] || 'that';
      return { result: 'already', message: this.pickLine(this.alreadyLines).replace('{label}', label), tries: this.tries };
    }
    this.searched.add(id);
    this.tries++;
    if (id === this.target) { this.found = true; return { result: 'found', tries: this.tries }; }
    return { result: 'wrong', message: this.wrongLine(id), tries: this.tries };
  }

  /** A line about the object that was clicked (generic only if it has none of its own). */
  wrongLine(id) {
    const own = this.wrongLines[id] || [];
    return this.pickLine(own.length ? own : this.genericLines);
  }
}
