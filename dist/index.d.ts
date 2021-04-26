export interface XTreeNode {
    children?: Array<any>;
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
        parent: TreeTableNode | null;
    };
}
export interface TreeTableOptions<T extends TreeTableNode> {
    indentUnit?: string;
    indentNumber?: number;
    compare(a: T, b: T): number;
    openModel?: boolean;
    nodes: Array<T>;
}
export declare class TreeTable<T extends TreeTableNode> {
    protected TID_PREFIX: string;
    protected TID_SPLITER: string;
    protected TID_START: number;
    protected indentUnit: string;
    protected indentNumber: number;
    protected options: TreeTableOptions<T> | null;
    protected tableModel: Array<T>;
    constructor();
    getTableModel(): Array<T>;
    setOptions(options: TreeTableOptions<T>): void;
    protected refresh(onlyUpdateId?: boolean, openAllModel?: boolean): void;
    protected cleanModel(): void;
    protected deleteNode(node: T): void;
    protected deleteNodeGroup(node: T): void;
    protected addNode(node: T, parent: T): void;
    getNodeLocation(node: T): number;
    protected regenerateTreeTable(root: T, level?: number, onlyUpdateId?: boolean, openModal?: boolean): void;
    protected setPadding(node: T): void;
    protected initTreeTableNode(node: T, level?: number): void;
    showNodes(): T[];
    collapsNode(node: T): void;
    uncollapse(node: any): void;
    protected showTId(a: T, b: T): number;
    commpareStringArray(a: string[], b: string[]): number;
}
