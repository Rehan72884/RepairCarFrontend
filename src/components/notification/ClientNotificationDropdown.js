import React, { useEffect, useState } from 'react';
import axios from '../../api/axios';
import { Dropdown, DropdownToggle, DropdownMenu, DropdownItem, Badge } from 'reactstrap';
import { FaBell } from 'react-icons/fa';
import { useNavigate } from 'react-router-dom';

const ClientNotificationDropdown = () => {
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [notifications, setNotifications] = useState([]);
  const navigate = useNavigate();

  const toggle = () => setDropdownOpen(!dropdownOpen);

  useEffect(() => {
    fetchNotifications();
  }, []);

  const fetchNotifications = async () => {
    try {
      const res = await axios.get('/api/notifications/list', {
        headers: authHeader()
      });
      setNotifications(res.data.notifications || []);
    } catch (err) {
      console.error('Failed to fetch notifications:', err);
    }
  };

  const handleNotificationClick = async (notification) => {
    try {
      await axios.post('/api/notifications/mark-as-read', {
        notification_id: notification.id,
      }, {
        headers: authHeader()
      });
      // fetchNotifications();
    } catch (err) {
      console.error('Failed to mark notification as read:', err);
    }
  };
  const formatMessage = (message) => {
  const words = message.split(' ');
    return words.map((word, index) => {
        return (
        <>
            {word}
            {(index + 1) % 4 === 0 ? <br /> : ' '}
        </>
        );
    });
    };

  const unreadCount = notifications.filter(n => !n.read_at).length;

  return (
    <div className="notification-wrapper" style={{ position: 'absolute', top: 20, right: 20 }}>
      <Dropdown isOpen={dropdownOpen} toggle={toggle}>
        <DropdownToggle color="light" className="position-relative">
          <FaBell size={24} />
          {unreadCount > 0 && (
            <Badge color="danger" pill style={{
              position: 'absolute',
              top: 0,
              right: 0,
              transform: 'translate(50%, -50%)',
              fontSize: '0.75rem'
            }}>
              {unreadCount}
            </Badge>
          )}
        </DropdownToggle>
        <DropdownMenu end style={{ minWidth: '250px' }}>
          {notifications.length === 0 ? (
            <DropdownItem disabled>No notifications</DropdownItem>
          ) : notifications.map(notification => (
            <DropdownItem
              key={notification.id}
              onClick={() => handleNotificationClick(notification)}
              className={!notification.read_at ? 'fw-bold' : ''}
            >
              {formatMessage(notification.data?.message || 'New notification')}
            </DropdownItem>
          ))}
        </DropdownMenu>
      </Dropdown>
    </div>
  );
};

const authHeader = () => ({
  Authorization: `Bearer ${localStorage.getItem('token')}`
});

export default ClientNotificationDropdown;
