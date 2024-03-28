//a flexible minheap implementation that supports custom comparator functions to store essentially any data you want. See the MinHeap.Comparators for examples.
export class MinHeap {
	static Comparators = {
		num: (a,b) => a - b,
		string: (a,b) => {
			if(a < b) return -1
			if(b > a) return 1
			return 0
		}
	} 

	static heapsort(arr){
		const sorted = []
		const heap = new MinHeap()
		for(const el of arr)
			heap.insert(el)
		while(heap.size > 0){
			sorted.push(heap.extract())
		}
		return sorted;
	}

	static LEFT(i){ return 2*i }
	static RIGHT(i) { return 2*i+1 }
	static PARENT(i) { return Math.floor(i/2) }

	constructor(compare_fn=MinHeap.Comparators.num){
		this.items = [null];
		this.size = 0
		this.compare = compare_fn;
	}
	insert(item){
		this.size++;
		this.items.push(item)
		this.heapifyUp();
	}
	heapifyUp(){
		let i = this.size, p = MinHeap.PARENT(i); 
		while( p > 0 ){
			const childValue = this.items[i];
			const parentValue = this.items[p]
			if(this.compare(parentValue,childValue) > 0) {
				this.items[p] = childValue;
				this.items[i] = parentValue;
			}
			i = p;
			p = MinHeap.PARENT(i);
		}
	}
	extract(){
		if(this.size == 0) {
			console.error("Heap Empty!")
			return null;
		}
		const max = this.items[1];
		this.items[1] = this.items[this.size];
		this.size--;
		this.items.pop();
		this.heapifyDown();
		return max;
	}
	getSmallerChildIndex(idx){
		const [left,right] = [MinHeap.LEFT(idx),MinHeap.RIGHT(idx)]
		if(right > this.size) return left;
		if(this.compare(this.items[left], this.items[right]) < 0) 
			return left;
		return right;
	}
	heapifyDown(){
		let i = 1; 
		while(MinHeap.LEFT(i) <= this.size){
			const smaller_idx = this.getSmallerChildIndex(i)
			const parent = this.items[i]
			const child = this.items[smaller_idx]
			if( this.compare(parent,child) > 0){
				this.items[i] = child;
				this.items[smaller_idx] = parent; 
			}
			i = smaller_idx;
		}
	}
	print(){
		let st = "[TOP] "
		for(let i = 1; i <= this.size; i++)
			st += `${this.items[i]} `
		console.log( st + " [BOTTOM]" );
	}
}