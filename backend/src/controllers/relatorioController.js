import { buscarPresencas, buscarEventos, buscarIdosos } from '../models/relatorioModel.js';
import { successResponse, errorResponse } from '../utils/responseHelper.js';
import { generatePDF } from '../utils/pdfGenerator.js';

/**
 * Remove formatação do CPF, retornando apenas números
 */
const cleanCPF = (cpf) => {
  if (!cpf) return 'N/A';
  return String(cpf).replace(/\D/g, '');
};

/**
 * Gera relatório baseado no tipo solicitado
 */
export const gerarRelatorio = async (req, res) => {
  try {
    const { tipo, inicio, fim, ...filtros } = req.query;

    if (!tipo || !['presencas', 'eventos', 'idosos'].includes(tipo)) {
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
          descricao: `Idade: ${r.idade} anos | Sexo: ${r.sexo} | Status: ${r.status === 'fixo' ? 'Fixo' : 'Espera'} | Telefone: ${r.telefone || 'N/A'}`,
          data: r.data_cadastro,
          nome: r.nome_completo,
          idade: r.idade,
          sexo: r.sexo,
          status: r.status,
          telefone: r.telefone,
          cpf: r.cpf,
          rg: r.rg,
          total_presencas: Number(r.total_presencas) || 0,
        }));
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

    if (!tipo || !['presencas', 'eventos', 'idosos'].includes(tipo)) {
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
          new Date(r.evento_data).toLocaleDateString('pt-BR'),
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
          new Date(r.data_evento).toLocaleDateString('pt-BR'),
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
        headers = ['Nome', 'Idade', 'Sexo', 'Status', 'CPF', 'Telefone', 'Total Presenças'];
        rows = registros.map((r) => [
          r.nome_completo,
          r.idade,
          r.sexo,
          r.status === 'fixo' ? 'Fixo' : 'Espera',
          cleanCPF(r.cpf),
          r.telefone || 'N/A',
          Number(r.total_presencas) || 0,
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

