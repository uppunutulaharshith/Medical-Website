import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useApp } from '../context/AppContext';
import { API_URL } from '../config';
import { ShoppingBag, Calendar, CreditCard, ChevronRight, AlertCircle, RefreshCw, MessageSquare } from 'lucide-react';

const MyOrders = () => {
  const { token, user, showToast } = useApp();
  const navigate = useNavigate();

  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!token || !user) {
      showToast('Please login to view your order history.', 'error');
      navigate('/auth');
      return;
    }

    const fetchMyOrders = async () => {
      setLoading(true);
      try {
        const res = await fetch(`${API_URL}/orders/my-orders`, {
          headers: {
            'Authorization': `Bearer ${token}`
          }
        });
        const data = await res.json();
        if (data.success) {
          setOrders(data.orders);
        } else {
          showToast(data.message || 'Failed to fetch your orders.', 'error');
        }
      } catch (err) {
        console.error("Error fetching my orders:", err);
        showToast('Server is offline. Unable to load order history.', 'error');
      } finally {
        setLoading(false);
      }
    };

    fetchMyOrders();
  }, [token, user, showToast, navigate]);

  const handleSendWhatsAppMessage = (order) => {
    let message = `*Laxmi Narsimha Medical & General Store*\n`;
    message += `*Order Inquiry (ID: LN-${order.id})*\n\n`;
    message += `*Customer Details:*\n`;
    message += `- Name: ${order.addressDetails.name}\n`;
    message += `- Contact: ${order.addressDetails.phone}\n`;
    message += `- Address: ${order.addressDetails.address}, ${order.addressDetails.city} - ${order.addressDetails.zip}\n\n`;
    
    message += `*Ordered Items:*\n`;
    order.items.forEach((item, idx) => {
      message += `${idx + 1}. ${item.name} x ${item.qty} - ₹${(item.price * item.qty).toFixed(2)}\n`;
    });
    
    message += `\n*Total: ₹${order.total.toFixed(2)}*\n`;
    message += `*Payment Method:* ${order.paymentDetails.method}\n`;
    message += `*Status:* ${order.status}\n\n`;
    message += `_Hello, I want to inquire about the status of my order._`;

    const waUrl = `https://wa.me/919000000000?text=${encodeURIComponent(message)}`;
    window.open(waUrl, '_blank');
  };

  if (loading) {
    return (
      <div style={{ textAlign: 'center', padding: '120px 0' }}>
        <div style={{ 
          border: '4px solid var(--border)', 
          borderTop: '4px solid var(--primary)', 
          borderRadius: '50%', 
          width: '50px', 
          height: '50px', 
          animation: 'spin 1s linear infinite', 
          margin: '0 auto' 
        }}></div>
        <p style={{ marginTop: '20px', color: 'var(--text-muted)' }}>Loading your orders...</p>
      </div>
    );
  }

  return (
    <div className="section" style={{ textAlign: 'left' }}>
      <div className="container">
        <div className="section-header" style={{ textAlign: 'left', marginLeft: 0 }}>
          <h2>My Order History</h2>
          <p>Review and track your past orders placed with Laxmi Narsimha Pharmacy.</p>
        </div>

        {orders.length === 0 ? (
          <div className="glass-card" style={{ padding: '60px', maxWidth: '600px', margin: '0 auto', textAlign: 'center' }}>
            <ShoppingBag size={48} color="var(--primary)" style={{ marginBottom: '20px' }} />
            <h3>No Orders Placed Yet</h3>
            <p style={{ color: 'var(--text-muted)', marginTop: '8px' }}>
              You haven't ordered any items yet. Browse our catalog and add items to your cart to start shopping!
            </p>
            <Link to="/shop" className="btn btn-primary" style={{ marginTop: '24px' }}>
              Browse Catalog
            </Link>
          </div>
        ) : (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
            {orders.map(order => (
              <div key={order.id} className="glass-card" style={{ padding: '24px' }}>
                {/* Order Top Panel */}
                <div style={{ 
                  display: 'flex', 
                  justifyContent: 'space-between', 
                  alignItems: 'flex-start',
                  flexWrap: 'wrap',
                  gap: '16px',
                  borderBottom: '1px solid var(--border)',
                  paddingBottom: '16px',
                  marginBottom: '16px'
                }}>
                  <div>
                    <h3 style={{ fontSize: '1.2rem', fontWeight: 800, margin: 0 }}>
                      Order #LN-{order.id}
                    </h3>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '16px', marginTop: '6px', fontSize: '0.85rem', color: 'var(--text-muted)' }}>
                      <span style={{ display: 'inline-flex', alignItems: 'center', gap: '4px' }}>
                        <Calendar size={14} />
                        {new Date(order.createdAt).toLocaleDateString()} at {new Date(order.createdAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                      </span>
                      <span style={{ display: 'inline-flex', alignItems: 'center', gap: '4px' }}>
                        <CreditCard size={14} />
                        Payment: {order.paymentDetails.method}
                      </span>
                    </div>
                  </div>
                  <div>
                    <span className={`admin-status-badge ${
                      order.status === 'Pending' ? 'status-pending' : 
                      order.status === 'Processing' ? 'status-processing' : 
                      order.status === 'Shipped' ? 'status-shipped' : 
                      order.status === 'Delivered' ? 'status-delivered' : 'status-cancelled'
                    }`}>
                      {order.status}
                    </span>
                  </div>
                </div>

                {/* Order items */}
                <div style={{ marginBottom: '20px' }}>
                  <h4 style={{ fontWeight: 700, fontSize: '0.9rem', color: 'var(--text-main)', marginBottom: '10px' }}>Items Summary</h4>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                    {order.items.map((item, idx) => (
                      <div key={idx} style={{ 
                        display: 'flex', 
                        justifyContent: 'space-between', 
                        fontSize: '0.9rem',
                        padding: '10px 14px',
                        backgroundColor: 'var(--bg-surface-secondary)',
                        borderRadius: 'var(--radius-sm)'
                      }}>
                        <div>
                          <strong style={{ color: 'var(--text-main)' }}>{item.name}</strong>
                          <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)', marginLeft: '8px' }}>({item.brand})</span>
                        </div>
                        <div>
                          <span style={{ color: 'var(--text-muted)', marginRight: '16px' }}>₹{item.price.toFixed(2)} x {item.qty}</span>
                          <strong style={{ color: 'var(--text-main)' }}>₹{(item.price * item.qty).toFixed(2)}</strong>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Delivery and Totals */}
                <div style={{ 
                  display: 'flex', 
                  justifyContent: 'space-between', 
                  alignItems: 'flex-end',
                  flexWrap: 'wrap',
                  gap: '20px',
                  borderTop: '1px solid var(--border)',
                  paddingTop: '16px'
                }}>
                  <div style={{ fontSize: '0.85rem', color: 'var(--text-muted)', maxWidth: '400px' }}>
                    <h5 style={{ fontWeight: 700, color: 'var(--text-main)', marginBottom: '4px', fontSize: '0.85rem' }}>Shipping Details</h5>
                    <div>{order.addressDetails.name} ({order.addressDetails.phone})</div>
                    <div>{order.addressDetails.address}, {order.addressDetails.city} - {order.addressDetails.zip}</div>
                  </div>
                  <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end', gap: '8px' }}>
                    <div style={{ fontSize: '1.2rem', fontWeight: 800 }}>
                      Total Bill: <span style={{ color: 'var(--primary)' }}>₹{order.total.toFixed(2)}</span>
                    </div>
                    <div style={{ display: 'flex', gap: '10px' }}>
                      <button 
                        className="btn btn-secondary" 
                        style={{ padding: '8px 14px', fontSize: '0.8rem', gap: '6px' }}
                        onClick={() => handleSendWhatsAppMessage(order)}
                      >
                        <MessageSquare size={14} /> WhatsApp Support
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default MyOrders;
