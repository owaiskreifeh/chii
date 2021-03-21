import*as Common from"../common/common.js";import{ContrastInfo,Events}from"./ContrastInfo.js";export class ContrastOverlay{constructor(t,o){this._contrastInfo=t,this._visible=!1,this._contrastRatioSVG=o.createSVGChild("svg","spectrum-contrast-container fill"),this._contrastRatioLines={aa:this._contrastRatioSVG.createSVGChild("path","spectrum-contrast-line"),aaa:this._contrastRatioSVG.createSVGChild("path","spectrum-contrast-line")},this._width=0,this._height=0,this._contrastRatioLineBuilder=new ContrastRatioLineBuilder(this._contrastInfo),this._contrastRatioLinesThrottler=new Common.Throttler.Throttler(0),this._drawContrastRatioLinesBound=this._drawContrastRatioLines.bind(this),this._contrastInfo.addEventListener(Events.ContrastInfoUpdated,this._update.bind(this))}_update(){this._visible&&!this._contrastInfo.isNull()&&this._contrastInfo.contrastRatio()&&this._contrastRatioLinesThrottler.schedule(this._drawContrastRatioLinesBound)}setDimensions(t,o){this._width=t,this._height=o,this._update()}setVisible(t){this._visible=t,this._contrastRatioSVG.classList.toggle("hidden",!t),this._update()}async _drawContrastRatioLines(){for(const t in this._contrastRatioLines){const o=this._contrastRatioLineBuilder.drawContrastRatioLine(this._width,this._height,t);o?this._contrastRatioLines[t].setAttribute("d",o):this._contrastRatioLines[t].removeAttribute("d")}}}export class ContrastRatioLineBuilder{constructor(t){this._contrastInfo=t}drawContrastRatioLine(t,o,n){const s=this._contrastInfo.contrastRatioThreshold(n);if(!t||!o||!s)return null;const i=.02,r=this._contrastInfo.color(),e=this._contrastInfo.bgColor();if(!r||!e)return null;const a=r.rgba(),l=r.hsva(),h=e.rgba(),c=Common.Color.Color.luminance(h),C=[];Common.Color.Color.blendColors(a,h,C);const d=Common.Color.Color.luminance(C)>c,u=Common.Color.Color.desiredLuminance(c,s,d);let m=l[2],_=0;const f=[l[0],0,0,l[3]];let L=[];const R=[];function p(t,o){return f[t]=o,Common.Color.Color.hsva2rgba(f,R),Common.Color.Color.blendColors(R,h,C),Common.Color.Color.luminance(C)-u}function b(t){let o=f[t],n=1,s=p(t,o),i=Math.sign(s);for(let r=100;r;r--){if(Math.abs(s)<2e-4)return o;const r=Math.sign(s);if(r!==i)n/=2,i=r;else if(o<0||o>1)return null;o+=n*(2===t?-s:s),s=p(t,o)}return console.error("Loop exited unexpectedly"),null}let g;for(Common.Color.Color.hsva2rgba(f,R),Common.Color.Color.blendColors(R,h,C),g=0;g<1.02;g+=i){g=Math.min(1,g),f[1]=g,f[2]=m+_*i;const n=b(2);if(null===n)break;_=0===g?0:(n-m)/i,m=n,L.push(L.length?"L":"M"),L.push((g*t).toFixed(2)),L.push(((1-n)*o).toFixed(2))}return g<1.02&&(g-=i,f[2]=1,g=b(1),null!==g&&(L=L.concat(["L",(g*t).toFixed(2),"-0.1"]))),0===L.length?null:L.join(" ")}}