import React from 'react';

const MyCars = () => {
  const cars = JSON.parse(localStorage.getItem('myCars')) || [];

  return (
    <div className="container mt-5">
      <h3 className="mb-4">My Cars</h3>
      {cars.length === 0 ? (
        <p>No cars added yet.</p>
      ) : (
        <ul className="list-group">
          {cars.map((car, index) => (
            <li key={index} className="list-group-item">
              {car.company} {car.model} ({car.year})
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default MyCars;
