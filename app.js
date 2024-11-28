import React, { useState } from 'react';

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

  // Estado para manejar los radio buttons
  const [radioSelections, setRadioSelections] = useState({});

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  // Función para manejar los clicks en los radio buttons
  const handleRadioClick = (name, value) => {
    setRadioSelections(prev => {
      if (prev[name] === value) {
        const newSelections = { ...prev };
        delete newSelections[name];
        return newSelections;
      }
      return {
        ...prev,
        [name]: value
      };
    });
  };

  const studies = ['Rx', 'Centellograma', 'Tomografía', 'Punción articular', 'Otros'];

  const traumaHistory = [
    { name: 'Fractura', detail: 'Hueso: ___________' },
    { name: 'Cerrada', detail: ['Desplazada: ____', 'Simple: ____'] },
    { name: 'Expuesta', detail: 'Gustilo: _____' },
    { name: 'EE', detail: 'Permanencia: _____' },
    { name: 'EEM', detail: '' },
    { name: 'Osteosíntesis', detail: '' },
    { name: 'Prótesis', detail: ['Lugar: ____', 'Fecha: ____'] },
    { name: 'Recambio de Prótesis', detail: '' },
    { name: 'Clavo', detail: '' },
    { name: 'ISQ Previas', detail: '' },
    { name: 'Aislamiento de MO Previo', detail: '' },
    { name: 'LQ Previas', detail: '' },
    { name: 'Retiro de implante', detail: 'Fecha: _____' },
    { name: 'Exposición a ATB en 3 meses previos', detail: 'Cuales: _____' }
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
              {colspan && (
                <td className="border border-gray-800 p-2" colSpan={colspan}>
                  {typeof item === 'object' && item.detail}
                </td>
              )}
            </tr>
          );
        })}
      </tbody>
    </table>
  );

  return (
    <div className="max-w-5xl mx-auto p-4 text-sm font-sans">
      {/* Renderiza las distintas secciones como está en el código original */}
    </div>
  );
};

ReactDOM.render(<INOTForm />, document.getElementById('root'));
