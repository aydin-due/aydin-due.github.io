function downloadPDF() {
    var link = document.createElement('a');
    link.setAttribute('download', 'file.pdf');
    link.setAttribute('href', 'assets/cv_aydin.pdf');
    link.click();
  }