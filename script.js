// ==========================================
// MOTOR PAN, ZOOM & ENGINE MATRICIAL
// ==========================================
const svg = document.getElementById('svg-cad');
const content = document.getElementById('canvas-content');
const container = document.getElementById('viewport-container');

let scale = 1, pointX = 0, pointY = 0;
let startX = 0, startY = 0, isPanning = false;

function updateTransform() {
  content.setAttribute('transform', `translate(${pointX}, ${pointY}) scale(${scale})`);
}

function getSvgCoords(e) {
  const ctm = content.getScreenCTM();
  if (!ctm) return { x: 0, y: 0 };
  const inverse = ctm.inverse();
  const pt = svg.createSVGPoint();
  pt.x = e.clientX;
  pt.y = e.clientY;
  const svgPt = pt.matrixTransform(inverse);
  return { x: svgPt.x, y: svgPt.y };
}

// ==========================================
// BASES DE DADOS ORIGINAIS / DEFAULTS
// ==========================================
const defaultDoors = [
  { id: "dr_1", x: 330, y: 480, type: "up-right", size: 55 },
  { id: "dr_2", x: 730, y: 480, type: "up-right", size: 55 },
  { id: "dr_3", x: 1210, y: 480, type: "up-right", size: 55 },
  { id: "dr_4", x: 1690, y: 480, type: "up-right", size: 55 },
  { id: "dr_5", x: 2170, y: 480, type: "up-right", size: 55 },
  { id: "dr_6", x: 330, y: 600, type: "down-right", size: 55 },
  { id: "dr_7", x: 730, y: 600, type: "down-right", size: 55 },
  { id: "dr_8", x: 1930, y: 600, type: "down-right", size: 55 }
];

const defaultWalls = [
  { id: "w_corr_top", x1: 320, y1: 480, x2: 2720, y2: 480 },
  { id: "w_corr_bot", x1: 320, y1: 600, x2: 2720, y2: 600 },
  { id: "w_div_top_1", x1: 720, y1: 60, x2: 720, y2: 480 },
  { id: "w_div_top_2", x1: 1200, y1: 60, x2: 1200, y2: 480 },
  { id: "w_div_top_3", x1: 1680, y1: 60, x2: 1680, y2: 480 },
  { id: "w_div_top_4", x1: 2160, y1: 60, x2: 2160, y2: 480 },
  { id: "w_div_bot_1", x1: 720, y1: 600, x2: 720, y2: 1020 },
  { id: "w_div_bot_2", x1: 1400, y1: 600, x2: 1400, y2: 1020 },
  { id: "w_div_bot_3", x1: 1920, y1: 600, x2: 1920, y2: 1020 },
  { id: "w_s1_part", x1: 2450, y1: 120, x2: 2450, y2: 430 }
];

const defaultFurnitures = [
  { id: "f_s1_1", type: "desk-l", x: 2660, y: 155, rot: 0 },
  { id: "f_s1_2", type: "desk-l", x: 2660, y: 255, rot: 0 },
  { id: "f_s1_3", type: "desk-l", x: 2660, y: 355, rot: 0 },
  { id: "f_s1_4", type: "desk-r", x: 2490, y: 155, rot: 0 },
  { id: "f_s1_5", type: "desk-r", x: 2490, y: 230, rot: 0 },
  { id: "f_s1_6", type: "desk-r", x: 2490, y: 305, rot: 0 },
  { id: "f_s1_7", type: "desk-r", x: 2490, y: 380, rot: 0 },
  { id: "f_s1_8", type: "desk-l", x: 2410, y: 155, rot: 0 },
  { id: "f_s1_9", type: "desk-l", x: 2410, y: 230, rot: 0 },
  { id: "f_s1_10", type: "desk-l", x: 2410, y: 305, rot: 0 },
  { id: "f_s1_11", type: "desk-r", x: 2210, y: 155, rot: 0 },
  { id: "f_s1_12", type: "desk-r", x: 2210, y: 230, rot: 0 },
  { id: "f_s1_13", type: "desk-r", x: 2210, y: 305, rot: 0 },
  { id: "f_s1_14", type: "desk-r", x: 2260, y: 440, rot: 90 },

  { id: "f_s2_1", type: "desk-r", x: 1750, y: 165, rot: 0 },
  { id: "f_s2_2", type: "desk-l", x: 1850, y: 165, rot: 0 },
  { id: "f_s2_3", type: "desk-r", x: 1970, y: 165, rot: 0 },
  { id: "f_s2_4", type: "desk-l", x: 2070, y: 165, rot: 0 },
  { id: "f_s2_5", type: "desk-r", x: 1750, y: 345, rot: 0 },
  { id: "f_s2_6", type: "desk-l", x: 1850, y: 345, rot: 0 },
  { id: "f_s2_7", type: "desk-r", x: 1970, y: 345, rot: 0 },
  { id: "f_s2_8", type: "desk-l", x: 2070, y: 345, rot: 0 },

  { id: "f_s3_1", type: "desk-l-shape-l", x: 1335, y: 200, rot: 0 },
  { id: "f_s3_2", type: "desk-l-shape-r", x: 1525, y: 200, rot: 0 },
  { id: "f_s3_3", type: "desk-dual", x: 1335, y: 360, rot: 0 },
  { id: "f_s3_4", type: "desk-dual", x: 1525, y: 360, rot: 0 },

  { id: "f_s4_1", type: "desk-r", x: 810, y: 165, rot: 0 },
  { id: "f_s4_2", type: "desk-l", x: 910, y: 165, rot: 0 },
  { id: "f_s4_3", type: "desk-r", x: 1030, y: 165, rot: 0 },
  { id: "f_s4_4", type: "desk-l", x: 1130, y: 165, rot: 0 },
  { id: "f_s4_5", type: "desk-r", x: 810, y: 345, rot: 0 },
  { id: "f_s4_6", type: "desk-l", x: 910, y: 345, rot: 0 },
  { id: "f_s4_7", type: "desk-r", x: 1030, y: 345, rot: 0 },
  { id: "f_s4_8", type: "desk-l", x: 1130, y: 345, rot: 0 },

  { id: "f_s5_1", type: "desk-r", x: 390, y: 175, rot: 0 },
  { id: "f_s5_2", type: "desk-l", x: 490, y: 175, rot: 0 },
  { id: "f_s5_3", type: "desk-r", x: 610, y: 175, rot: 0 },
  { id: "f_s5_4", type: "desk-r", x: 390, y: 335, rot: 0 },
  { id: "f_s5_5", type: "desk-l", x: 490, y: 335, rot: 0 },
  { id: "f_s5_6", type: "desk-r", x: 610, y: 335, rot: 0 },
  { id: "f_s5_7", type: "desk-r", x: 390, y: 685, rot: 0 },
  { id: "f_s5_8", type: "desk-l", x: 490, y: 685, rot: 0 },
  { id: "f_s5_9", type: "desk-r", x: 610, y: 685, rot: 0 },
  { id: "f_s5_10", type: "desk-r", x: 390, y: 845, rot: 0 },
  { id: "f_s5_11", type: "desk-l", x: 490, y: 845, rot: 0 },
  { id: "f_s5_12", type: "desk-r", x: 610, y: 845, rot: 0 },

  { id: "f_s6_1", type: "quad-island", x: 900, y: 760, rot: 0 },
  { id: "f_s6_2", type: "quad-island", x: 1220, y: 760, rot: 0 },
  { id: "f_s6_3", type: "quad-island", x: 1570, y: 760, rot: 0 },

  { id: "f_s7_1", type: "meeting-round", x: 2180, y: 790, rot: 0 },
  { id: "f_s7_2", type: "bench-rect", x: 2550, y: 760, rot: 0 }
];

const defaultRooms = [
  { id: "r1", x: 2440, y: 95, name: "SALA 01 - BASTIDOR DE TI", desc: "RACK PRINCIPAL A (44U) • CHEGADA DE 171 CABOS", nameSize: 16, descSize: 10 },
  { id: "r2", x: 1920, y: 95, name: "SALA 02", desc: "ASSESSORIA TÉCNICA E ATENDIMENTO", nameSize: 16, descSize: 10 },
  { id: "r3", x: 1440, y: 95, name: "SALA 03", desc: "GABINETE DEFENSORIAL", nameSize: 16, descSize: 10 },
  { id: "r4", x: 960, y: 95, name: "SALA 04", desc: "COORDENAÇÃO OPERACIONAL", nameSize: 16, descSize: 10 },
  { id: "r5", x: 520, y: 95, name: "SALA 05 (NORTE)", desc: "", nameSize: 16, descSize: 10 },
  { id: "r6", x: 520, y: 555, name: "CORREDOR PRINCIPAL", desc: "", nameSize: 16, descSize: 10 },
  { id: "r7", x: 520, y: 995, name: "SALA 05 (SUL)", desc: "", nameSize: 16, descSize: 10 },
  { id: "r8", x: 1320, y: 995, name: "SALA 06 - ILHAS OPERACIONAIS", desc: "", nameSize: 16, descSize: 10 },
  { id: "r9", x: 2320, y: 995, name: "SALA 07 - REUNIÃO TÉCNICA", desc: "", nameSize: 16, descSize: 10 }
];

