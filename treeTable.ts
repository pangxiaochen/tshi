export interface XTreeNode{
  children?:Array<any>;
}

export interface  TreeTableNode extends XTreeNode{
  id?:string;
  [propName:string]:any;
  _node?:{
    id:string;
    tnLevel:number;
    padding:string;
    collapsed:boolean;
    show:boolean;
    parent:TreeTableNode |null;
  }
}

export interface  TreeTableOptions <T extends TreeTableNode>{

  indentUnit?:string;
  indentNumber?:number;
  compare(a:T,b:T):number;
  openModel?:boolean;
  nodes:Array<T>;
}

export class TreeTable <T extends TreeTableNode> {
  protected TID_PREFIX: string = '#';
  protected TID_SPLITER: string = '.';
  protected TID_START: number = 2;
  protected indentUnit = 'rem';
  protected indentNumber = 2;
  protected options: TreeTableOptions<T> | null = null;
  protected tableModel: Array<T> = new Array();

  constructor() {
    this.TID_START = this.TID_PREFIX.length + this.TID_SPLITER.length;
  }

  public getTableModel(): Array<T> {
    return this.tableModel;
  }

  public setOptions(options: TreeTableOptions<T>) {
    this.cleanModel();
    this.options = options;
    if (this.options.indentUnit !== undefined && this.options.indentUnit !== null) {
      this.indentUnit = this.options.indentUnit;
    }
    if (this.options.indentNumber !== undefined && this.options.indentNumber !== null) {
      this.indentNumber = this.options.indentNumber;
    }

    this.refresh();
  }

  protected refresh(onlyUpdateId: boolean = false, openAllModel: boolean = false) {
    if (this.options === null) {
      return
    }
    this.options.nodes.forEach((node, inx) => {
      this.initTreeTableNode(node);
      if (node._node != undefined) {
        node._node["id"] = this.TID_PREFIX + this.TID_SPLITER + inx;
      }
      this.regenerateTreeTable(node)
    })
  }

  protected cleanModel() {
    this.tableModel.splice(0, this.tableModel.length);
  }

  protected deleteNode(node: T) {
    this.tableModel = this.tableModel.filter((item) => node.id != item.id);
  }

  protected deleteNodeGroup(node: T) {
    for (let n = 0; n < this.tableModel.length; n++) {
      if (this.tableModel[n].id == node.id) {
        if (node.children && node.children.length > 0) {
          node.children.forEach((item, index) => {
            this.deleteNode(item);
          })
        }
      }
    }

  }

  protected addNode(node: T, parent: T) {
    if (node === null || node === undefined) {
      return;
    }
    if (parent != undefined && parent !== null) {

      if (parent.children != undefined && parent.children != null) {
        parent.children.push(node);
        this.tableModel.splice(this.getNodeLocation(node), 1, node)
      }
    } else {
      this.tableModel.push(node);
    }

  }

  getNodeLocation(node: T): number {
    let inx = -1;
    for (let i = 0; i < this.tableModel.length; i++) {
      if (this.tableModel[i].id == node.id) {
        inx = i;
        return inx
      }
    }
    return inx;
  }

  protected regenerateTreeTable(root: T,level:number=0,onlyUpdateId: boolean = false, openModal: boolean = false) {
    let node = root;
    if (node == undefined) {
      return
    }
    if (!onlyUpdateId) {
      this.tableModel.push(node);
    }
    if (node.children !== null && node.children !== undefined && node.children.length>0) {
      node.children.forEach((n, idx) => {
        this.initTreeTableNode(n);
        n._node.id = node._node.id + '.' + idx;
        n._node.collapsed = !openModal;
        n._node.show = !n._node.collapsed;
        n._node.tnLevel = n._node.tnLevel + 1+level;
        n._node.parent = node;
        this.setPadding(n);
        if(n.children.length>0){
          this.regenerateTreeTable(n,n._node.tnLevel)
        }else{
          this.tableModel.push(n);
        }
      })
    }
    else{
      return
    }
  }

  protected setPadding(node: T) {
    if (node._node === undefined || node._node === null) {
      return
    }
    node._node.padding = (node._node.tnLevel * this.indentNumber) * 0.5 + this.indentUnit;
  }

  protected initTreeTableNode(node: T,level:number=0) {
    if (node._node === undefined || node._node === null) {
      node._node = {
        id: "",
        tnLevel: level,
        padding: "",
        collapsed: true,
        show: true,
        parent: null
      }
    }
  }

  public showNodes() {
    return this.tableModel.filter((n) => {
      return n._node.show;
    })
  }

  public collapsNode(node:T){
    if(node._node ==undefined){return}
    node._node.collapsed=true;
    this.tableModel.filter((n)=>{
      return n._node.id !=node._node.id && n._node.id.indexOf(node._node.id)>-1
    }).forEach(n=>{
      if(n._node !=undefined){
        n._node.collapsed=true;
        n._node.show=false;
      }
    })

  }

  public uncollapse(node){
    if(node._node ==undefined){return}
    node._node.collapsed=false;
    if(node.children !=undefined && node.children.length>0){
      node.children.forEach((n,idx)=>{
        n._node.show=true;
      })
    }
  }


  protected showTId(a: T, b: T): number {
    let idA: string[] = a._node.id.split(this.TID_SPLITER);
    let idB: string[] = b._node.id.split(this.TID_SPLITER);
    return this.commpareStringArray(idA,idB);
  }

  commpareStringArray(a: string[], b: string[]):number{
    let lenA = a.length;
    let lenB = b.length;

    if (lenA < lenB) {
      for (let i = 0; i < lenA; i++) {
        if (a[i] == b[i]) {
          continue;
        } else {
          return Number(a[i]) < Number(b[i]) ? -1 : 1;
        }
      }
      return -1;
    }
    else if (lenA > lenB) {
      for (let i = 0; i < lenB; i++) {
        if (a[i] == b[i]) {
          continue;
        }else {
          return Number(a[i]) < Number(b[i]) ? -1 : 1;
        }
        return 1;
      }
    }
    else {
      for (let i = 0; i < lenB; i++) {
        if (a[i] == b[i]) {
          continue;
        }else {
          return Number(a[i]) < Number(b[i]) ? -1 : 1;
        }
        return 0;
      }
    }
    return -1;
  }
}
