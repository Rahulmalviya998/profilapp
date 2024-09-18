import React, { useState, useEffect } from 'react';
import axios from 'axios';
import "./App.css"

const App = () => {
  const [users, setUsers] = useState([]);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    image: null,
  });
  const [editingUser, setEditingUser] = useState(null);

  // Fetch users on page load
  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    try {
      const response = await axios.get('http://localhost:5000/user/getuser');
      setUsers(response.data);
    } catch (error) {
      console.error('Error fetching users:', error);
    }
  };

  const handleInputChange = (e) => {
    const { name, value, files } = e.target;
    setFormData({ ...formData, [name]: files ? files[0] : value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const form = new FormData();
    form.append('name', formData.name);
    form.append('email', formData.email);
    form.append('password', formData.password);
    form.append('image', formData.image);

    try {
      if (editingUser) {
        // Update user
        await axios.put('http://localhost:5000/user/update', form);
        setEditingUser(null);
      } else {
        // Create new user
        await axios.post('http://localhost:5000/user/post', form);
      }
      setFormData({ name: '', email: '', password: '', image: null });
      fetchUsers();
    } catch (error) {
      console.error('Error submitting form:', error);
    }
  };

  const handleDelete = async (email) => {
    try {
      await axios.delete('http://localhost:5000/user/delete', { data: { email } });
      fetchUsers();
    } catch (error) {
      console.error('Error deleting user:', error);
    }
  };

  const handleEdit = (user) => {
    setFormData({
      name: user.name,
      email: user.email,
      password: '',
      image: null,
    });
    setEditingUser(user);
  };

  return (
    <div className="container">
      <h1>User Management</h1>
      <form onSubmit={handleSubmit}>
        <input
          type="text"
          name="name"
          value={formData.name}
          onChange={handleInputChange}
          placeholder="Name"
          required
        />
        <input
          type="email"
          name="email"
          value={formData.email}
          onChange={handleInputChange}
          placeholder="Email"
          required
        />
        <input
          type="password"
          name="password"
          value={formData.password}
          onChange={handleInputChange}
          placeholder="Password"
          required
        />
        <input type="file" name="image" onChange={handleInputChange} />
        <button type="submit">{editingUser ? 'Update User' : 'Create User'}</button>
      </form>

      <h2>User List</h2>
      <ul>
        {users.map((user) => (
          <li key={user._id}>
            <p>{user.name}</p>
            <p>{user.email}</p>
            <img
              src={`http://localhost:5000/uploads/${user.image}`}
              alt={user.name}
              style={{ width: '100px', height: '100px' }}
            />
            <button onClick={() => handleEdit(user)}>Edit</button>
            <button onClick={() => handleDelete(user.email)}>Delete</button>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default App;
