import*as Common from"../common/common.js";import*as UI from"../ui/ui.js";export class RadioSetting{constructor(e,t,i){this._setting=t,this._options=e,this.element=createElement("div"),this.element.title=i,UI.ARIAUtils.setDescription(this.element,i),UI.ARIAUtils.markAsRadioGroup(this.element),this._radioElements=[];for(const e of this._options){const i=UI.Fragment.Fragment.build`
        <label $="label" class="lighthouse-radio">
          <input $="input" type="radio" value=${e.value} name=${t.name}>
          <span class="lighthouse-radio-text">${e.label}</span>
        </label>
      `;this.element.appendChild(i.element()),e.title&&UI.Tooltip.Tooltip.install(i.$("label"),e.title);const s=i.$("input");s.addEventListener("change",this._valueChanged.bind(this)),this._radioElements.push(s)}this._ignoreChangeEvents=!1,this._selectedIndex=-1,t.addChangeListener(this._settingChanged,this),this._settingChanged()}_updateUI(){this._ignoreChangeEvents=!0,this._radioElements[this._selectedIndex].checked=!0,this._ignoreChangeEvents=!1}_settingChanged(){const e=this._setting.get();this._selectedIndex=this._options.findIndex(t=>t.value===e),this._updateUI()}_valueChanged(e){if(this._ignoreChangeEvents)return;const t=this._radioElements.find(e=>e.checked);this._setting.set(t.value)}}