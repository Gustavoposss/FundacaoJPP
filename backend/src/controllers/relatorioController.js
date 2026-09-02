import { buscarPresencas, buscarEventos, buscarIdosos, buscarFaltas, buscarTitulosEleitorais } from '../models/relatorioModel.js';
import { successResponse, errorResponse } from '../utils/responseHelper.js';
import { generatePDF } from '../utils/pdfGenerator.js';
import { formatarDataBR } from '../utils/dateUtils.js';

/**
 * Remove formatação do CPF, retornando apenas números
 */
const cleanCPF = (cpf) => {
  if (!cpf) return 'N/A';
  return String(cpf).replace(/\D/g, '');
};

const TIPOS_RELATORIO = ['presencas', 'eventos', 'idosos', 'faltas', 'titulos'];

const mapearTitulos = (registros) =>
  registros.map((r) => ({
    id: r.id,
    orgao_expedidor: r.orgao_expedidor || '-',
    titulo_eleitoral: r.titulo_eleitoral || '-',
    zona_eleitoral: r.zona_eleitoral || '-',
    secao_eleitoral: r.secao_eleitoral || '-',
    municipio_uf: r.municipio_uf || '-',
  }));

const getStatusLabel = (status) => (status === 'inadimplente' ? 'Inadimplentes' : 'Fixos');

const calcularFrequencia = (presencas, faltas) => {
  const total = Number(presencas) + Number(faltas);
  if (!total) return 0;
  return Math.round((Number(presencas) / total) * 100);
};

const mapearFaltas = (registros) =>
  registros.map((r) => {
    const total_faltas = Number(r.total_faltas) || 0;
    const total_presencas = Number(r.total_presencas) || 0;
    const frequencia = calcularFrequencia(total_presencas, total_faltas);

    return {
      id: r.id,
      titulo: r.nome_completo,
      descricao: `Faltas: ${total_faltas} | Presenças: ${total_presencas} | Frequência: ${frequencia}%`,
      nome: r.nome_completo,
      numero_sorteio: r.numero_sorteio,
      telefone: r.telefone,
      status: r.status,
      cpf: r.cpf,
      total_faltas,
      total_presencas,
      total_registros: Number(r.total_registros) || 0,
      frequencia,
    };
  });

/**
 * Gera relatório baseado no tipo solicitado
 */
export const gerarRelatorio = async (req, res) => {
  try {
    const { tipo, inicio, fim, ...filtros } = req.query;

    if (!tipo || !TIPOS_RELATORIO.includes(tipo)) {
      return errorResponse(res, 'Tipo de relatório inválido', 400);
    }

    let registros = [];

    switch (tipo) {
      case 'presencas':
        registros = await buscarPresencas({
          inicio,
          fim,
          idoso_id: filtros.idoso_id,
          evento_id: filtros.evento_id,
          presente: filtros.presente,
          ordenar: filtros.ordenar,
        });
        registros = registros.map((r) => ({
          id: r.id,
          titulo: `${r.idoso_nome} - ${r.evento_nome}`,
          descricao: `Presença: ${r.presente ? 'Presente' : 'Ausente'} | Local: ${r.evento_local || 'N/A'}`,
          data: r.evento_data,
          idoso: r.idoso_nome,
          cpf: r.idoso_cpf,
          evento: r.evento_nome,
          presente: r.presente,
          data_registro: r.data_registro,
        }));
        break;

      case 'eventos':
        registros = await buscarEventos({
          inicio,
          fim,
          nome: filtros.nome,
          local: filtros.local,
          ordenar: filtros.ordenar,
        });
        registros = registros.map((r) => ({
          id: r.id,
          titulo: r.nome,
          descricao: r.descricao || 'Sem descrição',
          data: r.data_evento,
          local: r.local,
          total_presentes: Number(r.total_presentes) || 0,
          total_cadastrados: Number(r.total_cadastrados) || 0,
        }));
        break;

      case 'idosos':
        registros = await buscarIdosos({
          inicio,
          fim,
          nome: filtros.nome,
          cpf: filtros.cpf,
          sexo: filtros.sexo,
          idade_min: filtros.idade_min,
          idade_max: filtros.idade_max,
          status: filtros.status,
          ordenar: filtros.ordenar,
        });
        registros = registros.map((r) => ({
          id: r.id,
          titulo: r.nome_completo,
          descricao: `Nº ${r.numero_sorteio || '-'} | Idade: ${r.idade} anos | Sexo: ${r.sexo} | Status: ${getStatusLabel(r.status)} | Telefone: ${r.telefone || 'N/A'}`,
          data: r.data_cadastro,
          nome: r.nome_completo,
          numero_sorteio: r.numero_sorteio,
          idade: r.idade,
          sexo: r.sexo,
          status: r.status,
          telefone: r.telefone,
          cpf: r.cpf,
          rg: r.rg,
          total_presencas: Number(r.total_presencas) || 0,
        }));
        break;

      case 'faltas':
        registros = mapearFaltas(
          await buscarFaltas({
            inicio,
            fim,
            nome: filtros.nome,
            status: filtros.status,
            ordenar: filtros.ordenar,
          })
        );
        break;

      case 'titulos':
        registros = mapearTitulos(
          await buscarTitulosEleitorais({
            inicio,
            fim,
            status: filtros.status,
            municipio: filtros.municipio,
            ordenar: filtros.ordenar,
          })
        );
        break;
    }

    return successResponse(res, { registros }, 'Relatório gerado com sucesso');
  } catch (error) {
    console.error('Erro ao gerar relatório:', error);
    return errorResponse(res, 'Erro ao gerar relatório', 500);
  }
};

