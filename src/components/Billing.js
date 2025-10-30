import React from 'react';

function Billing({ stocks, customers, selectedCustomer, setSelectedCustomer, cart, addToCart, removeFromCart, processBill, bills }) {
  const total = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
  
  const getExpiredMedicines = () => {
    const today = new Date();
    return stocks.filter(stock => new Date(stock.expiryDate) < today);
  };

  const getExpiringMedicines = () => {
    const thirtyDaysFromNow = new Date();
    thirtyDaysFromNow.setDate(thirtyDaysFromNow.getDate() + 30);
    const today = new Date();
    return stocks.filter(stock => {
      const expiryDate = new Date(stock.expiryDate);
      return expiryDate > today && expiryDate <= thirtyDaysFromNow;
    });
  };

  const expiredMedicines = getExpiredMedicines();
  const expiringMedicines = getExpiringMedicines();

  return (
    <div className="section">
      <h2>Billing</h2>
      
      {/* Expiry Alerts */}
      {expiredMedicines.length > 0 && (
        <div className="alert expired-alert">
          <h3>⚠️ EXPIRED MEDICINES</h3>
          {expiredMedicines.map(med => (
            <p key={med.id}>{med.name} - Expired on {med.expiryDate} (Qty: {med.quantity})</p>
          ))}
        </div>
      )}
      
      {expiringMedicines.length > 0 && (
        <div className="alert expiring-alert">
          <h3>⚠️ MEDICINES EXPIRING SOON (Within 30 days)</h3>
          {expiringMedicines.map(med => (
            <p key={med.id}>{med.name} - Expires on {med.expiryDate} (Qty: {med.quantity})</p>
          ))}
        </div>
      )}
      
      {/* Customer Selection */}
      <div className="customer-selection">
        <h3>Select Customer</h3>
        <select 
          value={selectedCustomer?.id || ''} 
          onChange={(e) => {
            const customer = customers.find(c => c.id === parseInt(e.target.value));
            setSelectedCustomer(customer || null);
          }}
        >
          <option value="">Choose a customer...</option>
          {customers.map(customer => (
            <option key={customer.id} value={customer.id}>
              {customer.name} - {customer.phone}
            </option>
          ))}
        </select>
        {selectedCustomer && (
          <div className="selected-customer">
            <p><strong>Customer:</strong> {selectedCustomer.name}</p>
            <p><strong>Phone:</strong> {selectedCustomer.phone}</p>
            <p><strong>Address:</strong> {selectedCustomer.address}</p>
          </div>
        )}
      </div>
      
      {/* Add Item Form */}
      <div className="add-item-form">
        <h3>Add Medicine to Bill</h3>
        <div className="form">
          <input type="text" placeholder="Medicine Name" id="medicineName" />
          <input type="number" placeholder="Quantity" id="quantity" />
          <input type="number" step="0.01" placeholder="Price" id="price" />
          <button onClick={() => {
            const name = document.getElementById('medicineName').value;
            const qty = parseInt(document.getElementById('quantity').value);
            const price = parseFloat(document.getElementById('price').value);
            if (name && qty && price && selectedCustomer) {
              addToCart({ id: Date.now(), name, quantity: qty, price });
              document.getElementById('medicineName').value = '';
              document.getElementById('quantity').value = '';
              document.getElementById('price').value = '';
            } else {
              alert('Please fill all fields and select customer');
            }
          }}>Add to Bill</button>
        </div>
      </div>

      {/* Invoice */}
      <div className="invoice">
        <h3>Invoice</h3>
        {cart.length === 0 ? (
          <p>No items in cart</p>
        ) : (
          <table className="invoice-table">
            <thead>
              <tr>
                <th>Medicine Name</th>
                <th>Quantity</th>
                <th>Price</th>
                <th>Total</th>
                <th>Action</th>
              </tr>
            </thead>
            <tbody>
              {cart.map(item => (
                <tr key={item.id}>
                  <td>{item.name}</td>
                  <td>{item.quantity}</td>
                  <td>${item.price}</td>
                  <td>${(item.price * item.quantity).toFixed(2)}</td>
                  <td>
                    <button onClick={() => removeFromCart(item.id)} className="remove-btn">Remove</button>
                  </td>
                </tr>
              ))}
            </tbody>
            <tfoot>
              <tr>
                <td colSpan="3"><strong>Total Amount:</strong></td>
                <td><strong>${total.toFixed(2)}</strong></td>
                <td>
                  <button 
                    onClick={processBill} 
                    className="process-bill"
                    disabled={!selectedCustomer}
                  >
                    Process Bill
                  </button>
                </td>
              </tr>
            </tfoot>
          </table>
        )}
      </div>
    </div>
  );
}

export default Billing;