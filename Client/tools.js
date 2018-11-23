class Tools{
	static compareBoards(arr){
		let pArr = [];
		for(let b of arr){
			pArr.push(b.pieces);
		}
		for(let b of pArr){
			let eq = this.includes2DArray(b, pArr);
			
		}
	}

	static compareNodes(nArr){
		let arr = [];
		for(let n of nArr){
			arr.push(n.data);
		}
		this.compareBoards(arr);
	}

	static includes2DArray(array2D, arr){
		let equalArr = [];
		for(let a of arr){
			if(arr == array2D){
				continue;
			}
			if(array2D.join('-') === a.join('-')){
				if(equalArr.length == 0){
					equalArr.push(array2D);
				}
				equalArr.push(a);
			}
		}
		return equalArr;
	}
}