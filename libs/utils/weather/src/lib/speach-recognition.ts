/* global AFRAME */

if (typeof AFRAME === 'undefined') {
  throw new Error(
    'Component attempted to register before AFRAME was available.'
  );
}

AFRAME.registerSystem('speech-command', {
  init: function () {
    console.log('in speech-command system init');
    this.entities = [];
    //window.addEventListener('loaded', this.onSceneLoaded.bind(this));
  },
  registerMe: function (comp) {
    this.entities.push(comp);
    console.log('in register, comp: ' + comp.data.command);
    window.dispatchEvent(new Event('commandregistration'));
  },
  unregisterMe: function (comp) {
    const index = this.entities.indexOf(comp);
    this.entities.splice(index, 1);
  },
  onSceneLoaded: function (evt) {
    console.log('in speech-command system onSceneLoaded listener');
  },
  play: function () {
    console.log('in system play, entities: ' + this.entities);
  },
});
AFRAME.registerComponent('speech-command', {
  multiple: true,
  schema: {
    command: { type: 'string' },
    type: { type: 'string' },
    targetElement: { type: 'selector' },
    targetComponent: { type: 'string' },
    function: { type: 'string' },
    attribute: { type: 'string' },
    value: { type: 'string' },
    keyCode: { type: 'string' },
  },
  init: function () {
    this.system.registerMe(this);
    if (!this.data.targetElement) {
      this.data.targetElement = this.el;
    }
    if (this.data.keyCode) {
      window.addEventListener('keyup', this.onKeyup.bind(this));
    }
  },
  remove: function () {
    this.system.unregisterMe(this);
  },
  play: function () {
    //console.log("in speech-command play, command: "+this.data.command+", type: "+this.data.type);
  },
  executeCommand: function () {
    console.log('in executeCommand for: ' + this.data.targetElement);
    const targetElement = this.data.targetElement;

    if (this.data.type == 'attribute') {
      /*       console.log(
        'about to change attribute ' +
          this.data.attribute +
          ' to: ' +
          this.data.value
      ); */
      if (this.data.attribute === 'visible' && this.data.value === 'true') {
        window.dispatchEvent(new Event('positionplayer'));
      }
      targetElement.setAttribute(this.data.attribute, this.data.value);
    } else if (this.data.type == 'function') {
      const targetComponent =
        targetElement.components[this.data.targetComponent];
      targetComponent[this.data.function]();
    }
  },
  onKeyup: function (evt) {
    if (evt.keyCode == this.data.keyCode) {
      //console.log("in speech command keyup for: "+this.data.command);
      this.executeCommand();
    }
  },
});
AFRAME.registerComponent('annyang-speech-recognition', {
  init: function () {
    console.log('in annyang-speech-recognition init');
    window.addEventListener('commandregistration', this.addCommands.bind(this));
  },
  addCommands: function () {
    if (annyang) {
      // annyang.stop();
      // console.log('annyang: ' + annyang);
      // console.log('annyang.addCommands: ' + annyang.addCommands);
      const speechCommandSystem =
        document.querySelector('a-scene').systems['speech-command'];
      console.log(speechCommandSystem);
      // console.log('speechCommandSystem', speechCommandSystem?.entities);
      const commands = {};
      const commandsMap = {};
      for (let i = 0; i < speechCommandSystem['entities'].length; i++) {
        const speechCommand = speechCommandSystem['entities'][i];
        console.log('i', i, speechCommand);
        commandsMap[speechCommand.data.command] = speechCommand;
        // note: function empty here because real work is done in the resultMatch callback below
        commands[speechCommand.data.command] = function () {
          /* */
        };
      }
      console.log('CURRENT commands', commands);
      annyang.addCommands(commands);
      annyang.removeCallback();
      annyang.addCallback(
        'resultMatch',
        function (userSaid, commandText, phrases) {
          console.log('commandText: ' + commandText); // sample output: 'hello (there)'
          const speechCommand = commandsMap[commandText];
          speechCommand.executeCommand();
        }
      );

      // Start listening. You can call this here, or attach this call to an event, button, etc.
      //  annyang.start();
    }
  },
  play: function () {
    if (annyang) {
      // console.log('annyang: ' + annyang);
      // console.log('annyang.addCommands: ' + annyang.addCommands);
      /*    const speechCommandSystem =
        document.querySelector('a-scene').systems['speech-command'];
      console.log(speechCommandSystem);
      // console.log('speechCommandSystem', speechCommandSystem?.entities);
      const commands = {};
      const commandsMap = {};
      for (let i = 0; i < speechCommandSystem['entities'].length; i++) {
        console.log('HEHE');
        const speechCommand = speechCommandSystem['entities'][i];
        console.log('i', i, speechCommand);
        commandsMap[speechCommand.data.command] = speechCommand;
        // note: function empty here because real work is done in the resultMatch callback below
        commands[speechCommand.data.command] = function () {};
      }
      console.log(JSON.stringify(commands));
      annyang.addCommands(commands);

      annyang.addCallback(
        'resultMatch',
        function (userSaid, commandText, phrases) {
          console.log('commandText: ' + commandText); // sample output: 'hello (there)'
          const speechCommand = commandsMap[commandText];
          speechCommand.executeCommand();
        }
      ); */

      // Start listening. You can call this here, or attach this call to an event, button, etc.
      annyang.start();
    }
  },
});
