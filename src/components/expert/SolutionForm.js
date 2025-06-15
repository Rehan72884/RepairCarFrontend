import React, { useState, useEffect } from 'react';
import axios from '../../api/axios';
import StepForm from './StepForm';

const SolutionForm = ({ problem, refresh }) => {
  const [solutions, setSolutions] = useState([]);
  const [newSolution, setNewSolution] = useState('');

  const loadSolutions = async () => {
    const res = await axios.get(`/api/expert/problems/${problem.id}/solutions`);
    setSolutions(res.data.solutions);
  };

  const handleAddSolution = async () => {
    if (!newSolution) return;
    await axios.post(`/api/expert/problems/${problem.id}/solutions`, {
      title: newSolution,
    });
    setNewSolution('');
    loadSolutions();
    refresh();
  };

  const handleDelete = async (id) => {
    await axios.delete(`/api/expert/solutions/${id}`);
    loadSolutions();
  };

  useEffect(() => {
    loadSolutions();
  }, [problem.id]);

  return (
    <div className="mt-3">
      <input
        type="text"
        value={newSolution}
        onChange={(e) => setNewSolution(e.target.value)}
        placeholder="Solution Title"
        className="form-control mb-2"
      />
      <button className="btn btn-success mb-3" onClick={handleAddSolution}>
        Add Solution
      </button>
      {solutions.map((solution) => (
        <div key={solution.id} className="border p-2 mb-2">
          <div className="d-flex justify-content-between align-items-center">
            <strong>{solution.title}</strong>
            <button
              className="btn btn-sm btn-danger"
              onClick={() => handleDelete(solution.id)}
            >
              Delete
            </button>
          </div>
          <StepForm solution={solution} />
        </div>
      ))}
    </div>
  );
};

export default SolutionForm;