const defaultPoints = [
  { id: "p1", x: 2460, y: 760, lbl1: "02A0101", lbl2: "02A0102", type: "start", rot: "d" },
  { id: "p2", x: 2620, y: 760, lbl1: "02A0103", lbl2: "02A0104", type: "mid", rot: "d" },
  { id: "p3", x: 2655, y: 140, lbl1: "02A0111", lbl2: "02A0112", type: "mid", rot: "l" },
  { id: "p4", x: 2655, y: 240, lbl1: "02A0109", lbl2: "02A0110", type: "mid", rot: "l" },
  { id: "p5", x: 2655, y: 340, lbl1: "02A0107", lbl2: "02A0108", type: "mid", rot: "l" },
  { id: "p6", x: 2515, y: 140, lbl1: "02A0113", lbl2: "02A0114", type: "mid", rot: "r" },
  { id: "p7", x: 2515, y: 215, lbl1: "02A0115", lbl2: "02A0116", type: "mid", rot: "r" },
  { id: "p8", x: 2515, y: 290, lbl1: "02A0117", lbl2: "02A0118", type: "mid", rot: "r" },
  { id: "p9", x: 2515, y: 365, lbl1: "02A0119", lbl2: "02A0120", type: "mid", rot: "r" },
  { id: "p10", x: 2395, y: 215, lbl1: "02A0123", lbl2: "02A0124", type: "mid", rot: "l" },
  { id: "p11", x: 2260, y: 445, lbl1: "02A0121", lbl2: "02A0122", type: "end", rot: "u" },
  { id: "p12", x: 2395, y: 140, lbl1: "02A0203", lbl2: "02A0204", type: "start", rot: "l" },
  { id: "p13", x: 2300, y: 140, lbl1: "02A0205", lbl2: "02A0206", type: "mid", rot: "l" },
  { id: "p14", x: 2300, y: 215, lbl1: "02A0207", lbl2: "02A0208", type: "mid", rot: "l" },
  { id: "p15", x: 1765, y: 150, lbl1: "02A0201", lbl2: "02A0202", type: "mid", rot: "r" },
  { id: "p16", x: 1845, y: 150, lbl1: "02A0209", lbl2: "02A0210", type: "mid", rot: "l" },
  { id: "p17", x: 1975, y: 150, lbl1: "02A0211", lbl2: "02A0212", type: "mid", rot: "r" },
  { id: "p18", x: 2065, y: 150, lbl1: "02A0213", lbl2: "02A0214", type: "mid", rot: "l" },
  { id: "p19", x: 1765, y: 335, lbl1: "02A0215", lbl2: "02A0216", type: "mid", rot: "r" },
  { id: "p20", x: 1845, y: 335, lbl1: "02A0217", lbl2: "02A0218", type: "mid", rot: "l" },
  { id: "p21", x: 1975, y: 335, lbl1: "02A0219", lbl2: "02A0220", type: "mid", rot: "r" },
  { id: "p22", x: 2065, y: 335, lbl1: "02A0221", lbl2: "02A0222", type: "mid", rot: "l" },
  { id: "p23", x: 1800, y: 240, lbl1: "02A0223", lbl2: "", type: "mid", rot: "u" },
  { id: "p24", x: 2020, y: 240, lbl1: "02A0224", lbl2: "", type: "end", rot: "u" },
  { id: "p25", x: 1335, y: 155, lbl1: "02A0301", lbl2: "02A0302", type: "start", rot: "l" },
  { id: "p26", x: 1525, y: 155, lbl1: "02A0303", lbl2: "02A0304", type: "mid", rot: "r" },
  { id: "p27", x: 1335, y: 315, lbl1: "02A0305", lbl2: "02A0306", type: "mid", rot: "u" },
  { id: "p28", x: 1525, y: 315, lbl1: "02A0307", lbl2: "02A0308", type: "mid", rot: "u" },
  { id: "p29", x: 1260, y: 235, lbl1: "02A0309", lbl2: "02A0310", type: "mid", rot: "r" },
  { id: "p30", x: 1620, y: 235, lbl1: "02A0311", lbl2: "02A0312", type: "mid", rot: "l" },
  { id: "p31", x: 1335, y: 395, lbl1: "02A0313", lbl2: "02A0314", type: "mid", rot: "u" },
  { id: "p32", x: 1525, y: 395, lbl1: "02A0315", lbl2: "02A0316", type: "mid", rot: "u" },
  { id: "p33", x: 1260, y: 265, lbl1: "02A0317", lbl2: "02A0318", type: "mid", rot: "r" },
  { id: "p34", x: 1620, y: 265, lbl1: "02A0319", lbl2: "02A0320", type: "mid", rot: "l" },
  { id: "p35", x: 1365, y: 115, lbl1: "02A0321", lbl2: "02A0322", type: "mid", rot: "u" },
  { id: "p36", x: 1545, y: 115, lbl1: "02A0323", lbl2: "02A0324", type: "end", rot: "u" },
  { id: "p37", x: 850, y: 150, lbl1: "02A0401", lbl2: "02A0402", type: "start", rot: "r" },
  { id: "p38", x: 1070, y: 150, lbl1: "02A0403", lbl2: "02A0404", type: "mid", rot: "l" },
  { id: "p39", x: 850, y: 335, lbl1: "02A0405", lbl2: "02A0406", type: "mid", rot: "r" },
  { id: "p40", x: 1070, y: 335, lbl1: "02A0407", lbl2: "02A0408", type: "mid", rot: "l" },
  { id: "p41", x: 860, y: 235, lbl1: "02A0409", lbl2: "02A0410", type: "mid", rot: "r" },
  { id: "p42", x: 1060, y: 235, lbl1: "02A0411", lbl2: "02A0412", type: "mid", rot: "l" },
  { id: "p43", x: 860, y: 415, lbl1: "02A0413", lbl2: "02A0414", type: "mid", rot: "r" },
  { id: "p44", x: 1060, y: 415, lbl1: "02A0416", lbl2: "02A0416", type: "mid", rot: "l" },
  { id: "p45", x: 760, y: 235, lbl1: "02A0417", lbl2: "02A0418", type: "mid", rot: "r" },
  { id: "p46", x: 1160, y: 235, lbl1: "02A0419", lbl2: "02A0420", type: "mid", rot: "l" },
  { id: "p47", x: 860, y: 115, lbl1: "02A0421", lbl2: "02A0422", type: "mid", rot: "u" },
  { id: "p48", x: 1060, y: 115, lbl1: "02A0423", lbl2: "02A0424", type: "end", rot: "u" },
  { id: "p49", x: 440, y: 140, lbl1: "02A0501", lbl2: "02A0502", type: "start", rot: "r" },
  { id: "p50", x: 610, y: 140, lbl1: "02A0503", lbl2: "02A0504", type: "mid", rot: "l" },
  { id: "p51", x: 440, y: 300, lbl1: "02A0505", lbl2: "02A0506", type: "mid", rot: "r" },
  { id: "p52", x: 610, y: 300, lbl1: "02A0507", lbl2: "02A0508", type: "mid", rot: "l" },
  { id: "p53", x: 440, y: 650, lbl1: "02A0509", lbl2: "02A0510", type: "mid", rot: "r" },
  { id: "p54", x: 610, y: 650, lbl1: "02A0511", lbl2: "02A0512", type: "mid", rot: "l" },
  { id: "p55", x: 440, y: 810, lbl1: "02A0513", lbl2: "02A0514", type: "mid", rot: "r" },
  { id: "p56", x: 610, y: 810, lbl1: "02A0515", lbl2: "02A0516", type: "mid", rot: "l" },
  { id: "p57", x: 370, y: 230, lbl1: "02A0507", lbl2: "02A0508", type: "mid", rot: "r" },
  { id: "p58", x: 370, y: 750, lbl1: "02A0519", lbl2: "02A0520", type: "mid", rot: "r" },
  { id: "p59", x: 530, y: 930, lbl1: "02A0521", lbl2: "02A0522", type: "end", rot: "d" },
  { id: "p60", x: 840, y: 695, lbl1: "02A0601", lbl2: "02A0602", type: "start", rot: "d" },
  { id: "p61", x: 960, y: 695, lbl1: "02A0603", lbl2: "02A0604", type: "mid", rot: "d" },
  { id: "p62", x: 840, y: 830, lbl1: "02A0605", lbl2: "02A0606", type: "mid", rot: "u" },
  { id: "p63", x: 960, y: 830, lbl1: "02A0607", lbl2: "02A0608", type: "mid", rot: "u" },
  { id: "p64", x: 1160, y: 695, lbl1: "02A0609", lbl2: "02A0610", type: "mid", rot: "d" },
  { id: "p65", x: 1280, y: 695, lbl1: "02A0611", lbl2: "02A0612", type: "mid", rot: "d" },
  { id: "p66", x: 1160, y: 830, lbl1: "02A0613", lbl2: "02A0614", type: "mid", rot: "u" },
  { id: "p67", x: 1280, y: 830, lbl1: "02A0615", lbl2: "02A0616", type: "mid", rot: "u" },
  { id: "p68", x: 1510, y: 695, lbl1: "02A0617", lbl2: "02A0618", type: "mid", rot: "d" },
  { id: "p69", x: 1630, y: 695, lbl1: "02A0619", lbl2: "02A0620", type: "mid", rot: "d" },
  { id: "p70", x: 1510, y: 830, lbl1: "02A0621", lbl2: "02A0622", type: "mid", rot: "u" },
  { id: "p71", x: 1630, y: 830, lbl1: "02A0623", lbl2: "02A0624", type: "end", rot: "u" },
  { id: "p72", x: 2085, y: 785, lbl1: "02A0701", lbl2: "02A0702", type: "start", rot: "r" },
  { id: "p73", x: 2275, y: 785, lbl1: "02A0703", lbl2: "02A0704", type: "mid", rot: "l" },
  { id: "p74", x: 2180, y: 855, lbl1: "02A0705", lbl2: "02A0706", type: "mid", rot: "u" },
  { id: "p75", x: 2180, y: 725, lbl1: "02A0707", lbl2: "02A0708", type: "mid", rot: "d" },
  { id: "p76", x: 2380, y: 700, lbl1: "02A0709", lbl2: "02A0710", type: "mid", rot: "d" },
  { id: "p77", x: 2500, y: 700, lbl1: "02A0711", lbl2: "02A0712", type: "mid", rot: "d" },
  { id: "p78", x: 2620, y: 700, lbl1: "02A0713", lbl2: "02A0714", type: "mid", rot: "d" },
  { id: "p79", x: 2380, y: 875, lbl1: "02A0715", lbl2: "02A0716", type: "mid", rot: "u" },
  { id: "p80", x: 2500, y: 875, lbl1: "02A0717", lbl2: "02A0718", type: "mid", rot: "u" },
  { id: "p81", x: 2620, y: 875, lbl1: "02A0723", lbl2: "02A0724", type: "end", rot: "u" }
];

const defaultCftv = [
  { id: "c_ap1", type: "ap", x: 980, y: 540, lbl: "02A0719", rot: 0 },
  { id: "c_ap2", type: "ap", x: 1960, y: 540, lbl: "02A0720", rot: 0 },
  { id: "c_cftv1", type: "cftv", x: 360, y: 90, lbl: "02A0721", rot: 0 },
  { id: "c_cftv2", type: "cftv", x: 360, y: 990, lbl: "02A0722", rot: 180 },
  { id: "c_cftv3", type: "cftv", x: 420, y: 540, lbl: "02A0723", rot: 0 },
  { id: "c_cftv4", type: "cftv", x: 2250, y: 540, lbl: "02A0801", rot: 0 },
  { id: "c_cftv5", type: "cftv", x: 2360, y: 420, lbl: "02A0802", rot: 180 },
  { id: "c_cftv6", type: "cftv", x: 2680, y: 420, lbl: "02A0803", rot: 180 },
  { id: "c_cftv7", type: "cftv", x: 2680, y: 930, lbl: "02A0724", rot: 180 }
];

const defaultPillars = [
  { id: "pil_1", type: "pillar-sq", x: 720, y: 480, rot: 0 },
  { id: "pil_2", type: "pillar-sq", x: 1200, y: 480, rot: 0 },
  { id: "pil_3", type: "pillar-sq", x: 1680, y: 480, rot: 0 },
  { id: "pil_4", type: "pillar-sq", x: 2160, y: 480, rot: 0 },
  { id: "pil_5", type: "pillar-sq", x: 720, y: 600, rot: 0 },
  { id: "pil_6", type: "pillar-sq", x: 1400, y: 600, rot: 0 },
  { id: "pil_7", type: "pillar-sq", x: 1920, y: 600, rot: 0 }
];

// ==========================================
// ESTADO GERAL DA APLICAÇÃO
// ==========================================
let points = [];
let rooms = [];
let furnitures = [];
let cftvs = [];
let pillars = [];
let walls = [];
let doors = [];
let rackData = { id: "rack_principal", x: 2500, y: 540 };
let selectedItemIds = new Set();
let clipboard = null;
let lastMouseSvg = { x: 1400, y: 550 };

