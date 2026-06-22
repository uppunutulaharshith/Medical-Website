import { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { useApp } from '../context/AppContext';
import { API_URL } from '../config';
import { Plus, Edit3, Trash2, X } from 'lucide-react';

const Admin = () => {
  const { user, token, showToast } = useApp();
  const navigate = useNavigate();

  // Tab State
  const [activeTab, setActiveTab] = useState('products'); // 'products' | 'orders' | 'prescriptions'

  // Data States
  const [products, setProducts] = useState([]);
  const [orders, setOrders] = useState([]);
  const [prescriptions, setPrescriptions] = useState([]);
  const [loading, setLoading] = useState(true);

  // Modal States for Product Add/Edit
  const [showProductModal, setShowProductModal] = useState(false);
  const [editingProduct, setEditingProduct] = useState(null); // null for add mode, product object for edit mode
  
  // Product Form states
  const [prodName, setProdName] = useState('');
  const [prodBrand, setProdBrand] = useState('');
  const [prodCategory, setProdCategory] = useState('medicines');
  const [prodType, setProdType] = useState('OTC');
  const [prodPrice, setProdPrice] = useState('');
  const [prodDesc, setProdDesc] = useState('');
  const [prodImage, setProdImage] = useState('');

  // Redirect if not logged in or not admin
  useEffect(() => {
    if (!token || !user) {
      showToast('Please login to access the Admin panel.', 'error');
      navigate('/auth');
    } else if (user.role !== 'admin') {
      showToast('Not authorized, administrator access required.', 'error');
      navigate('/');
    }
  }, [user, token, showToast, navigate]);

  const fetchData = useCallback(async () => {
    try {
      const headers = { 'Authorization': `Bearer ${token}` };

      // Fetch products
      const resProd = await fetch(`${API_URL}/products`);
      const dataProd = await resProd.json();
      if (dataProd.success) setProducts(dataProd.products);

      // Fetch orders
      const resOrd = await fetch(`${API_URL}/orders`, { headers });
      const dataOrd = await resOrd.json();
      if (dataOrd.success) setOrders(dataOrd.orders);

      // Fetch prescriptions
      const resPres = await fetch(`${API_URL}/prescriptions`, { headers });
      const dataPres = await resPres.json();
      if (dataPres.success) setPrescriptions(dataPres.prescriptions);

    } catch (err) {
      console.error(err);
      showToast('Error loading administrative datasets.', 'error');
    } finally {
      setLoading(false);
    }
  }, [token, showToast]);

  useEffect(() => {
    if (user) {
      // eslint-disable-next-line react-hooks/set-state-in-effect
      fetchData();
    }
  }, [user, fetchData]);

  // Handle open modal for adding
  const handleOpenAddModal = () => {
    setEditingProduct(null);
    setProdName('');
    setProdBrand('');
    setProdCategory('medicines');
    setProdType('OTC');
    setProdPrice('');
    setProdDesc('');
    setProdImage('');
    setShowProductModal(true);
  };

  // Handle open modal for editing
  const handleOpenEditModal = (product) => {
    setEditingProduct(product);
    setProdName(product.name);
    setProdBrand(product.brand);
    setProdCategory(product.category);
    setProdType(product.type);
    setProdPrice(product.price.toString());
    setProdDesc(product.desc || '');
    setProdImage(product.image || '');
    setShowProductModal(true);
  };

  // Submit Product Add/Edit Form
  const handleProductSubmit = async (e) => {
    e.preventDefault();

    if (!prodName.trim() || !prodPrice) {
      showToast('Name and price details are required.', 'error');
      return;
    }

    const body = {
      name: prodName,
      brand: prodBrand || 'Generic',
      category: prodCategory,
      type: prodType,
      price: parseFloat(prodPrice),
      desc: prodDesc,
      image: prodImage
    };

    try {
      const url = editingProduct ? `${API_URL}/products/${editingProduct.id}` : `${API_URL}/products`;
      const method = editingProduct ? 'PUT' : 'POST';

      const res = await fetch(url, {
        method,
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(body)
      });

      const data = await res.json();
      if (data.success) {
        showToast(data.message, 'success');
        setShowProductModal(false);
        // Refresh catalog lists
        setLoading(true);
        fetchData();
      } else {
        showToast(data.message || 'Product action failed.', 'error');
      }
    } catch (err) {
      console.error(err);
      showToast('Server error executing product save.', 'error');
    }
  };

  // Delete Product
  const handleDeleteProduct = async (id) => {
    if (!window.confirm('Are you sure you want to delete this product from the database catalog?')) return;

    try {
      const res = await fetch(`${API_URL}/products/${id}`, {
        method: 'DELETE',
        headers: { 'Authorization': `Bearer ${token}` }
      });
      const data = await res.json();
      if (data.success) {
        showToast(data.message, 'success');
        setLoading(true);
        fetchData();
      } else {
        showToast(data.message || 'Failed to delete.', 'error');
      }
    } catch (err) {
      console.error(err);
      showToast('Server offline while deleting product.', 'error');
    }
  };

  // Update Order Status
  const handleUpdateOrderStatus = async (id, status) => {
    try {
      const res = await fetch(`${API_URL}/orders/${id}/status`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ status })
      });
      const data = await res.json();
      if (data.success) {
        showToast(data.message, 'success');
        setLoading(true);
        fetchData();
      } else {
        showToast(data.message || 'Status update failed.', 'error');
      }
    } catch (err) {
      console.error(err);
      showToast('Server offline while saving order status.', 'error');
    }
  };

  // Delete Prescription
  const handleDeletePrescription = async (id) => {
    if (!window.confirm('Are you sure you want to delete this prescription from the database?')) return;

    try {
      const res = await fetch(`${API_URL}/prescriptions/${id}`, {
        method: 'DELETE',
        headers: { 'Authorization': `Bearer ${token}` }
      });
      const data = await res.json();
      if (data.success) {
        showToast(data.message, 'success');
        setLoading(true);
        fetchData();
      } else {
        showToast(data.message || 'Failed to delete prescription.', 'error');
      }
    } catch (err) {
      console.error(err);
      showToast('Server offline while deleting prescription.', 'error');
    }
  };



  // Show loading/redirect if not logged in
  if (!user) {
    return null;
  }

  return (
    <div className="section" style={{ textAlign: 'left' }}>
      <div className="container">
        <div className="section-header" style={{ textAlign: 'left', marginLeft: 0 }}>
          <h2>Admin Dashboard</h2>
          <p>Manage store catalogs and view customer orders history.</p>
        </div>

        <div className="admin-layout">
          {/* Tab buttons */}
          <div className="admin-tabs">
            <button 
              className={`admin-tab-btn ${activeTab === 'products' ? 'active' : ''}`}
              onClick={() => setActiveTab('products')}
            >
              Catalog Products ({products.length})
            </button>
            <button 
              className={`admin-tab-btn ${activeTab === 'orders' ? 'active' : ''}`}
              onClick={() => setActiveTab('orders')}
            >
              Customer Orders ({orders.length})
            </button>
            <button 
              className={`admin-tab-btn ${activeTab === 'prescriptions' ? 'active' : ''}`}
              onClick={() => setActiveTab('prescriptions')}
            >
              Prescriptions ({prescriptions.length})
            </button>
          </div>

          {/* Tab Panel contents */}
          <div className="admin-panel-content">
            {loading ? (
              <div style={{ textAlign: 'center', padding: '40px 0' }}>
                <div style={{ 
                  border: '4px solid var(--border)', 
                  borderTop: '4px solid var(--primary)', 
                  borderRadius: '50%', 
                  width: '40px', 
                  height: '40px', 
                  animation: 'spin 1s linear infinite', 
                  margin: '0 auto' 
                }}></div>
                <p style={{ marginTop: '16px', color: 'var(--text-muted)' }}>Refreshing dashboard records...</p>
              </div>
            ) : (
              <>
                {/* 1. PRODUCTS PANEL */}
                {activeTab === 'products' && (
                  <div>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
                      <h3 style={{ fontWeight: 700 }}>Catalog Directory</h3>
                      <button className="btn btn-primary" style={{ gap: '6px', padding: '10px 16px', fontSize: '0.9rem' }} onClick={handleOpenAddModal}>
                        <Plus size={16} /> Add New Product
                      </button>
                    </div>

                    <div className="admin-table-wrapper">
                      <table className="admin-table">
                        <thead>
                          <tr>
                            <th>ID</th>
                            <th>Product Name</th>
                            <th>Brand</th>
                            <th>Category</th>
                            <th>Price</th>
                            <th>Actions</th>
                          </tr>
                        </thead>
                        <tbody>
                          {products.map(prod => (
                            <tr key={prod.id}>
                              <td>{prod.id}</td>
                              <td style={{ fontWeight: 600 }}>{prod.name}</td>
                              <td>{prod.brand}</td>
                              <td style={{ textTransform: 'capitalize' }}>{prod.category.replace('-', ' ')}</td>
                              <td>₹{prod.price.toFixed(2)}</td>
                              <td>
                                <div className="admin-actions">
                                  <button className="admin-action-btn admin-action-edit" onClick={() => handleOpenEditModal(prod)}>
                                    <Edit3 size={14} />
                                  </button>
                                  <button className="admin-action-btn admin-action-delete" onClick={() => handleDeleteProduct(prod.id)}>
                                    <Trash2 size={14} />
                                  </button>
                                </div>
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  </div>
                )}

                {/* 2. ORDERS PANEL */}
                {activeTab === 'orders' && (
                  <div>
                    <h3 style={{ fontWeight: 700, marginBottom: '20px' }}>Placed Orders Directory</h3>

                    {orders.length === 0 ? (
                      <p style={{ color: 'var(--text-muted)', textAlign: 'center', padding: '40px' }}>No orders registered in the system database yet.</p>
                    ) : (
                      <div className="admin-table-wrapper">
                        <table className="admin-table">
                          <thead>
                            <tr>
                              <th>Order ID</th>
                              <th>Date</th>
                              <th>Customer Name</th>
                              <th>Items & Quantities</th>
                              <th>Total Bill</th>
                              <th>Payment</th>
                              <th>Status</th>
                            </tr>
                          </thead>
                          <tbody>
                            {orders.map(order => (
                              <tr key={order.id}>
                                <td>LN-{order.id}</td>
                                <td>{new Date(order.createdAt).toLocaleDateString()}</td>
                                <td>
                                  <div style={{ fontWeight: 600 }}>{order.addressDetails.name}</div>
                                  <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>{order.addressDetails.phone}</div>
                                </td>
                                <td>
                                  <div style={{ fontSize: '0.85rem', maxWidth: '240px', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                                    {order.items.map(item => `${item.name} (x${item.qty})`).join(', ')}
                                  </div>
                                </td>
                                <td style={{ fontWeight: 700 }}>₹{order.total.toFixed(2)}</td>
                                <td>
                                  <span style={{ fontSize: '0.8rem', fontWeight: 600 }}>{order.paymentDetails.method}</span>
                                </td>
                                <td>
                                  <select 
                                    className={`admin-status-badge ${
                                      order.status === 'Pending' ? 'status-pending' : 
                                      order.status === 'Processing' ? 'status-processing' : 
                                      order.status === 'Shipped' ? 'status-shipped' : 
                                      order.status === 'Delivered' ? 'status-delivered' : 'status-cancelled'
                                    }`}
                                    value={order.status}
                                    onChange={(e) => handleUpdateOrderStatus(order.id, e.target.value)}
                                    style={{ border: 'none', cursor: 'pointer', paddingRight: '8px' }}
                                  >
                                    <option value="Pending">Pending</option>
                                    <option value="Processing">Processing</option>
                                    <option value="Shipped">Shipped</option>
                                    <option value="Delivered">Delivered</option>
                                    <option value="Cancelled">Cancelled</option>
                                  </select>
                                </td>
                              </tr>
                            ))}
                          </tbody>
                        </table>
                      </div>
                    )}
                  </div>
                )}

                {/* 3. PRESCRIPTIONS PANEL */}
                {activeTab === 'prescriptions' && (
                  <div>
                    <h3 style={{ fontWeight: 700, marginBottom: '20px' }}>Uploaded Prescriptions Directory</h3>

                    {prescriptions.length === 0 ? (
                      <p style={{ color: 'var(--text-muted)', textAlign: 'center', padding: '40px' }}>No prescriptions registered in the system database yet.</p>
                    ) : (
                      <div className="admin-table-wrapper">
                        <table className="admin-table">
                          <thead>
                            <tr>
                              <th>Rx ID</th>
                              <th>Date</th>
                              <th>Patient Name</th>
                              <th>Contact Phone</th>
                              <th>Service Option</th>
                              <th>Notes / Special Instructions</th>
                              <th>Prescription File</th>
                              <th>Action</th>
                            </tr>
                          </thead>
                          <tbody>
                            {prescriptions.map(pres => (
                              <tr key={pres.id}>
                                <td>LN-RX{pres.id}</td>
                                <td>{new Date(pres.createdAt).toLocaleDateString()}</td>
                                <td style={{ fontWeight: 600 }}>{pres.name}</td>
                                <td>{pres.phone}</td>
                                <td>
                                  <div style={{ textTransform: 'capitalize', fontWeight: 600 }}>
                                    {pres.deliveryOption === 'home' ? 'Home Delivery' : 'Store Pickup'}
                                  </div>
                                  {pres.deliveryOption === 'home' && (
                                    <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', maxWidth: '180px', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }} title={pres.address}>
                                      {pres.address}
                                    </div>
                                  )}
                                </td>
                                <td>
                                  <div style={{ fontSize: '0.85rem', maxWidth: '200px', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }} title={pres.notes || 'No instructions'}>
                                    {pres.notes || <span style={{ fontStyle: 'italic', color: 'var(--text-muted)' }}>None</span>}
                                  </div>
                                </td>
                                <td>
                                  {pres.file ? (
                                    <a 
                                      href={`${API_URL.replace('/api', '')}${pres.file.url}`} 
                                      target="_blank" 
                                      rel="noreferrer" 
                                      style={{ color: 'var(--primary)', fontWeight: 600, textDecoration: 'underline' }}
                                    >
                                      View File ({pres.file.originalname.split('.').pop().toUpperCase()})
                                    </a>
                                  ) : (
                                    <span style={{ color: 'var(--text-muted)' }}>No File</span>
                                  )}
                                </td>
                                <td>
                                  <button 
                                    className="admin-action-btn admin-action-delete" 
                                    onClick={() => handleDeletePrescription(pres.id)}
                                    title="Delete Prescription"
                                  >
                                    <Trash2 size={14} />
                                  </button>
                                </td>
                              </tr>
                            ))}
                          </tbody>
                        </table>
                      </div>
                    )}
                  </div>
                )}
              </>
            )}
          </div>
        </div>
      </div>

      {/* --- ADD/EDIT PRODUCT MODAL --- */}
      {showProductModal && (
        <div className="admin-modal-overlay">
          <div className="admin-modal">
            <div className="admin-modal-header">
              <h3>{editingProduct ? 'Edit Catalog Product' : 'Add New Product'}</h3>
              <button 
                className="admin-modal-close" 
                onClick={() => setShowProductModal(false)}
                aria-label="Close modal"
              >
                <X size={20} />
              </button>
            </div>

            <form onSubmit={handleProductSubmit}>
              <div className="form-group">
                <label htmlFor="prod-name">Product Name *</label>
                <input 
                  type="text" 
                  id="prod-name" 
                  required 
                  placeholder="e.g. Amoxicillin 500mg" 
                  value={prodName}
                  onChange={(e) => setProdName(e.target.value)}
                />
              </div>

              <div className="form-group">
                <label htmlFor="prod-brand">Brand / Manufacturer *</label>
                <input 
                  type="text" 
                  id="prod-brand" 
                  required 
                  placeholder="e.g. Cipla" 
                  value={prodBrand}
                  onChange={(e) => setProdBrand(e.target.value)}
                />
              </div>

              <div className="form-group">
                <label htmlFor="prod-cat">Category *</label>
                <select 
                  id="prod-cat" 
                  value={prodCategory}
                  onChange={(e) => setProdCategory(e.target.value)}
                >
                  <option value="medicines">Medicines</option>
                  <option value="wellness">Wellness & Nutrition</option>
                  <option value="personal-care">Personal Care</option>
                  <option value="baby-care">Baby Care</option>
                </select>
              </div>

              <div className="form-group">
                <label htmlFor="prod-type">Product Type *</label>
                <select 
                  id="prod-type" 
                  value={prodType}
                  onChange={(e) => setProdType(e.target.value)}
                >
                  <option value="OTC">OTC (Over The Counter)</option>
                  <option value="Rx">Rx (Prescription Required)</option>
                </select>
              </div>

              <div className="form-group">
                <label htmlFor="prod-price">Retail Price (₹) *</label>
                <input 
                  type="number" 
                  id="prod-price" 
                  required 
                  step="0.01"
                  placeholder="e.g. 150.00" 
                  value={prodPrice}
                  onChange={(e) => setProdPrice(e.target.value)}
                />
              </div>

              <div className="form-group">
                <label htmlFor="prod-image">Image URL</label>
                <input 
                  type="text" 
                  id="prod-image" 
                  placeholder="e.g. https://images.unsplash.com/..." 
                  value={prodImage}
                  onChange={(e) => setProdImage(e.target.value)}
                />
              </div>

              <div className="form-group">
                <label htmlFor="prod-desc">Description</label>
                <textarea 
                  id="prod-desc" 
                  rows="3" 
                  placeholder="Formulation details, active ingredients, dosage notices..."
                  value={prodDesc}
                  onChange={(e) => setProdDesc(e.target.value)}
                ></textarea>
              </div>

              <div className="admin-modal-footer">
                <button 
                  type="button" 
                  className="btn btn-secondary" 
                  style={{ padding: '10px 16px', fontSize: '0.9rem' }}
                  onClick={() => setShowProductModal(false)}
                >
                  Cancel
                </button>
                <button 
                  type="submit" 
                  className="btn btn-primary"
                  style={{ padding: '10px 16px', fontSize: '0.9rem' }}
                >
                  Save Product
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default Admin;
