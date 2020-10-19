import*as Common from"../common/common.js";import*as SDK from"../sdk/sdk.js";export class RemoteObjectPreviewFormatter{static _objectPropertyComparator(e,t){return r(e)-r(t);function r(e){const t=_internalName;return e.name===t.PromiseStatus?1:e.name===t.PromiseValue?2:e.name===t.GeneratorStatus||e.name===t.PrimitiveValue?3:"function"===e.type||e.name.startsWith("#")?5:4}}appendObjectPreview(e,t,r){const n=t.description,i=new Set(["null","regexp","error","internal#entry"]);if("object"!==t.type||i.has(t.subtype)||r)return void e.appendChild(this.renderPropertyPreview(t.type,t.subtype,n));const a="array"===t.subtype||"typedarray"===t.subtype;if(n){let r;if(a){const e=SDK.RemoteObject.RemoteObject.arrayLength(t),i=e>1?"("+e+")":"",a=SDK.RemoteObject.RemoteObject.arrayNameFromDescription(n);r="Array"===a?i:a+i}else{r="Object"===n?"":n}r.length>0&&(e.createChild("span","object-description").textContent=r+" ")}const o=e.createChild("span","object-properties-preview");if(o.createTextChild(a?"[":"{"),t.entries?this._appendEntriesPreview(o,t):a?this._appendArrayPropertiesPreview(o,t):this._appendObjectPropertiesPreview(o,t),t.overflow){const e=o.textContent.length>1?", …":"…";o.createChild("span").textContent=e}o.createTextChild(a?"]":"}")}_abbreviateFullQualifiedClassName(e){const t=e.split(".");for(let e=0;e<t.length-1;++e)t[e]=t[e].trimMiddle(3);return t.join(".")}_appendObjectPropertiesPreview(e,t){const r=_internalName,n=t.properties.filter(e=>"accessor"!==e.type).sort(RemoteObjectPreviewFormatter._objectPropertyComparator);for(let i=0;i<n.length;++i){i>0&&e.createTextChild(", ");const a=n[i],o=a.name;if("promise"===t.subtype&&o===r.PromiseStatus){e.appendChild(this._renderDisplayName("<"+a.value+">"));const t=i+1<n.length?n[i+1]:null;t&&t.name===r.PromiseValue&&("pending"!==a.value&&(e.createTextChild(": "),e.appendChild(this._renderPropertyPreviewOrAccessor([t]))),i++)}else"generator"===t.subtype&&o===r.GeneratorStatus?e.appendChild(this._renderDisplayName("<"+a.value+">")):(o===r.PrimitiveValue||(e.appendChild(this._renderDisplayName(o)),e.createTextChild(": ")),e.appendChild(this._renderPropertyPreviewOrAccessor([a])))}}_appendArrayPropertiesPreview(e,t){const r=SDK.RemoteObject.RemoteObject.arrayLength(t),n=t.properties.filter(e=>-1!==a(e.name)).sort((function(e,t){return a(e.name)-a(t.name)})),i=t.properties.filter(e=>-1===a(e.name)).sort(RemoteObjectPreviewFormatter._objectPropertyComparator);function a(e){const t=e>>>0;return String(t)===e&&t<r?t:-1}const o=!t.overflow;let s=-1,p=!1;for(let t=0;t<n.length;++t){p&&e.createTextChild(", ");const r=n[t],i=a(r.name);o&&i-s>1&&(l(i),e.createTextChild(", ")),o||t===i||(e.appendChild(this._renderDisplayName(r.name)),e.createTextChild(": ")),e.appendChild(this._renderPropertyPreviewOrAccessor([r])),s=i,p=!0}o&&r-s>1&&(p&&e.createTextChild(", "),l(r));for(let t=0;t<i.length;++t){p&&e.createTextChild(", ");const r=i[t];e.appendChild(this._renderDisplayName(r.name)),e.createTextChild(": "),e.appendChild(this._renderPropertyPreviewOrAccessor([r])),p=!0}function l(t){const r=e.createChild("span","object-value-undefined"),n=t-s-1;r.textContent=1!==n?Common.UIString.UIString("empty × %d",n):Common.UIString.UIString("empty"),p=!0}}_appendEntriesPreview(e,t){for(let r=0;r<t.entries.length;++r){r>0&&e.createTextChild(", ");const n=t.entries[r];n.key&&(this.appendObjectPreview(e,n.key,!0),e.createTextChild(" => ")),this.appendObjectPreview(e,n.value,!0)}}_renderDisplayName(e){const t=createElementWithClass("span","name"),r=/^\s|\s$|^$|\n/.test(e);return t.textContent=r?'"'+e.replace(/\n/g,"↵")+'"':e,t}_renderPropertyPreviewOrAccessor(e){const t=e.peekLast();return this.renderPropertyPreview(t.type,t.subtype,t.value)}renderPropertyPreview(e,t,r){const n=createElementWithClass("span","object-value-"+(t||e));if(r=r||"","accessor"===e)return n.textContent="(...)",n.title=Common.UIString.UIString("The property is computed with a getter"),n;if("function"===e)return n.textContent="ƒ",n;if("object"===e&&"node"===t&&r)return createSpansForNodeTitle(n,r),n;if("string"===e)return n.createTextChildren('"',r.replace(/\n/g,"↵"),'"'),n;if("object"===e&&!t){let e=this._abbreviateFullQualifiedClassName(r);return"Object"===e&&(e="{…}"),n.textContent=e,n.title=r,n}return n.textContent=r,n}}const _internalName={GeneratorStatus:"[[GeneratorStatus]]",PrimitiveValue:"[[PrimitiveValue]]",PromiseStatus:"[[PromiseStatus]]",PromiseValue:"[[PromiseValue]]"};export const createSpansForNodeTitle=function(e,t){const r=t.match(/([^#.]+)(#[^.]+)?(\..*)?/);e.createChild("span","webkit-html-tag-name").textContent=r[1],r[2]&&(e.createChild("span","webkit-html-attribute-value").textContent=r[2]),r[3]&&(e.createChild("span","webkit-html-attribute-name").textContent=r[3])};