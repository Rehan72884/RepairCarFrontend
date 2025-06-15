const ProblemForm = ({ form, setForm, handleSubmit }) => {
  return (
    <form onSubmit={handleSubmit} className="mb-4">
      <input
        className="form-control mb-2"
        placeholder="Problem Title"
        value={form.title}
        onChange={(e) => setForm({ ...form, title: e.target.value })}
      />
      <textarea
        className="form-control mb-2"
        placeholder="Problem Description"
        value={form.description}
        onChange={(e) => setForm({ ...form, description: e.target.value })}
      ></textarea>
      <button className="btn btn-primary">Submit</button>
    </form>
  );
};

export default ProblemForm;
