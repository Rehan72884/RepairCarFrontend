import React from 'react';
import { useNavigate } from 'react-router-dom';
import { Card, CardBody, CardTitle, Button, Row, Col } from 'reactstrap';
import { FaUserTie, FaCar, FaExclamationTriangle } from 'react-icons/fa';

const AdminDashboard = () => {
  const navigate = useNavigate();

  const options = [
    { title: 'Manage Experts', icon: <FaUserTie size={30} />, path: '/admin/experts' },
    { title: 'Manage Cars', icon: <FaCar size={30} />, path: '/admin/cars' },
    { title: 'Manage Problems', icon: <FaExclamationTriangle size={30} />, path: '/admin/problems' },
  ];

  return (
    <div className="dashboard-container">
      <div className="container">
        <h2 className="text-center mb-4">Admin Dashboard</h2>
        <Row className="justify-content-center">
          {options.map((item, index) => (
            <Col md="4" sm="6" xs="12" key={index} className="mb-4">
              <Card className="shadow dashboard-card text-center">
                <CardBody>
                  <div className="mb-3 text-primary">{item.icon}</div>
                  <CardTitle tag="h5">{item.title}</CardTitle>
                  <Button color="primary" onClick={() => navigate(item.path)}>
                    Go
                  </Button>
                </CardBody>
              </Card>
            </Col>
          ))}
        </Row>
      </div>
    </div>
  );
};

export default AdminDashboard;
