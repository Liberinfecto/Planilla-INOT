import { useState } from 'react';

function FactoresRiesgo() {
  // Estado para Factores de Riesgo
  const [factoresRiesgo, setFactoresRiesgo] = useState({
    diabetes: { value: '', detalles: '' },
    tabaquismo: { value: '', detalles: '' },
    obesidad: { value: '', detalles: '' },
    AR: { value: '', detalles: '' },
    ERC: { value: '', detalles: '' },
    corticoides: { value: '', detalles: '' },
    IS: { value: '', detalles: '' },
    recambioProtesis: { value: '', detalles: '' },
    colonizadoMR: { value: '', detalles: '' }
  });

  // Estado para Antecedentes Traumatológicos
  const [antecedentes, setAntecedentes] = useState({
    fractura: {
      value: '',
      detalles: '',
      hueso: '',
      fecha: { comentarios: '' },
      expuesta: {
        value: '',
        gustilo: ''
      },
      osteosintesis: {
        value: '',
        tipo: '',
        fecha: { comentarios: '' }
      }
    },
    protesis: {
      value: '',
      tipo: '',
      fecha: { comentarios: '' },
      recambio: {
        value: '',
        fecha: { comentarios: '' }
      }
    },
    isqPrevias: {
      value: '',
      detalles: { comentarios: '' }
    },
    lqPrevias: {
      value: '',
      detalles: { comentarios: '' }
    },
    aislamientoMicro: {
      value: '',
      detalles: { comentarios: '' }
    },
    antibioticos: {
      value: '',
      detalles: { comentarios: '' }
    }
  });

  // Handlers para los cambios en Factores de Riesgo
  const handleFactorChange = (factor, field, value) => {
    setFactoresRiesgo(prev => ({
      ...prev,
      [factor]: {
        ...prev[factor],
        [field]: value
      }
    }));
  };

  // Handlers para los cambios en Antecedentes
  const handleAntecedentesChange = (antecedente, campo, valor, subCampo = null) => {
    setAntecedentes(prev => {
      if (!subCampo) {
        return {
          ...prev,
          [antecedente]: {
            ...prev[antecedente],
            [campo]: valor
          }
        };
      } else {
        return {
          ...prev,
          [antecedente]: {
            ...prev[antecedente],
            [campo]: {
              ...prev[antecedente][campo],
              [subCampo]: valor
            }
          }
        };
      }
    });
  };

  // Función helper para formatear el texto de los factores
  const formatFactorText = (factor) => {
    switch(factor) {
      case 'recambioProtesis':
        return 'Recambio Prótesis';
      case 'colonizadoMR':
        return 'Colonizado por MR';
      case 'isqPrevias':
        return 'ISQ Previas';
      case 'lqPrevias':
        return 'LQ Previas';
      case 'aislamientoMicro':
        return 'Aislamiento Micro';
      default:
        return factor.charAt(0).toUpperCase() + factor.slice(1);
    }
  };

  // Arrays para los selectores
  const huesos = {
    'Miembro Superior': ['Húmero', 'Radio', 'Cúbito', 'Clavícula', 'Escápula', 'Carpo'],
    'Cadera/Pelvis': ['Pelvis', 'Acetábulo', 'Cabeza Femoral', 'Cuello Femoral', 'Intertrocantérica', 'Subtrocantérica', 'Ilíaco', 'Isquion', 'Pubis', 'Sacro'],
    'Miembro Inferior': ['Fémur', 'Rótula', 'Tibia', 'Pilón Tibial', 'Peroné', 'Tobillo', 'Calcáneo', 'Tarso']
  };

  const tiposOsteosintesis = [
    'FFEE', 'EEM', 'Placas', 'Tornillos', 'Fijador Ilizarov',
    'Alambres de Kirschner', 'Grapas metálicas', 'Otros'
  ];

  const tiposProtesis = ['Rodilla', 'Cadera', 'Otros'];

  const clasificacionGustilo = ['I', 'II', 'IIIa', 'IIIb', 'IIIc'];

  return (
    <div className="container">
  <h3 style={{ 
    margin: '0 0 1rem', 
    textAlign: 'left',
    color: '#333'
  }}>
    Antecedentes Personales
  </h3>
  <hr style={{ 
    border: 'none', 
    borderTop: '2px solid #333', 
    margin: '0 0 1rem' 
  }} />
  <div className="flex-container" style={{
    display: 'flex',
    gap: '2rem',
    width: '100%'
  }}>
          <div className="section-container" style={{ flex: '0.45' }}>  
          {/* Tabla Factores de Riesgo */}
          <table className="risk-table">
            <thead>
              <tr>
                <th>FR Para Infección</th>
                <th>Detalles</th>
              </tr>
            </thead>
            <tbody>
              {Object.entries(factoresRiesgo).map(([factor, data]) => (
                <tr
                  key={factor}
                  className={`risk-row ${data.value === 'si' ? 'active' : ''}`}
                  onClick={() => handleFactorChange(factor, 'value', data.value === 'si' ? '' : 'si')}
                >
                  <td>{formatFactorText(factor)}</td>
                  <td>
                    <textarea
                      placeholder="Comentarios"
                      value={data.detalles}
                      onClick={(e) => e.stopPropagation()}
                      onChange={(e) => handleFactorChange(factor, 'detalles', e.target.value)}
                    />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <div className="section-container" style={{ flex: '0.55' }}>  
          {/* Tabla Antecedentes Traumatológicos */}
          <table className="trauma-table">
            <colgroup>
              <col style={{ width: '35%' }} /> {/* Columna de variables */}
              <col style={{ width: '65%' }} /> {/* Columna de detalles/opciones */}
            </colgroup>
            <thead>
              <tr>
                <th>Antecedentes Traumatológicos</th>
                <th>Detalles</th>
              </tr>
            </thead>
            <tbody>
              {/* Fractura y sus campos anidados */}
              <tr
                className={`risk-row ${antecedentes.fractura.value === 'si' ? 'active' : ''}`}
                onClick={() => handleAntecedentesChange('fractura', 'value',
                  antecedentes.fractura.value === 'si' ? '' : 'si')}
              >
                <td>Fractura</td>
                <td>
                  {antecedentes.fractura.value === 'si' && (
                    <div style={{ display: 'flex', gap: '0.5rem', alignItems: 'center' }}
                         onClick={(e) => e.stopPropagation()}>
                      <select
                        value={antecedentes.fractura.hueso}
                        onChange={(e) => handleAntecedentesChange('fractura', 'hueso', e.target.value)}
                        style={{ minWidth: '150px' }}
                      >
                        <option value="">Seleccionar hueso...</option>
                        {Object.entries(huesos).map(([grupo, huesosGrupo]) => (
                          <optgroup key={grupo} label={grupo}>
                            {huesosGrupo.map(hueso => (
                              <option key={hueso} value={hueso.toLowerCase()}>{hueso}</option>
                            ))}
                          </optgroup>
                        ))}
                      </select>
                      <textarea
                        placeholder="Fecha/Comentarios"
                        value={antecedentes.fractura.fecha.comentarios}
                        onChange={(e) => handleAntecedentesChange('fractura', 'fecha',
                          e.target.value, 'comentarios')}
                      />
                    </div>
                  )}
                </td>
              </tr>

              {antecedentes.fractura.value === 'si' && (
                <>
                  <tr
                    className={`risk-row ${antecedentes.fractura.expuesta.value === 'si' ? 'active' : ''}`}
                    onClick={() => handleAntecedentesChange('fractura', 'expuesta', {
                      ...antecedentes.fractura.expuesta,
                      value: antecedentes.fractura.expuesta.value === 'si' ? '' : 'si'
                    })}
                  >
                    <td style={{ paddingLeft: '2rem' }}>↳ Expuesta</td>
                    <td>
                      {antecedentes.fractura.expuesta.value === 'si' && (
                        <select
                          onClick={(e) => e.stopPropagation()}
                          value={antecedentes.fractura.expuesta.gustilo}
                          onChange={(e) => handleAntecedentesChange('fractura', 'expuesta', {
                            ...antecedentes.fractura.expuesta,
                            gustilo: e.target.value
                          })}
                          style={{ minWidth: '150px' }}
                        >
                          <option value="">Clasificación Gustilo...</option>
                          {clasificacionGustilo.map(tipo => (
                            <option key={tipo} value={tipo}>Gustilo {tipo}</option>
                          ))}
                        </select>
                      )}
                    </td>
                  </tr>

                  <tr
                    className={`risk-row ${antecedentes.fractura.osteosintesis.value === 'si' ? 'active' : ''}`}
                    onClick={() => handleAntecedentesChange('fractura', 'osteosintesis', {
                      ...antecedentes.fractura.osteosintesis,
                      value: antecedentes.fractura.osteosintesis.value === 'si' ? '' : 'si'
                    })}
                  >
                    <td style={{ paddingLeft: '2rem' }}>↳ Osteosíntesis</td>
                    <td>
                      {antecedentes.fractura.osteosintesis.value === 'si' && (
                        <div style={{ display: 'flex', gap: '0.5rem', alignItems: 'center' }}
                             onClick={(e) => e.stopPropagation()}>
                          <select
                            value={antecedentes.fractura.osteosintesis.tipo}
                            onChange={(e) => handleAntecedentesChange('fractura', 'osteosintesis', {
                              ...antecedentes.fractura.osteosintesis,
                              tipo: e.target.value
                            })}
                            style={{ minWidth: '150px' }}
                          >
                            <option value="">Tipo de OS...</option>
                            {tiposOsteosintesis.map(tipo => (
                              <option key={tipo} value={tipo.toLowerCase()}>{tipo}</option>
                            ))}
                          </select>
                          <textarea
                            placeholder="Fecha/Comentarios"
                            value={antecedentes.fractura.osteosintesis.fecha.comentarios}
                            onChange={(e) => handleAntecedentesChange('fractura', 'osteosintesis', {
                              ...antecedentes.fractura.osteosintesis,
                              fecha: { comentarios: e.target.value }
                            })}
                          />
                        </div>
                      )}
                    </td>
                  </tr>
                </>
              )}

              {/* Prótesis y sus campos anidados */}
              <tr
                className={`risk-row ${antecedentes.protesis.value === 'si' ? 'active' : ''}`}
                onClick={() => handleAntecedentesChange('protesis', 'value',
                  antecedentes.protesis.value === 'si' ? '' : 'si')}
              >
                <td>Prótesis</td>
                <td>
                  {antecedentes.protesis.value === 'si' && (
                    <div style={{ display: 'flex', gap: '0.5rem', alignItems: 'center' }}
                         onClick={(e) => e.stopPropagation()}>
                      <select
                        value={antecedentes.protesis.tipo}
                        onChange={(e) => handleAntecedentesChange('protesis', 'tipo', e.target.value)}
                        style={{ minWidth: '150px' }}
                      >
                        <option value="">Tipo de prótesis...</option>
                        {tiposProtesis.map(tipo => (
                          <option key={tipo} value={tipo.toLowerCase()}>{tipo}</option>
                        ))}
                      </select>
                      <textarea
                        placeholder="Fecha/Comentarios"
                        value={antecedentes.protesis.fecha.comentarios}
                        onChange={(e) => handleAntecedentesChange('protesis', 'fecha',
                          e.target.value, 'comentarios')}
                      />
                    </div>
                  )}
                </td>
              </tr>

              {antecedentes.protesis.value === 'si' && (
                <tr
                  className={`risk-row ${antecedentes.protesis.recambio.value === 'si' ? 'active' : ''}`}
                  onClick={() => handleAntecedentesChange('protesis', 'recambio', {
                    ...antecedentes.protesis.recambio,
                    value: antecedentes.protesis.recambio.value === 'si' ? '' : 'si'
                  })}
                >
                  <td style={{ paddingLeft: '2rem' }}>↳ Recambio de prótesis</td>
                  <td>
                    {antecedentes.protesis.recambio.value === 'si' && (
                      <textarea
                        placeholder="Fecha/Comentarios"
                        value={antecedentes.protesis.recambio.fecha.comentarios}
                        onClick={(e) => e.stopPropagation()}
                        onChange={(e) => handleAntecedentesChange('protesis', 'recambio', {
                          ...antecedentes.protesis.recambio,
                          fecha: { comentarios: e.target.value }
                        })}
                      />
                    )}
                  </td>
                </tr>
              )}

              {/* Resto de campos simples */}
              {['isqPrevias', 'lqPrevias', 'aislamientoMicro', 'antibioticos'].map(campo => (
                <tr
                  key={campo}
                  className={`risk-row ${antecedentes[campo].value === 'si' ? 'active' : ''}`}
                  onClick={() => handleAntecedentesChange(campo, 'value',
                    antecedentes[campo].value === 'si' ? '' : 'si')}
                >
                  <td>{formatFactorText(campo)}</td>
                  <td>
                    <textarea
                      placeholder="Comentarios"
                      value={antecedentes[campo].detalles.comentarios}
                      onClick={(e) => e.stopPropagation()}
                      onChange={(e) => handleAntecedentesChange(campo, 'detalles',
                        e.target.value, 'comentarios')}
                    />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

export default FactoresRiesgo;