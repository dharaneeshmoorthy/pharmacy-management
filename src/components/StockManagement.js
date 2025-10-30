import React, { useState } from 'react';

function StockManagement({ stocks, addStock, removeStock, expiringMedicines, expiredMedicines }) {
  const [formData, setFormData] = useState({ 
    name: '', 
    price: '', 
    quantity: '', 
    expiryDate: '' 
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    addStock({
      ...formData,
      price: parseFloat(formData.price),
      quantity: parseInt(formData.quantity)
    });
    setFormData({ name: '', price: '', quantity: '', expiryDate: '' });
  };

  const isExpired = (expiryDate) => {
    return new Date(expiryDate) < new Date();
  };

  return (
    <div className="section">
      <h2>Stock Management</h2>
      
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
      
      <form onSubmit={handleSubmit} className="form">
        <input
          type="text"
          placeholder="Medicine Name"
          value={formData.name}
          onChange={(e) => setFormData({ ...formData, name: e.target.value })}
          required
        />
        <input
          type="number"
          step="0.01"
          placeholder="Price"
          value={formData.price}
          onChange={(e) => setFormData({ ...formData, price: e.target.value })}
          required
        />
        <input
          type="number"
          placeholder="Quantity"
          value={formData.quantity}
          onChange={(e) => setFormData({ ...formData, quantity: e.target.value })}
          required
        />
        <input
          type="date"
          placeholder="Expiry Date"
          value={formData.expiryDate}
          onChange={(e) => setFormData({ ...formData, expiryDate: e.target.value })}
          required
        />
        <button type="submit">Add Stock</button>
      </form>

      <div className="list">
        {stocks.map(stock => (
          <div key={stock.id} className={`item ${isExpired(stock.expiryDate) ? 'expired' : ''}`}>
            <div>
              <strong>{stock.name}</strong>
              <p>Price: ${stock.price}</p>
              <p>Quantity: {stock.quantity}</p>
              <p>Expiry: {stock.expiryDate}</p>
              {isExpired(stock.expiryDate) && <p className="warning">EXPIRED</p>}
            </div>
            <button onClick={() => removeStock(stock.id)}>Remove</button>
          </div>
        ))}
      </div>
    </div>
  );
}

export default StockManagement;