/**
 * Exporta relatório em CSV
 */
export const exportarRelatorio = async (req, res) => {
  try {
    const { tipo, formato, inicio, fim, ...filtros } = req.query;

    if (!tipo || !TIPOS_RELATORIO.includes(tipo)) {
      return errorResponse(res, 'Tipo de relatório inválido', 400);
    }

    if (!formato || !['csv', 'pdf'].includes(formato)) {
      return errorResponse(res, 'Formato de exportação inválido', 400);
    }

    let registros = [];
    let headers = [];
    let rows = [];

    switch (tipo) {
      case 'presencas':
        registros = await buscarPresencas({
          inicio,
          fim,
          idoso_id: filtros.idoso_id,
          evento_id: filtros.evento_id,
          presente: filtros.presente,
          ordenar: filtros.ordenar,
        });
        headers = ['Data do Evento', 'Evento', 'Local', 'Idoso', 'CPF', 'Presença'];
        rows = registros.map((r) => [
          formatarDataBR(r.evento_data),
          r.evento_nome,
          r.evento_local || 'N/A',
          r.idoso_nome,
          cleanCPF(r.idoso_cpf),
          r.presente ? 'Presente' : 'Ausente',
        ]);
        break;

      case 'eventos':
        registros = await buscarEventos({
          inicio,
          fim,
          nome: filtros.nome,
          local: filtros.local,
          ordenar: filtros.ordenar,
        });
        headers = ['Data', 'Evento', 'Local', 'Total Presentes', 'Total Cadastrados'];
        rows = registros.map((r) => [
          formatarDataBR(r.data_evento),
          r.nome,
          r.local || 'N/A',
          Number(r.total_presentes) || 0,
          Number(r.total_cadastrados) || 0,
        ]);
        break;

      case 'idosos':
        registros = await buscarIdosos({
          inicio,
          fim,
          nome: filtros.nome,
          cpf: filtros.cpf,
          sexo: filtros.sexo,
          idade_min: filtros.idade_min,
          idade_max: filtros.idade_max,
          status: filtros.status,
          ordenar: filtros.ordenar,
        });
        headers = ['Nº', 'Nome', 'Idade', 'Sexo', 'Status', 'CPF', 'Telefone', 'Total Presenças'];
        rows = registros.map((r) => [
          r.numero_sorteio || '-',
          r.nome_completo,
          r.idade,
          r.sexo,
          getStatusLabel(r.status),
          cleanCPF(r.cpf),
          r.telefone || 'N/A',
          Number(r.total_presencas) || 0,
        ]);
        break;

      case 'faltas':
        registros = await buscarFaltas({
          inicio,
          fim,
          nome: filtros.nome,
          status: filtros.status,
          ordenar: filtros.ordenar,
        });
        headers = ['Nº', 'Nome', 'Status', 'Faltas', 'Presenças', 'Frequência (%)', 'Telefone', 'CPF'];
        rows = registros.map((r) => {
          const total_faltas = Number(r.total_faltas) || 0;
          const total_presencas = Number(r.total_presencas) || 0;
          return [
            r.numero_sorteio || '-',
            r.nome_completo,
            getStatusLabel(r.status),
            total_faltas,
            total_presencas,
            calcularFrequencia(total_presencas, total_faltas),
            r.telefone || 'N/A',
            cleanCPF(r.cpf),
          ];
        });
        break;

      case 'titulos':
        registros = await buscarTitulosEleitorais({
          inicio,
          fim,
          status: filtros.status,
          municipio: filtros.municipio,
          ordenar: filtros.ordenar,
        });
        headers = ['Órgão Expedidor', 'Título Eleitoral', 'Zona', 'Seção', 'Município/UF'];
        rows = registros.map((r) => [
          r.orgao_expedidor || '-',
          r.titulo_eleitoral || '-',
          r.zona_eleitoral || '-',
          r.secao_eleitoral || '-',
          r.municipio_uf || '-',
        ]);
        break;
    }

    if (formato === 'csv') {
      // Gerar CSV
      const csvContent = [
        headers.join(','),
        ...rows.map((row) => row.map((cell) => `"${String(cell).replace(/"/g, '""')}"`).join(',')),
      ].join('\n');

      res.setHeader('Content-Type', 'text/csv; charset=utf-8');
      res.setHeader('Content-Disposition', `attachment; filename="relatorio-${tipo}-${Date.now()}.csv"`);
      res.setHeader('Content-Length', Buffer.byteLength(csvContent, 'utf8'));
      return res.send(csvContent);
    } else if (formato === 'pdf') {
      // Gerar PDF
      try {
        // Usar os dados originais do banco (registros) para o PDF
        const pdfBuffer = await generatePDF(registros, tipo, { inicio, fim, ...filtros });

        res.setHeader('Content-Type', 'application/pdf');
        res.setHeader(
          'Content-Disposition',
          `attachment; filename="relatorio-${tipo}-${Date.now()}.pdf"`
        );
        res.setHeader('Content-Length', pdfBuffer.length);
        return res.send(pdfBuffer);
      } catch (pdfError) {
        console.error('Erro ao gerar PDF:', pdfError);
        return errorResponse(res, 'Erro ao gerar PDF', 500);
      }
    }
  } catch (error) {
    console.error('Erro ao exportar relatório:', error);
    return errorResponse(res, 'Erro ao exportar relatório', 500);
  }
};

