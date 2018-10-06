const externalScripts = {};

export default {
  data() {
    return {
      $externalScriptsLoaded: false,
    };
  },
  created() {
    if (!this.$options.externalScripts) return;

    this.$options.externalScripts.forEach((url) => {
      // TODO: make this work with promise / onload behavior
      if (externalScripts[url]) return;

      const script = document.createElement('script');
      script.setAttribute('src', url);
      script.async = true;
      document.head.appendChild(script);

      // TODO: set things up so we can tell when the script is loaded
      // expose "is everything loaded" as a boolean
      // expose a promise that resolves when everything is loaded
      // script.onload = scriptLoadedPromise.resolve();

      externalScripts[url] = {
        url,
        domScript: script,
      };
    });
  },
};
