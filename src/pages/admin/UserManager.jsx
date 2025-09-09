import React, { useState, useEffect } from 'react';

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
    <div>
      <h3> Manage Users</h3>
      {users.length === 0 ? (
        <p>No users found.</p>
      ) : (
        users.map(user => (
          <div key={user.id} className="card" style={{ marginBottom: '1rem', padding: '1rem', border: '1px solid #ccc' }}>
            <p><strong>Name:</strong> {user.name}</p>
            <p><strong>Email:</strong> {user.email}</p>
            <p>
              <strong>Status:</strong>{' '}
              {user.blocked ? (
                <span style={{ color: 'red' }}>Blocked</span>
              ) : (
                <span style={{ color: 'green' }}>Active</span>
              )}
            </p>
            <button
              onClick={() => toggleBlockStatus(user.id, user.blocked)}
              style={{
                backgroundColor: user.blocked ? '#28a745' : '#dc3545',
                color: '#fff',
                marginTop: '0.5rem',
                padding: '0.5rem 1rem',
                border: 'none',
                cursor: 'pointer',
              }}
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
