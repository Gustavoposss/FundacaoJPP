const MESES = [
  'Janeiro', 'Fevereiro', 'Março', 'Abril', 'Maio', 'Junho',
  'Julho', 'Agosto', 'Setembro', 'Outubro', 'Novembro', 'Dezembro',
];

/**
 * Extrai ano/mês/dia de uma data de evento sem aplicar conversão de fuso horário.
 * O banco devolve datas em UTC (ex.: "2026-11-01T00:00:00.000Z"); usar new Date()
 * diretamente desloca o dia para o fuso local (ex.: 31/10 em UTC-3). Aqui pegamos
 * apenas a parte YYYY-MM-DD para preservar a data exata cadastrada.
 */
const extrairPartesData = (dataEvento) => {
  if (!dataEvento) return null;

  const texto = typeof dataEvento === 'string' ? dataEvento : dataEvento.toISOString();
  const match = texto.match(/^(\d{4})-(\d{2})-(\d{2})/);

  if (!match) return null;

  return {
    ano: Number(match[1]),
    mes: Number(match[2]),
    dia: Number(match[3]),
  };
};

/**
 * Retorna { mes, ano } com o nome do mês por extenso, sem deslocamento de fuso.
 */
export const formatarMesAnoEvento = (dataEvento) => {
  const partes = extrairPartesData(dataEvento);
  if (!partes) return { mes: '', ano: '' };

  return {
    mes: MESES[partes.mes - 1] || '',
    ano: String(partes.ano),
  };
};

/**
 * Retorna a data no formato DD/MM/YYYY, sem deslocamento de fuso.
 */
export const formatarDataBR = (dataEvento) => {
  const partes = extrairPartesData(dataEvento);
  if (!partes) return '-';

  const dia = String(partes.dia).padStart(2, '0');
  const mes = String(partes.mes).padStart(2, '0');
  return `${dia}/${mes}/${partes.ano}`;
};

/**
 * Retorna YYYY-MM-DD para inputs type="date", sem conversão de fuso.
 */
export const paraInputDate = (dataEvento) => {
  const partes = extrairPartesData(dataEvento);
  if (!partes) return '';

  return `${partes.ano}-${String(partes.mes).padStart(2, '0')}-${String(partes.dia).padStart(2, '0')}`;
};
