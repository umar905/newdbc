import axios from 'axios';
import React, { useEffect, useState } from 'react';
import './UserPage.css'; 
import { Link, useNavigate } from 'react-router-dom';

const UserPage = () => {
  const [data, setData] = useState([]);
  const [user, setUser] = useState({});
  const [isEditing, setIsEditing] = useState(false);
  const [editForm, setEditForm] = useState({});

  const getUsers = async () => {
    try {
      const res = await axios.get('https://ntbackend.uz/api/users/all', {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("Access")}`,
        },
      });
      setData(res.data);
      findUserInData(res.data);
    } catch (err) {
      console.error(err);
      alert('An error occurred while fetching data.');
    }
  };

  const findUserInData = (dataToSearch) => {
    const checkingValue = localStorage.getItem("Checking");
    if (checkingValue) {
      const foundUser = dataToSearch.find(data => data.email === checkingValue);
      setUser(foundUser || {});
      setEditForm(foundUser || {});
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setEditForm(prevState => ({
      ...prevState,
      [name]: value
    }));
  };

  const handleEditSubmit = async (e) => {
    e.preventDefault();
    try {
      await axios.put(`https://ntbackend.uz/api/users/update/${user._id}/user`, editForm, {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("Access")}`,
        },
      });
      setUser(editForm);
      setIsEditing(false);
      alert('User updated successfully');
      window.location.reload();
    } catch (err) {
      console.error(err);
      alert('An error occurred while updating user data.');
    }
  };
  const navigate = useNavigate()

  useEffect(() => {
    getUsers();
  }, []);

  return (
    <div className='container'>
      <div className='user-details'>
        <h1>User Information</h1>
    
        {user && user.email ? (
          <>
            {isEditing ? (
              <form onSubmit={handleEditSubmit} className='edit-form'>
                <h2>{user.firstName} {user.lastName}</h2>
             
                <div>
                  <label htmlFor='firstName'>First Name:</label>
                  <input
                    type='text'
                    id='firstName'
                    name='firstName'
                    value={editForm.firstName || ''}
                    onChange={handleInputChange}
                  />
                </div>
                <div>
                  <label htmlFor='lastName'>Last Name:</label>
                  <input
                    type='text'
                    id='lastName'
                    name='lastName'
                    value={editForm.lastName || ''}
                    onChange={handleInputChange}
                  />
                </div>
                <div>
                  <label htmlFor='email'>Email:</label>
                  <input
                    type='email'
                    id='email'
                    name='email'
                    value={editForm.email || ''}
                    onChange={handleInputChange}
                  />
                </div>
                <div>
                  <label htmlFor='username'>Username:</label>
                  <input
                    type='text'
                    id='username'
                    name='username'
                    value={editForm.username || ''}
                    onChange={handleInputChange}
                  />
                </div>
                <div>
                  <label htmlFor='password'>Password:</label>
                  <input
                    type='text'
                    id='password'
                    name='password'
                    onChange={handleInputChange}
                  />
                </div>
                <button type='submit'>Save Changes</button>
                <button type='button' className='cancel' onClick={() => setIsEditing(false)}>Cancel</button>
              </form>
            ) : (
              <>
               <b><Link to='/allcards'>All Cards</Link></b> || <b><Link to='/createcard'>Create Card</Link></b> || <b onClick={() => {
          localStorage.removeItem("Access");
          navigate('/');
        }}>Log out</b>
        <br />
        <br />
                <img src="https://via.placeholder.com/150" alt="Profile" />
                <h2>{user.firstName} {user.lastName}</h2>
                <p>Email: {user.email}</p>
                <p>Username: {user.username}</p>
                <button onClick={() => setIsEditing(true)}>Edit</button>
              </>
            )}
          </>
        ) : (
          <p className='no-user'>No user found based on localStorage value.</p>
        )}
      </div>
    </div>
  );
};

export default UserPage;
