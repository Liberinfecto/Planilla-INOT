const INOTForm = () => {
  const [formData, setFormData] = React.useState({
    name: '',
    floor: '',
    ci: '',
    age: '',
    origin: '',
    fi: '',
    fConsult: '',
    fe: '',
  });

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  return (
    <div className="max-w-3xl mx-auto p-4">
      <h2 className="text-2xl font-bold mb-4">Planilla INOT</h2>
      <form className="grid grid-cols-2 gap-4">
        <div className="col-span-2">
          <label className="block font-semibold mb-1">Nombre:</label>
          <input
            type="text"
            name="name"
            value={formData.name}
            onChange={handleInputChange}
            className="w-full border rounded p-2"
          />
        </div>
        <div>
          <label className="block font-semibold mb-1">Piso/Cama:</label>
          <input
            type="text"
            name="floor"
            value={formData.floor}
            onChange={handleInputChange}
            className="w-full border rounded p-2"
          />
        </div>
        <div>
          <label className="block font-semibold mb-1">CI:</label>
          <input
            type="text"
            name="ci"
            value={formData.ci}
            onChange={handleInputChange}
            className="w-full border rounded p-2"
          />
        </div>
        <div>
          <label className="block font-semibold mb-1">Edad:</label>
          <input
            type="text"
            name="age"
            value={formData.age}
            onChange={handleInputChange}
            className="w-full border rounded p-2"
          />
        </div>
        <div className="col-span-2">
          <label className="block font-semibold mb-1">Procedencia:</label>
          <input
            type="text"
            name="origin"
            value={formData.origin}
            onChange={handleInputChange}
            className="w-full border rounded p-2"
          />
        </div>
        <div>
          <label className="block font-semibold mb-1">FI:</label>
          <input
            type="date"
            name="fi"
            value={formData.fi}
            onChange={handleInputChange}
            className="w-full border rounded p-2"
          />
        </div>
        <div>
          <label className="block font-semibold mb-1">F consulta infecto:</label>
          <input
            type="date"
            name="fConsult"
            value={formData.fConsult}
            onChange={handleInputChange}
            className="w-full border rounded p-2"
          />
        </div>
        <div>
          <label className="block font-semibold mb-1">FE:</label>
          <input
            type="date"
            name="fe"
            value={formData.fe}
            onChange={handleInputChange}
            className="w-full border rounded p-2"
          />
        </div>
      </form>
    </div>
  );
};

ReactDOM.render(<INOTForm />, document.getElementById('root'));
