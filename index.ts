interface XTreeNode {
  children?: Array<any>;
}


export class XMath {

  static wideTraversal<T extends XTreeNode>(
    root: T,
    handler: (node: T) => void,
    sort: (a: T, b: T) => number) {

    if (root === null || root === undefined) {
      return;
    }

    var queue: T[] = [];
    queue.unshift(root);
    while (queue.length > 0) {
      let np: T = queue.shift();

      if (handler !== undefined && handler !== null) {
        if (handler !== undefined && handler !== null) {
          handler(np);
        }
      }

      if (np.children === undefined || np.children === null) {
        continue;
      }

      if (sort === null || sort === undefined) {
        np.children
          .forEach((n, idx) => {
            queue.push(n);
          });
      }
      else {
        np.children
          .sort((a: T, b: T) => sort(a, b))
          .forEach((n, idx) => {
            queue.push(n);
          });
      }
    }
  }

  static deepTraversal<T extends XTreeNode>(
    root: T,
    handler: (node: T) => void,
    sort: (a: T, b: T) => number) {

    if (root === undefined || root === null) {
      return;
    }

    let np: T;
    let stack: T[] = [];

    stack.push(root);
    while (stack.length > 0) {
      np = stack.pop();
      if (handler !== null && handler !== undefined) {
        if (handler !== undefined && handler !== null) {
          handler(np);
        }
      }

      if (np.children === undefined || np.children === null) {
        continue;
      }

      if (sort === undefined || sort === null) {
        np.children
          .forEach(n => {
            stack.push(n);
          });

      }
      else {
        np.children
          .sort((a: T, b: T) => {
            return sort(a, b);
          })
          .forEach(n => {
            stack.push(n);
          });
      }
    }
  }

}


export interface TreeTableNode extends XTreeNode {
    id?: string;
    [propName: string]: any;

    // Set & Update by TreeTable, customer need not to provide them.
    _node?: {
        id: string;
        tnLevel: number;
        padding: string;
        collapsed: boolean;
        show: boolean;
        parent: TreeTableNode;
    };
}

export interface TreeTableOptions<T extends TreeTableNode> {
    // Default is 2rem
    indentUnit?: string;
    indentNumber?: number;
    compare(a: T, b: T): number;
    openModel?:boolean;
    nodes: Array<T>;
}
export interface  contrastItem{
    id?:string,
    userLabel?:string,
    collapsed?:boolean,
    show?:boolean
}

export class TreeTable<T extends TreeTableNode> {
    protected TID_PREFIX: string = '#';
    protected TID_SPLITER: string = '.';
    protected TID_START: number = 2;
    protected indentUnit = 'rem';
    protected indentNumber = 2;
    protected options: TreeTableOptions<T> = null;
    protected tableModel: Array<T> = new Array();
    protected contraItems:Array<contrastItem> = new Array();

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

