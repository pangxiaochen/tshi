"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.TreeTable = exports.XMath = void 0;
var XMath = /** @class */ (function () {
    function XMath() {
    }
    XMath.wideTraversal = function (root, handler, sort) {
        if (root === null || root === undefined) {
            return;
        }
        var queue = [];
        queue.unshift(root);
        while (queue.length > 0) {
            var np = queue.shift();
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
                    .forEach(function (n, idx) {
                    queue.push(n);
                });
            }
            else {
                np.children
                    .sort(function (a, b) { return sort(a, b); })
                    .forEach(function (n, idx) {
                    queue.push(n);
                });
            }
        }
    };
    XMath.deepTraversal = function (root, handler, sort) {
        if (root === undefined || root === null) {
            return;
        }
        var np;
        var stack = [];
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
                    .forEach(function (n) {
                    stack.push(n);
                });
            }
            else {
                np.children
                    .sort(function (a, b) {
                    return sort(a, b);
                })
                    .forEach(function (n) {
                    stack.push(n);
                });
            }
        }
    };
    return XMath;
}());
exports.XMath = XMath;
var TreeTable = /** @class */ (function () {
    function TreeTable() {
        this.TID_PREFIX = '#';
        this.TID_SPLITER = '.';
        this.TID_START = 2;
        this.indentUnit = 'rem';
        this.indentNumber = 2;
        this.options = null;
        this.tableModel = new Array();
        this.contraItems = new Array();
        this.TID_START = this.TID_PREFIX.length + this.TID_SPLITER.length;
    }
    TreeTable.prototype.getTableModel = function () {
        return this.tableModel;
    };
    TreeTable.prototype.setOptions = function (options) {
        this.cleanModel();
        this.options = options;
        if (this.options.indentUnit !== undefined && this.options.indentUnit !== null) {
            this.indentUnit = this.options.indentUnit;
        }
        if (this.options.indentNumber !== undefined && this.options.indentNumber !== null) {
            this.indentNumber = this.options.indentNumber;
        }
        this.refresh(false, this.options.openModel);
    };
    TreeTable.prototype.refresh = function (onlyUpdateId, openModel) {
        var _this = this;
        if (onlyUpdateId === void 0) { onlyUpdateId = false; }
        if (openModel === void 0) { openModel = false; }
        this.options.nodes
            .sort(function (a, b) {
            return _this.options.compare(a, b);
        })
            .forEach(function (n, idx) {
            _this.initTreeTableNode(n);
            n._node.id = _this.TID_PREFIX + _this.TID_SPLITER + idx;
            _this.regenerateTreeTable(n, onlyUpdateId, openModel);
        });
        this.tableModel = this.tableModel.sort(function (a, b) {
            return a._node.id.localeCompare(b._node_id);
        });
    };
    TreeTable.prototype.regenerateTreeTable = function (root, onlyUpdateId, openModel) {
        var _this = this;
        if (onlyUpdateId === void 0) { onlyUpdateId = false; }
        if (openModel === void 0) { openModel = false; }
        XMath.wideTraversal(root, function (node) {
            if (!onlyUpdateId) {
                _this.tableModel.push(node);
            }
            if (node.children !== null && node.children !== undefined) {
                node.children
                    .sort(function (a, b) {
                    return _this.options.compare(a, b);
                })
                    .forEach(function (n, idx) {
                    _this.initTreeTableNode(n);
                    // Format TreeNode
                    n._node.id = node._node.id + "." + idx;
                    node._node.collapsed = !openModel;
                    n._node.show = node._node.collapsed ? false : true;
                    n._node.tnLevel = node._node.tnLevel + 1;
                    n._node.parent = node;
                    _this.setPadding(n);
                });
            }
        }, function (a, b) {
            return _this.options.compare(a, b);
        });
    };
    TreeTable.prototype.updateNodeId = function (root) {
        var _this = this;
        XMath.wideTraversal(root, function (node) {
            if (node.children !== null && node.children !== undefined) {
                node.children
                    .sort(function (a, b) {
                    return _this.options.compare(a, b);
                })
                    .forEach(function (n, idx) {
                    _this.initTreeTableNode(n);
                    // Format TreeNode
                    n._node.id = node._node.id + "." + idx;
                    n._node.show = node._node.collapsed ? false : true;
                    n._node.tnLevel = node._node.tnLevel + 1;
                    n._node.parent = node;
                    _this.setPadding(n);
                });
            }
        }, function (a, b) {
            return _this.options.compare(a, b);
        });
    };
    TreeTable.prototype.cleanModel = function () {
        this.tableModel.splice(0, this.tableModel.length);
    };
    TreeTable.prototype.setPadding = function (node) {
        node._node.padding = (node._node.tnLevel * this.indentNumber) * 0.5 + this.indentUnit;
    };
    TreeTable.prototype.initTreeTableNode = function (node) {
        if (node._node === undefined || node._node === null) {
            node._node = {
                id: "",
                tnLevel: 0,
                padding: "",
                collapsed: true,
                show: true,
                parent: null
            };
        }
    };
    TreeTable.prototype.collapse = function (node) {
        node._node.collapsed = true;
        this.tableModel
            .filter(function (n) {
            return n._node.id.indexOf(node._node.id + ".") > -1;
        })
            .forEach(function (n) {
            n._node.collapsed = true;
            n._node.show = false;
        });
    };
    TreeTable.prototype.uncollapse = function (node) {
        node._node.collapsed = false;
        node.children.forEach(function (n) {
            n._node.show = true;
        });
    };
    TreeTable.prototype.shownNodes = function () {
        var _this = this;
        return this.tableModel.filter(function (n) {
            return n._node.show;
        }).sort(function (a, b) {
            return _this.sortTId(a, b);
        });
    };
    TreeTable.prototype.sortTId = function (a, b) {
        var idA = a._node.id.split(this.TID_SPLITER);
        var idB = b._node.id.split(this.TID_SPLITER);
        return this.compareStringArray(idA, idB);
    };
    TreeTable.prototype.compareStringArray = function (a, b) {
        var lenA = a.length;
        var lenB = b.length;
        if (lenA < lenB) {
            for (var i = 1; i < lenA; ++i) {
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
            for (var i = 1; i < lenB; ++i) {
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
            for (var i = 1; i < lenB; ++i) {
                if (a[i] == b[i]) {
                    continue;
                }
                else {
                    return Number(a[i]) < Number(b[i]) ? -1 : 1;
                }
            }
            return 0;
        }
    };
    TreeTable.prototype.addNode = function (parent, child, onlyUpdateId) {
        if (onlyUpdateId === void 0) { onlyUpdateId = true; }
        this.initTreeTableNode(child);
        if (parent === undefined || parent === null) {
            this.options.nodes.push(child);
            this.tableModel.push(child);
            this.refresh(onlyUpdateId);
        }
        else {
            if (parent.children === undefined || parent.children === null) {
                child._node.collapsed = true;
                parent.children = [child];
            }
            else {
                child._node.collapsed = true;
                parent.children.push(child);
            }
            // parent._node.collapsed=false;
            this.updateNodeId(parent);
            this.tableModel.push(child);
            this.tableModel = this.tableModel.sort(function (a, b) {
                return a._node.id.localeCompare(b._node_id);
            });
        }
    };
    TreeTable.prototype.deleteNode = function (node, deleteTree) {
        if (deleteTree === void 0) { deleteTree = false; }
        var nodeId = node._node.id;
        for (var idx = this.tableModel.length - 1; idx >= 0; idx = idx - 1) {
            if (this.tableModel[idx]._node.id.indexOf(nodeId) > -1) {
                this.tableModel.splice(idx, 1);
                break;
            }
        }
        if (node._node.parent === undefined || node._node.parent === null) {
            return;
        }
        var list = node._node.parent.children;
        if (list.length == 0 && deleteTree) {
            var parentNode = node._node.parent;
            this.cleanTreeNode(parentNode, deleteTree);
        }
        for (var idx = 0; idx < list.length; idx = idx + 1) {
            if (nodeId.localeCompare(list[idx]._node.id) == 0) {
                list.splice(idx, 1);
            }
        }
    };
    TreeTable.prototype.cleanTreeNode = function (node, state) {
        this.deleteNode(node, state);
    };
    TreeTable.prototype.addNodeGroup = function (parent, child, onlyUpdateId) {
        if (onlyUpdateId === void 0) { onlyUpdateId = true; }
        this.initTreeTableNode(child);
        if (parent === undefined || parent === null) {
            this.options.nodes.push(child);
            this.tableModel.push(child);
            this.refresh(onlyUpdateId);
        }
        else {
            if (parent.children === undefined || parent.children === null) {
                child._node.collapsed = true;
                parent.children = [child];
            }
            parent._node.collapsed = false;
            this.updateNodeId(parent);
            this.tableModel.push(child);
            this.tableModel = this.tableModel.sort(function (a, b) {
                return a._node.id.localeCompare(b._node_id);
            });
        }
        if (child.children === undefined || child.children === null || child.children.length == 0) {
            return;
        }
        else {
            for (var tInx = 0; tInx < child.children.length; tInx++) {
                this.addNodeGroup(child, child.children[tInx]);
            }
        }
    };
    TreeTable.prototype.deleteNodeGroup = function (node) {
        var nodeId = node.id;
        for (var idx = 0; idx < this.tableModel.length; idx++) {
            if (this.tableModel[idx].id == nodeId) {
                this.tableModel.splice(idx, 1);
            }
        }
        this.deleteNodeGroupChildren(node);
    };
    TreeTable.prototype.deleteNodeGroupChildren = function (node) {
        if (node.children !== undefined && node.children !== null && node.children.length > 0) {
            for (var cidx = 0; cidx < node.children.length; cidx++) {
                for (var tInx = 0; tInx < this.tableModel.length; tInx++) {
                    if (node.children[cidx].id == this.tableModel[tInx].id) {
                        this.tableModel.splice(tInx, 1);
                        this.deleteNodeGroupChildren(node.children[cidx]);
                    }
                }
            }
        }
    };
    TreeTable.prototype.getNodes = function (node, predicate) {
        var list = new Array;
        for (var idx = this.tableModel.length - 1; idx >= 0; idx = idx - 1) {
            if (predicate(this.tableModel[idx], node) == 0) {
                list.push(this.tableModel[idx]);
            }
        }
        return list;
    };
    TreeTable.prototype.getNode = function (predicate) {
        var node = this.tableModel.filter(function (n) {
            return predicate(n) == 0;
        });
        return node[0];
    };
    //contrastItem
    TreeTable.prototype.setContrastItem = function () {
        this.contraItems = [];
        var item = {};
        for (var c = 0; c < this.tableModel.length; c++) {
            item = { "id": this.tableModel[c].eq.id,
                "collapsed": this.tableModel[c]._node.collapsed,
                "show": this.tableModel[c]._node.show,
                "userLabel": this.tableModel[c].eq.userLabel };
            this.contraItems.push(item);
        }
    };
    TreeTable.prototype.setTableContastItem = function () {
        for (var tn = 0; tn < this.tableModel.length; tn++) {
            for (var c = 0; c < this.contraItems.length; c++) {
                if (this.contraItems[c].id !== undefined) {
                    if (this.tableModel[tn].eq.id == this.contraItems[c].id) {
                        this.tableModel[tn]._node.collapsed = this.contraItems[c].collapsed;
                        this.tableModel[tn]._node.show = this.contraItems[c].show;
                    }
                }
                else {
                    if (this.tableModel[tn].eq.userLabel == this.contraItems[c].userLabel) {
                        this.tableModel[tn]._node.collapsed = this.contraItems[c].collapsed;
                        this.tableModel[tn]._node.show = this.contraItems[c].show;
                    }
                }
            }
        }
    };
    return TreeTable;
}());
exports.TreeTable = TreeTable;