const STORAGE_KEY_POINTS = 'dpe_pa_cad_points_v12';
const STORAGE_KEY_ROOMS = 'dpe_pa_cad_rooms_v12';
const STORAGE_KEY_FURN = 'dpe_pa_cad_furn_v12';
const STORAGE_KEY_CFTV = 'dpe_pa_cad_cftv_v12';
const STORAGE_KEY_PILLARS = 'dpe_pa_cad_pillars_v12';
const STORAGE_KEY_WALLS = 'dpe_pa_cad_walls_v12';
const STORAGE_KEY_DOORS = 'dpe_pa_cad_doors_v12';
const STORAGE_KEY_RACK = 'dpe_pa_cad_rack_v12';

// ==========================================
// HISTÓRICO (UNDO / REDO)
// ==========================================
const undoStack = [];
const redoStack = [];
const MAX_HISTORY = 40;

function pushHistory() {
  const state = {
    points: JSON.parse(JSON.stringify(points)),
    rooms: JSON.parse(JSON.stringify(rooms)),
    furnitures: JSON.parse(JSON.stringify(furnitures)),
    cftvs: JSON.parse(JSON.stringify(cftvs)),
    pillars: JSON.parse(JSON.stringify(pillars)),
    walls: JSON.parse(JSON.stringify(walls)),
    doors: JSON.parse(JSON.stringify(doors)),
    rack: JSON.parse(JSON.stringify(rackData))
  };
  undoStack.push(state);
  if (undoStack.length > MAX_HISTORY) undoStack.shift();
  redoStack.length = 0;
  updateHistoryButtons();
}

function undo() {
  if (undoStack.length === 0) return;
  const currentState = {
    points: JSON.parse(JSON.stringify(points)),
    rooms: JSON.parse(JSON.stringify(rooms)),
    furnitures: JSON.parse(JSON.stringify(furnitures)),
    cftvs: JSON.parse(JSON.stringify(cftvs)),
    pillars: JSON.parse(JSON.stringify(pillars)),
    walls: JSON.parse(JSON.stringify(walls)),
    doors: JSON.parse(JSON.stringify(doors)),
    rack: JSON.parse(JSON.stringify(rackData))
  };
  redoStack.push(currentState);
  const prevState = undoStack.pop();
  points = prevState.points;
  rooms = prevState.rooms;
  furnitures = prevState.furnitures || [];
  cftvs = prevState.cftvs || [];
  pillars = prevState.pillars || [];
  walls = prevState.walls || [];
  doors = prevState.doors || [];
  if (prevState.rack) rackData = prevState.rack;
  clearSelection();
  saveCurrentState();
  renderAll();
  updateHistoryButtons();
}

function redo() {
  if (redoStack.length === 0) return;
  const currentState = {
    points: JSON.parse(JSON.stringify(points)),
    rooms: JSON.parse(JSON.stringify(rooms)),
    furnitures: JSON.parse(JSON.stringify(furnitures)),
    cftvs: JSON.parse(JSON.stringify(cftvs)),
    pillars: JSON.parse(JSON.stringify(pillars)),
    walls: JSON.parse(JSON.stringify(walls)),
    doors: JSON.parse(JSON.stringify(doors)),
    rack: JSON.parse(JSON.stringify(rackData))
  };
  undoStack.push(currentState);
  const nextState = redoStack.pop();
  points = nextState.points;
  rooms = nextState.rooms;
  furnitures = nextState.furnitures || [];
  cftvs = nextState.cftvs || [];
  pillars = nextState.pillars || [];
  walls = nextState.walls || [];
  doors = nextState.doors || [];
  if (nextState.rack) rackData = nextState.rack;
  clearSelection();
  saveCurrentState();
  renderAll();
  updateHistoryButtons();
}

function updateHistoryButtons() {
  const btnUndo = document.getElementById('btn-undo');
  const btnRedo = document.getElementById('btn-redo');
  if (btnUndo) btnUndo.disabled = undoStack.length === 0;
  if (btnRedo) btnRedo.disabled = redoStack.length === 0;
}

// ==========================================
// ATALHOS DE TECLADO E CLIPBOARD
// ==========================================
window.addEventListener('keydown', (e) => {
  if (e.target.tagName === 'INPUT' || e.target.tagName === 'SELECT') return;

  if (e.key === 'Delete' || e.key === 'Backspace') {
    if (selectedItemIds.size > 0) {
      e.preventDefault();
      deleteSelectedItems();
    }
  }

  if (e.ctrlKey || e.metaKey) {
    if (e.key === 'c' || e.key === 'C') {
      e.preventDefault();
      copySelection();
    } else if (e.key === 'v' || e.key === 'V') {
      e.preventDefault();
      pasteClipboard(lastMouseSvg);
    } else if (e.key === 'd' || e.key === 'D') {
      e.preventDefault();
      duplicateSelectedItems();
    } else if (e.key === 'z' || e.key === 'Z') {
      if (e.shiftKey) { e.preventDefault(); redo(); }
      else { e.preventDefault(); undo(); }
    } else if (e.key === 'y' || e.key === 'Y') {
      e.preventDefault(); redo();
    }
  }
});

function copySelection() {
  if (selectedItemIds.size === 0) return;
  const selPoints = points.filter(p => selectedItemIds.has(p.id));
  const selFurn = furnitures.filter(f => selectedItemIds.has(f.id));
  const selCftv = cftvs.filter(c => selectedItemIds.has(c.id));
  const selPillars = pillars.filter(pil => selectedItemIds.has(pil.id));
  const selDoors = doors.filter(dr => selectedItemIds.has(dr.id));

  clipboard = {
    points: JSON.parse(JSON.stringify(selPoints)),
    furnitures: JSON.parse(JSON.stringify(selFurn)),
    cftvs: JSON.parse(JSON.stringify(selCftv)),
    pillars: JSON.parse(JSON.stringify(selPillars)),
    doors: JSON.parse(JSON.stringify(selDoors))
  };
}

function pasteClipboard(targetPos) {
  if (!clipboard) return;
  pushHistory();

  let sumX = 0, sumY = 0, total = 0;
  const allItems = [...clipboard.points, ...clipboard.furnitures, ...clipboard.cftvs, ...clipboard.pillars, ...clipboard.doors];
  if (allItems.length === 0) return;

  allItems.forEach(i => { sumX += i.x; sumY += i.y; total++; });
  const centerX = sumX / total;
  const centerY = sumY / total;

  const offX = Math.round(targetPos.x - centerX);
  const offY = Math.round(targetPos.y - centerY);

  selectedItemIds.clear();

  clipboard.points.forEach(p => {
    const cloned = JSON.parse(JSON.stringify(p));
    cloned.id = "p_" + Date.now() + "_" + Math.random().toString(36).substr(2, 4);
    cloned.x += offX; cloned.y += offY;
    points.push(cloned);
    selectedItemIds.add(cloned.id);
  });

  clipboard.furnitures.forEach(f => {
    const cloned = JSON.parse(JSON.stringify(f));
    cloned.id = "f_" + Date.now() + "_" + Math.random().toString(36).substr(2, 4);
    cloned.x += offX; cloned.y += offY;
    furnitures.push(cloned);
    selectedItemIds.add(cloned.id);
  });

  clipboard.cftvs.forEach(c => {
    const cloned = JSON.parse(JSON.stringify(c));
    cloned.id = "c_" + Date.now() + "_" + Math.random().toString(36).substr(2, 4);
    cloned.x += offX; cloned.y += offY;
    cftvs.push(cloned);
    selectedItemIds.add(cloned.id);
  });

  clipboard.pillars.forEach(pil => {
    const cloned = JSON.parse(JSON.stringify(pil));
    cloned.id = "pil_" + Date.now() + "_" + Math.random().toString(36).substr(2, 4);
    cloned.x += offX; cloned.y += offY;
    pillars.push(cloned);
    selectedItemIds.add(cloned.id);
  });

  clipboard.doors.forEach(dr => {
    const cloned = JSON.parse(JSON.stringify(dr));
    cloned.id = "dr_" + Date.now() + "_" + Math.random().toString(36).substr(2, 4);
    cloned.x += offX; cloned.y += offY;
    doors.push(cloned);
    selectedItemIds.add(cloned.id);
  });

  saveCurrentState();
  renderAll();
}

function duplicateSelectedItems() {
  if (selectedItemIds.size === 0) return;
  copySelection();
  pasteClipboard({ x: lastMouseSvg.x + 40, y: lastMouseSvg.y + 40 });
}

// ==========================================
// PERSISTÊNCIA LOCAL (LOCAL STORAGE)
// ==========================================
function loadData() {
  const savedPoints = localStorage.getItem(STORAGE_KEY_POINTS);
  const savedRooms = localStorage.getItem(STORAGE_KEY_ROOMS);
  const savedFurn = localStorage.getItem(STORAGE_KEY_FURN);
  const savedCftv = localStorage.getItem(STORAGE_KEY_CFTV);
  const savedPillars = localStorage.getItem(STORAGE_KEY_PILLARS);
  const savedWalls = localStorage.getItem(STORAGE_KEY_WALLS);
  const savedDoors = localStorage.getItem(STORAGE_KEY_DOORS);
  const savedRack = localStorage.getItem(STORAGE_KEY_RACK);

  points = savedPoints ? JSON.parse(savedPoints) : JSON.parse(JSON.stringify(defaultPoints));
  rooms = savedRooms ? JSON.parse(savedRooms) : JSON.parse(JSON.stringify(defaultRooms));
  furnitures = savedFurn ? JSON.parse(savedFurn) : JSON.parse(JSON.stringify(defaultFurnitures));
  cftvs = savedCftv ? JSON.parse(savedCftv) : JSON.parse(JSON.stringify(defaultCftv));
  pillars = savedPillars ? JSON.parse(savedPillars) : JSON.parse(JSON.stringify(defaultPillars));
  walls = savedWalls ? JSON.parse(savedWalls) : JSON.parse(JSON.stringify(defaultWalls));
  doors = savedDoors ? JSON.parse(savedDoors) : JSON.parse(JSON.stringify(defaultDoors));
  if (savedRack) {
    try { rackData = JSON.parse(savedRack); } catch(e){}
  }
  renderAll();
}

function saveCurrentState() {
  localStorage.setItem(STORAGE_KEY_POINTS, JSON.stringify(points));
  localStorage.setItem(STORAGE_KEY_ROOMS, JSON.stringify(rooms));
  localStorage.setItem(STORAGE_KEY_FURN, JSON.stringify(furnitures));
  localStorage.setItem(STORAGE_KEY_CFTV, JSON.stringify(cftvs));
  localStorage.setItem(STORAGE_KEY_PILLARS, JSON.stringify(pillars));
  localStorage.setItem(STORAGE_KEY_WALLS, JSON.stringify(walls));
  localStorage.setItem(STORAGE_KEY_DOORS, JSON.stringify(doors));
  localStorage.setItem(STORAGE_KEY_RACK, JSON.stringify(rackData));
  updateAudit();
}

// ==========================================
// RENDERIZAÇÃO GERAL E RACK MÓVEL
// ==========================================
function renderRack() {
  const layer = document.getElementById('layer-rack-movel');
  if (!layer) return;
  layer.innerHTML = '';

  const g = document.createElementNS("http://www.w3.org/2000/svg", "g");
  g.setAttribute("id", rackData.id);
  g.setAttribute("transform", `translate(${rackData.x}, ${rackData.y})`);
  g.setAttribute("style", "cursor: move;");

  g.innerHTML = `
    <rect x="-80" y="-45" width="160" height="90" fill="#1e293b" stroke="#0284c7" stroke-width="3" rx="4"/>
    <text x="0" y="-5" font-size="13.5" font-weight="900" fill="#38bdf8" text-anchor="middle">RACK A (44U)</text>
    <text x="0" y="15" font-size="9.5" font-weight="700" fill="#94a3b8" text-anchor="middle">171 CABOS CONVERGENTES</text>
    <rect x="-15" y="-65" width="30" height="20" fill="#cbd5e1" stroke="#475569" stroke-width="1.5"/>
  `;

  g.addEventListener('mousedown', (e) => onElementMouseDown(e, rackData, 'rack'));
  layer.appendChild(g);
}

