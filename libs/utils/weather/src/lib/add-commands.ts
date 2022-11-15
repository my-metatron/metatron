AFRAME.registerComponent('add-commands', {
  init: function () {
    const weatherEntityEl = document.querySelector('#weatherentity');
    if (weatherEntityEl) {
      weatherEntityEl.setAttribute(
        'speech-command__show',
        'command: show weather; type: attribute; attribute: visible; value: true;'
      );
      weatherEntityEl.setAttribute(
        'speech-command__hide',
        'command: hide weather; type: attribute; attribute: visible; value: false;'
      );
      weatherEntityEl.setAttribute('visible', 'false');
    }
  },
});
