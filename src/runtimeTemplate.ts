export type DEP = {
  url: string
  version?: string
  varName?: string
  attributes?: Record<string, string | boolean>
}

export const globalName = '__LOAD_EXTERNAL_DEPENDENCIES_WEBPACK_PLUGIN__'

const countTimeString = `load all dependencies by ${globalName} spend`

/** 模板头部，只在第一个入口文件中插入 */
export const templateBegin = (deps: DEP[]) => `
window.${globalName} = (function() {
  const loadedUrlSet = new Set();
  const deps = ${JSON.stringify(deps)};
  return new Promise((allResolve, allReject) => {
    const append = (index) => {
      if (index >= deps.length) {
        allResolve();
        return Promise.resolve();
      };
      const url = deps[index].url;
      if (url.endsWith('.css')) {
        const linkNode = document.createElement('link');
        linkNode.setAttribute('rel', 'stylesheet');
        linkNode.href = url;
        document.head.appendChild(linkNode);
        return append(index + 1);
      };
      if (loadedUrlSet.has(url)) {
        return append(index + 1);
      };
      const scriptNode = document.createElement('script');
      scriptNode.setAttribute('rel', 'preload');
      scriptNode.src = url;
      document.head.appendChild(scriptNode);
      const varName = deps[index].varName;
      const version = deps[index].version;
      return new Promise((resolve, reject) => {
        scriptNode.onload = () => {
          if (window[varName] && version) {
            window[varName + version.replace(/[^0-9a-z_$]/g, '')] = window[varName]
          }
          resolve();
          loadedUrlSet.add(url);
          append(index + 1);
        };
        scriptNode.onerror = () => {
          reject();
          allReject();
        };
      });
    };
    console.time('${countTimeString}');
    append(0);
  });
})().then(() => {console.timeEnd('${countTimeString}')});
window.${globalName}.documentCurrentScript = document.currentScript;
`

/** 在所有入口文件中插入 */
export const templateEnd = [
  `;${globalName}.then(() => {
`,
  `
});`,
]
