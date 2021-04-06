export const common={
    checkIn(list:any[],item:any,key:string){
        let i=0;
        let isIndex=-1;
        while (i<list.length){
            if(list[i][key]===item.key){
                isIndex=i;
                return isIndex;
            }
            i++;
        }
        return isIndex
    },
    add(a:number, b:number) : number {
        return a + b;
    }

}