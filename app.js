const INOTForm = () => {
  const [formData, setFormData] = useState({
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
    <div className="max-w-5xl mx-auto p-4 text-sm font-sans">
      {/* Header */}
      <div className="text-center mb-4">
        <h2 className="text-lg font-bold mb-1">CATEDRA DE ENFERMEDADES INFECCIOSAS</h2>
        <h3 className="text-base font-bold">ASISTENCIA DE PACIENTES EN INOT</h3>
      </div>

      {/* Patient Info Section */}
      <div className="border border-gray-800 p-4 mb-4">
        <div className="grid grid-cols-2 gap-4">
          {[
            { label: 'Nombre:', name: 'name' },
            { label: 'Piso/Cama:', name: 'floor' },
            { label: 'CI:', name: 'ci' },
            { label: 'Edad:', name: 'age' },
            { label: 'Procedencia:', name: 'origin', fullWidth: true }
          ].map((field) => (
            <div key={field.name} className={`flex items-baseline gap-2 ${field.fullWidth ? 'col-span-2' : ''}`}>
              <span className="font-bold min-w-[100px]">{field.label}</span>
              <input
                type="text"
                name={field.name}
                value={formData[field.name]}
                onChange={handleInputChange}
                className="flex-1 border-b border-black min-h-[20px] p-1"
              />
            </div>
          ))}
        </div>
        <div className="flex justify-between mt-4">
          {[
            { label: 'FI:', name: 'fi' },
            { label: 'F consulta infecto:', name: 'fConsult' },
            { label: 'FE:', name: 'fe' }
          ].map((field) => (
            <div key={field.name} className="flex items-baseline gap-2">
              <span className="font-bold">{field.label}</span>
              <input
                type="date"
                name={field.name}
                value={formData[field.name]}
                onChange={handleInputChange}
                className="border-b border-black min-w-[100px] min-h-[20px] p-1"
              />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

ReactDOM.render(<INOTForm />, document.getElementById('root'));
