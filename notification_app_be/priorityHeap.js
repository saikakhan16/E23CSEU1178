class TopNHeap {
  constructor(maxSize = 10) {
    this.maxSize = maxSize;
    this.heap = [];
  }

  insert(item) {
    if (this.heap.length < this.maxSize) {
      this.heap.push(item);
      this._bubbleUp(this.heap.length - 1);
    } else if (item.score > this.heap[0].score) {
      this.heap[0] = item;
      this._siftDown(0);
    }
  }

  getTopN() {
    return [...this.heap].sort((a, b) => b.score - a.score);
  }

  get size() { return this.heap.length; }

  _parent(i)  { return Math.floor((i - 1) / 2); }
  _left(i)    { return 2 * i + 1; }
  _right(i)   { return 2 * i + 2; }
  _swap(i, j) { [this.heap[i], this.heap[j]] = [this.heap[j], this.heap[i]]; }

  _bubbleUp(i) {
    while (i > 0) {
      const p = this._parent(i);
      if (this.heap[p].score <= this.heap[i].score) break;
      this._swap(i, p);
      i = p;
    }
  }

  _siftDown(i) {
    const n = this.heap.length;
    while (true) {
      let smallest = i;
      const l = this._left(i), r = this._right(i);
      if (l < n && this.heap[l].score < this.heap[smallest].score) smallest = l;
      if (r < n && this.heap[r].score < this.heap[smallest].score) smallest = r;
      if (smallest === i) break;
      this._swap(i, smallest);
      i = smallest;
    }
  }
}

module.exports = TopNHeap;