// Lista de antibióticos IV frecuentes

export const antibioticosIVFrecuentes = [
    {
        abreviatura: "AMK",
        nombre: "Amikacina",
        color: ["#ff0000", "#ffffff"],
        vias: ["IV", "IM"],
        dosisHabitual: "15-20 mg/kg/día"
    },
    {
        abreviatura: "CFZ",
        nombre: "Cefazolina",
        color: ["#ffffff", "#008b8b"],
        vias: ["IV"],
        dosisHabitual: "1-2 g cada 6-8 horas"
    },
    {
        abreviatura: "CRO",
        nombre: "Ceftriaxona",
        color: ["#ffffff", "#ff8c00"],
        vias: ["IV", "IM"],
        dosisHabitual: "1-2 g cada 24 horas"
    },
    {
        abreviatura: "CAZ",
        nombre: "Ceftazidima",
        color: ["#ffffff", "#ffff00"],
        vias: ["IV"],
        dosisHabitual: "1-2 g cada 8 horas"
    },
    {
        abreviatura: "MEM",
        nombre: "Meropenem",
        color: ["#ff8c00", "#ffa500"],
        vias: ["IV"],
        dosisHabitual: "1-2 g cada 8 horas"
    },
    {
        abreviatura: "PTZ",
        nombre: "Piperacilina/Tazobactam",
        color: ["#0000ff", "#228b22"],
        vias: ["IV"],
        dosisHabitual: "4.5 g cada 6 horas"
    },
    {
        abreviatura: "VAN",
        nombre: "Vancomicina",
        color: ["#ff0000", "#0056b3"],
        vias: ["IV"],
        dosisHabitual: "15-20 mg/kg cada 8-12 horas"
    },
    {
        abreviatura: "TMS",
        nombre: "Trimetoprim/Sulfametoxazol",
        color: ["#ffff00", "#6b8e23"],
        vias: ["IV", "VO"],
        dosisHabitual: "8-20 mg/kg de Trimetoprim cada 6-12 horas"
    }
];

// Lista de biterapias frecuentes
export const biterapiasFrecuentes = [
    {
        atb1: "VAN",
        atb2: "AMK",
        nombre: "Vancomicina + Amikacina",
        color: ["#ff0000", "#ffffff"],
        vias: ["IV", "IM"],
        dosisHabitual: "Vancomicina: 15-20 mg/kg cada 8-12 horas, Amikacina: 15-20 mg/kg/día"
    },
    {
        atb1: "VAN",
        atb2: "CFZ",
        nombre: "Vancomicina + Cefazolina",
        color: ["#ff0000", "#008b8b"],
        vias: ["IV"],
        dosisHabitual: "Vancomicina: 15-20 mg/kg cada 8-12 horas, Cefazolina: 1-2 g cada 6-8 horas"
    },
    {
        atb1: "VAN",
        atb2: "TMS",
        nombre: "Vancomicina + Trimetoprim/Sulfametoxazol",
        color: ["#ff0000", "#6b8e23"],
        vias: ["IV"],
        dosisHabitual: "Vancomicina: 15-20 mg/kg cada 8-12 horas, Trimetoprim/Sulfametoxazol: 8-20 mg/kg de Trimetoprim cada 6-12 horas"
    },
    {
        atb1: "CFZ",
        atb2: "TMS",
        nombre: "Cefazolina + Trimetoprim/Sulfametoxazol",
        color: ["#ffffff", "#6b8e23"],
        vias: ["IV", "VO"],
        dosisHabitual: "Cefazolina: 1-2 g cada 6-8 horas, Trimetoprim/Sulfametoxazol: 8-20 mg/kg de Trimetoprim cada 6-12 horas"
    },
    {
        atb1: "MEM",
        atb2: "VAN",
        nombre: "Meropenem + Vancomicina",
        color: ["#ff8c00", "#ff0000"],
        vias: ["IV"],
        dosisHabitual: "Meropenem: 1-2 g cada 8 horas, Vancomicina: 15-20 mg/kg cada 8-12 horas"
    },
    {
        atb1: "CAZ",
        atb2: "AMK",
        nombre: "Ceftazidima + Amikacina",
        color: ["#ffffff", "#ffff00"],
        vias: ["IV"],
        dosisHabitual: "Ceftazidima: 1-2 g cada 8 horas, Amikacina: 15-20 mg/kg/día"
    }
];


