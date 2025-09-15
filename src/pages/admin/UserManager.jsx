import React, { useState, useEffect } from 'react';
import '../../css/UserManager.css';

const UserManager = () => {
  const [users, setUsers] = useState([]);

  
  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    try {
      const response = await fetch('http://localhost:8080/api/admin/users', {
        credentials: 'include', 
      });

      if (!response.ok) throw new Error('Failed to fetch users');

      const data = await response.json();
      setUsers(data);
    } catch (error) {
      console.error('Failed to fetch users:', error);
    }
  };

  const toggleBlockStatus = async (id, currentlyBlocked) => {
    const action = currentlyBlocked ? 'unblock' : 'block';

    try {
      await fetch(`/api/admin/users/${id}/${action}`, {
        method: 'PUT',
        credentials: 'include',
      });

      
      setUsers(users.map(user =>
        user.id === id ? { ...user, blocked: !user.blocked } : user
      ));
    } catch (error) {
      console.error(`Failed to ${action} user:`, error);
    }
  };

  return (
    <div className="user-manager">
      <h3 className="admin-title">Manage Users</h3>
      {users.length === 0 ? (
        <p>No users found.</p>
      ) : (
        users.map(user => (
          <div key={user.id} className="user-card">
            <div className="user-info">
              <p><strong>Name:</strong> {user.name}</p>
              <p><strong>Email:</strong> {user.email}</p>
              <p>
                <strong>Status:</strong>{' '}
                <span className={`status-badge ${user.blocked ? 'blocked' : 'active'}`}>
                  {user.blocked ? 'Blocked' : 'Active'}
                </span>
              </p>
            </div>
            <button
              className={`btn ${user.blocked ? 'btn-unblock' : 'btn-block'}`}
              onClick={() => toggleBlockStatus(user.id, user.blocked)}
            >
              {user.blocked ? 'Unblock' : 'Block'}
            </button>
          </div>
        ))
      )}
    </div>
  );
};

export default UserManager;
