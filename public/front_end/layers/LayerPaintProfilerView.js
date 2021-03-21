import*as LayerViewer from"../layer_viewer/layer_viewer.js";import*as SDK from"../sdk/sdk.js";import*as UI from"../ui/ui.js";export class LayerPaintProfilerView extends UI.SplitWidget.SplitWidget{constructor(e){super(!0,!1),this._logTreeView=new LayerViewer.PaintProfilerView.PaintProfilerCommandLogView,this.setSidebarWidget(this._logTreeView),this._paintProfilerView=new LayerViewer.PaintProfilerView.PaintProfilerView(e),this.setMainWidget(this._paintProfilerView),this._paintProfilerView.addEventListener(LayerViewer.PaintProfilerView.Events.WindowChanged,this._onWindowChanged,this),this._logTreeView.focus()}reset(){this._paintProfilerView.setSnapshotAndLog(null,[],null)}profile(e){function i(e,i){this._logTreeView.setCommandLog(i||[]),this._paintProfilerView.setSnapshotAndLog(e,i||[],null),e&&e.release()}e.commandLog().then(t=>i.call(this,e,t))}setScale(e){this._paintProfilerView.setScale(e)}_onWindowChanged(){this._logTreeView.updateWindow(this._paintProfilerView.selectionWindow())}}