function renderAll() {
  if (typeof renderDoors === 'function') renderDoors();
  if (typeof renderWalls === 'function') renderWalls();
  if (typeof renderPillars === 'function') renderPillars();
  if (typeof renderRooms === 'function') renderRooms();
  if (typeof renderFurnitures === 'function') renderFurnitures();
  if (typeof renderPoints === 'function') renderPoints();
  if (typeof renderCftvs === 'function') renderCftvs();
  renderRack();
  if (typeof renderAutoFlow === 'function') renderAutoFlow();
  if (typeof updateSelectionVisuals === 'function') updateSelectionVisuals();
}

function updateSelectionVisuals() {
  document.querySelectorAll('.point-item, .furn-item, .cftv-item, .pillar-item, .wall-item, .door-item').forEach(el => {
    if (typeof selectedItemIds !== 'undefined' && selectedItemIds.has(el.id)) {
      el.classList.add('selected-item');
    } else {
      el.classList.remove('selected-item');
    }
  });
  const btnDelSel = document.getElementById('btn-delete-selected');
  const btnDupSel = document.getElementById('btn-duplicate');
  const count = typeof selectedItemIds !== 'undefined' ? selectedItemIds.size : 0;
  if (count > 0) {
    if (btnDelSel) {
      btnDelSel.style.display = 'inline-flex';
      btnDelSel.textContent = `Excluir Selecionados (${count})`;
    }
    if (btnDupSel) btnDupSel.style.display = 'inline-flex';
  } else {
    if (btnDelSel) btnDelSel.style.display = 'none';
    if (btnDupSel) btnDupSel.style.display = 'none';
  }
}

function resetToDefault() {
  if (confirm("Deseja restaurar todos os elementos (portas, paredes, móveis, pontos e salas) para a posição original de projeto?")) {
    pushHistory();
    points = JSON.parse(JSON.stringify(defaultPoints));
    rooms = JSON.parse(JSON.stringify(defaultRooms));
    furnitures = JSON.parse(JSON.stringify(defaultFurnitures));
    cftvs = JSON.parse(JSON.stringify(defaultCftv));
    pillars = JSON.parse(JSON.stringify(defaultPillars));
    walls = JSON.parse(JSON.stringify(defaultWalls));
    doors = JSON.parse(JSON.stringify(defaultDoors));
    rackData = { id: "rack_principal", x: 2500, y: 540 };
    clearSelection();
    saveCurrentState();
    renderAll();
  }
}

// ==========================================
// BUSCA E LOCALIZAÇÃO DE PONTOS
// ==========================================
const layerSearchTarget = document.getElementById('layer-search-target');
let toastTimeout = null;

function showToast(msg) {
  const toast = document.getElementById('toast-msg');
  if (!toast) return;
  toast.textContent = msg;
  toast.style.display = 'block';
  clearTimeout(toastTimeout);
  toastTimeout = setTimeout(() => {
    toast.style.display = 'none';
  }, 3500);
}

function handleSearchKey(e) {
  if (e.key === 'Enter') {
    searchAndLocatePoint();
  }
}

function searchAndLocatePoint() {
  const query = document.getElementById('input-point-search').value.trim().toUpperCase();
  layerSearchTarget.innerHTML = '';

  if (!query) {
    showToast("Digite o código do ponto ou dispositivo para buscar.");
    return;
  }

  let found = points.find(p => 
    (p.lbl1 && p.lbl1.toUpperCase() === query) || 
    (p.lbl2 && p.lbl2.toUpperCase() === query)
  );

  if (!found) {
    found = points.find(p => 
      (p.lbl1 && p.lbl1.toUpperCase().includes(query)) || 
      (p.lbl2 && p.lbl2.toUpperCase().includes(query))
    );
  }

  if (!found) {
    found = cftvs.find(c => (c.lbl && c.lbl.toUpperCase() === query) || (c.lbl && c.lbl.toUpperCase().includes(query)));
  }

  if (found) {
    scale = 2.8;
    const rect = svg.getBoundingClientRect();
    const screenMidX = rect.width / 2;
    const screenMidY = rect.height / 2;
    const targetSvgX = found.x * (rect.width / 2800);
    const targetSvgY = found.y * (rect.height / 1100);

    pointX = screenMidX - (targetSvgX * scale);
    pointY = screenMidY - (targetSvgY * scale);
    updateTransform();

    const halo = document.createElementNS("http://www.w3.org/2000/svg", "circle");
    halo.setAttribute("cx", found.x);
    halo.setAttribute("cy", found.y);
    halo.setAttribute("class", "search-target-halo");
    layerSearchTarget.appendChild(halo);

    selectedItemIds.clear();
    selectedItemIds.add(found.id);
    updateSelectionVisuals();

    setTimeout(() => {
      layerSearchTarget.innerHTML = '';
    }, 5000);

  } else {
    showToast(`O ponto "${query}" não está na planta!`);
  }
}

// ==========================================
// RENDERIZAR CAMADAS ESPECÍFICAS
// ==========================================
const layerDoorsAll = document.getElementById('layer-doors-all');
function renderDoors() {
  if (!layerDoorsAll) return;
  layerDoorsAll.innerHTML = '';
  doors.forEach(dr => {
    const g = document.createElementNS("http://www.w3.org/2000/svg", "g");
    g.setAttribute("class", "door-item" + (selectedItemIds.has(dr.id) ? " selected-item" : ""));
    g.setAttribute("id", dr.id);
    g.setAttribute("transform", `translate(${dr.x}, ${dr.y})`);

    const s = dr.size || 55;
    let leafX = 0, leafY = -s;
    let arcPath = `M 0 -${s} A ${s} ${s} 0 0 1 ${s} 0`;

    switch(dr.type) {
      case 'up-left':
        leafX = 0; leafY = -s;
        arcPath = `M 0 -${s} A ${s} ${s} 0 0 0 -${s} 0`;
        break;
      case 'up-right':
        leafX = 0; leafY = -s;
        arcPath = `M 0 -${s} A ${s} ${s} 0 0 1 ${s} 0`;
        break;
      case 'down-left':
        leafX = 0; leafY = s;
        arcPath = `M 0 ${s} A ${s} ${s} 0 0 1 -${s} 0`;
        break;
      case 'down-right':
        leafX = 0; leafY = s;
        arcPath = `M 0 ${s} A ${s} ${s} 0 0 0 ${s} 0`;
        break;
      case 'left-down':
        leafX = -s; leafY = 0;
        arcPath = `M -${s} 0 A ${s} ${s} 0 0 1 0 ${s}`;
        break;
      case 'right-down':
        leafX = s; leafY = 0;
        arcPath = `M ${s} 0 A ${s} ${s} 0 0 0 0 ${s}`;
        break;
      default:
        leafX = 0; leafY = -s;
        arcPath = `M 0 -${s} A ${s} ${s} 0 0 1 ${s} 0`;
    }

    const leaf = document.createElementNS("http://www.w3.org/2000/svg", "line");
    leaf.setAttribute("x1", 0); leaf.setAttribute("y1", 0);
    leaf.setAttribute("x2", leafX); leaf.setAttribute("y2", leafY);
    leaf.setAttribute("class", "door-leaf-line");
    g.appendChild(leaf);

    const swing = document.createElementNS("http://www.w3.org/2000/svg", "path");
    swing.setAttribute("d", arcPath);
    swing.setAttribute("class", "door-swing-arc");
    g.appendChild(swing);

    const pivot = document.createElementNS("http://www.w3.org/2000/svg", "circle");
    pivot.setAttribute("cx", 0); pivot.setAttribute("cy", 0);
    pivot.setAttribute("r", 3.5); pivot.setAttribute("class", "door-pivot");
    g.appendChild(pivot);

    g.addEventListener('mousedown', (e) => onElementMouseDown(e, dr, 'door'));
    g.addEventListener('click', (e) => onDoorClick(e, dr));

    layerDoorsAll.appendChild(g);
  });
  updateAudit();
}

const layerWallsDynamic = document.getElementById('layer-walls-dynamic');
function renderWalls() {
  if (!layerWallsDynamic) return;
  layerWallsDynamic.innerHTML = '';
  walls.forEach(w => {
    const g = document.createElementNS("http://www.w3.org/2000/svg", "g");
    g.setAttribute("class", "wall-item" + (selectedItemIds.has(w.id) ? " selected-item" : ""));
    g.setAttribute("id", w.id);

    const line = document.createElementNS("http://www.w3.org/2000/svg", "line");
    line.setAttribute("x1", w.x1); line.setAttribute("y1", w.y1);
    line.setAttribute("x2", w.x2); line.setAttribute("y2", w.y2);
    line.setAttribute("class", "editable-wall-line");
    g.appendChild(line);

    const h1 = document.createElementNS("http://www.w3.org/2000/svg", "circle");
    h1.setAttribute("cx", w.x1); h1.setAttribute("cy", w.y1);
    h1.setAttribute("r", 7); h1.setAttribute("class", "wall-handle");
    g.appendChild(h1);

    const h2 = document.createElementNS("http://www.w3.org/2000/svg", "circle");
    h2.setAttribute("cx", w.x2); h2.setAttribute("cy", w.y2);
    h2.setAttribute("r", 7); h2.setAttribute("class", "wall-handle");
    g.appendChild(h2);

    line.addEventListener('mousedown', (e) => onElementMouseDown(e, w, 'wall'));
    h1.addEventListener('mousedown', (e) => onWallHandleMouseDown(e, w, 'p1'));
    h2.addEventListener('mousedown', (e) => onWallHandleMouseDown(e, w, 'p2'));

    layerWallsDynamic.appendChild(g);
  });
  updateAudit();
}

const layerPillarsAll = document.getElementById('layer-pillars-all');
function renderPillars() {
  if (!layerPillarsAll) return;
  layerPillarsAll.innerHTML = '';
  pillars.forEach(pil => {
    const g = document.createElementNS("http://www.w3.org/2000/svg", "g");
    g.setAttribute("class", "pillar-item" + (selectedItemIds.has(pil.id) ? " selected-item" : ""));
    g.setAttribute("id", pil.id);
    g.setAttribute("transform", `translate(${pil.x}, ${pil.y}) rotate(${pil.rot || 0})`);

    const use = document.createElementNS("http://www.w3.org/2000/svg", "use");
    use.setAttribute("href", `#${pil.type}`);
    g.appendChild(use);

    g.addEventListener('mousedown', (e) => onElementMouseDown(e, pil, 'pillar'));
    g.addEventListener('click', (e) => onPillarClick(e, pil));

    layerPillarsAll.appendChild(g);
  });
}