        this.refresh(false,this.options.openModel);
    }

    public refresh(onlyUpdateId: boolean = false,openModel:boolean=false) {
        this.options.nodes
            .sort((a: T, b: T) => {
                return this.options.compare(a, b);
            })
            .forEach((n, idx) => {
                this.initTreeTableNode(n);
                n._node.id = this.TID_PREFIX + this.TID_SPLITER + idx;
                this.regenerateTreeTable(n, onlyUpdateId,openModel);
            });

        this.tableModel = this.tableModel.sort((a: T, b: T) => {
            return a._node.id.localeCompare(b._node_id);
        });
    }

    private regenerateTreeTable(root: T, onlyUpdateId: boolean = false,openModel:boolean=false) {
        XMath.wideTraversal(
            root,
            (node: T) => {
                if(!onlyUpdateId) {
                    this.tableModel.push(node);
                }
                if (node.children !== null && node.children !== undefined) {
                    node.children
                        .sort((a: T, b: T): number => {
                            return this.options.compare(a, b);
                        })
                        .forEach((n, idx) => {
                            this.initTreeTableNode(n);
                            // Format TreeNode
                            n._node.id = node._node.id + "." + idx;
                            node._node.collapsed=!openModel;
                            n._node.show = node._node.collapsed ? false : true;
                            n._node.tnLevel = node._node.tnLevel + 1;
                            n._node.parent = node;
                            this.setPadding(n);
                        });

                }
            },
            (a: T, b: T): number => {
                return this.options.compare(a, b);
            }
        );
    }

    public updateNodeId(root: T) {
        XMath.wideTraversal(
            root,
            (node: T) => {
                if (node.children !== null && node.children !== undefined) {
                    node.children
                        .sort((a: T, b: T): number => {
                            return this.options.compare(a, b);
                        })
                        .forEach((n, idx) => {
                            this.initTreeTableNode(n);
                            // Format TreeNode
                            n._node.id = node._node.id + "." + idx;
                            n._node.show = node._node.collapsed ? false : true;
                            n._node.tnLevel = node._node.tnLevel + 1;
                            n._node.parent = node;
                            this.setPadding(n);

                        });

                }
            },
            (a: T, b: T): number => {
                return this.options.compare(a, b);
            }
        );
    }

    private cleanModel() {
        this.tableModel.splice(0, this.tableModel.length);
    }

    protected setPadding(node: T) {
        node._node.padding = (node._node.tnLevel * this.indentNumber) *0.5 + this.indentUnit;
    }

    protected initTreeTableNode(node: T) {
        if (node._node === undefined || node._node === null) {
            node._node = {
                id: "",
                tnLevel: 0,
                padding: "",
                collapsed: true,
                show: true,
                parent: null
            }
        }
    }

    protected collapse(node: T) {
        node._node.collapsed = true;
        this.tableModel
            .filter((n) => {
                return n._node.id.indexOf(node._node.id + ".")>-1;
            })
            .forEach(
                n => {
                    n._node.collapsed = true;
                    n._node.show = false;
                }
            );

    }

    protected uncollapse(node: T) {
        node._node.collapsed = false;
        node.children.forEach(n => {
            n._node.show = true;
        });
    }

    public shownNodes() {
        return this.tableModel.filter(
            (n) => {
                return n._node.show;

            }
        ).sort((a: T, b: T) => {
            return this.sortTId(a, b);
        });
    }

    protected sortTId(a: T, b: T): number {
        let idA: string[] = a._node.id.split(this.TID_SPLITER);
        let idB: string[] = b._node.id.split(this.TID_SPLITER);

        return this.compareStringArray(idA, idB);
    }

    protected compareStringArray(a: string[], b: string[]) {
        let lenA = a.length;
        let lenB = b.length;
        if (lenA < lenB) {
            for (let i = 1; i < lenA; ++i) {
                if (a[i] == b[i]) {
                    continue;
                }
                else {
                    return Number(a[i]) < Number(b[i]) ? -1 : 1;
                }
            }
            return -1;
        }
        else if (lenA > lenB) {
            for (let i = 1; i < lenB; ++i) {
                if (a[i] == b[i]) {
                    continue;
                }
                else {
                    return Number(a[i]) < Number(b[i]) ? -1 : 1;
                }
            }
            return 1;
        }
        else {
            for (let i = 1; i < lenB; ++i) {
                if (a[i] == b[i]) {
                    continue;
                }
                else {
                    return Number(a[i]) < Number(b[i]) ? -1 : 1;
                }
            }
            return 0;
        }
    }

    protected addNode(parent: T, child: T,onlyUpdateId:boolean=true) {
        this.initTreeTableNode(child);
        if (parent === undefined || parent === null) {
            this.options.nodes.push(child);
            this.tableModel.push(child);
            this.refresh(onlyUpdateId);
        }
        else {
            if (parent.children === undefined || parent.children === null) {
                child._node.collapsed=true;
                parent.children = [child];
            }
            else {
                child._node.collapsed=true;
                parent.children.push(child);
            }
            // parent._node.collapsed=false;
            this.updateNodeId(parent);
            this.tableModel.push(child);
            this.tableModel = this.tableModel.sort((a: T, b: T) => {
                return a._node.id.localeCompare(b._node_id);
            });
        }
    }
    protected deleteNode(node: T,deleteTree:boolean=false) {
        let nodeId = node._node.id;
        for (let idx = this.tableModel.length - 1; idx >= 0; idx = idx - 1) {
            if (this.tableModel[idx]._node.id.indexOf(nodeId)>-1) {
                this.tableModel.splice(idx, 1);
                break
            }
        }
        if (node._node.parent === undefined || node._node.parent === null) {
            return;
        }
        let list = node._node.parent.children;
        if(list.length==0 && deleteTree){
            let parentNode=node._node.parent;
            this.cleanTreeNode(parentNode,deleteTree)
        }
        for (let idx = 0; idx < list.length; idx = idx + 1) {
            if (nodeId.localeCompare(list[idx]._node.id) == 0) {
                list.splice(idx, 1);
            }
        }
    }
    private cleanTreeNode(node,state){
      this.deleteNode(node,state);
    }
    protected addNodeGroup(parent: T, child: T,onlyUpdateId:boolean=true){
       this.initTreeTableNode(child);
       if (parent === undefined || parent === null) {
         this.options.nodes.push(child);
         this.tableModel.push(child);
         this.refresh(onlyUpdateId);
       }else{
         if (parent.children === undefined || parent.children === null) {
           child._node.collapsed=true;
           parent.children = [child];
         }
         parent._node.collapsed=false;
         this.updateNodeId(parent);
         this.tableModel.push(child);
         this.tableModel = this.tableModel.sort((a: T, b: T) => {
           return a._node.id.localeCompare(b._node_id);
         });
       }
       if (child.children === undefined || child.children === null || child.children.length==0) {
           return;
       }else{
         for(let tInx=0;tInx<child.children.length;tInx++){
            this.addNodeGroup(child,child.children[tInx]);
         }
       }
     }
    protected deleteNodeGroup(node: T) {
        let nodeId = node.id;
        for (let idx = 0; idx <this.tableModel.length;idx++) {
                if(this.tableModel[idx].id==nodeId){
                    this.tableModel.splice(idx,1);
                }
        }
        this.deleteNodeGroupChildren(node);
    }
    private deleteNodeGroupChildren(node){
        if (node.children !== undefined && node.children !== null && node.children.length>0) {
            for (let cidx = 0; cidx <node.children.length;cidx++) {
                for(let tInx=0;tInx<this.tableModel.length;tInx++){
                    if(node.children[cidx].id==this.tableModel[tInx].id){
                        this.tableModel.splice(tInx,1);
                        this.deleteNodeGroupChildren(node.children[cidx])
                    }
                }
            }
        }
    }
    public getNodes(node: T, predicate: (a: T, b: T) => number): Array<T> {
        let list: Array<T> = new Array;
        for (let idx = this.tableModel.length - 1; idx >= 0; idx = idx - 1) {
            if (predicate(this.tableModel[idx], node) == 0) {
                list.push(this.tableModel[idx]);
            }
        }
        return list;
    }

    public getNode(predicate: (node: T) => number): T {
        let node = this.tableModel.filter( n => {
            return predicate(n) == 0;
        });
        return node[0];
    }
    //contrastItem
    public  setContrastItem(){
            this.contraItems=[];
             let item:contrastItem={};
            for(let c=0;c<this.tableModel.length;c++){
                 item={"id":this.tableModel[c].eq.id,
                    "collapsed":this.tableModel[c]._node.collapsed,
                    "show":this.tableModel[c]._node.show,
                    "userLabel":this.tableModel[c].eq.userLabel};
                this.contraItems.push(item)
            }
    }
    public setTableContastItem(){
        for(let tn=0;tn<this.tableModel.length;tn++){
            for(let c=0;c<this.contraItems.length;c++){
                if(this.contraItems[c].id !==undefined){
                    if(this.tableModel[tn].eq.id==this.contraItems[c].id){
                        this.tableModel[tn]._node.collapsed=this.contraItems[c].collapsed;
                        this.tableModel[tn]._node.show=this.contraItems[c].show;
                    }
                }else{
                    if(this.tableModel[tn].eq.userLabel== this.contraItems[c].userLabel){
                        this.tableModel[tn]._node.collapsed=this.contraItems[c].collapsed;
                        this.tableModel[tn]._node.show=this.contraItems[c].show;
                    }
                }
            }
        }
    }
}