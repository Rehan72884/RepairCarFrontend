import React, { useState } from 'react';
import SolutionForm from './SolutionForm';

const ProblemList = ({ problems, refresh }) => {
  const [selectedProblem, setSelectedProblem] = useState(null);

  return (
    <div>
      <h4>Problems List</h4>
      {problems.length === 0 ? (
        <p>No problems found.</p>
      ) : (
        <ul className="list-group">
          {problems.map((problem) => (
            <li key={problem.id} className="list-group-item">
              <div className="d-flex justify-content-between">
                <strong>{problem.title}</strong>
                <button
                  className="btn btn-sm btn-primary"
                  onClick={() => setSelectedProblem(problem)}
                >
                  Add/View Solutions
                </button>
              </div>
              {selectedProblem?.id === problem.id && (
                <SolutionForm problem={problem} refresh={refresh} />
              )}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default ProblemList;
