AFRAME.registerComponent('interactive-pdf', {
  schema: {
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

  init: function () {
    this.displayPlane = document.getElementById(this.data.id);
    this.displayMaterial = this.displayPlane.getObject3D('mesh').material;
    this.canvas = this.displayPlane.getAttribute('material').src;
    this.canvas.setAttribute('width', this.data.pageWidth);
    this.canvas.setAttribute('height', this.data.pageHeight);
    this.context = this.canvas.getContext('2d');
    this.pdf = null;
    this.currentPage = 1;
    this.numPages = 0;
    window.pdfjsLib.GlobalWorkerOptions.workerSrc = this.data.workerSrc;
    let self = this;
    window.pdfjsLib
      .getDocument(this.data.fileName)
      .promise.then(function (pdf) {
        self.pdf = pdf;
        self.numPages = pdf.numPages;
        self.render(1);
      });
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