// Lista de antibióticos VO frecuentes
export const antibioticosVOFrecuentes = [
    {
        abreviatura: "AMX",
        nombre: "Amoxicilina",
        color: ["#0000ff", "#495057"],
        vias: ["VO"],
        dosisHabitual: "500-875 mg cada 8-12 horas"
    },
    {
        abreviatura: "AMC",
        nombre: "Amoxicilina/Clavulanato",
        color: ["#0000ff", "#6c757d"],
        vias: ["VO"],
        dosisHabitual: "875/125 mg cada 12 horas"
    },
    {
        abreviatura: "DOX",
        nombre: "Doxiciclina",
        color: ["#2c3e50", "#000000"],
        vias: ["VO"],
        dosisHabitual: "100 mg cada 12 horas"
    },
    {
        abreviatura: "CIP",
        nombre: "Ciprofloxacino",
        color: ["#28a745", "#6b8e23"],
        vias: ["VO"],
        dosisHabitual: "500 mg cada 12 horas"
    },
    {
        abreviatura: "LIN",
        nombre: "Linezolid",
        color: ["#6c757d", "#ffffff"],
        vias: ["VO"],
        dosisHabitual: "600 mg cada 12 horas"
    },
    {
        abreviatura: "TMS",
        nombre: "Trimetoprim/Sulfametoxazol",
        color: ["#ffff00", "#6b8e23"],
        vias: ["VO"],
        dosisHabitual: "8-20 mg/kg de Trimetoprim cada 8-12 horas"

    },
    {
        abreviatura: "RIF",
        nombre: "Rifampicina",
        color: ["#ff8c00", "#ffff00"],
        vias: ["VO"],
        dosisHabitual: "300 mg cada 8-12 horas"
    },
    {
        abreviatura: "CFD",
        nombre: "Cefradina",
        color: ["#ffffff", "#87CEEB"],
        vias: ["VO"],
        dosisHabitual: "500 mg cada 6 horas"
    }
];

