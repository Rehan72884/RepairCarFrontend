// components/SolutionModal.js
import React, { useEffect, useState } from 'react';
import { Modal, ModalHeader, ModalBody, ModalFooter, Button } from 'reactstrap';
import axios from '../../api/axios';

const SolutionModal = ({ isOpen, toggle, problemId }) => {
  const [solutions, setSolutions] = useState([]);

  useEffect(() => {
    console.log('Fetching solutions for problemId:', problemId);
    if (isOpen && problemId) {
      axios
        .get(`/api/problems/${problemId}/solutions`)
        .then((res) => {
          console.log('Solutions response:', res.data);
          setSolutions(res.data || []);
        })
        .catch((err) => console.error('Error fetching solutions:', err));
    }
  }, [isOpen, problemId]);

  const handleDelete = async (id) => {
    if (window.confirm('Delete this solution?')) {
      try {
        await axios.delete(`/api/solutions/delete/${id}`);
        setSolutions((prev) => prev.filter((sol) => sol.id !== id));
      } catch (error) {
        console.error('Delete failed:', error);
        alert('Error deleting solution');
      }
    }
  };

  const closeModal = () => {
    toggle();
    setSolutions([]); // reset solutions when closing modal
  };

  return (
    <Modal isOpen={isOpen} toggle={closeModal} size="lg">
      <ModalHeader toggle={closeModal}>Solutions</ModalHeader>
      <ModalBody>
        {solutions.length === 0 ? (
          <p>No solutions available.</p>
        ) : (
          <ul className="list-group">
            {solutions.map((sol) => (
  <li key={sol.id} className="list-group-item d-flex justify-content-between align-items-start flex-column">
    <div className="w-100 d-flex justify-content-between">
      <strong>{sol.title || 'Untitled Solution'}</strong>
      <button className="btn btn-danger btn-sm" onClick={() => handleDelete(sol.id)}>
        Delete
      </button>
    </div>
    <div className="mt-2">
      <p>{sol.description}</p>

      {sol.feedbacks && sol.feedbacks.length > 0 ? (
        sol.feedbacks.map((fb, index) => (
          <small key={index} className="d-block mb-2">
            <strong>User:</strong> {fb.user?.name || 'Unknown'} <br />
            <strong>Rating:</strong> {fb.rating} | <strong>Feedback:</strong> {fb.feedback}
            <hr />
          </small>
        ))
      ) : (
        <small><em>No feedback yet</em></small>
      )}
    </div>
  </li>
))}

          </ul>
        )}
      </ModalBody>
      <ModalFooter>
        <Button color="secondary" onClick={closeModal}>
          Close
        </Button>
      </ModalFooter>
    </Modal>
  );
};

export default SolutionModal;
