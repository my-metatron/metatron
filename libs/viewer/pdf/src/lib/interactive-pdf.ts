AFRAME.registerComponent('interactive-pdf', {
  schema: {
    pdfSrc: {
      type: 'string',
      default:
        'https://cdn.jsdelivr.net/npm/pdfjs-dist@3.0.279/build/pdf.min.js',
    },
    workerSrc: {
      type: 'string',
      default:
        'https://cdn.jsdelivr.net/npm/pdfjs-dist@3.0.279/build/pdf.worker.min.js',
    },
    id: { type: 'string', default: 'plane1' },
    fileName: {
      type: 'string',
      default: './assets/aframe.pdf',
    },
    pageWidth: { type: 'float', default: 1200 },
    pageHeight: { type: 'float', default: 1500 },
  },

  init: async function () {
    // console.log('data = ', this.data);
    const head = document.getElementsByTagName('head')[0];
    const script: any = document.createElement('script');
    script.type = 'text/javascript';
    script.src = this.data.pdfSrc;
    let self = this;
    script.onload = function () {
      window.pdfjsLib.GlobalWorkerOptions.workerSrc = self.data.workerSrc;
      window.pdfjsLib
        .getDocument(self.data.fileName)
        .promise.then(function (pdf) {
          self.pdf = pdf;
          self.numPages = pdf.numPages;
          self.render(1);
        });
    };
    head.appendChild(script);
    await script.onload;
    this.displayPlane = document.getElementById(this.data.id);
    this.displayMaterial = this.displayPlane.getObject3D('mesh').material;
    this.canvas = this.displayPlane.getAttribute('material').src;
    this.canvas.setAttribute('width', this.data.pageWidth);
    this.canvas.setAttribute('height', this.data.pageHeight);
    this.context = this.canvas.getContext('2d');
    this.pdf = null;
    this.currentPage = 1;
    this.numPages = 0;

    // console.log(this.displayPlane);
  },

  render(pageNumber = 1) {
    if (!this.pdf) return;

    let self = this;

    this.pdf.getPage(pageNumber).then(function (page) {
      const pageViewport = page.getViewport({ scale: 2 });
      const context = self.canvas.getContext('2d');
      const renderContext = {
        canvasContext: context,
        viewport: pageViewport,
      };

      const renderTask = page.render(renderContext);

      renderTask.promise.then(function () {
        self.displayMaterial.map.needsUpdate = true;
      });
    });
  },

  nextPage: function () {
    if (this.currentPage < this.numPages) this.currentPage++;
    this.render(this.currentPage);
  },

  prevPage: function () {
    if (this.currentPage > 1) this.currentPage--;
    this.render(this.currentPage);
  },

  tick: function () {
    // this.displayMaterial.map.needsUpdate = true;
  },
});
