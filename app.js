const { useState } = React;
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

  const [traumaDetails, setTraumaDetails] = useState({});
  // Estado para manejar los radio buttons
  const [radioSelections, setRadioSelections] = useState({});

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };
const handleDetailChange = (itemName, value, subfield = null) => {
  setTraumaDetails(prev => ({
    ...prev,
    [itemName]: subfield ? { ...prev[itemName], [subfield]: value } : value
  }));
};
  
  // Función para manejar los clicks en los radio buttons
  const handleRadioClick = (name, value) => {
    setRadioSelections(prev => {
      // Si el radio actual ya está seleccionado con el mismo valor, lo deseleccionamos
      if (prev[name] === value) {
        const newSelections = { ...prev };
        delete newSelections[name];
        return newSelections;
      }
      // Si no, seleccionamos el nuevo valor
      return {
        ...prev,
        [name]: value
      };
    });
  };

  const studies = ['Rx', 'Centellograma', 'Tomografía', 'Punción articular', 'Otros'];

  const traumaHistory = [
  { name: 'Fractura', detail: 'Hueso' },
  { name: 'Cerrada', detail: ['Desplazada', 'Simple'] },
  { name: 'Expuesta', detail: 'Gustilo' },
  { name: 'EE', detail: 'Permanencia' },
  { name: 'EEM', detail: '' },
  { name: 'Osteosíntesis', detail: '' },
  { name: 'Prótesis', detail: ['Lugar', 'Fecha'] },
  { name: 'Recambio de Prótesis', detail: '' },
  { name: 'Clavo', detail: '' },
  { name: 'ISQ Previas', detail: '' },
  { name: 'Aislamiento de MO Previo', detail: '' },
  { name: 'LQ Previas', detail: '' },
  { name: 'Retiro de implante', detail: 'Fecha' },
  { name: 'Exposición a ATB en 3 meses previos', detail: 'Cuales' }
];

  const riskFactors = [
    'Diabetes', 'Tabaquismo', 'IMC>30', 'Obesidad', 'AR', 'ERC',
    'Corticoides', 'IS', 'Recambio prótesis', 'Colonizado por MR'
  ];

  const preoperativeItems = [
    'Búsqueda de colonización MR',
    'Cirugía día de internación Nº',
    'Baño clorhexidina',
    'Profilaxis con CAZ',
    'Dosis',
    'Administración min antes de cirugía',
    'Duración cirugía',
    'Repique dosis',
    'Profilaxis suspendida día'
  ];

  const symptoms = [
    'Dolor', 'Fiebre', 'Supuración', 'Signos fluxivos',
    'Limitación funcional', 'Fístula', 'Pseudoartrosis', 'Defecto cutáneo'
  ];