const layerCftvAll = document.getElementById('layer-cftv-all');
function renderCftvs() {
  if (!layerCftvAll) return;
  layerCftvAll.innerHTML = '';
  cftvs.forEach(c => {
    const g = document.createElementNS("http://www.w3.org/2000/svg", "g");
    g.setAttribute("class", "cftv-item" + (selectedItemIds.has(c.id) ? " selected-item" : ""));
    g.setAttribute("id", c.id);
    g.setAttribute("transform", `translate(${c.x}, ${c.y})`);

    const isAp = c.type === 'ap';
    const sym = document.createElementNS("http://www.w3.org/2000/svg", "use");
    sym.setAttribute("href", isAp ? "#sym-ap" : "#sym-cftv");
    sym.setAttribute("transform", `rotate(${c.rot || 0})`);
    g.appendChild(sym);

    const box = document.createElementNS("http://www.w3.org/2000/svg", "rect");
    const w = isAp ? 84 : 96;
    box.setAttribute("x", -w/2); box.setAttribute("y", 15);
    box.setAttribute("width", w); box.setAttribute("height", 20);
    box.setAttribute("class", "tag-box");
    box.setAttribute("style", isAp ? "stroke:#9333ea; fill:#faf5ff;" : "stroke:#dc2626; fill:#fef2f2;");
    g.appendChild(box);

    const txt = document.createElementNS("http://www.w3.org/2000/svg", "text");
    txt.setAttribute("x", 0); txt.setAttribute("y", 25);
    txt.setAttribute("class", "tag-num");
    txt.setAttribute("style", isAp ? "fill:#6b21a8;" : "fill:#dc2626;");
    txt.textContent = (isAp ? "AP " : "CFTV ") + c.lbl;
    g.appendChild(txt);

    g.addEventListener('mousedown', (e) => onElementMouseDown(e, c, 'cftv'));
    g.addEventListener('click', (e) => onCftvClick(e, c));

    layerCftvAll.appendChild(g);
  });
  updateAudit();
}

const layerFurnAll = document.getElementById('layer-furniture-all');
function renderFurnitures() {
  if (!layerFurnAll) return;
  layerFurnAll.innerHTML = '';
  furnitures.forEach(f => {
    const g = document.createElementNS("http://www.w3.org/2000/svg", "g");
    g.setAttribute("class", "furn-item" + (selectedItemIds.has(f.id) ? " selected-item" : ""));
    g.setAttribute("id", f.id);
    g.setAttribute("transform", `translate(${f.x}, ${f.y}) rotate(${f.rot || 0})`);

    const use = document.createElementNS("http://www.w3.org/2000/svg", "use");
    use.setAttribute("href", `#${f.type}`);
    g.appendChild(use);

    g.addEventListener('mousedown', (e) => onElementMouseDown(e, f, 'furn'));
    g.addEventListener('click', (e) => onFurnClick(e, f));

    layerFurnAll.appendChild(g);
  });
}

const layerRooms = document.getElementById('layer-rooms');
function renderRooms() {
  if (!layerRooms) return;
  layerRooms.innerHTML = '';
  rooms.forEach(r => {
    const g = document.createElementNS("http://www.w3.org/2000/svg", "g");
    g.setAttribute("class", "room-text-item");
    g.setAttribute("id", r.id);
    g.setAttribute("transform", `translate(${r.x}, ${r.y})`);

    const tName = document.createElementNS("http://www.w3.org/2000/svg", "text");
    tName.setAttribute("x", 0); tName.setAttribute("y", 0);
    tName.setAttribute("font-size", r.nameSize || 16);
    tName.setAttribute("font-weight", "800");
    tName.setAttribute("fill", "#0f172a");
    tName.setAttribute("text-anchor", "middle");
    tName.textContent = r.name;
    g.appendChild(tName);

    if (r.desc && r.desc.trim().length > 0) {
      const tDesc = document.createElementNS("http://www.w3.org/2000/svg", "text");
      tDesc.setAttribute("x", 0);
      tDesc.setAttribute("y", (r.nameSize || 16) * 1.1);
      tDesc.setAttribute("font-size", r.descSize || 10);
      tDesc.setAttribute("font-weight", "600");
      tDesc.setAttribute("fill", "#64748b");
      tDesc.setAttribute("text-anchor", "middle");
      tDesc.textContent = r.desc;
      g.appendChild(tDesc);
    }

    g.addEventListener('mousedown', (e) => onElementMouseDown(e, r, 'room'));
    g.addEventListener('click', (e) => onRoomClick(e, r));

    layerRooms.appendChild(g);
  });
}

const layerPoints = document.getElementById('layer-points');
function renderPoints() {
  if (!layerPoints) return;
  layerPoints.innerHTML = '';
  points.forEach(p => {
    const g = document.createElementNS("http://www.w3.org/2000/svg", "g");
    g.setAttribute("class", "point-item" + (selectedItemIds.has(p.id) ? " selected-item" : ""));
    g.setAttribute("id", p.id);
    g.setAttribute("transform", `translate(${p.x}, ${p.y})`);

    const sym = document.createElementNS("http://www.w3.org/2000/svg", "use");
    sym.setAttribute("href", `#rj45-${p.rot || 'r'}`);
    g.appendChild(sym);

    const hasTwo = p.lbl2 && p.lbl2.trim().length > 0;
    const isPrefix = p.type === 'start' ? 'INÍCIO: ' : (p.type === 'end' ? 'FIM: ' : '');
    const boxClass = p.type === 'start' ? 'tag-box-start' : (p.type === 'end' ? 'tag-box-end' : 'tag-box');
    const textClass = p.type === 'start' ? 'tag-num-start' : (p.type === 'end' ? 'tag-num-end' : 'tag-num');

    const box = document.createElementNS("http://www.w3.org/2000/svg", "rect");
    const w = Math.max(76, (isPrefix.length + Math.max(p.lbl1.length, (p.lbl2||'').length)) * 7 + 10);
    const h = hasTwo ? 26 : 18;
    box.setAttribute("x", -w/2); box.setAttribute("y", -h/2);
    box.setAttribute("width", w); box.setAttribute("height", h);
    box.setAttribute("class", boxClass);
    g.appendChild(box);

    if (hasTwo) {
      const t1 = document.createElementNS("http://www.w3.org/2000/svg", "text");
      t1.setAttribute("x", 0); t1.setAttribute("y", -3.5);
      t1.setAttribute("class", textClass);
      t1.textContent = (p.type === 'start' ? 'INÍCIO: ' : '') + p.lbl1;
      g.appendChild(t1);

      const t2 = document.createElementNS("http://www.w3.org/2000/svg", "text");
      t2.setAttribute("x", 0); t2.setAttribute("y", 7.5);
      t2.setAttribute("class", p.type === 'end' ? 'tag-num-end' : 'tag-num');
      t2.textContent = (p.type === 'end' ? 'FIM: ' : '') + p.lbl2;
      g.appendChild(t2);
    } else {
      const t1 = document.createElementNS("http://www.w3.org/2000/svg", "text");
      t1.setAttribute("x", 0); t1.setAttribute("y", 0);
      t1.setAttribute("class", textClass);
      t1.textContent = isPrefix + p.lbl1;
      g.appendChild(t1);
    }

    g.addEventListener('mousedown', (e) => onElementMouseDown(e, p, 'point'));
    g.addEventListener('click', (e) => onPointClick(e, p));

    layerPoints.appendChild(g);
  });
  updateAudit();
}

// ==========================================
// CONTROLE DE MODOS E ARRASTE
// ==========================================
let isEditMode = false;
let isAddPointMode = false;
let isAddFurnMode = false;
let isAddCftvMode = false;
let isAddPillarMode = false;
let isAddWallMode = false;
let isAddDoorMode = false;
let isSelectMode = false;

let pendingFurnType = null;
let pendingFurnRot = 0;
let pendingCftvType = 'cftv';
let pendingCftvLbl = '';
let pendingCftvRot = 0;
let pendingPillarType = 'pillar-sq';
let pendingPillarRot = 0;
let pendingWallOrient = 'v';
let pendingWallLen = 400;
let pendingDoorType = 'up-right';
let pendingDoorSize = 55;

let isSelecting = false;
let selectStartSvg = { x: 0, y: 0 };
const selectionRect = document.getElementById('selection-rect');

let activeWall = null;
let activeHandle = null;

function onWallHandleMouseDown(e, wall, handleName) {
  if (!isEditMode) return;
  e.stopPropagation();
  pushHistory();
  activeWall = wall;
  activeHandle = handleName;
}

function toggleSelectMode() {
  isSelectMode = !isSelectMode;
  const btn = document.getElementById('btn-mode-select');
  const vPort = document.getElementById('viewport-container');
  if (btn) btn.classList.toggle('select-active', isSelectMode);
  if (vPort) vPort.classList.toggle('select-mode', isSelectMode);
  if (isSelectMode) {
    if (isEditMode) toggleEditMode();
    if (isAddPointMode) toggleAddMode();
    if (isAddFurnMode && typeof cancelAddFurnMode === 'function') cancelAddFurnMode();
    if (isAddCftvMode && typeof cancelAddCftvMode === 'function') cancelAddCftvMode();
    if (isAddPillarMode && typeof cancelAddPillarMode === 'function') cancelAddPillarMode();
    if (isAddWallMode && typeof cancelAddWallMode === 'function') cancelAddWallMode();
    if (isAddDoorMode && typeof cancelAddDoorMode === 'function') cancelAddDoorMode();
  } else {
    clearSelection();
  }
}

function clearSelection() {
  if (typeof selectedItemIds !== 'undefined') {
    selectedItemIds.clear();
  }
  updateSelectionVisuals();
}

function deleteSelectedItems() {
  if (!selectedItemIds || selectedItemIds.size === 0) return;
  if (confirm(`Deseja excluir os ${selectedItemIds.size} itens selecionados?`)) {
    pushHistory();
    points = points.filter(p => !selectedItemIds.has(p.id));
    furnitures = furnitures.filter(f => !selectedItemIds.has(f.id));
    cftvs = cftvs.filter(c => !selectedItemIds.has(c.id));
    pillars = pillars.filter(pil => !selectedItemIds.has(pil.id));
    walls = walls.filter(w => !selectedItemIds.has(w.id));
    doors = doors.filter(dr => !selectedItemIds.has(dr.id));
    clearSelection();
    saveCurrentState();
    renderAll();
  }
}

function toggleEditMode() {
  isEditMode = !isEditMode;
  const btn = document.getElementById('btn-mode-edit');
  if (btn) btn.classList.toggle('active', isEditMode);
  if (isEditMode) {
    if (isAddPointMode) toggleAddMode();
    if (isAddFurnMode && typeof cancelAddFurnMode === 'function') cancelAddFurnMode();
    if (isAddCftvMode && typeof cancelAddCftvMode === 'function') cancelAddCftvMode();
    if (isAddPillarMode && typeof cancelAddPillarMode === 'function') cancelAddPillarMode();
    if (isAddWallMode && typeof cancelAddWallMode === 'function') cancelAddWallMode();
    if (isAddDoorMode && typeof cancelAddDoorMode === 'function') cancelAddDoorMode();
    if (isSelectMode) toggleSelectMode();
  }
}

