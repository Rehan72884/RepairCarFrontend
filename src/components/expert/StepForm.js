import React, { useState, useEffect } from 'react';
import axios from '../../api/axios';

const StepForm = ({ solution }) => {
  const [steps, setSteps] = useState([]);
  const [newStep, setNewStep] = useState('');

  const loadSteps = async () => {
    const res = await axios.get(`/api/expert/solutions/${solution.id}/steps`);
    setSteps(res.data.steps);
  };

  const handleAddStep = async () => {
    if (!newStep) return;
    await axios.post(`/api/expert/solutions/${solution.id}/steps`, {
      description: newStep,
    });
    setNewStep('');
    loadSteps();
  };

  const handleDelete = async (stepId) => {
    await axios.delete(`/api/expert/steps/${stepId}`);
    loadSteps();
  };

  useEffect(() => {
    loadSteps();
  }, [solution.id]);

  return (
    <div className="mt-2">
      <input
        type="text"
        value={newStep}
        onChange={(e) => setNewStep(e.target.value)}
        placeholder="Step description"
        className="form-control mb-2"
      />
      <button className="btn btn-outline-primary mb-2" onClick={handleAddStep}>
        Add Step
      </button>
      <ul>
        {steps.map((step) => (
          <li key={step.id} className="d-flex justify-content-between">
            {step.description}
            <button
              className="btn btn-sm btn-danger"
              onClick={() => handleDelete(step.id)}
            >
              Delete
            </button>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default StepForm;
