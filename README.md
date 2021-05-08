# Install
```
npm install gdtshi
```
# Import
```
import {TreeTable, TreeTableNode, TreeTableOptions} from "gdtshi";
```
# TreeTabel usage
## tree.ts
```
export class TelemetryTreeComponent extends TreeTable<TreeTableNode> implements OnInit {

  constructor() { super();}

  ngOnInit(): void {
    this.reload();
  
  }
  reload(){
    this.getInfo();
  }
  getInfo(id:string){
    this.telCtl.getSubscriptionInfosByGroupId(id).subscribe(
      res => {
        this.setTreeData(res)
      },
      failed => {
        // TODO
      }
    );
  }
  setTreeData(data){
    this.treeData=this.setTreeDataCommon(data);
    this.goSetTree();
  }
  goSetTree(){
    let options: TreeTableOptions<TreeTableNode> = {
      compare: this.compare,
      nodes: this.treeData
    };
    this.setOptions(options);
  }
  compare(nodeA:any, nodeB:any): number {
    return 1;
  }
 treeOd(id:string){
   this.deleteNodeGroup(this.getNodeById(id))
 }
  getNodeById(id) {
    return this.getNode((n) => {
      return n.id === id ? 0 : -1;
    });
  }
  treeAvc(id:string,values:Object){
    let node=this.getNodeById(id);
    for(let [k,v] of Object.entries(values)){
        node.eq[k]=v
    }
  }
  setTreeDataCommon(data):TreeTableNode[]{
    let treeData=[];
    data.forEach((sItem,index)=>{
      let item={
        id:sItem.id,
        eq:sItem,
        children:[]
      };
    });
    return  treeData
  }
 }
 ```
 ## tree.html (The UI framework of ng-zorro is used)
 
 ```
 <nz-table  class="table table-hover mt-3" #basicTable [nzData]="shownNodes()">
  <thead>
  <tr>
    <th>{{'i18n_neName'|i18n}}</th>
    <th>{{'i18n_subscriptions.state'|i18n}}</th>
    <th>{{'i18n_startTime'|i18n}}</th>
    <th>{{'i18n_endTime'|i18n}}</th>
  </tr>
  </thead>
    <tbody  *ngIf="getTableModel().length> 0; else emptyTreeTable">
     <tr  *ngFor="let node of basicTable.data">
      <td >
        <div [ngStyle]="{'padding-left':node._node.padding}">
          <div *ngIf="node.children && node.children.length>0; else treeTableNoChild">
            <div *ngIf="node._node.collapsed == true ; else uncollapsedSign">
              <div>
                <i class="fas fa-angle-right" style="font-size:18px" (click)="uncollapse(node)" *ngIf="node.children.length>0"></i>
                <ng-container *ngIf="node['eq'].subscriptionState !=undefined">
                     {{node['eq'].entityId.userLabel}}
                </ng-container>
                <ng-container *ngIf="node['eq'].subscriptionState==undefined &&node['eq'].entityId !=undefined">
                  <span (click)="uncollapse(node)" style="padding-left: 1rem">{{node['eq'].entityId.userLabel}}</span>
                </ng-container>
              </div>
            </div>
            <ng-template #uncollapsedSign>
              <div>
                <i class="fas fas fa-angle-down" style="font-size:18px" (click)="collapse(node)" *ngIf="node.children.length>0"></i>
                <ng-container *ngIf="node['eq'].subscriptionState !=undefined">
                  {{node['eq'].entityId.userLabel}}
                </ng-container>
                <ng-container *ngIf="node['eq'].subscriptionState==undefined && node['eq'].entityId !=undefined">
                  <span (click)="uncollapse(node)" style="padding-left: 1rem">{{node['eq'].entityId.userLabel}}</span>
                </ng-container>
              </div>
            </ng-template>
          </div>
          <ng-template #treeTableNoChild>
            <ng-container *ngIf="node['eq'].name !=undefined">
            {{node['eq'].name}}
          </ng-container>
          </ng-template>
        </div>
      </td>
       <td>
         <ng-container *ngIf="node['eq'].entityId !=undefined && node['eq']?.subscriptionState">
          {{node['eq'].subscriptionState}}
         </ng-container>
       </td>
       <td>{{node['eq'].startTime | date:'yyyy-MM-dd HH:mm:ss'}}</td>
       <td>{{node['eq'].endTime | date:'yyyy-MM-dd HH:mm:ss'}}</td>
    </tr>
    </tbody>
</nz-table>
```
# tshi
[![Build Status](https://travis-ci.com/pangxiaochen/tshi.svg?branch=main)](https://travis-ci.com/pangxiaochen/tshi)
