import React, { useEffect, useState } from 'react';
import axios from '../../api/axios';
import { Card, CardBody, CardTitle, Table, Button, Alert, Input } from 'reactstrap';

const ClientProblemRequests = () => {
  const [problems, setProblems] = useState([]);
  const [experts, setExperts] = useState([]);
  const [assignments, setAssignments] = useState({});
  const [message, setMessage] = useState('');

  useEffect(() => {
    fetchClientProblems();
    fetchExperts();
  }, []);

  const fetchClientProblems = async () => {
    try {
      const res = await axios.get('/api/problems/client-problems/pending', {
        headers: authHeader()
      });
      setProblems(res.data.data || []);
    } catch (err) {
      console.error('Error fetching client problems:', err);
    }
  };

  const fetchExperts = async () => {
    try {
      const res = await axios.get('/api/experts/list', {
        headers: authHeader()
      });
      setExperts(res.data.data || []);
    } catch (err) {
      console.error('Error fetching experts:', err);
    }
  };

  const assignExpert = async (problemId) => {
    const expertId = assignments[problemId];
    if (!expertId) return alert('Please select an expert first.');

    try {
      await axios.post('/api/problems/client-problems/assign', {
        problem_id: problemId,
        expert_id: expertId,
      }, {
        headers: authHeader()
      });

      setMessage('Expert assigned successfully!');
      fetchClientProblems(); // Refresh list
    } catch (err) {
      alert('Failed to assign expert.');
    }
  };

  return (
    <div className="container mt-4">
      <h3 className="mb-4 text-center">Client Problem Requests</h3>
      {message && <Alert color="success">{message}</Alert>}

      <Card>
        <CardBody>
          <CardTitle tag="h5">Pending Requests</CardTitle>
          <Table responsive bordered className="mt-3">
            <thead>
              <tr>
                <th>Client</th>
                <th>Car</th>
                <th>Title</th>
                <th>Description</th>
                <th>Assign Expert</th>
              </tr>
            </thead>
            <tbody>
              {problems.length === 0 ? (
                <tr><td colSpan="5">No pending requests</td></tr>
              ) : problems.map(problem => (
                <tr key={problem.id}>
                  <td>{problem.client?.name || 'N/A'}</td>
                  <td>{problem.car?.company} {problem.car?.model}</td>
                  <td>{problem.title}</td>
                  <td>{problem.description}</td>
                  <td>
                    <Input
                      type="select"
                      value={assignments[problem.id] || ''}
                      onChange={e =>
                        setAssignments({ ...assignments, [problem.id]: e.target.value })
                      }
                    >
                      <option value="">Select Expert</option>
                      {experts.map(expert => (
                        <option key={expert.id} value={expert.id}>
                          {expert.name} ({expert.company})
                        </option>
                      ))}
                    </Input>
                    <Button
                      color="success"
                      size="sm"
                      className="mt-2"
                      onClick={() => assignExpert(problem.id)}
                    >
                      Assign
                    </Button>
                  </td>
                </tr>
              ))}
            </tbody>
          </Table>
        </CardBody>
      </Card>
    </div>
  );
};

const authHeader = () => ({
  Authorization: `Bearer ${localStorage.getItem('token')}`
});

export default ClientProblemRequests;