function toggleAddMode() {
  isAddPointMode = !isAddPointMode;
  const btn = document.getElementById('btn-mode-add');
  const vPort = document.getElementById('viewport-container');
  if (btn) btn.classList.toggle('active', isAddPointMode);
  if (vPort) vPort.classList.toggle('add-mode', isAddPointMode);
  if (isAddPointMode) {
    if (isEditMode) toggleEditMode();
    if (isAddFurnMode && typeof cancelAddFurnMode === 'function') cancelAddFurnMode();
    if (isAddCftvMode && typeof cancelAddCftvMode === 'function') cancelAddCftvMode();
    if (isAddPillarMode && typeof cancelAddPillarMode === 'function') cancelAddPillarMode();
    if (isAddWallMode && typeof cancelAddWallMode === 'function') cancelAddWallMode();
    if (isAddDoorMode && typeof cancelAddDoorMode === 'function') cancelAddDoorMode();
    if (isSelectMode) toggleSelectMode();
  }
}

function updateAudit() {
  let count = 0;
  points.forEach(p => {
    count += (p.lbl2 && p.lbl2.trim().length > 0) ? 2 : 1;
  });
  const cftvCount = cftvs.filter(c => c.type === 'cftv').length;
  const stPts = document.getElementById('stat-points');
  const stCab = document.getElementById('stat-cables');
  const stDrs = document.getElementById('stat-doors');
  const stWls = document.getElementById('stat-walls');
  if (stPts) stPts.textContent = points.length + " caixas";
  if (stCab) stCab.textContent = (count + cftvCount + 2) + " UTP";
  if (stDrs) stDrs.textContent = doors.length + " portas";
  if (stWls) stWls.textContent = walls.length + " paredes";
}

// ==========================================
// MODAIS E CRIAÇÃO DE ELEMENTOS
// ==========================================
let editingDoor = null;
function openAddDoorModal() {
  editingDoor = null;
  document.getElementById('door-modal-title').textContent = "Adicionar Porta";
  document.getElementById('door-modal-type').value = "up-right";
  document.getElementById('door-modal-size').value = "55";
  document.getElementById('btn-del-door').style.display = "none";
  document.getElementById('btn-save-door').textContent = "Posicionar Porta";
  document.getElementById('door-modal').style.display = "block";
}
function closeDoorModal() {
  document.getElementById('door-modal').style.display = "none";
  editingDoor = null;
}
function confirmAddDoorPlacement() {
  if (editingDoor) {
    pushHistory();
    editingDoor.type = document.getElementById('door-modal-type').value;
    editingDoor.size = parseInt(document.getElementById('door-modal-size').value, 10) || 55;
    saveCurrentState();
    renderDoors();
    closeDoorModal();
    return;
  }

  pendingDoorType = document.getElementById('door-modal-type').value;
  pendingDoorSize = parseInt(document.getElementById('door-modal-size').value, 10) || 55;
  closeDoorModal();

  isAddDoorMode = true;
  document.getElementById('btn-mode-adddoor').classList.add('active');
  document.getElementById('viewport-container').classList.add('add-mode');
  if (isEditMode) toggleEditMode();
  if (isAddPointMode) toggleAddMode();
  if (isSelectMode) toggleSelectMode();
}
function cancelAddDoorMode() {
  isAddDoorMode = false;
  document.getElementById('btn-mode-adddoor').classList.remove('active');
  document.getElementById('viewport-container').classList.remove('add-mode');
}
function onDoorClick(e, dr) {
  if (isSelectMode) {
    e.stopPropagation();
    if (selectedItemIds.has(dr.id)) selectedItemIds.delete(dr.id);
    else selectedItemIds.add(dr.id);
    updateSelectionVisuals();
    return;
  }
  if (hasMoved) return;
  e.stopPropagation();
  editingDoor = dr;
  document.getElementById('door-modal-title').textContent = "Editar Porta";
  document.getElementById('door-modal-type').value = dr.type || "up-right";
  document.getElementById('door-modal-size').value = dr.size || 55;
  document.getElementById('btn-del-door').style.display = "inline-flex";
  document.getElementById('btn-save-door').textContent = "Salvar Alterações";
  document.getElementById('door-modal').style.display = "block";
}
function deleteCurrentDoor() {
  if (!editingDoor) return;
  if (confirm("Deseja excluir esta porta da planta?")) {
    pushHistory();
    doors = doors.filter(d => d.id !== editingDoor.id);
    saveCurrentState();
    renderDoors();
    closeDoorModal();
  }
}

function openAddWallModal() {
  document.getElementById('wall-modal').style.display = 'block';
}
function closeWallModal() {
  document.getElementById('wall-modal').style.display = 'none';
}
function confirmAddWallPlacement() {
  pendingWallOrient = document.getElementById('wall-modal-orient').value;
  pendingWallLen = parseInt(document.getElementById('wall-modal-len').value, 10) || 400;
  closeWallModal();

  isAddWallMode = true;
  document.getElementById('btn-mode-addwall').classList.add('active');
  document.getElementById('viewport-container').classList.add('add-mode');
  if (isEditMode) toggleEditMode();
  if (isAddPointMode) toggleAddMode();
  if (isSelectMode) toggleSelectMode();
}
function cancelAddWallMode() {
  isAddWallMode = false;
  document.getElementById('btn-mode-addwall').classList.remove('active');
  document.getElementById('viewport-container').classList.remove('add-mode');
}

function openAddFurnCatalog() {
  document.getElementById('furn-modal').style.display = 'block';
  updateFurnPreview();
}
function closeFurnModal() {
  document.getElementById('furn-modal').style.display = 'none';
}
function updateFurnPreview() {
  const type = document.getElementById('furn-modal-type').value;
  const rot = document.getElementById('furn-modal-rot').value;
  const target = document.getElementById('preview-target');
  target.innerHTML = '';
  const use = document.createElementNS("http://www.w3.org/2000/svg", "use");
  use.setAttribute("href", `#${type}`);
  use.setAttribute("transform", `rotate(${rot})`);
  target.appendChild(use);
}

const ghostPreview = document.getElementById('ghost-preview');
const ghostUse = document.getElementById('ghost-use');

function confirmAddFurnPlacement() {
  pendingFurnType = document.getElementById('furn-modal-type').value;
  pendingFurnRot = parseInt(document.getElementById('furn-modal-rot').value, 10) || 0;
  closeFurnModal();

  isAddFurnMode = true;
  document.getElementById('btn-mode-furn').classList.add('active');
  document.getElementById('viewport-container').classList.add('add-mode');
  ghostUse.setAttribute('href', `#${pendingFurnType}`);
  ghostPreview.style.display = 'inline';

  if (isEditMode) toggleEditMode();
  if (isAddPointMode) toggleAddMode();
  if (isAddCftvMode) cancelAddCftvMode();
  if (isAddPillarMode) cancelAddPillarMode();
  if (isAddWallMode) cancelAddWallMode();
  if (isAddDoorMode) cancelAddDoorMode();
  if (isSelectMode) toggleSelectMode();
}
function cancelAddFurnMode() {
  isAddFurnMode = false;
  pendingFurnType = null;
  ghostPreview.style.display = 'none';
  document.getElementById('btn-mode-furn').classList.remove('active');
  document.getElementById('viewport-container').classList.remove('add-mode');
}

let editingPillar = null;
function openAddPillarModal() {
  editingPillar = null;
  document.getElementById('pillar-modal-title').textContent = "Adicionar Coluna / Elemento";
  document.getElementById('pillar-modal-type').value = 'pillar-sq';
  document.getElementById('pillar-modal-rot').value = '0';
  document.getElementById('btn-del-pillar').style.display = 'none';
  document.getElementById('btn-save-pillar').textContent = "Posicionar na Planta";
  document.getElementById('pillar-modal').style.display = 'block';
}
function closePillarModal() {
  document.getElementById('pillar-modal').style.display = 'none';
  editingPillar = null;
}
function confirmAddPillarPlacement() {
  if (editingPillar) {
    pushHistory();
    editingPillar.type = document.getElementById('pillar-modal-type').value;
    editingPillar.rot = parseInt(document.getElementById('pillar-modal-rot').value, 10) || 0;
    saveCurrentState();
    renderPillars();
    closePillarModal();
    return;
  }

  pendingPillarType = document.getElementById('pillar-modal-type').value;
  pendingPillarRot = parseInt(document.getElementById('pillar-modal-rot').value, 10) || 0;
  closePillarModal();

  isAddPillarMode = true;
  document.getElementById('btn-mode-pillar').classList.add('active');
  document.getElementById('viewport-container').classList.add('add-mode');
  ghostUse.setAttribute('href', `#${pendingPillarType}`);
  ghostPreview.style.display = 'inline';

  if (isEditMode) toggleEditMode();
  if (isAddPointMode) toggleAddMode();
  if (isAddFurnMode) cancelAddFurnMode();
  if (isAddCftvMode) cancelAddCftvMode();
  if (isAddWallMode) cancelAddWallMode();
  if (isAddDoorMode) cancelAddDoorMode();
  if (isSelectMode) toggleSelectMode();
}
function cancelAddPillarMode() {
  isAddPillarMode = false;
  ghostPreview.style.display = 'none';
  document.getElementById('btn-mode-pillar').classList.remove('active');
  document.getElementById('viewport-container').classList.remove('add-mode');
}
function onPillarClick(e, pil) {
  if (isSelectMode) {
    e.stopPropagation();
    if (selectedItemIds.has(pil.id)) selectedItemIds.delete(pil.id);
    else selectedItemIds.add(pil.id);
    updateSelectionVisuals();
    return;
  }
  if (hasMoved) return;
  e.stopPropagation();
  editingPillar = pil;
  document.getElementById('pillar-modal-title').textContent = "Editar Coluna / Divisória";
  document.getElementById('pillar-modal-type').value = pil.type;
  document.getElementById('pillar-modal-rot').value = pil.rot || 0;
  document.getElementById('btn-del-pillar').style.display = 'inline-flex';
  document.getElementById('btn-save-pillar').textContent = "Salvar Alterações";
  document.getElementById('pillar-modal').style.display = 'block';
}
function deleteCurrentPillar() {
  if (!editingPillar) return;
  if (confirm("Deseja excluir esta coluna ou divisória da planta?")) {
    pushHistory();
    pillars = pillars.filter(p => p.id !== editingPillar.id);
    saveCurrentState();
    renderPillars();
    closePillarModal();
  }
}

