interface XTreeNode {
    children?: Array<any>;
}
export declare class XMath {
    static wideTraversal<T extends XTreeNode>(root: T, handler: (node: T) => void, sort: (a: T, b: T) => number): void;
    static deepTraversal<T extends XTreeNode>(root: T, handler: (node: T) => void, sort: (a: T, b: T) => number): void;
}
export interface TreeTableNode extends XTreeNode {
    id?: string;
    [propName: string]: any;
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
    indentUnit?: string;
    indentNumber?: number;
    compare(a: T, b: T): number;
    openModel?: boolean;
    nodes: Array<T>;
}
export interface contrastItem {
    id?: string;
    userLabel?: string;
    collapsed?: boolean;
    show?: boolean;
}
export declare class TreeTable<T extends TreeTableNode> {
    protected TID_PREFIX: string;
    protected TID_SPLITER: string;
    protected TID_START: number;
    protected indentUnit: string;
    protected indentNumber: number;
    protected options: TreeTableOptions<T>;
    protected tableModel: Array<T>;
    protected contraItems: Array<contrastItem>;
    constructor();
    getTableModel(): Array<T>;
    setOptions(options: TreeTableOptions<T>): void;
    refresh(onlyUpdateId?: boolean, openModel?: boolean): void;
    private regenerateTreeTable;
    updateNodeId(root: T): void;
    private cleanModel;
    protected setPadding(node: T): void;
    protected initTreeTableNode(node: T): void;
    protected collapse(node: T): void;
    protected uncollapse(node: T): void;
    shownNodes(): T[];
    protected sortTId(a: T, b: T): number;
    protected compareStringArray(a: string[], b: string[]): 0 | 1 | -1;
    protected addNode(parent: T, child: T, onlyUpdateId?: boolean): void;
    protected deleteNode(node: T, deleteTree?: boolean): void;
    private cleanTreeNode;
    protected addNodeGroup(parent: T, child: T, onlyUpdateId?: boolean): void;
    protected deleteNodeGroup(node: T): void;
    private deleteNodeGroupChildren;
    getNodes(node: T, predicate: (a: T, b: T) => number): Array<T>;
    getNode(predicate: (node: T) => number): T;
    setContrastItem(): void;
    setTableContastItem(): void;
}
export {};
