import React, { useState } from 'react';
import './App.css';

function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [activeTab, setActiveTab] = useState('billing');
  const [customers, setCustomers] = useState([]);
  const [stocks, setStocks] = useState([]);
  const [cart, setCart] = useState([]);
  const [selectedCustomer, setSelectedCustomer] = useState(null);
  const [bills, setBills] = useState([]);

  const handleLogin = (e) => {
    e.preventDefault();
    const username = e.target.username.value;
    const password = e.target.password.value;
    if (username === 'admin' && password === 'admin') {
      setIsLoggedIn(true);
    } else {
      alert('Invalid credentials');
    }
  };

  const addCustomer = (customer) => {
    setCustomers([...customers, { ...customer, id: Date.now() }]);
  };

  const removeCustomer = (id) => {
    setCustomers(customers.filter(c => c.id !== id));
  };

  const addStock = (stock) => {
    setStocks([...stocks, { ...stock, id: Date.now() }]);
  };

  const removeStock = (id) => {
    setStocks(stocks.filter(s => s.id !== id));
  };

  const addToCart = (stock) => {
    const existing = cart.find(item => item.id === stock.id);
    if (existing) {
      setCart(cart.map(item => 
        item.id === stock.id 
          ? { ...item, quantity: item.quantity + 1 }
          : item
      ));
    } else {
      setCart([...cart, { ...stock, quantity: 1 }]);
    }
  };

  const removeFromCart = (id) => {
    setCart(cart.filter(item => item.id !== id));
  };

  const processBill = () => {
    if (!selectedCustomer) {
      alert('Please select a customer first!');
      return;
    }
    const total = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
    const bill = {
      id: Date.now(),
      customer: selectedCustomer,
      items: [...cart],
      total,
      date: new Date().toISOString().split('T')[0]
    };
    setBills([...bills, bill]);
    
    const updatedStocks = stocks.map(stock => {
      const cartItem = cart.find(item => item.id === stock.id);
      if (cartItem) {
        return { ...stock, quantity: stock.quantity - cartItem.quantity };
      }
      return stock;
    });
    setStocks(updatedStocks);
    
    alert(`Bill processed for ${selectedCustomer.name}! Total: $${total.toFixed(2)}`);
    setCart([]);
    setSelectedCustomer(null);
  };

  const getExpiringMedicines = () => {
    const thirtyDaysFromNow = new Date();
    thirtyDaysFromNow.setDate(thirtyDaysFromNow.getDate() + 30);
    
    return stocks.filter(stock => {
      const expiryDate = new Date(stock.expiryDate);
      const today = new Date();
      return expiryDate > today && expiryDate <= thirtyDaysFromNow;
    });
  };

  const getExpiredMedicines = () => {
    const today = new Date();
    return stocks.filter(stock => new Date(stock.expiryDate) < today);
  };

  if (!isLoggedIn) {
    return (
      <div className="login-container">
        <form onSubmit={handleLogin} className="login-form">
          <h2>Pharmacy Login</h2>
          <input type="text" name="username" placeholder="Username" required />
          <input type="password" name="password" placeholder="Password" required />
          <button type="submit">Login</button>
          <p>Default: admin/admin</p>
        </form>
      </div>
    );
  }

  return (
    <div className="app">
      <header>
        <h1>Pharmacy Management System</h1>
        <button onClick={() => setIsLoggedIn(false)}>Logout</button>
      </header>
      
      <nav>
        <button 
          className={activeTab === 'billing' ? 'active' : ''} 
          onClick={() => setActiveTab('billing')}
        >
          Billing
        </button>
        <button 
          className={activeTab === 'customers' ? 'active' : ''} 
          onClick={() => setActiveTab('customers')}
        >
          Customers
        </button>
        <button 
          className={activeTab === 'stocks' ? 'active' : ''} 
          onClick={() => setActiveTab('stocks')}
        >
          Stock
        </button>
      </nav>

      <main>
        {activeTab === 'billing' && (
          <Billing 
            stocks={stocks} 
            customers={customers}
            selectedCustomer={selectedCustomer}
            setSelectedCustomer={setSelectedCustomer}
            cart={cart} 
            addToCart={addToCart} 
            removeFromCart={removeFromCart} 
            processBill={processBill}
            bills={bills}
          />
        )}
        {activeTab === 'customers' && (
          <CustomerManagement 
            customers={customers} 
            addCustomer={addCustomer} 
            removeCustomer={removeCustomer} 
          />
        )}
        {activeTab === 'stocks' && (
          <StockManagement 
            stocks={stocks} 
            addStock={addStock} 
            removeStock={removeStock}
            expiringMedicines={getExpiringMedicines()}
            expiredMedicines={getExpiredMedicines()}
          />
        )}
      </main>
    </div>
  );
}

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
            </div>
            <button onClick={() => removeStock(stock.id)}>Remove</button>
          </div>
        ))}
      </div>
    </div>
  );
}

function Billing({ stocks, customers, selectedCustomer, setSelectedCustomer, cart, addToCart, removeFromCart, processBill, bills }) {
  const total = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);

  return (
    <div className="section">
      <h2>Billing</h2>
      
      <div className="billing-container">
        <div className="customer-selection">
          <h3>Select Customer</h3>
          <select 
            value={selectedCustomer?.id || ''} 
            onChange={(e) => {
              const customer = customers.find(c => c.id === parseInt(e.target.value));
              setSelectedCustomer(customer);
            }}
          >
            <option value="">Select a customer</option>
            {customers.map(customer => (
              <option key={customer.id} value={customer.id}>{customer.name}</option>
            ))}
          </select>
        </div>

        <div className="stock-selection">
          <h3>Available Medicines</h3>
          <div className="stock-grid">
            {stocks.filter(stock => stock.quantity > 0 && new Date(stock.expiryDate) > new Date()).map(stock => (
              <div key={stock.id} className="stock-item">
                <strong>{stock.name}</strong>
                <p>Price: ${stock.price}</p>
                <p>Available: {stock.quantity}</p>
                <button onClick={() => addToCart(stock)}>Add to Cart</button>
              </div>
            ))}
          </div>
        </div>

        <div className="cart">
          <h3>Cart</h3>
          {cart.map(item => (
            <div key={item.id} className="cart-item">
              <span>{item.name} x {item.quantity}</span>
              <span>${(item.price * item.quantity).toFixed(2)}</span>
              <button onClick={() => removeFromCart(item.id)}>Remove</button>
            </div>
          ))}
          <div className="total">
            <strong>Total: ${total.toFixed(2)}</strong>
          </div>
          <button onClick={processBill} disabled={cart.length === 0}>Process Bill</button>
        </div>
      </div>

      <div className="bills-history">
        <h3>Recent Bills</h3>
        {bills.slice(-5).map(bill => (
          <div key={bill.id} className="bill-item">
            <p>Customer: {bill.customer.name}</p>
            <p>Date: {bill.date}</p>
            <p>Total: ${bill.total.toFixed(2)}</p>
          </div>
        ))}
      </div>
    </div>
  );
}

export default App;