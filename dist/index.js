"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.TreeTable = void 0;
var TreeTable = /** @class */ (function () {
    function TreeTable() {
        this.TID_PREFIX = '#';
        this.TID_SPLITER = '.';
        this.TID_START = 2;
        this.indentUnit = 'rem';
        this.indentNumber = 2;
        this.options = null;
        this.tableModel = new Array();
        this.TID_START = this.TID_PREFIX.length + this.TID_SPLITER.length;
    }
    TreeTable.prototype.getTableModel = function () {
        return this.tableModel;
    };
    TreeTable.prototype.setOptions = function (options) {
        this.cleanModel();
        this.options = options;
        //
        if (this.options.indentUnit !== undefined && this.options.indentUnit !== null) {
            this.indentUnit = this.options.indentUnit;
        }
        //
        if (this.options.indentNumber !== undefined && this.options.indentNumber !== null) {
            this.indentNumber = this.options.indentNumber;
        }
        this.refresh();
    };
    TreeTable.prototype.refresh = function (onlyUpdateId, openAllModel) {
        var _this = this;
        if (onlyUpdateId === void 0) { onlyUpdateId = false; }
        if (openAllModel === void 0) { openAllModel = false; }
        if (this.options === null) {
            return;
        }
        this.options.nodes.forEach(function (node, inx) {
            _this.initTreeTableNode(node);
            if (node._node != undefined) {
                node._node["id"] = _this.TID_PREFIX + _this.TID_SPLITER + inx;
            }
            _this.regenerateTreeTable(node);
        });
    };
    TreeTable.prototype.cleanModel = function () {
        this.tableModel.splice(0, this.tableModel.length);
    };
    TreeTable.prototype.deleteNode = function (node) {
        this.tableModel = this.tableModel.filter(function (item) { return node.id != item.id; });
    };
    TreeTable.prototype.deleteNodeGroup = function (node) {
        var _this = this;
        for (var n = 0; n < this.tableModel.length; n++) {
            if (this.tableModel[n].id == node.id) {
                if (node.children && node.children.length > 0) {
                    node.children.forEach(function (item, index) {
                        _this.deleteNode(item);
                    });
                }
            }
        }
    };
    TreeTable.prototype.addNode = function (node, parent) {
        if (node === null || node === undefined) {
            return;
        }
        if (parent != undefined && parent !== null) {
            if (parent.children != undefined && parent.children != null) {
                parent.children.push(node);
                this.tableModel.splice(this.getNodeLocation(node), 1, node);
            }
        }
        else {
            this.tableModel.push(node);
        }
    };
    TreeTable.prototype.getNodeLocation = function (node) {
        var inx = -1;
        for (var i = 0; i < this.tableModel.length; i++) {
            if (this.tableModel[i].id == node.id) {
                inx = i;
                return inx;
            }
        }
        return inx;
    };
    TreeTable.prototype.regenerateTreeTable = function (root, level, onlyUpdateId, openModal) {
        var _this = this;
        if (level === void 0) { level = 0; }
        if (onlyUpdateId === void 0) { onlyUpdateId = false; }
        if (openModal === void 0) { openModal = false; }
        var node = root;
        if (node == undefined) {
            return;
        }
        if (!onlyUpdateId) {
            this.tableModel.push(node);
        }
        if (node.children !== null && node.children !== undefined && node.children.length > 0) {
            node.children.forEach(function (n, idx) {
                _this.initTreeTableNode(n);
                n._node.id = node._node.id + '.' + idx;
                n._node.collapsed = !openModal;
                n._node.show = !n._node.collapsed;
                n._node.tnLevel = n._node.tnLevel + 1 + level;
                n._node.parent = node;
                _this.setPadding(n);
                if (n.children.length > 0) {
                    _this.regenerateTreeTable(n, n._node.tnLevel);
                }
                else {
                    _this.tableModel.push(n);
                }
            });
        }
        else {
            return;
        }
    };
    TreeTable.prototype.setPadding = function (node) {
        if (node._node === undefined || node._node === null) {
            return;
        }
        node._node.padding = (node._node.tnLevel * this.indentNumber) * 0.5 + this.indentUnit;
    };
    TreeTable.prototype.initTreeTableNode = function (node, level) {
        if (level === void 0) { level = 0; }
        if (node._node === undefined || node._node === null) {
            node._node = {
                id: "",
                tnLevel: level,
                padding: "",
                collapsed: true,
                show: true,
                parent: null
            };
        }
    };
    TreeTable.prototype.showNodes = function () {
        return this.tableModel.filter(function (n) {
            return n._node.show;
        });
    };
    TreeTable.prototype.collapsNode = function (node) {
        if (node._node == undefined) {
            return;
        }
        node._node.collapsed = true;
        this.tableModel.filter(function (n) {
            return n._node.id != node._node.id && n._node.id.startsWith(node._node.id);
        }).forEach(function (n) {
            if (n._node != undefined) {
                n._node.collapsed = true;
                n._node.show = false;
            }
        });
    };
    TreeTable.prototype.uncollapse = function (node) {
        debugger;
        if (node._node == undefined) {
            return;
        }
        node._node.collapsed = false;
        if (node.children != undefined && node.children.length > 0) {
            node.children.forEach(function (n, idx) {
                n._node.show = true;
            });
        }
    };
    TreeTable.prototype.showTId = function (a, b) {
        var idA = a._node.id.split(this.TID_SPLITER);
        var idB = b._node.id.split(this.TID_SPLITER);
        return this.commpareStringArray(idA, idB);
    };
    TreeTable.prototype.commpareStringArray = function (a, b) {
        var lenA = a.length;
        var lenB = b.length;
        if (lenA < lenB) {
            for (var i = 0; i < lenA; i++) {
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
            for (var i = 0; i < lenB; i++) {
                if (a[i] == b[i]) {
                    continue;
                }
                else {
                    return Number(a[i]) < Number(b[i]) ? -1 : 1;
                }
                return 1;
            }
        }
        else {
            for (var i = 0; i < lenB; i++) {
                if (a[i] == b[i]) {
                    continue;
                }
                else {
                    return Number(a[i]) < Number(b[i]) ? -1 : 1;
                }
                return 0;
            }
        }
        return -1;
    };
    return TreeTable;
}());
exports.TreeTable = TreeTable;
