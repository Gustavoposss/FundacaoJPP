/**
 * Formata datas de evento (DATE do PostgreSQL) em DD/MM/YYYY
 * sem aplicar fuso horário. new Date('YYYY-MM-DD') interpreta UTC
 * e em fusos como America/Sao_Paulo a data cai no dia anterior.
 */
export const formatarDataBR = (dataEvento) => {
  if (!dataEvento) return '-';

  let texto;
  if (dataEvento instanceof Date) {
    const ano = dataEvento.getUTCFullYear();
    const mes = String(dataEvento.getUTCMonth() + 1).padStart(2, '0');
    const dia = String(dataEvento.getUTCDate()).padStart(2, '0');
    texto = `${ano}-${mes}-${dia}`;
  } else {
    texto = String(dataEvento);
  }

  const match = texto.match(/^(\d{4})-(\d{2})-(\d{2})/);
  if (!match) return '-';

  return `${match[3]}/${match[2]}/${match[1]}`;
};
