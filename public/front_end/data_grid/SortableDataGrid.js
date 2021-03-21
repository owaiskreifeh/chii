import{ColumnDescriptor,Events,Parameters}from"./DataGrid.js";import{ViewportDataGrid,ViewportDataGridNode}from"./ViewportDataGrid.js";export class SortableDataGrid extends ViewportDataGrid{constructor(t){super(t),this._sortingFunction=SortableDataGrid.TrivialComparator,this.setRootNode(new SortableDataGridNode)}static TrivialComparator(t,r){return 0}static NumericComparator(t,r,e){const o=r.data[t],i=e.data[t],n=Number(o instanceof Node?o.textContent:o),a=Number(i instanceof Node?i.textContent:i);return n<a?-1:n>a?1:0}static StringComparator(t,r,e){const o=r.data[t],i=e.data[t],n=o instanceof Node?o.textContent:String(o),a=i instanceof Node?i.textContent:String(i);return n<a?-1:n>a?1:0}static Comparator(t,r,e,o){return r?t(o,e):t(e,o)}static create(t,r,e){const o=t.length;if(!o)return null;const i=[];for(let r=0;r<t.length;++r)i.push({id:String(r),title:t[r],width:t[r].length,sortable:!0});const n=[];for(let e=0;e<r.length/o;++e){const i={};for(let n=0;n<t.length;++n)i[n]=r[o*e+n];const a=new SortableDataGridNode(i);a.selectable=!1,n.push(a)}const a=new SortableDataGrid({displayName:e,columns:i}),s=n.length,d=a.rootNode();for(let t=0;t<s;++t)d.appendChild(n[t]);return a.addEventListener(Events.SortingChanged,(function(){const t=a.rootNode().children,r=a.sortColumnId();if(!r)return;let e=!0;for(let o=0;o<t.length;o++){const i=t[o].data[r];if(isNaN(i instanceof Node?i.textContent:i)){e=!1;break}}const o=e?SortableDataGrid.NumericComparator:SortableDataGrid.StringComparator;a.sortNodes(o.bind(null,r),!a.isSortOrderAscending())})),a}insertChild(t){this.rootNode().insertChildOrdered(t)}sortNodes(t,r){this._sortingFunction=SortableDataGrid.Comparator.bind(null,t,r),this.rootNode().recalculateSiblings(0),this.rootNode()._sortChildren(r),this.scheduleUpdateStructure()}}export class SortableDataGridNode extends ViewportDataGridNode{constructor(t,r){super(t,r)}insertChildOrdered(t){this.insertChild(t,this.children.upperBound(t,this.dataGrid._sortingFunction))}_sortChildren(){this.children.sort(this.dataGrid._sortingFunction);for(let t=0;t<this.children.length;++t)this.children[t].recalculateSiblings(t);for(const t of this.children)t._sortChildren()}}