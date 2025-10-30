import React, { useState } from 'react';

function CustomerManagement({ customers, addCustomer, removeCustomer }) {
  const [formData, setFormData] = useState({ name: '', phone: '', address: '' });

  const handleSubmit = (e) => {
    e.preventDefault();
    addCustomer(formData);
    setFormData({ name: '', phone: '', address: '' });
  };

  return (
    <div className="section">
      <h2>Customer Management</h2>
      <form onSubmit={handleSubmit} className="form">
        <input
          type="text"
          placeholder="Name"
          value={formData.name}
          onChange={(e) => setFormData({ ...formData, name: e.target.value })}
          required
        />
        <input
          type="tel"
          placeholder="Phone"
          value={formData.phone}
          onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
          required
        />
        <input
          type="text"
          placeholder="Address"
          value={formData.address}
          onChange={(e) => setFormData({ ...formData, address: e.target.value })}
          required
        />
        <button type="submit">Add Customer</button>
      </form>

      <div className="list">
        {customers.map(customer => (
          <div key={customer.id} className="item">
            <div>
              <strong>{customer.name}</strong>
              <p>{customer.phone}</p>
              <p>{customer.address}</p>
            </div>
            <button onClick={() => removeCustomer(customer.id)}>Remove</button>
          </div>
        ))}
      </div>
    </div>
  );
}

export default CustomerManagement;