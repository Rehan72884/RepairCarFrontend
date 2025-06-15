const CarForm = ({ form, setForm, handleSubmit, editingCarId }) => {
  return (
    <form onSubmit={handleSubmit} className="mb-4">
      <input
        className="form-control mb-2"
        placeholder="Company"
        value={form.company || ''}
        onChange={(e) => setForm({ ...form, company: e.target.value })}
      />
      <input
        className="form-control mb-2"
        placeholder="Model"
        value={form.model || ''}
        onChange={(e) => setForm({ ...form, model: e.target.value })}
      />
      <input
        className="form-control mb-2"
        placeholder="Year"
        value={form.year || ''}
        onChange={(e) => setForm({ ...form, year: e.target.value })}
      />
      <button className="btn btn-primary">
        {editingCarId ? 'Update Car' : 'Add Car'}
      </button>
    </form>
  );
};

export default CarForm;