let editingCftv = null;
function openAddCftvModal() {
  editingCftv = null;
  document.getElementById('cftv-modal-title').textContent = "Adicionar CFTV / AP";
  document.getElementById('cftv-modal-type').value = 'cftv';
  document.getElementById('cftv-modal-lbl').value = '';
  document.getElementById('cftv-modal-rot').value = '0';
  document.getElementById('btn-del-cftv').style.display = 'none';
  document.getElementById('btn-save-cftv').textContent = "Posicionar na Planta";
  document.getElementById('cftv-modal').style.display = 'block';
}
function closeCftvModal() {
  document.getElementById('cftv-modal').style.display = 'none';
  editingCftv = null;
}
function confirmAddCftvPlacement() {
  if (editingCftv) {
    pushHistory();
    editingCftv.type = document.getElementById('cftv-modal-type').value;
    editingCftv.lbl = document.getElementById('cftv-modal-lbl').value.trim() || 'NOVO';
    editingCftv.rot = parseInt(document.getElementById('cftv-modal-rot').value, 10) || 0;
    saveCurrentState();
    renderCftvs();
    closeCftvModal();
    return;
  }

  pendingCftvType = document.getElementById('cftv-modal-type').value;
  pendingCftvLbl = document.getElementById('cftv-modal-lbl').value.trim() || (pendingCftvType === 'ap' ? '02A0719' : '02A0721');
  pendingCftvRot = parseInt(document.getElementById('cftv-modal-rot').value, 10) || 0;
  closeCftvModal();

  isAddCftvMode = true;
  document.getElementById('btn-mode-cftv').classList.add('active');
  document.getElementById('viewport-container').classList.add('add-mode');
  ghostUse.setAttribute('href', pendingCftvType === 'ap' ? '#sym-ap' : '#sym-cftv');
  ghostPreview.style.display = 'inline';

  if (isEditMode) toggleEditMode();
  if (isAddPointMode) toggleAddMode();
  if (isAddFurnMode) cancelAddFurnMode();
  if (isAddPillarMode) cancelAddPillarMode();
  if (isAddWallMode) cancelAddWallMode();
  if (isAddDoorMode) cancelAddDoorMode();
  if (isSelectMode) toggleSelectMode();
}
function cancelAddCftvMode() {
  isAddCftvMode = false;
  ghostPreview.style.display = 'none';
  document.getElementById('btn-mode-cftv').classList.remove('active');
  document.getElementById('viewport-container').classList.remove('add-mode');
}
function onCftvClick(e, c) {
  if (isSelectMode) {
    e.stopPropagation();
    if (selectedItemIds.has(c.id)) selectedItemIds.delete(c.id);
    else selectedItemIds.add(c.id);
    updateSelectionVisuals();
    return;
  }
  if (hasMoved) return;
  e.stopPropagation();
  editingCftv = c;
  document.getElementById('cftv-modal-title').textContent = "Editar " + (c.type === 'ap' ? "AP Wi-Fi" : "Câmara CFTV");
  document.getElementById('cftv-modal-type').value = c.type;
  document.getElementById('cftv-modal-lbl').value = c.lbl;
  document.getElementById('cftv-modal-rot').value = c.rot || 0;
  document.getElementById('btn-del-cftv').style.display = 'inline-flex';
  document.getElementById('btn-save-cftv').textContent = "Salvar Alterações";
  document.getElementById('cftv-modal').style.display = 'block';
}
function deleteCurrentCftv() {
  if (!editingCftv) return;
  if (confirm(`Deseja excluir o dispositivo ${editingCftv.lbl}?`)) {
    pushHistory();
    cftvs = cftvs.filter(c => c.id !== editingCftv.id);
    saveCurrentState();
    renderCftvs();
    closeCftvModal();
  }
}

let editingFurn = null;
function onFurnClick(e, f) {
  if (isSelectMode) {
    e.stopPropagation();
    if (selectedItemIds.has(f.id)) selectedItemIds.delete(f.id);
    else selectedItemIds.add(f.id);
    updateSelectionVisuals();
    return;
  }
  if (hasMoved) return;
  e.stopPropagation();
  editingFurn = f;
  document.getElementById('edit-furn-rot').value = f.rot || 0;
  document.getElementById('edit-furn-modal').style.display = 'block';
}
function closeEditFurnModal() {
  document.getElementById('edit-furn-modal').style.display = 'none';
  editingFurn = null;
}
function saveEditFurnModal() {
  if (!editingFurn) return;
  pushHistory();
  editingFurn.rot = parseInt(document.getElementById('edit-furn-rot').value, 10) || 0;
  saveCurrentState();
  renderFurnitures();
  closeEditFurnModal();
}
function deleteCurrentFurn() {
  if (!editingFurn) return;
  if (confirm("Deseja excluir este móvel da planta?")) {
    pushHistory();
    furnitures = furnitures.filter(f => f.id !== editingFurn.id);
    saveCurrentState();
    renderFurnitures();
    closeEditFurnModal();
  }
}

// ==========================================
// ARRASTE E MANIPULAÇÃO DE ELEMENTOS NO CANVAS
// ==========================================
let draggedItem = null;
let draggedType = null;
let dragStartX = 0, dragStartY = 0;
let wallOriginal = { x1: 0, y1: 0, x2: 0, y2: 0 };
let hasMoved = false;

function onElementMouseDown(e, item, type) {
  if (isSelectMode) return;
  if (!isEditMode) return;
  e.stopPropagation();
  draggedItem = item;
  draggedType = type;
  hasMoved = false;
  const pt = getSvgCoords(e);

  if (type === 'wall') {
    dragStartX = pt.x; dragStartY = pt.y;
    wallOriginal = { x1: item.x1, y1: item.y1, x2: item.x2, y2: item.y2 };
  } else {
    dragStartX = pt.x - item.x;
    dragStartY = pt.y - item.y;
  }
}

function onPointClick(e, p) {
  if (isSelectMode) {
    e.stopPropagation();
    if (selectedItemIds.has(p.id)) selectedItemIds.delete(p.id);
    else selectedItemIds.add(p.id);
    updateSelectionVisuals();
    return;
  }
  if (hasMoved) return;
  e.stopPropagation();
  openEditModal(p);
}

function onRoomClick(e, r) {
  if (isSelectMode) return;
  if (hasMoved) return;
  e.stopPropagation();
  openRoomModal(r);
}

let editingPoint = null;
function openEditModal(p) {
  editingPoint = p;
  document.getElementById('modal-title').textContent = "Editar Ponto: " + p.lbl1;
  document.getElementById('modal-lbl1').value = p.lbl1;
  document.getElementById('modal-lbl2').value = p.lbl2 || "";
  document.getElementById('modal-type').value = p.type || "mid";
  document.getElementById('modal-rot').value = p.rot || "r";
  document.getElementById('edit-modal').style.display = "block";
}
function closeEditModal() {
  document.getElementById('edit-modal').style.display = "none";
  editingPoint = null;
}
function savePointModal() {
  if (!editingPoint) return;
  pushHistory();
  editingPoint.lbl1 = document.getElementById('modal-lbl1').value.trim();
  editingPoint.lbl2 = document.getElementById('modal-lbl2').value.trim();
  editingPoint.type = document.getElementById('modal-type').value;
  editingPoint.rot = document.getElementById('modal-rot').value;
  saveCurrentState();
  renderPoints();
  renderAutoFlow();
  closeEditModal();
}
function deleteCurrentPoint() {
  if (!editingPoint) return;
  if (confirm(`Excluir o ponto ${editingPoint.lbl1}?`)) {
    pushHistory();
    points = points.filter(p => p.id !== editingPoint.id);
    saveCurrentState();
    renderPoints();
    renderAutoFlow();
    closeEditModal();
  }
}

let editingRoom = null;
function openRoomModal(r) {
  editingRoom = r;
  document.getElementById('room-modal-name').value = r.name;
  document.getElementById('room-modal-namesize').value = r.nameSize || 16;
  document.getElementById('room-modal-desc').value = r.desc || "";
  document.getElementById('room-modal-descsize').value = r.descSize || 10;
  document.getElementById('room-modal').style.display = "block";
}
function closeRoomModal() {
  document.getElementById('room-modal').style.display = "none";
  editingRoom = null;
}
function saveRoomModal() {
  if (!editingRoom) return;
  pushHistory();
  editingRoom.name = document.getElementById('room-modal-name').value.trim();
  editingRoom.nameSize = parseInt(document.getElementById('room-modal-namesize').value, 10) || 16;
  editingRoom.desc = document.getElementById('room-modal-desc').value.trim();
  editingRoom.descSize = parseInt(document.getElementById('room-modal-descsize').value, 10) || 10;
  saveCurrentState();
  renderRooms();
  closeRoomModal();
}

container.addEventListener('mousedown', (e) => {
  if (e.target.closest('#cad-header') || e.target.closest('#layer-manager') || e.target.closest('#audit-box') || e.target.closest('.modal-box')) return;

  const pt = getSvgCoords(e);

  // SELEÇÃO BOX
  if (isSelectMode) {
    isSelecting = true;
    selectStartSvg = pt;
    selectionRect.setAttribute('x', pt.x);
    selectionRect.setAttribute('y', pt.y);
    selectionRect.setAttribute('width', 0);
    selectionRect.setAttribute('height', 0);
    selectionRect.style.display = 'block';
    return;
  }

  // INSERIR PORTA
  if (isAddDoorMode) {
    pushHistory();
    const newDr = {
      id: "dr_" + Date.now(),
      x: Math.round(pt.x),
      y: Math.round(pt.y),
      type: pendingDoorType,
      size: pendingDoorSize || 55
    };
    doors.push(newDr);
    saveCurrentState();
    renderDoors();
    cancelAddDoorMode();
    return;
  }

  // INSERIR PAREDE
  if (isAddWallMode) {
    pushHistory();
    const isV = pendingWallOrient === 'v';
    const newW = {
      id: "w_" + Date.now(),
      x1: Math.round(pt.x),
      y1: Math.round(pt.y),
      x2: Math.round(isV ? pt.x : pt.x + pendingWallLen),
      y2: Math.round(isV ? pt.y + pendingWallLen : pt.y)
    };
    walls.push(newW);
    saveCurrentState();
    renderWalls();
    cancelAddWallMode();
    return;
  }

  // INSERIR PONTO
  if (isAddPointMode) {
    pushHistory();
    const newP = {
      id: "p_" + Date.now(),
      x: Math.round(pt.x),
      y: Math.round(pt.y),
      lbl1: "NOVO_PONTO",
      lbl2: "",
      type: "mid",
      rot: "r"
    };
    points.push(newP);
    saveCurrentState();
    renderPoints();
    renderAutoFlow();
    openEditModal(newP);
    toggleAddMode();
    return;
  }

  // INSERIR MÓVEL
  if (isAddFurnMode && pendingFurnType) {
    pushHistory();
    const newF = {
      id: "furn_" + Date.now(),
      type: pendingFurnType,
      x: Math.round(pt.x),
      y: Math.round(pt.y),
      rot: pendingFurnRot || 0
    };
    furnitures.push(newF);
    saveCurrentState();
    renderFurnitures();
    cancelAddFurnMode();
    return;
  }

  // INSERIR COLUNA
  if (isAddPillarMode && pendingPillarType) {
    pushHistory();
    const newPil = {
      id: "pil_" + Date.now(),
      type: pendingPillarType,
      x: Math.round(pt.x),
      y: Math.round(pt.y),
      rot: pendingPillarRot || 0
    };
    pillars.push(newPil);
    saveCurrentState();
    renderPillars();
    cancelAddPillarMode();
    return;
  }

  // INSERIR CFTV OU AP
  if (isAddCftvMode) {
    pushHistory();
    const newC = {
      id: "c_" + Date.now(),
      type: pendingCftvType,
      x: Math.round(pt.x),
      y: Math.round(pt.y),
      lbl: pendingCftvLbl,
      rot: pendingCftvRot || 0
    };
    cftvs.push(newC);
    saveCurrentState();
    renderCftvs();
    cancelAddCftvMode();
    return;
  }

  if (!isEditMode) {
    isPanning = true;
    startX = e.clientX - pointX;
    startY = e.clientY - pointY;
    container.classList.add('panning');
  }
});

