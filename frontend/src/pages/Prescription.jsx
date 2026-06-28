import { useState } from 'react';
import { useApp } from '../context/AppContext';
import { API_URL } from '../config';
import { UploadCloud, FileText, CheckCircle, MessageSquare, AlertCircle, Trash2, Home, Store } from 'lucide-react';
import { Link } from 'react-router-dom';

const Prescription = () => {
  const { showToast, token } = useApp();

  // Form states
  const [name, setName] = useState('');
  const [phone, setPhone] = useState('');
  const [deliveryOption, setDeliveryOption] = useState('home'); // 'home' | 'pickup'
  const [address, setAddress] = useState('');
  const [notes, setNotes] = useState('');
  const [uploadedFile, setUploadedFile] = useState(null);

  // UI state
  const [loading, setLoading] = useState(false);
  const [dragActive, setDragActive] = useState(false);
  const [successRecord, setSuccessRecord] = useState(null);

  // Drag handlers
  const handleDrag = (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === 'dragenter' || e.type === 'dragover') {
      setDragActive(true);
    } else if (e.type === 'dragleave') {
      setDragActive(false);
    }
  };

  const handleDrop = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      handleFile(e.dataTransfer.files[0]);
    }
  };

  const handleFileInput = (e) => {
    if (e.target.files && e.target.files[0]) {
      handleFile(e.target.files[0]);
    }
  };

  const handleFile = (file) => {
    if (file.size > 5 * 1024 * 1024) {
      showToast('File size exceeds 5MB limit.', 'error');
      return;
    }
    const allowedTypes = ['image/jpeg', 'image/png', 'image/jpg', 'application/pdf'];
    if (!allowedTypes.includes(file.type)) {
      showToast('Invalid file format. Only JPG, PNG, and PDF are allowed.', 'error');
      return;
    }
    setUploadedFile(file);
    showToast('Prescription copy loaded successfully.', 'success');
  };

  const handleRemoveFile = (e) => {
    e.stopPropagation();
    setUploadedFile(null);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!name.trim() || !phone.trim() || !deliveryOption) {
      showToast('Please fill out all required fields.', 'error');
      return;
    }

    if (!uploadedFile) {
      showToast('Please upload a copy of your prescription.', 'error');
      return;
    }

    setLoading(true);

    const formData = new FormData();
    formData.append('name', name);
    formData.append('phone', phone);
    formData.append('deliveryOption', deliveryOption);
    formData.append('address', deliveryOption === 'home' ? address : '');
    formData.append('notes', notes);
    formData.append('prescriptionCopy', uploadedFile);

    try {
      const res = await fetch(`${API_URL}/prescriptions`, {
        method: 'POST',
        headers: token ? { 'Authorization': `Bearer ${token}` } : {},
        body: formData
      });

      const data = await res.json();
      setLoading(false);

      if (data.success) {
        showToast('Prescription details saved successfully!', 'success');
        setSuccessRecord(data.prescription);
        
        // Reset form
        setName('');
        setPhone('');
        setDeliveryOption('home');
        setAddress('');
        setNotes('');
        setUploadedFile(null);
      } else {
        showToast(data.message || 'Prescription upload failed.', 'error');
      }
    } catch (err) {
      console.error(err);
      setLoading(false);
      showToast('Server offline or network error during upload.', 'error');
    }
  };

  const handleSendWhatsApp = () => {
    if (!successRecord) return;
    
    let msg = `*Laxmi Narsimha Medical & General Store*\n`;
    msg += `*Prescription Upload Request (ID: LN-RX${successRecord.id})*\n\n`;
    msg += `*Customer:* ${successRecord.name}\n`;
    msg += `*WhatsApp Phone:* ${successRecord.phone}\n`;
    msg += `*Service Option:* ${successRecord.deliveryOption === 'home' ? 'Home Delivery' : 'Store Pickup'}\n`;
    if (successRecord.deliveryOption === 'home' && successRecord.address) {
      msg += `*Delivery Address:* ${successRecord.address}\n`;
    }
    if (successRecord.notes) {
      msg += `*Notes:* ${successRecord.notes}\n`;
    }
    msg += `\n*Uploaded Attachment:* [Ref: ${successRecord.file.originalname}]\n`;
    msg += `_Note: Please attach your prescription file copy in this WhatsApp chat immediately for our pharmacists to double check._`;

    const waUrl = `https://wa.me/917569796263?text=${encodeURIComponent(msg)}`;
    window.open(waUrl, '_blank');
  };

  if (successRecord) {
    return (
      <div className="section">
        <div className="container" style={{ maxWidth: '600px' }}>
          <div className="glass-card checkout-success-box">
            <div className="success-icon" style={{ backgroundColor: 'var(--primary-light)', color: 'var(--primary)' }}>
              <CheckCircle size={40} />
            </div>
            <h2 style={{ fontSize: '1.85rem', fontWeight: 800, marginBottom: '10px' }}>Upload Confirmed!</h2>
            <p style={{ color: 'var(--text-muted)', marginBottom: '24px' }}>
              Your prescription details have been successfully recorded. Prescription ID is <strong>LN-RX{successRecord.id}</strong>.
            </p>

            <div style={{ 
              textAlign: 'left', 
              border: '1px solid var(--border)', 
              borderRadius: 'var(--radius-sm)', 
              padding: '20px', 
              backgroundColor: 'var(--bg-surface-secondary)', 
              marginBottom: '24px' 
            }}>
              <h4 style={{ fontWeight: 700, marginBottom: '12px', borderBottom: '1px solid var(--border)', paddingBottom: '8px' }}>Registration Summary</h4>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', fontSize: '0.9rem' }}>
                <div><strong>Patient Name:</strong> {successRecord.name}</div>
                <div><strong>Phone Number:</strong> {successRecord.phone}</div>
                <div><strong>Delivery Type:</strong> {successRecord.deliveryOption === 'home' ? 'Home Delivery' : 'Store Pickup'}</div>
                {successRecord.deliveryOption === 'home' && <div><strong>Address:</strong> {successRecord.address}</div>}
                <div><strong>Uploaded File:</strong> {successRecord.file.originalname}</div>
              </div>
            </div>

            <div style={{ 
              backgroundColor: 'var(--secondary-light)', 
              border: '1px solid var(--secondary)', 
              borderRadius: 'var(--radius-sm)', 
              padding: '16px', 
              marginBottom: '24px',
              display: 'flex',
              gap: '12px',
              alignItems: 'flex-start',
              textAlign: 'left'
            }}>
              <AlertCircle size={20} color="var(--secondary)" style={{ flexShrink: 0, marginTop: '2px' }} />
              <div>
                <h4 style={{ fontSize: '0.9rem', fontWeight: 700, color: 'var(--text-main)', marginBottom: '4px' }}>Establish Direct Counter Contact</h4>
                <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)', lineHeight: '1.4' }}>
                  Please click the button below to forward your prescription draft to the pharmacy counter staff on WhatsApp. Don't forget to attach the prescription image in WhatsApp too!
                </p>
              </div>
            </div>

            <div style={{ display: 'flex', gap: '16px' }}>
              <button className="btn btn-secondary" style={{ flexGrow: 1, gap: '8px' }} onClick={handleSendWhatsApp}>
                <MessageSquare size={18} /> Coordinate via WhatsApp
              </button>
              <button className="btn btn-primary" style={{ flexGrow: 1 }} onClick={() => setSuccessRecord(null)}>
                Upload Another RX
              </button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="section">
      <div className="container">
        <div className="section-header">
          <h2>Upload Prescription</h2>
          <p>Send your prescription details directly to our staff for quick packing and hassle-free pickup or home delivery.</p>
        </div>

        <div className="upload-grid" style={{ textAlign: 'left' }}>
          {/* Left: How it works */}
          <div className="glass-card upload-info-card">
            <h3 style={{ fontWeight: 800 }}>How it Works</h3>
            <div className="upload-steps">
              <div className="step-item">
                <div className="step-num">1</div>
                <div className="step-content">
                  <h4>Snap & Upload</h4>
                  <p>Take a clear photo of your doctor's written prescription list and drag it into the upload dropzone.</p>
                </div>
              </div>
              <div className="step-item">
                <div className="step-num">2</div>
                <div className="step-content">
                  <h4>Verify Details</h4>
                  <p>Provide your delivery location choice, phone number, and any special instructions or drug preferences.</p>
                </div>
              </div>
              <div className="step-item">
                <div className="step-num">3</div>
                <div className="step-content">
                  <h4>Confirm via WhatsApp</h4>
                  <p>The system prepares a preformatted order template that redirect-launches in your WhatsApp for visual file attachments.</p>
                </div>
              </div>
            </div>
          </div>

          {/* Right: Upload Form */}
          <div className="glass-card">
            <form onSubmit={handleSubmit} onDragEnter={handleDrag}>
              <div className="form-group" style={{ position: 'relative' }}>
                <label>Prescription Copy (Max 5MB)</label>
                
                <input 
                  type="file" 
                  id="file-input" 
                  accept=".jpg, .jpeg, .png, .pdf" 
                  onChange={handleFileInput}
                  style={{ display: 'none' }}
                />

                <div 
                  className={`upload-dropzone ${dragActive ? 'dragover' : ''}`}
                  onClick={() => document.getElementById('file-input').click()}
                  onDragEnter={handleDrag}
                  onDragOver={handleDrag}
                  onDragLeave={handleDrag}
                  onDrop={handleDrop}
                >
                  <div className="upload-icon">
                    <UploadCloud size={32} color="var(--primary)" />
                  </div>
                  <p>Drag and drop your file here, or <span>browse files</span></p>
                  <span className="file-format-info">Accepted formats: JPG, JPEG, PNG, PDF</span>
                </div>

                {uploadedFile && (
                  <div className="file-preview">
                    <div className="file-info">
                      <FileText size={20} color="var(--primary)" />
                      <span className="file-name">{uploadedFile.name}</span>
                    </div>
                    <span className="file-remove" onClick={handleRemoveFile} aria-label="Remove prescription">
                      <Trash2 size={18} />
                    </span>
                  </div>
                )}
              </div>

              <div className="form-group">
                <label htmlFor="rx-name">Full Name *</label>
                <input 
                  type="text" 
                  id="rx-name" 
                  required 
                  placeholder="Enter patient full name" 
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                />
              </div>

              <div className="form-group">
                <label htmlFor="rx-phone">WhatsApp Contact Number *</label>
                <input 
                  type="tel" 
                  id="rx-phone" 
                  required 
                  placeholder="Enter 10-digit phone number" 
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                />
              </div>

              <label style={{ display: 'block', fontSize: '0.9rem', fontWeight: 600, marginBottom: '8px' }}>
                Delivery / Service Type
              </label>
              
              <div className="delivery-options">
                <div 
                  className={`delivery-option-card ${deliveryOption === 'home' ? 'active' : ''}`}
                  onClick={() => setDeliveryOption('home')}
                >
                  <input 
                    type="radio" 
                    name="delivery-type" 
                    value="home" 
                    checked={deliveryOption === 'home'} 
                    onChange={() => setDeliveryOption('home')}
                    id="del-home"
                  />
                  <div className="delivery-option-text">
                    <label htmlFor="del-home" style={{ marginBottom: 0, fontWeight: 700, cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '4px' }}>
                      <Home size={14} /> Home Delivery
                    </label>
                    <p style={{ margin: 0, fontSize: '0.75rem' }}>Delivered direct to address</p>
                  </div>
                </div>

                <div 
                  className={`delivery-option-card ${deliveryOption === 'pickup' ? 'active' : ''}`}
                  onClick={() => setDeliveryOption('pickup')}
                >
                  <input 
                    type="radio" 
                    name="delivery-type" 
                    value="pickup" 
                    checked={deliveryOption === 'pickup'} 
                    onChange={() => setDeliveryOption('pickup')}
                    id="del-pickup"
                  />
                  <div className="delivery-option-text">
                    <label htmlFor="del-pickup" style={{ marginBottom: 0, fontWeight: 700, cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '4px' }}>
                      <Store size={14} /> Store Pickup
                    </label>
                    <p style={{ margin: 0, fontSize: '0.75rem' }}>Ready to collect at counter</p>
                  </div>
                </div>
              </div>

              {deliveryOption === 'home' && (
                <div className="form-group">
                  <label htmlFor="rx-address">Delivery Street Address *</label>
                  <input 
                    type="text" 
                    id="rx-address" 
                    required 
                    placeholder="Enter full address for home delivery" 
                    value={address}
                    onChange={(e) => setAddress(e.target.value)}
                  />
                </div>
              )}

              <div className="form-group">
                <label htmlFor="rx-notes">Special Instructions or Dosage Requests</label>
                <textarea 
                  id="rx-notes" 
                  rows="3" 
                  placeholder="Specify substitute brand requests, packaging guidelines, or timing considerations..."
                  value={notes}
                  onChange={(e) => setNotes(e.target.value)}
                ></textarea>
              </div>

              <button 
                type="submit" 
                className="btn btn-primary" 
                style={{ width: '100%' }}
                disabled={loading}
              >
                {loading ? (
                  <div style={{ 
                    border: '2px solid rgba(255,255,255,0.3)', 
                    borderTop: '2px solid white', 
                    borderRadius: '50%', 
                    width: '18px', 
                    height: '18px', 
                    animation: 'spin 0.6s linear infinite',
                    margin: '0 auto'
                  }}></div>
                ) : 'Submit Prescription Details'}
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Prescription;
