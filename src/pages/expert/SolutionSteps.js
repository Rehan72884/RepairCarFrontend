import React, { useEffect, useState } from 'react';
import {
  Container,
  Card,
  CardBody,
  CardTitle,
  Form,
  FormGroup,
  Input,
  Label,
  Button,
  Alert,
  Row,
  Col
} from 'reactstrap';
import axios from '../../api/axios';
import { useParams } from 'react-router-dom';
import { FaEdit, FaTrash, FaSave, FaTimes } from 'react-icons/fa';

const SolutionSteps = () => {
  const { solutionId } = useParams();
  const [steps, setSteps] = useState([]);
  const [form, setForm] = useState({ description: '', order: '' });
  const [image, setImage] = useState(null);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [editingId, setEditingId] = useState(null);
  const [editForm, setEditForm] = useState({ description: '', order: '', image: null });

  // Fetch steps
  useEffect(() => {
    axios.get(`/api/solutions/${solutionId}/steps`, {
      headers: authHeader()
    }).then(res => {
      setSteps(res.data.data);
    }).catch(() => {
      setError('Failed to fetch steps.');
    });
  }, [solutionId]);

  // Add Step
  const handleSubmit = (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');

    const formData = new FormData();
    formData.append('solution_id', solutionId);
    formData.append('description', form.description);
    if (form.order) formData.append('order', form.order);
    if (image) formData.append('image', image);

    axios.post('/api/steps/store', formData, {
      headers: {
        ...authHeader(),
      }
    })
    .then(res => {
      setSteps(prev => [...prev, res.data.data]);
      setForm({ description: '', order: '' });
      setImage(null);
      setSuccess('Step added successfully!');
    })
    .catch(() => {
      setError('Failed to add step.');
    });
  };

  // Edit Step
  const handleEdit = (step) => {
    setEditingId(step.id);
    setEditForm({
      description: step.description,
      order: step.order || '',
      image: null
    });
  };

  const cancelEdit = () => {
    setEditingId(null);
    setEditForm({ description: '', order: '', image: null });
  };

  const saveEdit = (id) => {
    const formData = new FormData();
    formData.append('description', editForm.description);
    if (editForm.order) formData.append('order', editForm.order);
    if (editForm.image) formData.append('image', editForm.image);

    axios.post(`/api/steps/update/${id}`, formData, {
      headers: {
        ...authHeader()
      }
    })
    .then(() => {
      axios.get(`/api/solutions/${solutionId}/steps`, { headers: authHeader() })
        .then(res => setSteps(res.data.data));

      setEditingId(null);
      setSuccess('Step updated successfully!');
    })
    .catch(() => {
      setError('Failed to update step.');
    });
  };

  // Delete Step
  const handleDelete = (id) => {
    if (!window.confirm('Are you sure you want to delete this step?')) return;

    axios.delete(`/api/steps/delete/${id}`, {
      headers: authHeader()
    })
    .then(() => {
      setSteps(prev => prev.filter(step => step.id !== id));
      setSuccess('Step deleted successfully!');
    })
    .catch(() => {
      setError('Failed to delete step.');
    });
  };

  // Auto-hide messages
  useEffect(() => {
    if (success || error) {
      const timer = setTimeout(() => {
        setSuccess('');
        setError('');
      }, 3000);
      return () => clearTimeout(timer);
    }
  }, [success, error]);

  return (
    <Container className="py-5">
      <h2 className="text-primary mb-4">Steps for the Solution</h2>
      {error && <Alert color="danger">{error}</Alert>}
      {success && <Alert color="success">{success}</Alert>}

      <Card className="mb-4 shadow">
        <CardBody>
          <CardTitle tag="h5">Add Step</CardTitle>
          <Form onSubmit={handleSubmit}>
            <FormGroup>
              <Label>Description</Label>
              <Input
                type="textarea"
                value={form.description}
                onChange={(e) => setForm({ ...form, description: e.target.value })}
                required
              />
            </FormGroup>
            <FormGroup>
              <Label>Order (optional)</Label>
              <Input
                type="number"
                value={form.order}
                onChange={(e) => setForm({ ...form, order: e.target.value })}
              />
            </FormGroup>
            <FormGroup>
              <Label>Image (optional)</Label>
              <Input
                type="file"
                onChange={(e) => setImage(e.target.files[0])}
              />
            </FormGroup>
            <Button color="primary" type="submit">Add Step</Button>
          </Form>
        </CardBody>
      </Card>

      <h5 className="mb-3">Existing Steps</h5>
      <Row>
        {steps.map((step) => (
          step && (
            <Col md="6" key={step.id} className="mb-4">
              <Card className="shadow-sm">
                <CardBody>
                  {editingId === step.id ? (
                    <>
                      <FormGroup>
                        <Label>Description</Label>
                        <Input
                          type="textarea"
                          value={editForm.description}
                          onChange={(e) => setEditForm({ ...editForm, description: e.target.value })}
                        />
                      </FormGroup>
                      <FormGroup>
                        <Label>Order</Label>
                        <Input
                          type="number"
                          value={editForm.order}
                          onChange={(e) => setEditForm({ ...editForm, order: e.target.value })}
                        />
                      </FormGroup>
                      <FormGroup>
                        <Label>Replace Image (optional)</Label>
                        <Input
                          type="file"
                          onChange={(e) => setEditForm({ ...editForm, image: e.target.files[0] })}
                        />
                      </FormGroup>
                      <div className="d-flex justify-content-end gap-2">
                        <Button color="success" onClick={() => saveEdit(step.id)}><FaSave /> Save</Button>
                        <Button color="secondary" onClick={cancelEdit}><FaTimes /> Cancel</Button>
                      </div>
                    </>
                  ) : (
                    <>
                      <p><strong>Order:</strong> {step.order ?? 'N/A'}</p>
                      <p>{step.description}</p>
                      {step.image && (
                        <img
                          src={`http://127.0.0.1:8000/storage/${step.image}`}
                          alt="Step"
                          className="img-fluid rounded mb-2"
                        />
                      )}
                      <div className="d-flex justify-content-end gap-2">
                        <Button color="warning" onClick={() => handleEdit(step)}><FaEdit /></Button>
                        <Button color="danger" onClick={() => handleDelete(step.id)}><FaTrash /></Button>
                      </div>
                    </>
                  )}
                </CardBody>
              </Card>
            </Col>
          )
        ))}
      </Row>
    </Container>
  );
};

const authHeader = () => ({
  Authorization: `Bearer ${localStorage.getItem('token')}`
});

export default SolutionSteps;