// Lista de antibióticos para el selector predictivo
export const antibioticosSelector = [
    // Aminoglucósidos
    {
        abreviatura: "AMK",
        nombre: "Amikacina",
        color: ["#ff0000", "#ffffff"],
        vias: ["IV"],
        dosisHabitual: "15-20 mg/kg/día"
    },
    {
        abreviatura: "GEN",
        nombre: "Gentamicina",
        color: ["#ff0000", "#ff8c00"],
        vias: ["IV"],
        dosisHabitual: "3-5 mg/kg/día"
    },

    // Cefalosporinas
    {
        abreviatura: "CFZ",
        nombre: "Cefazolina",
        color: ["#ffffff", "#008b8b"],
        vias: ["IV"],
        dosisHabitual: "1-2 g cada 6-8 horas"
    },
    {
        abreviatura: "CRO",
        nombre: "Ceftriaxona",
        color: ["#ffffff", "#ff8c00"],
        vias: ["IV"],
        dosisHabitual: "1-2 g cada 24 horas"
    },
    {
        abreviatura: "CAZ",
        nombre: "Ceftazidima",
        color: ["#ffffff", "#ffff00"],
        vias: ["IV"],
        dosisHabitual: "1-2 g cada 8 horas"
    },
    {
        abreviatura: "FEP",
        nombre: "Cefepime",
        color: ["#ffffff", "#6c757d"],
        vias: ["IV"],
        dosisHabitual: "1-2 g cada 8-12 horas"
    },
    {
        abreviatura: "CXM",
        nombre: "Cefuroxima",
        color: ["#ffffff", "#2c3e50"],
        vias: ["IV"],
        dosisHabitual: "750 mg cada 8 horas"
    },
    {
        abreviatura: "CFM",
        nombre: "Cefixima",
        color: ["#ffff00", "#ff6347"],
        vias: ["VO"],
        dosisHabitual: "400 mg cada 24 horas"
    },
    {
        abreviatura: "CTB",
        nombre: "Ceftibuteno",
        color: ["#ffa500", "#ff4500"],
        vias: ["VO"],
        dosisHabitual: "400 mg cada 24 horas"
    },
    {
        abreviatura: "CPD",
        nombre: "Cefpodoxima",
        color: ["#ffd700", "#ff69b4"],
        vias: ["VO"],
        dosisHabitual: "200 mg cada 12 horas"
    },
    {
        abreviatura: "CDR",
        nombre: "Cefdinir",
        color: ["#ff1493", "#ff6347"],
        vias: ["VO"],
        dosisHabitual: "300 mg cada 12 horas"
    },
    {
        abreviatura: "CCL",
        nombre: "Cefaclor",
        color: ["#8a2be2", "#ff1493"],
        vias: ["VO"],
        dosisHabitual: "250-500 mg cada 8 horas"
    },
    {
        abreviatura: "CPZ",
        nombre: "Cefprozil",
        color: ["#4b0082", "#9932cc"],
        vias: ["VO"],
        dosisHabitual: "500 mg cada 24 horas"
    },
    {
        abreviatura: "CTX",
        nombre: "Cefotaxima",
        color: ["#da70d6", "#ba55d3"],
        vias: ["IV"],
        dosisHabitual: "1-2 g cada 6-8 horas"
    },
    {
        abreviatura: "CPT",
        nombre: "Ceftarolina",
        color: ["#ff69b4", "#ff1493"],
        vias: ["IV"],
        dosisHabitual: "600 mg cada 12 horas"
    },
    {
        abreviatura: "CZT",
        nombre: "Ceftolozano/Tazobactam",
        color: ["#ffb6c1", "#ff69b4"],
        vias: ["IV"],
        dosisHabitual: "1.5 g cada 8 horas"
    },
    {
        abreviatura: "BPR",
        nombre: "Ceftobiprol",
        color: ["#ff6347", "#ff4500"],
        vias: ["IV"],
        dosisHabitual: "500 mg cada 8 horas"
    },
    {
        abreviatura: "CPF",
        nombre: "Ceftarolina fosamil",
        color: ["#ff69b4", "#ffb6c1"],
        vias: ["IV"],
        dosisHabitual: "600 mg cada 12 horas"
    },
    {
        abreviatura: "CZA",
        nombre: "Ceftazidima/Avibactam",
        color: ["#ffff00", "#ffd700"],
        vias: ["IV"],
        dosisHabitual: "2.5 g cada 8 horas"
    },
    {
        abreviatura: "CFD",
        nombre: "Cefradina",
        color: ["#ffffff", "#87CEEB"],
        vias: ["VO"],
        dosisHabitual: "500 mg cada 6 horas"
    },

    // Penicilinas
    {
        abreviatura: "AMX",
        nombre: "Amoxicilina",
        color: ["#0000ff", "#495057"],
        vias: ["VO"],
        dosisHabitual: "500-875 mg cada 8-12 horas"
    },
    {
        abreviatura: "AMC",
        nombre: "Amoxicilina/Clavulanato",
        color: ["#0000ff", "#6c757d"],
        vias: ["VO"],
        dosisHabitual: "875/125 mg cada 12 horas"
    },
    {
        abreviatura: "AMP",
        nombre: "Ampicilina",
        color: ["#0000ff", "#ffffff"],
        vias: ["IV", "VO"],
        dosisHabitual: "500 mg cada 6 horas"
    },
    {
        abreviatura: "PTZ",
        nombre: "Piperacilina/Tazobactam",
        color: ["#0000ff", "#228b22"],
        vias: ["IV"],
        dosisHabitual: "4.5 g cada 6 horas"
    },

    // Carbapenémicos
    {
        abreviatura: "MEM",
        nombre: "Meropenem",
        color: ["#ff8c00", "#ffa500"],
        vias: ["IV"],
        dosisHabitual: "1.2 g cada 8 horas"
    },
    {
        abreviatura: "IMI",
        nombre: "Imipenem",
        color: ["#ff8c00", "#ffffff"],
        vias: ["IV"],
        dosisHabitual: "500 mg cada 6 horas"
    },
    {
        abreviatura: "ETP",
        nombre: "Ertapenem",
        color: ["#ff8c00", "#000000"],
        vias: ["IV"],
        dosisHabitual: "1 g cada 24 horas"
    },

    // Quinolonas
    {
        abreviatura: "CIP",
        nombre: "Ciprofloxacino",
        color: ["#28a745", "#6b8e23"],
        vias: ["VO", "IV"],
        dosisHabitual: "500 mg cada 12 horas (VO), 400 mg cada 12 horas (IV)"
    },
    {
        abreviatura: "LEV",
        nombre: "Levofloxacino",
        color: ["#28a745", "#ffffff"],
        vias: ["VO", "IV"],
        dosisHabitual: "500 mg cada 24 horas"
    },
    {
        abreviatura: "MOX",
        nombre: "Moxifloxacino",
        color: ["#28a745", "#000000"],
        vias: ["VO"],
        dosisHabitual: "400 mg cada 24 horas"
    },

    // Tetraciclinas
    {
        abreviatura: "DOX",
        nombre: "Doxiciclina",
        color: ["#2c3e50", "#000000"],
        vias: ["VO"],
        dosisHabitual: "100 mg cada 12 horas"
    },
    {
        abreviatura: "TGC",
        nombre: "Tigeciclina",
        color: ["#c0c0c0", "#0000ff"],
        vias: ["IV"],
        dosisHabitual: "50 mg cada 12 horas"
    },

    // Glicopéptidos
    {
        abreviatura: "VAN",
        nombre: "Vancomicina",
        color: ["#ff0000", "#0056b3"],
        vias: ["IV"],
        dosisHabitual: "15-20 mg/kg cada 8-12 horas"
    },

    // Sulfonamidas
    {
        abreviatura: "TMS",
        nombre: "Trimetoprim/Sulfametoxazol",
        color: ["#ffff00", "#6b8e23"],
        vias: ["VO"],
        dosisHabitual: "8-20 mg/kg de Trimetoprim cada 8-12 horas"
    },

    // Lincosamidas
    {
        abreviatura: "CLI",
        nombre: "Clindamicina",
        color: ["#000000", "#ffffff"],
        vias: ["VO", "IV"],
        dosisHabitual: "300-600 mg cada 6-8 horas (VO), 600 mg cada 6 horas (IV)"
    },

    // Nitroimidazoles
    {
        abreviatura: "MTZ",
        nombre: "Metronidazol",
        color: ["#8b4513", "#ffffff"],
        vias: ["VO", "IV"],
        dosisHabitual: "500 mg cada 8 horas"
    },

    // Fosfónicos
    {
        abreviatura: "FOS",
        nombre: "Fosfomicina",
        color: ["#87ceeb", "#ffffff"],
        vias: ["VO"],
        dosisHabitual: "3 g dosis única"
    },

    // Nitrofurano
    {
        abreviatura: "NIT",
        nombre: "Nitrofurantoína",
        color: ["#7fff00", "#ffffff"],
        vias: ["VO"],
        dosisHabitual: "100 mg cada 6 horas"
    },

    // Polimixinas
    {
        abreviatura: "COL",
        nombre: "Colistina",
        color: ["#ffa500", "#4682b4"],
        vias: ["IV"],
        dosisHabitual: "2.5-5 mg/kg/día"
    },

    // Rifamicinas
    {
        abreviatura: "RIF",
        nombre: "Rifampicina",
        color: ["#ff8c00", "#ffff00"],
        vias: ["VO"],
        dosisHabitual: "300 mg cada 8-12 horas"
    },

    // Macrólidos
    {
        abreviatura: "AZM",
        nombre: "Azitromicina",
        color: ["#ffc0cb", "#ffffff"],
        vias: ["VO"],
        dosisHabitual: "500 mg el primer día, luego 250 mg cada 24 horas"
    },
    {
        abreviatura: "CLR",
        nombre: "Claritromicina",
        color: ["#ffc0cb", "#6c757d"],
        vias: ["VO"],
        dosisHabitual: "500 mg cada 12 horas"
    },

    // Oxazolidinonas
    {
        abreviatura: "LNZ",
        nombre: "Linezolid",
        color: ["#6c757d", "#ffffff"],
        vias: ["VO"],
        dosisHabitual: "600 mg cada 12 horas"
    },

    // Lipopeptidos
    {
        abreviatura: "DAP",
        nombre: "Daptomicina",
        color: ["#800080", "#ffffff"],
        vias: ["IV"],
        dosisHabitual: "4-6 mg/kg cada 24 horas"
    },

    // Monobactamos
    {
        abreviatura: "ATM",
        nombre: "Aztreonam",
        color: ["#add8e6", "#ffffff"],
        vias: ["IV"],
        dosisHabitual: "1-2 g cada 8 horas"
    },
    
    // Antifúngicos
    {
        abreviatura: "VCZ",
        nombre: "Voriconazol",
        color: ["#800080", "#ffa500"],
        vias: ["IV", "VO"],
        dosisHabitual: "200 mg cada 12 horas (IV), 200 mg cada 12 horas (VO)"
    },
    {
        abreviatura: "AMB",
        nombre: "Anfotericina B",
        color: ["#ff0000", "#ff8c00"],
        vias: ["IV"],
        dosisHabitual: "0.5-1 mg/kg/día"
    },
    {
        abreviatura: "FCZ",
        nombre: "Fluconazol",
        color: ["#0000ff", "#008b8b"],
        vias: ["IV", "VO"],
        dosisHabitual: "200-400 mg el primer día, luego 200-400 mg cada 24 horas"
    },
    {
        abreviatura: "ITZ",
        nombre: "Itraconazol",
        color: ["#0000ff", "#ff8c00"],
        vias: ["VO"],
        dosisHabitual: "200 mg cada 12 horas"
    },
    {
        abreviatura: "PSZ",
        nombre: "Posaconazol",
        color: ["#0000ff", "#ffff00"],
        vias: ["VO"],
        dosisHabitual: "300 mg cada 12 horas"
    },
    {
        abreviatura: "CFG",
        nombre: "Caspofungina",
        color: ["#0000ff", "#6c757d"],
        vias: ["IV"],
        dosisHabitual: "70 mg el primer día, luego 50 mg cada 24 horas"
    },
    {
        abreviatura: "MFG",
        nombre: "Micafungina",
        color: ["#0000ff", "#2c3e50"],
        vias: ["IV"],
        dosisHabitual: "100 mg cada 24 horas"
    }
];

// Detecta Color de Fondo de Cápsula para definir color de la letra.
/**
 * Determina si un color hexadecimal es claro u oscuro.
 * @param {string} color - Código de color en formato hexadecimal (ejemplo: #ffffff).
 * @returns {boolean} - Devuelve true si el color es claro, false si es oscuro.
 */
export const esColorClaro = (color) => {
    // Convertir el color hexadecimal a RGB
    const hex = color.replace('#', '');
    const r = parseInt(hex.substring(0, 2), 16);
    const g = parseInt(hex.substring(2, 4), 16);
    const b = parseInt(hex.substring(4, 6), 16);

    // Calcular la luminosidad relativa
    const luminosidad = (0.299 * r + 0.587 * g + 0.114 * b);

    // Ajustar el umbral: valores bajos son oscuros, altos son claros
    return luminosidad > 60;
};


