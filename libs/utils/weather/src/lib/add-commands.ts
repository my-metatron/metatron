AFRAME.registerComponent('add-commands', {
  init: function () {
    const weatherEntityEl = document.querySelector('#weatherentity');
    if (weatherEntityEl) {
      console.log('adding commands');
      weatherEntityEl.setAttribute(
        'speech-command__show',
        'command: show menu; type: attribute; attribute: visible; value: true;'
      );
      weatherEntityEl.setAttribute(
        'speech-command__hide',
        'command: hide menu; type: attribute; attribute: visible; value: false;'
      );
      weatherEntityEl.setAttribute('visible', 'false');
    }
  },
});
