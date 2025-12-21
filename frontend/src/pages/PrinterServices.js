import React, { useState } from 'react';
import Footer from '../components/Footer';

const PrinterServices = () => {
  const [printDetails, setPrintDetails] = useState({
    file: null,
    copies: 1,
    colorMode: 'bw',
    pageSize: 'a4',
    orientation: 'portrait',
    sides: 'single'
  });
  const [fileName, setFileName] = useState('');

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setPrintDetails(prev => ({ ...prev, file }));
      setFileName(file.name);
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    
    // Calculate price based on selections
    const basePrice = printDetails.colorMode === 'color' ? 10 : 5; // Price per page
    const totalPrice = basePrice * printDetails.copies;

    // Add to user history
    const username = JSON.parse(localStorage.getItem('userDetails'))?.username;
    const printHistory = {
      username,
      service: 'Printing Service',
      details: `${printDetails.copies} copies, ${printDetails.colorMode === 'color' ? 'Color' : 'B&W'}, ${printDetails.pageSize.toUpperCase()}`,
      price: totalPrice,
      date: new Date().toISOString().split('T')[0]
    };

    const history = JSON.parse(localStorage.getItem('userHistory') || '[]');
    history.push(printHistory);
    localStorage.setItem('userHistory', JSON.stringify(history));

    alert(`Print job submitted successfully! Total cost: ₹${totalPrice}`);
    
    // Reset form
    setPrintDetails({
      file: null,
      copies: 1,
      colorMode: 'bw',
      pageSize: 'a4',
      orientation: 'portrait',
      sides: 'single'
    });
    setFileName('');
  };

  return (
    <div className="layout-container">
      <main className="main-content">
        <div className="printer-container">
          <h2>Printing Services</h2>

          <div className="print-services">
            <div className="print-form">
              <form onSubmit={handleSubmit}>
                <div className="form-group">
                  <label>Upload File</label>
                  <div className="file-upload">
                    <input
                      type="file"
                      onChange={handleFileChange}
                      accept=".pdf,.doc,.docx,.txt"
                      required
                    />
                    {fileName && <p className="file-name">{fileName}</p>}
                  </div>
                </div>

                <div className="form-group">
                  <label>Number of Copies</label>
                  <input
                    type="number"
                    min="1"
                    value={printDetails.copies}
                    onChange={(e) => setPrintDetails(prev => ({ ...prev, copies: parseInt(e.target.value) }))}
                    required
                  />
                </div>

                <div className="form-group">
                  <label>Color Mode</label>
                  <select
                    value={printDetails.colorMode}
                    onChange={(e) => setPrintDetails(prev => ({ ...prev, colorMode: e.target.value }))}
                  >
                    <option value="bw">Black & White</option>
                    <option value="color">Color</option>
                  </select>
                </div>

                <div className="form-group">
                  <label>Page Size</label>
                  <select
                    value={printDetails.pageSize}
                    onChange={(e) => setPrintDetails(prev => ({ ...prev, pageSize: e.target.value }))}
                  >
                    <option value="a4">A4</option>
                    <option value="a3">A3</option>
                    <option value="letter">Letter</option>
                    <option value="legal">Legal</option>
                  </select>
                </div>

                <div className="form-group">
                  <label>Orientation</label>
                  <select
                    value={printDetails.orientation}
                    onChange={(e) => setPrintDetails(prev => ({ ...prev, orientation: e.target.value }))}
                  >
                    <option value="portrait">Portrait</option>
                    <option value="landscape">Landscape</option>
                  </select>
                </div>

                <div className="form-group">
                  <label>Sides</label>
                  <select
                    value={printDetails.sides}
                    onChange={(e) => setPrintDetails(prev => ({ ...prev, sides: e.target.value }))}
                  >
                    <option value="single">Single-sided</option>
                    <option value="double">Double-sided</option>
                  </select>
                </div>

                <button type="submit" className="submit-button">
                  <i className="fas fa-print"></i> Print Document
                </button>
              </form>
            </div>
          </div>

          <div className="printing-guidelines">
            <h3>Printing Guidelines</h3>
            <div className="guidelines-grid">
              <div className="guideline-card">
                <i className="fas fa-file"></i>
                <h4>Supported Formats</h4>
                <p>PDF, DOC, DOCX, TXT</p>
              </div>
              <div className="guideline-card">
                <i className="fas fa-rupee-sign"></i>
                <h4>Pricing</h4>
                <p>B&W: ₹5/copy<br />Color: ₹10/copy</p>
              </div>
              <div className="guideline-card">
                <i className="fas fa-clock"></i>
                <h4>Processing Time</h4>
                <p>30 sceonds to 2 minutes</p>
              </div>
            </div>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
};

export default PrinterServices; 