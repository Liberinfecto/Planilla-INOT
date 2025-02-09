import { useState } from 'react';
import DatosPaciente from './components/DatosPaciente';
import FactoresRiesgo from './components/FactoresRiesgo';
import EnfermedadActual from './components/EnfermedadActual';
import Paraclinica from './components/Paraclinica';
import DescripcionOperatoria from './components/DescripcionOperatoria';
import Imagenes from './components/Imagenes';
import Antibioticoterapia from './components/Antibioticoterapia';
import './App.css';

function App() {
  const [datoPaciente, setDatoPaciente] = useState({
    edad: '',
    peso: '',
    talla: '',
    sexo: ''
  });

  return (
    <div className="app">
      <h1 className="main-title">Planilla de Datos INOT</h1>
      <DatosPaciente setDatoPaciente={setDatoPaciente} />
      <FactoresRiesgo />
      <EnfermedadActual />
      <DescripcionOperatoria />
      <Paraclinica formData={datoPaciente} />
      <Imagenes />
      <Antibioticoterapia />
    </div>
  );
}

export default App;