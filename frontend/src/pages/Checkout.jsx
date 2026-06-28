import { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useApp } from '../context/AppContext';
import { API_URL } from '../config';
import { ShieldCheck, Truck, QrCode, CreditCard, Banknote, ShoppingBag, MessageSquare, AlertCircle } from 'lucide-react';

const Checkout = () => {
  const { cart, cartTotal, clearCart, user, token, showToast } = useApp();
  const navigate = useNavigate();

  // Form states
  const [name, setName] = useState(user ? (user.name || '') : '');
  const [phone, setPhone] = useState(user ? (user.phone || '') : '');
  const [address, setAddress] = useState(user ? (user.address || '') : '');
  const [city, setCity] = useState('');
  const [zip, setZip] = useState('');
  
  // Payment states
  const [paymentMethod, setPaymentMethod] = useState('COD'); // 'COD' | 'UPI' | 'CARD'
  const [cardNumber, setCardNumber] = useState('');
  const [cardExpiry, setCardExpiry] = useState('');
  const [cardCvv, setCardCvv] = useState('');

  // Processing states
  const [loading, setLoading] = useState(false);
  const [orderSuccess, setOrderSuccess] = useState(false);
  const [placedOrder, setPlacedOrder] = useState(null);

  // If cart is empty on mount, redirect to shop
  useEffect(() => {
    if (cart.length === 0 && !orderSuccess) {
      navigate('/shop');
    }
  }, [cart, orderSuccess, navigate]);

  // Auto fill details if user is available
  useEffect(() => {
    if (user) {
      const timer = setTimeout(() => {
        setName(user.name || '');
        setPhone(user.phone || '');
        setAddress(user.address || '');
      }, 0);
      return () => clearTimeout(timer);
    }
  }, [user]);

  const deliveryFee = cartTotal > 500 ? 0 : 40;
  const grandTotal = cartTotal + deliveryFee;

  const handlePlaceOrder = async (e) => {
    e.preventDefault();

    if (!name.trim() || !phone.trim() || !address.trim() || !city.trim() || !zip.trim()) {
      showToast('Please fill out all address details.', 'error');
      return;
    }

    if (phone.trim().length < 10) {
      showToast('Please enter a valid 10-digit phone number.', 'error');
      return;
    }

    // Card validation if selected
    if (paymentMethod === 'CARD') {
      if (!cardNumber || cardNumber.length < 16 || !cardExpiry || !cardCvv) {
        showToast('Please fill out all card details.', 'error');
        return;
      }
    }

    setLoading(true);

    try {
      const orderItems = cart.map(item => ({
        productId: item.id,
        name: item.name,
        brand: item.brand,
        type: item.type,
        qty: item.qty,
        price: item.price
      }));

      const orderBody = {
        items: orderItems,
        total: grandTotal,
        addressDetails: { name, phone, address, city, zip },
        paymentDetails: {
          method: paymentMethod,
          status: paymentMethod === 'COD' ? 'Pending' : 'Completed',
          transactionId: paymentMethod === 'COD' ? '' : 'LN-' + Math.floor(Math.random() * 10000000)
        }
      };

      // Call API
      const res = await fetch(`${API_URL}/orders`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(orderBody)
      });

      const data = await res.json();
      if (data.success) {
        setPlacedOrder(data.order);
        setOrderSuccess(true);
        clearCart();
        showToast('Order placed successfully!', 'success');
      } else {
        showToast(data.message || 'Failed to place order.', 'error');
      }
    } catch (err) {
      console.error(err);
      showToast('Server error while saving order details.', 'error');
    } finally {
      setLoading(false);
    }
  };

  const handleSendWhatsAppMessage = () => {
    if (!placedOrder) return;
    
    let message = `*Laxmi Narsimha Medical & General Store*\n`;
    message += `*Order Confirmed (ID: LN-${placedOrder.id})*\n\n`;
    message += `*Customer Details:*\n`;
    message += `- Name: ${placedOrder.addressDetails.name}\n`;
    message += `- Contact: ${placedOrder.addressDetails.phone}\n`;
    message += `- Address: ${placedOrder.addressDetails.address}, ${placedOrder.addressDetails.city} - ${placedOrder.addressDetails.zip}\n\n`;
    
    message += `*Ordered Items:*\n`;
    placedOrder.items.forEach((item, idx) => {
      message += `${idx + 1}. ${item.name} x ${item.qty} - ₹${(item.price * item.qty).toFixed(2)}\n`;
    });
    
    message += `\n*Total Estimate: ₹${placedOrder.total.toFixed(2)}*\n`;
    if (placedOrder.paymentDetails.method === 'UPI') {
      message += `*Payment Method:* UPI (Paid to 7569796263-k352@axl)\n`;
      message += `*Txn ID:* ${placedOrder.paymentDetails.transactionId}\n\n`;
    } else {
      message += `*Payment Method:* ${placedOrder.paymentDetails.method}\n\n`;
    }
    message += `_Please pack my medicines. Thank you!_`;

    const waUrl = `https://wa.me/917569796263?text=${encodeURIComponent(message)}`;
    window.open(waUrl, '_blank');
  };

  // SUCCESS SCREEN RENDER
  if (orderSuccess && placedOrder) {
    return (
      <div className="section">
        <div className="container">
          <div className="glass-card checkout-success-box">
            <div className="success-icon">
              <ShieldCheck size={40} />
            </div>
            <h2 style={{ fontSize: '1.85rem', fontWeight: 800, marginBottom: '10px' }}>Order Confirmed!</h2>
            <p style={{ color: 'var(--text-muted)', marginBottom: '24px' }}>
              Your order has been registered in our system successfully. Order ID is <strong>LN-{placedOrder.id}</strong>.
            </p>

            <div style={{ textAlign: 'left', border: '1px solid var(--border)', borderRadius: 'var(--radius-sm)', padding: '20px', backgroundColor: 'var(--bg-surface-secondary)', marginBottom: '24px' }}>
              <h4 style={{ fontWeight: 700, marginBottom: '12px', borderBottom: '1px solid var(--border)', paddingBottom: '8px' }}>Delivery Receipt</h4>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', fontSize: '0.9rem' }}>
                <div><strong>Recipient:</strong> {placedOrder.addressDetails.name}</div>
                <div><strong>Contact Phone:</strong> {placedOrder.addressDetails.phone}</div>
                <div><strong>Address:</strong> {placedOrder.addressDetails.address}, {placedOrder.addressDetails.city} - {placedOrder.addressDetails.zip}</div>
                <div><strong>Total Amount Paid/Due:</strong> ₹{placedOrder.total.toFixed(2)}</div>
                <div><strong>Status:</strong> <span className="admin-status-badge status-pending">{placedOrder.status}</span></div>
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
                <h4 style={{ fontSize: '0.9rem', fontWeight: 700, color: 'var(--text-main)', marginBottom: '4px' }}>Fast Counter Packing via WhatsApp</h4>
                <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)', lineHeight: '1.4' }}>
                  To get immediate packaging updates, you can notify the Laxmi Narsimha staff directly by sending this order draft automatically via WhatsApp.
                </p>
              </div>
            </div>

            <div style={{ display: 'flex', gap: '16px' }}>
              <button className="btn btn-secondary" style={{ flexGrow: 1, gap: '8px' }} onClick={handleSendWhatsAppMessage}>
                <MessageSquare size={18} /> Send to WhatsApp
              </button>
              <Link to="/shop" className="btn btn-primary" style={{ flexGrow: 1 }}>
                Continue Shopping
              </Link>
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
          <h2>Delivery & Checkout</h2>
          <p>Provide your home delivery location details and complete the secure payment transaction.</p>
        </div>

        {/* Warning if not logged in */}
        {!token && (
          <div style={{ 
            backgroundColor: 'rgba(239, 68, 68, 0.08)', 
            border: '1px solid rgba(239, 68, 68, 0.2)', 
            borderRadius: 'var(--radius-sm)', 
            padding: '16px', 
            marginBottom: '24px',
            display: 'flex',
            gap: '12px',
            alignItems: 'center',
            textAlign: 'left'
          }}>
            <AlertCircle size={20} color="#ef4444" style={{ flexShrink: 0 }} />
            <div style={{ flexGrow: 1 }}>
              <p style={{ fontSize: '0.9rem', fontWeight: 600, color: '#ef4444' }}>
                You are currently checking out as a guest.
              </p>
              <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>
                For a better order history tracker and admin visibility, we recommend <Link to="/auth" style={{ textDecoration: 'underline', fontWeight: 700, color: 'var(--primary)' }}>Logging In</Link> first.
              </p>
            </div>
          </div>
        )}

        <form onSubmit={handlePlaceOrder} className="checkout-grid" style={{ textAlign: 'left' }}>
          {/* Left: Address Form */}
          <div className="glass-card">
            <h3 style={{ fontWeight: 700, marginBottom: '20px', borderBottom: '1px solid var(--border)', paddingBottom: '12px' }}>
              Shipping Address Details
            </h3>

            <div className="form-group">
              <label htmlFor="full-name">Receiver's Full Name</label>
              <input 
                type="text" 
                id="full-name" 
                required 
                placeholder="Enter full name" 
                value={name} 
                onChange={(e) => setName(e.target.value)}
              />
            </div>

            <div className="form-group">
              <label htmlFor="contact-phone">Contact Phone Number (WhatsApp Recommended)</label>
              <input 
                type="tel" 
                id="contact-phone" 
                required 
                placeholder="10-digit mobile number" 
                value={phone} 
                onChange={(e) => setPhone(e.target.value)}
              />
            </div>

            <div className="form-group">
              <label htmlFor="address">Delivery Street Address</label>
              <input 
                type="text" 
                id="address" 
                required 
                placeholder="House no., Street, Colony name" 
                value={address} 
                onChange={(e) => setAddress(e.target.value)}
              />
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
              <div className="form-group">
                <label htmlFor="city">City</label>
                <input 
                  type="text" 
                  id="city" 
                  required 
                  placeholder="Hyderabad" 
                  value={city} 
                  onChange={(e) => setCity(e.target.value)}
                />
              </div>
              <div className="form-group">
                <label htmlFor="zip">Pincode (ZIP)</label>
                <input 
                  type="text" 
                  id="zip" 
                  required 
                  placeholder="500001" 
                  value={zip} 
                  onChange={(e) => setZip(e.target.value)}
                />
              </div>
            </div>

            <h3 style={{ fontWeight: 700, marginTop: '30px', marginBottom: '20px', borderBottom: '1px solid var(--border)', paddingBottom: '12px' }}>
              Select Payment Method
            </h3>

            <div className="payment-options-grid">
              <div 
                className={`payment-option ${paymentMethod === 'COD' ? 'active' : ''}`}
                onClick={() => setPaymentMethod('COD')}
              >
                <Banknote />
                <span style={{ fontWeight: 600, fontSize: '0.9rem' }}>Cash on Delivery</span>
              </div>

              <div 
                className={`payment-option ${paymentMethod === 'UPI' ? 'active' : ''}`}
                onClick={() => setPaymentMethod('UPI')}
              >
                <QrCode />
                <span style={{ fontWeight: 600, fontSize: '0.9rem' }}>UPI QR Code</span>
              </div>

              <div 
                className={`payment-option ${paymentMethod === 'CARD' ? 'active' : ''}`}
                onClick={() => setPaymentMethod('CARD')}
              >
                <CreditCard />
                <span style={{ fontWeight: 600, fontSize: '0.9rem' }}>Credit / Debit Card</span>
              </div>
            </div>

            {/* UPI QR Display */}
            {paymentMethod === 'UPI' && (
              <div style={{ textAlign: 'center', padding: '20px', border: '1px solid var(--border)', borderRadius: 'var(--radius-sm)', backgroundColor: 'var(--bg-surface-secondary)', marginBottom: '20px' }}>
                <h4 style={{ fontWeight: 700, marginBottom: '10px' }}>Scan to Pay with UPI</h4>
                <p style={{ fontSize: '0.85rem', fontWeight: 600, color: 'var(--primary)', marginBottom: '16px' }}>
                  UPI ID: 7569796263-k352@axl
                </p>
                <div style={{ 
                  backgroundColor: 'white', 
                  border: '1px solid #ddd', 
                  borderRadius: 'var(--radius-sm)', 
                  padding: '16px', 
                  width: '180px', 
                  height: '180px', 
                  margin: '0 auto 16px auto',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                }}>
                  <img 
                    src={`https://api.qrserver.com/v1/create-qr-code/?size=150x150&data=${encodeURIComponent(`upi://pay?pa=7569796263-k352@axl&pn=Laxmi%20Narsimha%20Medical&am=${grandTotal.toFixed(2)}&cu=INR&tn=LN-Order`)}`}
                    alt="UPI QR Code"
                    style={{ width: '150px', height: '150px', display: 'block' }}
                  />
                </div>
                <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>
                  Scan the QR code using GPay, PhonePe, Paytm, or any UPI app to pay <strong>₹{grandTotal.toFixed(2)}</strong>.
                </p>
              </div>
            )}

            {/* Card Inputs */}
            {paymentMethod === 'CARD' && (
              <div style={{ padding: '20px', border: '1px solid var(--border)', borderRadius: 'var(--radius-sm)', backgroundColor: 'var(--bg-surface-secondary)', marginBottom: '20px' }}>
                <h4 style={{ fontWeight: 700, marginBottom: '16px' }}>Card Payment Details</h4>
                
                <div className="form-group">
                  <label htmlFor="card-num">Card Number</label>
                  <input 
                    type="text" 
                    id="card-num" 
                    maxLength="16"
                    placeholder="4111 2222 3333 4444" 
                    value={cardNumber}
                    onChange={(e) => setCardNumber(e.target.value.replace(/\D/g, ''))}
                  />
                </div>
                
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
                  <div className="form-group">
                    <label htmlFor="card-expiry">Expiry Date</label>
                    <input 
                      type="text" 
                      id="card-expiry" 
                      placeholder="MM/YY" 
                      maxLength="5"
                      value={cardExpiry}
                      onChange={(e) => setCardExpiry(e.target.value)}
                    />
                  </div>
                  <div className="form-group">
                    <label htmlFor="card-cvv">CVV Code</label>
                    <input 
                      type="password" 
                      id="card-cvv" 
                      placeholder="***" 
                      maxLength="3"
                      value={cardCvv}
                      onChange={(e) => setCardCvv(e.target.value.replace(/\D/g, ''))}
                    />
                  </div>
                </div>
              </div>
            )}
          </div>

          {/* Right: Checkout Summary Side Panel */}
          <aside className="glass-card cart-summary-card">
            <h3>Cart Review</h3>
            
            <div style={{ maxHeight: '180px', overflowY: 'auto', marginBottom: '16px', display: 'flex', flexDirection: 'column', gap: '10px' }}>
              {cart.map(item => (
                <div key={item.id} style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.85rem', borderBottom: '1px solid var(--border)', paddingBottom: '6px' }}>
                  <span style={{ fontWeight: 500, maxWidth: '180px', textOverflow: 'ellipsis', overflow: 'hidden', whiteSpace: 'nowrap' }}>
                    {item.name} <strong style={{ color: 'var(--primary)' }}>x{item.qty}</strong>
                  </span>
                  <span style={{ fontWeight: 700 }}>₹{(item.price * item.qty).toFixed(2)}</span>
                </div>
              ))}
            </div>

            <div className="summary-row">
              <span>Cart Subtotal:</span>
              <span>₹{cartTotal.toFixed(2)}</span>
            </div>
            
            <div className="summary-row">
              <span>Home Delivery Charges:</span>
              <span>{deliveryFee > 0 ? `₹${deliveryFee.toFixed(2)}` : 'FREE'}</span>
            </div>

            <div className="summary-row total">
              <span>Total Bill Amount:</span>
              <span style={{ color: 'var(--primary)' }}>₹{grandTotal.toFixed(2)}</span>
            </div>

            <button 
              type="submit" 
              className="btn btn-primary" 
              style={{ width: '100%', marginTop: '20px', gap: '8px' }}
              disabled={loading}
            >
              {loading ? (
                <div style={{ 
                  border: '2px solid rgba(255,255,255,0.3)', 
                  borderTop: '2px solid white', 
                  borderRadius: '50%', 
                  width: '16px', 
                  height: '16px', 
                  animation: 'spin 0.6s linear infinite' 
                }}></div>
              ) : (
                <>
                  <ShoppingBag size={18} /> Place Your Order
                </>
              )}
            </button>
            
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '0.75rem', color: 'var(--text-muted)', justifyContent: 'center', marginTop: '12px' }}>
              <Truck size={14} color="var(--primary)" /> Packs arrive in 2-4 Hours locally.
            </div>
          </aside>
        </form>
      </div>
    </div>
  );
};

export default Checkout;