const TableWithCheckboxes = ({ title, items, colspan }) => (
    <table className="w-full border-collapse">
      <thead>
        <tr>
          <th className="border border-gray-800 p-2 bg-gray-100 font-bold">{title}</th>
          <th className="border border-gray-800 p-2 bg-gray-100 font-bold w-12 text-center">SI</th>
          <th className="border border-gray-800 p-2 bg-gray-100 font-bold w-12 text-center">NO</th>
          {colspan && <th className="border border-gray-800 p-2 bg-gray-100 font-bold" colSpan={colspan}>Detalles</th>}
        </tr>
      </thead>
      <tbody>
        {items.map((item) => {
          const itemName = typeof item === 'string' ? item : item.name;
          const radioName = `${itemName}_yn`;
          
          return (
            <tr key={itemName}>
              <td className="border border-gray-800 p-2">{itemName}</td>
              <td className="border border-gray-800 p-2 text-center">
                <input
                  type="radio"
                  checked={radioSelections[radioName] === 'yes'}
                  onChange={() => {}}
                  onClick={() => handleRadioClick(radioName, 'yes')}
                  className="w-4 h-4 cursor-pointer"
                />
              </td>
              <td className="border border-gray-800 p-2 text-center">
                <input
                  type="radio"
                  checked={radioSelections[radioName] === 'no'}
                  onChange={() => {}}
                  onClick={() => handleRadioClick(radioName, 'no')}
                  className="w-4 h-4 cursor-pointer"
                />
              </td>
              {colspan && item.detail && (
                <td className="border border-gray-800 p-2" colSpan={colspan}>
                  {Array.isArray(item.detail) ? (
                    <div className="flex gap-4">
                      {item.detail.map((detailField, index) => (
                        <div key={index} className="flex-1">
                          <label className="mr-2">{detailField}:</label>
                          <input
                            type="text"
                            value={traumaDetails[itemName]?.[detailField] || ''}
                            onChange={(e) => handleDetailChange(itemName, e.target.value, detailField)}
                            className="border-b border-black p-1 w-32"
                          />
                        </div>
                      ))}
                    </div>
                  ) : item.detail ? (
                    <div className="flex items-center">
                      <label className="mr-2">{item.detail}:</label>
                      <input
                        type="text"
                        value={traumaDetails[itemName] || ''}
                        onChange={(e) => handleDetailChange(itemName, e.target.value)}
                        className="border-b border-black p-1 flex-1"
                      />
                    </div>
                  ) : null}
                </td>
              )}
            </tr>
          );
        })}
      </tbody>
    </table>
  );

  // El resto del componente sigue igual...
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

      {/* Trauma History Section */}
      <div className="border border-gray-800 p-4 mb-4">
        <TableWithCheckboxes title="Antecedentes Traumatológicos" items={traumaHistory} colspan={2} />
      </div>

      {/* Risk Factors and Preoperative Section */}
      <div className="border border-gray-800 p-4 mb-4 grid grid-cols-2 gap-4">
        <div>
          <TableWithCheckboxes title="Factores de Riesgo para Infección" items={riskFactors} />
        </div>
        <div>
          <TableWithCheckboxes title="Preoperatorio Actual" items={preoperativeItems} />
        </div>
      </div>

      {/* Surgical Protocol */}
      <div className="border border-gray-800 p-4 mb-4">
        <table className="w-full border-collapse">
          <thead>
            <tr>
              <th className="border border-gray-800 p-2 bg-gray-100 font-bold">Protocolo Quirúrgico</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td className="border border-gray-800 p-2">
                <textarea className="w-full h-40 p-2" />
              </td>
            </tr>
          </tbody>
        </table>
      </div>

      {/* Current Disease */}
      <div className="border border-gray-800 p-4 mb-4">
        <table className="w-full border-collapse">
          <thead>
            <tr>
              <th className="border border-gray-800 p-2 bg-gray-100 font-bold">Enfermedad Actual</th>
              <th className="border border-gray-800 p-2 bg-gray-100 font-bold">Detalles</th>
            </tr>
          </thead>
          <tbody>
            {[
              'Ingresos este año vinculados a la infección actual',
              'Estadía en días actual'
            ].map((item) => (
              <tr key={item}>
                <td className="border border-gray-800 p-2">{item}</td>
                <td className="border border-gray-800 p-2">
                  <input type="text" className="w-full p-1" />
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Symptoms Section */}
      <div className="border border-gray-800 p-4 mb-4">
        <TableWithCheckboxes title="Síntomas" items={symptoms} />
      </div>

      {/* Studies Section */}
      <div className="border border-gray-800 p-4 mb-4">
        <table className="w-full border-collapse">
          <thead>
            <tr>
              <th className="border border-gray-800 p-2 bg-gray-100 font-bold">Estudios solicitados</th>
              <th className="border border-gray-800 p-2 bg-gray-100 font-bold">Resultado</th>
            </tr>
          </thead>
          <tbody>
            {studies.map((study) => (
              <tr key={study}>
                <td className="border border-gray-800 p-2">{study}</td>
                <td className="border border-gray-800 p-2">
                  <input type="text" className="w-full p-1" />
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Diagnosis Section */}
      <div className="border border-gray-800 p-4 mb-4">
        <table className="w-full border-collapse">
          <thead>
            <tr>
              <th className="border border-gray-800 p-2 bg-gray-100 font-bold">Diagnóstico</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td className="border border-gray-800 p-2">
                <textarea className="w-full h-20 p-2" />
              </td>
            </tr>
          </tbody>
        </table>
      </div>

      {/* Conduct Section */}
      <div className="border border-gray-800 p-4">
        <table className="w-full border-collapse">
          <thead>
            <tr>
              <th className="border border-gray-800 p-2 bg-gray-100 font-bold" colSpan="2">Conducta</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td className="border border-gray-800 p-2 w-1/4">Conducta Q:</td>
              <td className="border border-gray-800 p-2">
                <textarea className="w-full h-20 p-2" />
              </td>
            </tr>
            <tr>
              <td className="border border-gray-800 p-2">Conducta infectológica:</td>
              <td className="border border-gray-800 p-2">
                <textarea className="w-full h-20 p-2" />
              </td>
            </tr>
            <tr>
              <td className="border border-gray-800 p-2">Plan Antimicrobiano inicial:</td>
              <td className="border border-gray-800 p-2">
                <textarea className="w-full h-20 p-2" />
              </td>
            </tr>
            <tr>
              <td className="border border-gray-800 p-2">Se espero obtener cultivos para iniciar ATB:</td>
              <td className="border border-gray-800 p-2">
                <div className="flex gap-4">
                  <label className="flex items-center gap-1">
                    <input
                      type="radio"
                      checked={radioSelections['espero_cultivos'] === 'yes'}
                      onChange={() => {}}
                      onClick={() => handleRadioClick('espero_cultivos', 'yes')}
                      className="w-4 h-4 cursor-pointer"
                    />
                    <span>Si</span>
                  </label>
                  <label className="flex items-center gap-1">
                    <input
                      type="radio"
                      checked={radioSelections['espero_cultivos'] === 'no'}
                      onChange={() => {}}
                      onClick={() => handleRadioClick('espero_cultivos', 'no')}
                      className="w-4 h-4 cursor-pointer"
                    />
                    <span>No</span>
                  </label>
                </div>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
</div>
  );
};
const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(<INOTForm />);
