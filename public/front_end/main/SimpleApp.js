import*as Common from"../common/common.js";import*as UI from"../ui/ui.js";export class SimpleApp{presentUI(o){const e=new UI.RootView.RootView;self.UI.inspectorView.show(e.element),e.attachToDocument(o),e.focus()}}export class SimpleAppProvider{createApp(){return new SimpleApp}}