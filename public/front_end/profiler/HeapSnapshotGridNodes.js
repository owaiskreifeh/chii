import*as Common from"../common/common.js";import*as DataGrid from"../data_grid/data_grid.js";import*as HeapSnapshotModel from"../heap_snapshot_model/heap_snapshot_model.js";import*as Platform from"../platform/platform.js";import*as SDK from"../sdk/sdk.js";import*as UI from"../ui/ui.js";import{ChildrenProvider}from"./ChildrenProvider.js";import{AllocationDataGrid,HeapSnapshotConstructorsDataGrid,HeapSnapshotDiffDataGrid,HeapSnapshotRetainmentDataGrid,HeapSnapshotSortableDataGrid}from"./HeapSnapshotDataGrids.js";import{HeapSnapshotProviderProxy,HeapSnapshotProxy}from"./HeapSnapshotProxy.js";import{DataDisplayDelegate}from"./ProfileHeader.js";export class HeapSnapshotGridNode extends DataGrid.DataGrid.DataGridNode{constructor(e,t){super(null,t),this._dataGrid=e,this._instanceCount=0,this._savedChildren=null,this._retrievedChildrenRanges=[],this._providerObject=null,this._reachableFromWindow=!1}static createComparator(e){return{fieldName1:e[0],ascending1:e[1],fieldName2:e[2],ascending2:e[3]}}heapSnapshotDataGrid(){return this._dataGrid}createProvider(){throw new Error("Not implemented.")}retainersDataSource(){return null}_provider(){return this._providerObject||(this._providerObject=this.createProvider()),this._providerObject}createCell(e){const t=super.createCell(e);return this._searchMatched&&t.classList.add("highlight"),t}collapse(){super.collapse(),this._dataGrid.updateVisibleNodes(!0)}expand(){super.expand(),this._dataGrid.updateVisibleNodes(!0)}dispose(){this._providerObject&&this._providerObject.dispose();for(let e=this.children[0];e;e=e.traverseNextNode(!0,this,!0))e.dispose&&e.dispose()}queryObjectContent(e,t){}tryQueryObjectContent(e,t){}populateContextMenu(e,t,i){}_toPercentString(e){return e.toFixed(0)+" %"}_toUIDistance(e){const t=HeapSnapshotModel.HeapSnapshotModel.baseSystemDistance;return e>=0&&e<t?Common.UIString.UIString("%d",e):Common.UIString.UIString("−")}allChildren(){return this._dataGrid.allChildren(this)}removeChildByIndex(e){this._dataGrid.removeChildByIndex(this,e)}childForPosition(e){let t=0;for(let i=0;i<this._retrievedChildrenRanges.length;i++){const s=this._retrievedChildrenRanges[i];if(s.from<=e&&e<s.to){const i=t+e-s.from;return this.allChildren()[i]}t+=s.to-s.from+1}return null}_createValueCell(e){const t=UI.Fragment.html`<td class="numeric-column" />`;if(0!==this.dataGrid.snapshot.totalSize){const i=createElement("div"),s=UI.Fragment.html`<span>${this.data[e]}</span>`;i.appendChild(s);const a=e+"-percent";if(a in this.data){const r=UI.Fragment.html`<span class="percent-column">${this.data[a]}</span>`;i.appendChild(r),i.classList.add("profile-multiple-values"),UI.ARIAUtils.markAsHidden(s),UI.ARIAUtils.markAsHidden(r),this.setCellAccessibleName(ls`${this.data[e]}, ${this.data[a]}`,t,e)}t.appendChild(i)}return t}populate(){this._populated||(this._populated=!0,this._provider().sortAndRewind(this.comparator()).then(()=>this._populateChildren()))}expandWithoutPopulate(){return this._populated=!0,this.expand(),this._provider().sortAndRewind(this.comparator())}_populateChildren(e,t){let i;const s=new Promise(e=>i=e);e=e||0,t=t||e+this._dataGrid.defaultPopulateCount();let a=e;return r.call(this),s;function r(){if(a>=t)return;const e=Math.min(a+this._dataGrid.defaultPopulateCount(),t);this._provider().serializeItemsRange(a,e).then(d.bind(this)),a=e}function o(e,t){if(this._savedChildren){const i=this._childHashForEntity(e);if(i in this._savedChildren)return void this._dataGrid.insertChild(this,this._savedChildren[i],t)}this._dataGrid.insertChild(this,this._createChildNode(e),t)}function n(e,t,i){const s=new DataGrid.ShowMoreDataGridNode.ShowMoreDataGridNode(this._populateChildren.bind(this),e,t,this._dataGrid.defaultPopulateCount());this._dataGrid.insertChild(this,s,i)}function d(e){let s=0,d=e.startPosition;const h=e.items;let l=0;if(this._retrievedChildrenRanges.length){let t,i=0,a=!1;for(;i<this._retrievedChildrenRanges.length;){if(t=this._retrievedChildrenRanges[i],t.to>=d){a=!0;break}l+=t.to-t.from,t.to<e.totalLength&&(l+=1),++i}for(!a||e.startPosition<t.from?(this.allChildren()[l-1].setEndPosition(e.startPosition),n.call(this,e.startPosition,a?t.from:e.totalLength,l),t={from:e.startPosition,to:e.startPosition},a||(i=this._retrievedChildrenRanges.length),this._retrievedChildrenRanges.splice(i,0,t)):l+=d-t.from;t.to<e.endPosition;){const a=t.to-d;l+=a,s+=a,d=t.to;const r=this._retrievedChildrenRanges[i+1];let n=r?r.from:e.totalLength;for(n>e.endPosition&&(n=e.endPosition);d<n;)o.call(this,h[s++],l++),++d;r&&n===r.from?(t.to=r.to,this.removeChildByIndex(l),this._retrievedChildrenRanges.splice(i+1,1)):(t.to=n,n===e.totalLength?this.removeChildByIndex(l):this.allChildren()[l].setStartPosition(e.endPosition))}}else{e.startPosition>0&&(this._retrievedChildrenRanges.push({from:0,to:0}),n.call(this,0,e.startPosition,l++)),this._retrievedChildrenRanges.push({from:e.startPosition,to:e.endPosition});for(let e=0,t=h.length;e<t;++e)o.call(this,h[e],l++);e.endPosition<e.totalLength&&n.call(this,e.endPosition,e.totalLength,l++)}this._instanceCount+=h.length,a<t?r.call(this):(this.expanded&&this._dataGrid.updateVisibleNodes(!0),i(),this.dispatchEventToListeners(HeapSnapshotGridNode.Events.PopulateComplete))}}_saveChildren(){this._savedChildren=null;const e=this.allChildren();for(let t=0,i=e.length;t<i;++t){const i=e[t];i.expanded&&(this._savedChildren||(this._savedChildren={}),this._savedChildren[this._childHashForNode(i)]=i)}}async sort(){this._dataGrid.recursiveSortingEnter(),await this._provider().sortAndRewind(this.comparator()),this._saveChildren(),this._dataGrid.removeAllChildren(this),this._retrievedChildrenRanges=[];const e=this._instanceCount;this._instanceCount=0,await this._populateChildren(0,e);for(const e of this.allChildren())e.expanded&&e.sort();this._dataGrid.recursiveSortingLeave()}}HeapSnapshotGridNode.Events={PopulateComplete:Symbol("PopulateComplete")};export class HeapSnapshotGenericObjectNode extends HeapSnapshotGridNode{constructor(e,t){if(super(e,!1),!t)return;this._name=t.name,this._type=t.type,this._distance=t.distance,this._shallowSize=t.selfSize,this._retainedSize=t.retainedSize,this.snapshotNodeId=t.id,this.snapshotNodeIndex=t.nodeIndex,"string"===this._type?this._reachableFromWindow=!0:"object"===this._type&&this._name.startsWith("Window")?(this._name=this.shortenWindowURL(this._name,!1),this._reachableFromWindow=!0):t.canBeQueried&&(this._reachableFromWindow=!0),t.detachedDOMTreeNode&&(this.detachedDOMTreeNode=!0);const i=e.snapshot,s=this._shallowSize/i.totalSize*100,a=this._retainedSize/i.totalSize*100;this.data={distance:this._toUIDistance(this._distance),shallowSize:Number.withThousandsSeparator(this._shallowSize),retainedSize:Number.withThousandsSeparator(this._retainedSize),"shallowSize-percent":this._toPercentString(s),"retainedSize-percent":this._toPercentString(a)}}retainersDataSource(){return{snapshot:this._dataGrid.snapshot,snapshotNodeIndex:this.snapshotNodeIndex}}createCell(e){const t="object"!==e?this._createValueCell(e):this._createObjectCell();return this._searchMatched&&t.classList.add("highlight"),t}_createObjectCell(){let e=this._name,t="object";switch(this._type){case"concatenated string":case"string":e=`"${e}"`,t="string";break;case"regexp":e=`/${e}/`,t="string";break;case"closure":e+="()",t="function";break;case"bigint":t="bigint";break;case"number":t="number";break;case"hidden":t="null";break;case"array":e=e?e+"[]":ls`(internal array)[]`}return this._createObjectCellWithValue(t,e)}_createObjectCellWithValue(e,t){const i=UI.Fragment.Fragment.build`
        <td class="object-column disclosure">
          <div class="source-code event-properties" style="overflow: visible" $="container">
            <span class="value object-value-${e}">${t}</span>
            <span class="object-value-id">@${this.snapshotNodeId}</span>
          </div>
        </td>`,s=i.$("container");this._prefixObjectCell(s),this._reachableFromWindow&&s.appendChild(UI.Fragment.html`<span class="heap-object-tag" title="${ls`User object reachable from window`}">🗖</span>`),this.detachedDOMTreeNode&&s.appendChild(UI.Fragment.html`<span class="heap-object-tag" title="${ls`Detached from DOM tree`}">✀</span>`),this._appendSourceLocation(s);const a=i.element();return this.depth&&a.style.setProperty("padding-left",this.depth*this.dataGrid.indentWidth+"px"),a.heapSnapshotNode=this,a}_prefixObjectCell(e){}async _appendSourceLocation(e){const t=UI.Fragment.html`<span class="heap-object-source-link" />`;e.appendChild(t);const i=await this._dataGrid.dataDisplayDelegate().linkifyObject(this.snapshotNodeIndex);i?(t.appendChild(i),this.linkElement=i):t.remove()}async queryObjectContent(e,t){return await this.tryQueryObjectContent(e,t)||e.runtimeModel().createRemoteObjectFromPrimitiveValue(ls`Preview is not available`)}async tryQueryObjectContent(e,t){return"string"===this._type?e.runtimeModel().createRemoteObjectFromPrimitiveValue(this._name):await e.objectForSnapshotObjectId(String(this.snapshotNodeId),t)}async updateHasChildren(){const e=await this._provider().isEmpty();this.setHasChildren(!e)}shortenWindowURL(e,t){const i=e.indexOf("/"),s=t?e.indexOf("@"):e.length;if(-1===i||-1===s)return e;const a=e.substring(i+1,s).trimLeft();let r=Platform.StringUtilities.trimURL(a);return r.length>40&&(r=r.trimMiddle(40)),e.substr(0,i+2)+r+e.substr(s)}populateContextMenu(e,t,i){if(e.revealSection().appendItem(ls`Reveal in Summary view`,()=>{t.showObject(String(this.snapshotNodeId),ls`Summary`)}),this._referenceName)for(const i of this._referenceName.matchAll(/\((?<objectName>[^@)]*) @(?<snapshotNodeId>\d+)\)/g)){const{objectName:s,snapshotNodeId:a}=i.groups;e.revealSection().appendItem(ls`Reveal object '${s}' with id @${a} in Summary view`,()=>{t.showObject(a,ls`Summary`)})}i&&e.revealSection().appendItem(ls`Store as global variable`,async()=>{const e=await this.tryQueryObjectContent(i,"");e?await SDK.ConsoleModel.ConsoleModel.instance().saveToTempVariable(self.UI.context.flavor(SDK.RuntimeModel.ExecutionContext),e):Common.Console.Console.instance().error(ls`Preview is not available`)})}}export class HeapSnapshotObjectNode extends HeapSnapshotGenericObjectNode{constructor(e,t,i,s){super(e,i.node),this._referenceName=i.name,this._referenceType=i.type,this._edgeIndex=i.edgeIndex,this._snapshot=t,this._parentObjectNode=s,this._cycledWithAncestorGridNode=this._findAncestorWithSameSnapshotNodeId(),this._cycledWithAncestorGridNode||this.updateHasChildren();const a=this.data;a.count="",a.addedCount="",a.removedCount="",a.countDelta="",a.addedSize="",a.removedSize="",a.sizeDelta=""}retainersDataSource(){return{snapshot:this._snapshot,snapshotNodeIndex:this.snapshotNodeIndex}}createProvider(){return this._snapshot.createEdgesProvider(this.snapshotNodeIndex)}_findAncestorWithSameSnapshotNodeId(){let e=this._parentObjectNode;for(;e;){if(e.snapshotNodeId===this.snapshotNodeId)return e;e=e._parentObjectNode}return null}_createChildNode(e){return new HeapSnapshotObjectNode(this._dataGrid,this._snapshot,e,this)}_childHashForEntity(e){return e.edgeIndex}_childHashForNode(e){return e._edgeIndex}comparator(){const e=this._dataGrid.isSortOrderAscending(),t={object:["!edgeName",e,"retainedSize",!1],count:["!edgeName",!0,"retainedSize",!1],shallowSize:["selfSize",e,"!edgeName",!0],retainedSize:["retainedSize",e,"!edgeName",!0],distance:["distance",e,"_name",!0]}[this._dataGrid.sortColumnId()]||["!edgeName",!0,"retainedSize",!1];return HeapSnapshotGridNode.createComparator(t)}_prefixObjectCell(e){let t=this._referenceName||"(empty)",i="name";switch(this._referenceType){case"context":i="object-value-number";break;case"internal":case"hidden":case"weak":i="object-value-null";break;case"element":t=`[${t}]`}this._cycledWithAncestorGridNode&&e.classList.add("cycled-ancessor-node"),e.prepend(UI.Fragment.html`<span class="${i}">${t}</span>
                        <span class="grayed">${this._edgeNodeSeparator()}</span>`)}_edgeNodeSeparator(){return"::"}}export class HeapSnapshotRetainingObjectNode extends HeapSnapshotObjectNode{constructor(e,t,i,s){super(e,t,i,s)}createProvider(){return this._snapshot.createRetainingEdgesProvider(this.snapshotNodeIndex)}_createChildNode(e){return new HeapSnapshotRetainingObjectNode(this._dataGrid,this._snapshot,e,this)}_edgeNodeSeparator(){return ls`in`}expand(){this._expandRetainersChain(20)}_expandRetainersChain(e){if(!this._populated)return this.once(HeapSnapshotGridNode.Events.PopulateComplete).then(()=>this._expandRetainersChain(e)),void this.populate();if(super.expand(),--e>0&&this.children.length>0){const t=this.children[0];if(t._distance>1)return void t._expandRetainersChain(e)}this._dataGrid.dispatchEventToListeners(HeapSnapshotRetainmentDataGrid.Events.ExpandRetainersComplete)}}export class HeapSnapshotInstanceNode extends HeapSnapshotGenericObjectNode{constructor(e,t,i,s){super(e,i),this._baseSnapshotOrSnapshot=t,this._isDeletedNode=s,this.updateHasChildren();const a=this.data;a.count="",a.countDelta="",a.sizeDelta="",this._isDeletedNode?(a.addedCount="",a.addedSize="",a.removedCount="•",a.removedSize=Number.withThousandsSeparator(this._shallowSize)):(a.addedCount="•",a.addedSize=Number.withThousandsSeparator(this._shallowSize),a.removedCount="",a.removedSize="")}retainersDataSource(){return{snapshot:this._baseSnapshotOrSnapshot,snapshotNodeIndex:this.snapshotNodeIndex}}createProvider(){return this._baseSnapshotOrSnapshot.createEdgesProvider(this.snapshotNodeIndex)}_createChildNode(e){return new HeapSnapshotObjectNode(this._dataGrid,this._baseSnapshotOrSnapshot,e,null)}_childHashForEntity(e){return e.edgeIndex}_childHashForNode(e){return e._edgeIndex}comparator(){const e=this._dataGrid.isSortOrderAscending(),t={object:["!edgeName",e,"retainedSize",!1],distance:["distance",e,"retainedSize",!1],count:["!edgeName",!0,"retainedSize",!1],addedSize:["selfSize",e,"!edgeName",!0],removedSize:["selfSize",e,"!edgeName",!0],shallowSize:["selfSize",e,"!edgeName",!0],retainedSize:["retainedSize",e,"!edgeName",!0]}[this._dataGrid.sortColumnId()]||["!edgeName",!0,"retainedSize",!1];return HeapSnapshotGridNode.createComparator(t)}}export class HeapSnapshotConstructorNode extends HeapSnapshotGridNode{constructor(e,t,i,s){super(e,i.count>0),this._name=t,this._nodeFilter=s,this._distance=i.distance,this._count=i.count,this._shallowSize=i.self,this._retainedSize=i.maxRet;const a=e.snapshot,r=this._retainedSize/a.totalSize*100,o=this._shallowSize/a.totalSize*100;this.data={object:t,count:Number.withThousandsSeparator(this._count),distance:this._toUIDistance(this._distance),shallowSize:Number.withThousandsSeparator(this._shallowSize),retainedSize:Number.withThousandsSeparator(this._retainedSize),"shallowSize-percent":this._toPercentString(o),"retainedSize-percent":this._toPercentString(r)}}createProvider(){return this._dataGrid.snapshot.createNodesProviderForClass(this._name,this._nodeFilter)}async populateNodeBySnapshotObjectId(e){this._dataGrid.resetNameFilter(),await this.expandWithoutPopulate();const t=await this._provider().nodePosition(e);if(-1===t)return this.collapse(),[];await this._populateChildren(t,null);const i=this.childForPosition(t);return i?[this,i]:[]}filteredOut(e){return-1===this._name.toLowerCase().indexOf(e)}createCell(e){const t="object"===e?super.createCell(e):this._createValueCell(e);return"object"===e&&this._count>1&&t.appendChild(UI.Fragment.html`<span class="objects-count">×${this._count}</span>`),this._searchMatched&&t.classList.add("highlight"),t}_createChildNode(e){return new HeapSnapshotInstanceNode(this._dataGrid,this._dataGrid.snapshot,e,!1)}comparator(){const e=this._dataGrid.isSortOrderAscending(),t={object:["name",e,"id",!0],distance:["distance",e,"retainedSize",!1],shallowSize:["selfSize",e,"id",!0],retainedSize:["retainedSize",e,"id",!0]}[this._dataGrid.sortColumnId()];return HeapSnapshotGridNode.createComparator(t)}_childHashForEntity(e){return e.id}_childHashForNode(e){return e.snapshotNodeId}}export class HeapSnapshotDiffNodesProvider{constructor(e,t,i,s){this._addedNodesProvider=e,this._deletedNodesProvider=t,this._addedCount=i,this._removedCount=s}dispose(){this._addedNodesProvider.dispose(),this._deletedNodesProvider.dispose()}nodePosition(e){throw new Error("Unreachable")}isEmpty(){return Promise.resolve(!1)}async serializeItemsRange(e,t){let i,s;if(e<this._addedCount){i=await this._addedNodesProvider.serializeItemsRange(e,t);for(const e of i.items)e.isAddedNotRemoved=!0;if(i.endPosition>=t)return i.totalLength=this._addedCount+this._removedCount,i;s=i,i=await this._deletedNodesProvider.serializeItemsRange(0,t-i.endPosition)}else s=new HeapSnapshotModel.HeapSnapshotModel.ItemsRange(0,0,0,[]),i=await this._deletedNodesProvider.serializeItemsRange(e-this._addedCount,t-this._addedCount);s.items.length||(s.startPosition=this._addedCount+i.startPosition);for(const e of i.items)e.isAddedNotRemoved=!1;return s.items.push(...i.items),s.endPosition=this._addedCount+i.endPosition,s.totalLength=this._addedCount+this._removedCount,s}async sortAndRewind(e){await this._addedNodesProvider.sortAndRewind(e),await this._deletedNodesProvider.sortAndRewind(e)}}export class HeapSnapshotDiffNode extends HeapSnapshotGridNode{constructor(e,t,i){super(e,!0),this._name=t,this._addedCount=i.addedCount,this._removedCount=i.removedCount,this._countDelta=i.countDelta,this._addedSize=i.addedSize,this._removedSize=i.removedSize,this._sizeDelta=i.sizeDelta,this._deletedIndexes=i.deletedIndexes,this.data={object:t,addedCount:Number.withThousandsSeparator(this._addedCount),removedCount:Number.withThousandsSeparator(this._removedCount),countDelta:this._signForDelta(this._countDelta)+Number.withThousandsSeparator(Math.abs(this._countDelta)),addedSize:Number.withThousandsSeparator(this._addedSize),removedSize:Number.withThousandsSeparator(this._removedSize),sizeDelta:this._signForDelta(this._sizeDelta)+Number.withThousandsSeparator(Math.abs(this._sizeDelta))}}createProvider(){const e=this._dataGrid;return new HeapSnapshotDiffNodesProvider(e.snapshot.createAddedNodesProvider(e.baseSnapshot.uid,this._name),e.baseSnapshot.createDeletedNodesProvider(this._deletedIndexes),this._addedCount,this._removedCount)}createCell(e){const t=super.createCell(e);return"object"!==e&&t.classList.add("numeric-column"),t}_createChildNode(e){return e.isAddedNotRemoved?new HeapSnapshotInstanceNode(this._dataGrid,this._dataGrid.snapshot,e,!1):new HeapSnapshotInstanceNode(this._dataGrid,this._dataGrid.baseSnapshot,e,!0)}_childHashForEntity(e){return e.id}_childHashForNode(e){return e.snapshotNodeId}comparator(){const e=this._dataGrid.isSortOrderAscending(),t={object:["name",e,"id",!0],addedCount:["name",!0,"id",!0],removedCount:["name",!0,"id",!0],countDelta:["name",!0,"id",!0],addedSize:["selfSize",e,"id",!0],removedSize:["selfSize",e,"id",!0],sizeDelta:["selfSize",e,"id",!0]}[this._dataGrid.sortColumnId()];return HeapSnapshotGridNode.createComparator(t)}filteredOut(e){return-1===this._name.toLowerCase().indexOf(e)}_signForDelta(e){return 0===e?"":e>0?"+":"−"}}export class AllocationGridNode extends HeapSnapshotGridNode{constructor(e,t){super(e,t.hasChildren),this._populated=!1,this._allocationNode=t,this.data={liveCount:Number.withThousandsSeparator(t.liveCount),count:Number.withThousandsSeparator(t.count),liveSize:Number.withThousandsSeparator(t.liveSize),size:Number.withThousandsSeparator(t.size),name:t.name}}populate(){this._populated||this._doPopulate()}async _doPopulate(){this._populated=!0;const e=await this._dataGrid.snapshot.allocationNodeCallers(this._allocationNode.id),t=e.nodesWithSingleCaller;let i=this;const s=this._dataGrid;for(const e of t){const t=new AllocationGridNode(s,e);s.appendNode(i,t),i=t,i._populated=!0,this.expanded&&i.expand()}const a=e.branchingCallers;a.sort(this._dataGrid._createComparator());for(const e of a)s.appendNode(i,new AllocationGridNode(s,e));s.updateVisibleNodes(!0)}expand(){super.expand(),1===this.children.length&&this.children[0].expand()}createCell(e){if("name"!==e)return this._createValueCell(e);const t=super.createCell(e),i=this._allocationNode,s=this._dataGrid.heapProfilerModel();if(i.scriptId){const e=this._dataGrid._linkifier.linkifyScriptLocation(s?s.target():null,String(i.scriptId),i.scriptName,i.line-1,i.column-1,"profile-node-file");e.style.maxWidth="75%",t.insertBefore(e,t.firstChild)}return t}allocationNodeId(){return this._allocationNode.id}}