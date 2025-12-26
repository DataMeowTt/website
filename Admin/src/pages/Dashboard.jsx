import React from 'react';
import { useNavigate } from 'react-router-dom';

const DashboardAdmin = () => {
  const navigate = useNavigate();

  const goToAccount = () => navigate('/account');
  const handleLogout = () => navigate('/login');

  const features = [
    { title: 'Quản lý Tài khoản', onClick: goToAccount, color: '#7B68EE' },
  ];

  return (
    <div style={{ padding: '20px', fontFamily: 'sans-serif', background: '#E9F5E9', minHeight: '100vh' }}>
      <div style={{ textAlign: 'center', marginBottom: '30px' }}>
        <img src="https://cdn-icons-png.flaticon.com/512/124/124902.png" alt="avatar" style={{ width: 60, borderRadius: '50%' }} />
        <h2 style={{ fontSize: '2.5em', fontFamily: 'Roboto, sans-serif' }}>Quản lý trung tâm của bạn</h2>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: '20px' }}>
        {features.map((item, index) => (
          <div
            key={index}
            onClick={item.onClick}
            style={{
              background: item.color,
              padding: '30px',
              borderRadius: '15px',
              textAlign: 'center',
              cursor: 'pointer',
              color: 'white',
              fontWeight: 'bold',
              boxShadow: '0 4px 6px rgba(0,0,0,0.1)'
            }}
          >
            {item.title}
          </div>
        ))}
      </div>

      <div style={{ textAlign: 'center', marginTop: '40px' }}>
        <button onClick={handleLogout} style={{ padding: '10px 20px', background: '#FF4B5C', border: 'none', borderRadius: '8px', color: '#fff' }}>
          Đăng xuất
        </button>
      </div>
    </div>
  );
};

export default DashboardAdmin;
