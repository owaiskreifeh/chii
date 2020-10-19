import{Event,ObjectSnapshot,TracingModel}from"./TracingModel.js";export class FilmStripModel{constructor(e,t){this.reset(e,t)}reset(e,t){this._zeroTime=t||e.minimumRecordTime(),this._spanTime=e.maximumRecordTime()-this._zeroTime,this._frames=[];const s=TracingModel.browserMainThread(e);if(!s)return;const r=s.events();for(let e=0;e<r.length;++e){const t=r[e];if(!(t.startTime<this._zeroTime)&&t.hasCategory(_category))if(t.name===TraceEvents.CaptureFrame){t.args.data&&this._frames.push(Frame._fromEvent(this,t,this._frames.length))}else t.name===TraceEvents.Screenshot&&this._frames.push(Frame._fromSnapshot(this,t,this._frames.length))}}frames(){return this._frames}zeroTime(){return this._zeroTime}spanTime(){return this._spanTime}frameByTimestamp(e){const t=this._frames.upperBound(e,(e,t)=>e-t.timestamp)-1;return t>=0?this._frames[t]:null}}const _category="disabled-by-default-devtools.screenshot",TraceEvents={CaptureFrame:"CaptureFrame",Screenshot:"Screenshot"};export class Frame{constructor(e,t,s){this._model=e,this.timestamp=t,this.index=s,this._imageData=null,this._snapshot=null}static _fromEvent(e,t,s){const r=new Frame(e,t.startTime,s);return r._imageData=t.args.data,r}static _fromSnapshot(e,t,s){const r=new Frame(e,t.startTime,s);return r._snapshot=t,r}model(){return this._model}imageDataPromise(){return this._imageData||!this._snapshot?Promise.resolve(this._imageData):this._snapshot.objectPromise()}}