window.addEventListener('mousemove', (e) => {
  const pt = getSvgCoords(e);
  lastMouseSvg = pt;

  // Ghost preview
  if ((isAddFurnMode || isAddCftvMode || isAddPillarMode) && ghostPreview.style.display !== 'none') {
    const rot = isAddFurnMode ? (pendingFurnRot||0) : (isAddPillarMode ? (pendingPillarRot||0) : (pendingCftvRot||0));
    ghostPreview.setAttribute('transform', `translate(${pt.x}, ${pt.y}) rotate(${rot})`);
  }

  // Redimensionamento de Paredes
  if (activeWall && activeHandle && isEditMode) {
    hasMoved = true;
    if (activeHandle === 'p1') {
      activeWall.x1 = Math.round(pt.x);
      activeWall.y1 = Math.round(pt.y);
    } else if (activeHandle === 'p2') {
      activeWall.x2 = Math.round(pt.x);
      activeWall.y2 = Math.round(pt.y);
    }
    renderWalls();
    return;
  }

  // Seleção em Área
  if (isSelecting && isSelectMode) {
    const x = Math.min(selectStartSvg.x, pt.x);
    const y = Math.min(selectStartSvg.y, pt.y);
    const w = Math.abs(pt.x - selectStartSvg.x);
    const h = Math.abs(pt.y - selectStartSvg.y);
    selectionRect.setAttribute('x', x);
    selectionRect.setAttribute('y', y);
    selectionRect.setAttribute('width', w);
    selectionRect.setAttribute('height', h);
    return;
  }

  // Arraste Integral
  if (draggedItem && isEditMode) {
    if (!hasMoved) {
      pushHistory();
      hasMoved = true;
    }

    if (draggedType === 'wall') {
      const dx = pt.x - dragStartX;
      const dy = pt.y - dragStartY;
      draggedItem.x1 = Math.round(wallOriginal.x1 + dx);
      draggedItem.y1 = Math.round(wallOriginal.y1 + dy);
      draggedItem.x2 = Math.round(wallOriginal.x2 + dx);
      draggedItem.y2 = Math.round(wallOriginal.y2 + dy);
      renderWalls();
    } else {
      draggedItem.x = Math.round(pt.x - dragStartX);
      draggedItem.y = Math.round(pt.y - dragStartY);
      const el = document.getElementById(draggedItem.id);
      if (el) {
        if (draggedType === 'furn' || draggedType === 'pillar') {
          el.setAttribute("transform", `translate(${draggedItem.x}, ${draggedItem.y}) rotate(${draggedItem.rot || 0})`);
        } else if (draggedType === 'door') {
          el.setAttribute("transform", `translate(${draggedItem.x}, ${draggedItem.y})`);
        } else if (draggedType === 'rack') {
          el.setAttribute("transform", `translate(${draggedItem.x}, ${draggedItem.y})`);
          renderAutoFlow();
        } else {
          el.setAttribute("transform", `translate(${draggedItem.x}, ${draggedItem.y})`);
          if (draggedType === 'point') renderAutoFlow();
        }
      }
    }
    return;
  }

  if (!isPanning) return;
  pointX = e.clientX - startX;
  pointY = e.clientY - startY;
  updateTransform();
});

window.addEventListener('mouseup', (e) => {
  if (activeWall) {
    activeWall = null;
    activeHandle = null;
    saveCurrentState();
  }

  if (isSelecting && isSelectMode) {
    isSelecting = false;
    selectionRect.style.display = 'none';
    const pt = getSvgCoords(e);
    const minX = Math.min(selectStartSvg.x, pt.x);
    const maxX = Math.max(selectStartSvg.x, pt.x);
    const minY = Math.min(selectStartSvg.y, pt.y);
    const maxY = Math.max(selectStartSvg.y, pt.y);

    if (maxX - minX < 5 && maxY - minY < 5) {
      clearSelection();
      return;
    }

    points.forEach(p => {
      if (p.x >= minX && p.x <= maxX && p.y >= minY && p.y <= maxY) selectedItemIds.add(p.id);
    });
    furnitures.forEach(f => {
      if (f.x >= minX && f.x <= maxX && f.y >= minY && f.y <= maxY) selectedItemIds.add(f.id);
    });
    cftvs.forEach(c => {
      if (c.x >= minX && c.x <= maxX && c.y >= minY && c.y <= maxY) selectedItemIds.add(c.id);
    });
    pillars.forEach(pil => {
      if (pil.x >= minX && pil.x <= maxX && pil.y >= minY && pil.y <= maxY) selectedItemIds.add(pil.id);
    });
    doors.forEach(dr => {
      if (dr.x >= minX && dr.x <= maxX && dr.y >= minY && dr.y <= maxY) selectedItemIds.add(dr.id);
    });
    walls.forEach(w => {
      const midX = (w.x1 + w.x2) / 2;
      const midY = (w.y1 + w.y2) / 2;
      if (midX >= minX && midX <= maxX && midY >= minY && midY <= maxY) selectedItemIds.add(w.id);
    });

    updateSelectionVisuals();
    return;
  }

  if (draggedItem) {
    if (draggedType === 'point' || draggedType === 'rack') renderAutoFlow();
    draggedItem = null;
    draggedType = null;
    saveCurrentState();
  }
  isPanning = false;
  container.classList.remove('panning');
});

container.addEventListener('wheel', (e) => {
  if (e.target.closest('#layer-manager') || e.target.closest('#audit-box') || e.target.closest('.modal-box')) return;
  e.preventDefault();
  const clientX = e.clientX;
  const clientY = e.clientY;

  const xs = (clientX - pointX) / scale;
  const ys = (clientY - pointY) / scale;
  const delta = -e.deltaY;
  scale = delta > 0 ? scale * 1.15 : scale / 1.15;
  scale = Math.min(Math.max(0.4, scale), 8);

  pointX = clientX - xs * scale;
  pointY = clientY - ys * scale;
  updateTransform();
}, { passive: false });

function zoomIn() { scale = Math.min(scale * 1.25, 8); updateTransform(); }
function zoomOut() { scale = Math.max(scale / 1.25, 0.4); updateTransform(); }
function resetView() { scale = 1; pointX = 0; pointY = 0; updateTransform(); }

function toggleLayer(layerId, visible) {
  const el = document.getElementById(layerId);
  if (el) el.style.display = visible ? 'inline' : 'none';
}

// ==========================================
// EXPORTAÇÃO E IMPORTAÇÃO DE BACKUP JSON
// ==========================================
function exportJSON() {
  const fullData = { points, rooms, furnitures, cftvs, pillars, walls, doors, rack: rackData };
  const dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(fullData, null, 2));
  const a = document.createElement('a');
  a.setAttribute("href", dataStr);
  a.setAttribute("download", "planta_dpe_completa.json");
  document.body.appendChild(a);
  a.click();
  a.remove();
}

function triggerImport() {
  const input = document.getElementById('file-import');
  if (input) {
    input.value = '';
    input.click();
  }
}

function importJSON(event) {
  const file = event.target.files[0];
  if (!file) return;

  const reader = new FileReader();
  reader.onload = (e) => {
    let raw = e.target.result;
    
    try {
      if (typeof raw !== 'string') throw new Error("Formato inválido.");

      raw = raw.replace(/^\uFEFF/, '').trim();
      if (raw.startsWith('%7B') || raw.startsWith('%5B')) {
        raw = decodeURIComponent(raw);
      }

      const imported = JSON.parse(raw);

      if (typeof pushHistory === 'function') pushHistory();

      if (Array.isArray(imported)) {
        points = imported;
      } else if (typeof imported === 'object' && imported !== null) {
        points = imported.points || imported.pontos || points;
        rooms = imported.rooms || imported.salas || rooms;
        furnitures = imported.furnitures || imported.moveis || furnitures;
        cftvs = imported.cftvs || imported.cftv || cftvs;
        pillars = imported.pillars || imported.colunas || pillars;
        walls = imported.walls || imported.paredes || walls;
        doors = imported.doors || imported.portas || doors;
        if (imported.rack) rackData = imported.rack;
      } else {
        throw new Error("Estrutura não reconhecida.");
      }

      if (typeof selectedItemIds !== 'undefined' && selectedItemIds.clear) {
        selectedItemIds.clear();
      }
      if (typeof clearSelection === 'function') {
        clearSelection();
      }

      saveCurrentState();
      renderAll();

      alert("Arquivo JSON carregado com sucesso!");
    } catch(err) {
      console.error("Erro na importação:", err);
      alert("Erro: " + err.message);
    }
  };

  reader.readAsText(file, "UTF-8");
}

// ==========================================
// ARRASTE DO PAINEL DE CAMADAS
// ==========================================
const layerManager = document.getElementById('layer-manager');
const layerDragHeader = document.getElementById('layer-header-drag');
let isDraggingPanel = false;
let panelStartX = 0, panelStartY = 0;

if (layerDragHeader && layerManager) {
  layerDragHeader.addEventListener('mousedown', (e) => {
    isDraggingPanel = true;
    panelStartX = e.clientX - layerManager.offsetLeft;
    panelStartY = e.clientY - layerManager.offsetTop;
    e.stopPropagation();
  });

  window.addEventListener('mousemove', (e) => {
    if (!isDraggingPanel) return;
    const left = e.clientX - panelStartX;
    const top = e.clientY - panelStartY;
    layerManager.style.left = Math.max(10, Math.min(window.innerWidth - 260, left)) + 'px';
    layerManager.style.top = Math.max(60, Math.min(window.innerHeight - 300, top)) + 'px';
    layerManager.style.right = 'auto';
  });

  window.addEventListener('mouseup', () => {
    isDraggingPanel = false;
  });
}

// ==========================================
// LINHA DE FLUXO AUTOMÁTICA CONECTADA AO RACK
// ==========================================
const layerFlow = document.getElementById('layer-flow');

function renderAutoFlow() {
  if (!layerFlow) return;
  layerFlow.innerHTML = '';
  if (!points || points.length === 0) return;

  const sorted = [...points].sort((a, b) => {
    const valA = (a.lbl1 || '').toUpperCase();
    const valB = (b.lbl1 || '').toUpperCase();
    return valA.localeCompare(valB, undefined, { numeric: true });
  });

  for (let i = 0; i < sorted.length - 1; i++) {
    const p1 = sorted[i];
    const p2 = sorted[i + 1];

    const line = document.createElementNS("http://www.w3.org/2000/svg", "line");
    line.setAttribute("x1", p1.x);
    line.setAttribute("y1", p1.y);
    line.setAttribute("x2", p2.x);
    line.setAttribute("y2", p2.y);
    line.setAttribute("class", "flow-path");
    line.setAttribute("marker-end", "url(#arrow-flow)");
    layerFlow.appendChild(line);
  }

  const lastPoint = sorted[sorted.length - 1];
  const lineToRack = document.createElementNS("http://www.w3.org/2000/svg", "line");
  lineToRack.setAttribute("x1", lastPoint.x);
  lineToRack.setAttribute("y1", lastPoint.y);
  lineToRack.setAttribute("x2", rackData.x);
  lineToRack.setAttribute("y2", rackData.y - 45);
  lineToRack.setAttribute("class", "flow-path");
  lineToRack.setAttribute("marker-end", "url(#arrow-flow)");
  layerFlow.appendChild(lineToRack);
}

// ==========================================
// INICIALIZAÇÃO
// ==========================================
loadData();