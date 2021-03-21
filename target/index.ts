import query from 'licia/query';
import randomId from 'licia/randomId';
import safeStorage from 'licia/safeStorage';
import $ from 'licia/$';
import contain from 'licia/contain';
import Socket from 'licia/Socket';
import chobitsu from 'chobitsu';

const sessionStore = safeStorage('session');

let ChiiServerUrl = location.host;
let ChiiElement: any;

function getTargetScriptEl() {
  const elements = document.getElementsByTagName('script');
  let i = 0;
  while (i < elements.length) {
    const element = elements[i];
    if (-1 !== element.src.indexOf('/target.js')) {
      return element;
    }
    i++;
  }
}

if ((window as any).ChiiServerUrl) {
  ChiiServerUrl = (window as any).ChiiServerUrl;
} else {
  const element = getTargetScriptEl();
  if (element) {
    ChiiElement = element;
    const pattern = /((https?:)?\/\/(.*?)\/)/;
    const match = pattern.exec(element.src);
    if (match) {
      ChiiServerUrl = match[3];
    }
  }
}

function getFavicon() {
  let favicon = location.origin + '/favicon.ico';

  const $link = $('link');
  $link.each(function (this: HTMLElement) {
    if (contain(this.getAttribute('rel') || '', 'icon')) {
      const href = this.getAttribute('href');
      if (href) favicon = fullUrl(href);
    }
  });

  return favicon;
}

const link = document.createElement('a');

function fullUrl(href: string) {
  link.href = href;

  return link.protocol + '//' + link.host + link.pathname + link.search + link.hash;
}

let isInit = false;

let id = sessionStore.getItem('chii-id');
if (!id) {
  id = randomId(6);
  sessionStore.setItem('chii-id', id);
}

const protocol = location.protocol === 'https:' ? 'wss:' : 'wss:';

const ws = new Socket(
  `${protocol}//${ChiiServerUrl}/target/${id}?${query.stringify({
    url: location.href,
    title: (window as any).ChiiTitle || document.title,
    favicon: getFavicon(),
    info: getInfo(),
    id,
    meta: getMeta(),
  })}`
);

ws.on('open', () => {
  isInit = true;
  ws.on('message', (event: any) => {
    chobitsu.sendRawMessage(event.data);
  });
});

chobitsu.setOnMessage((message: string) => {
  if (!isInit) return;
  ws.send(message);
});




function getInfo(){
  try{
    let info: string = 'device info not supported';
    // Tizen 
    if(window && (window as any).webapis && (window as any).webapis.productinfo){
      let platform = 'Samsung Smart TV - ';
      if(window && window.navigator && window.navigator.userAgent != null) {
        platform += window.navigator.userAgent?.match(/\w*Tizen\w*([^\)|;]+)/g)!.join('');
      }
      const deviceModel = (window as any).webapis.productinfo.getRealModel();
      const modelCode = (window as any).webapis.productinfo.getModelCode();
      info = `Platfrom: ${platform} | Model: ${deviceModel} | Model Code: ${modelCode}`;
    }
  
    // Vidaa 
    if (window && (window as any).Hisense_GetModelName){
      const platform = "Hisense Vida TV";
      const deviceModel = (window as any).Hisense_GetModelName();
      info = `Platfrom: ${platform} | Model: ${deviceModel}`;
    }
  
    // WebOs
    if(window && (window as any).webOS && (window as any).webOS.deviceInfo){
      (window as any).webOS.deviceInfo((info: any) => {
        const platform = 'LG Smart TV - ' + info.sdkVersion;
        const deviceModel = info.modelName;
        const modelCode = info.version;
        info = `Platfrom: ${platform} | Model: ${deviceModel} | Model Code: ${modelCode}`;
    });
    }
    return info;
  }catch(err){
    console.error("Error while sending device info", err)
  }
  return 'error - can\'t fetch device info'
}


function getMeta(){
  let element: HTMLElement = ChiiElement || getTargetScriptEl();
  return JSON.stringify({
    ...element.dataset,
    connectedAt: new Date(),
  })
}