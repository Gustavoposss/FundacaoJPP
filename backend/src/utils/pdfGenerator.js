import PDFDocument from 'pdfkit';

/**
 * Gera PDF formatado para relatórios
 */
export const generatePDF = (registros, tipo, periodo = {}) => {
  return new Promise((resolve, reject) => {
    try {
      const doc = new PDFDocument({
        size: 'A4',
        margins: { top: 50, bottom: 50, left: 50, right: 50 },
      });

      const chunks = [];
      doc.on('data', (chunk) => chunks.push(chunk));
      doc.on('end', () => resolve(Buffer.concat(chunks)));
      doc.on('error', reject);

      // Cabeçalho
      doc
        .fontSize(20)
        .fillColor('#003366')
        .text('Fundação José Possidônio Peixoto', { align: 'center' });

      doc.moveDown(0.5);

      doc
        .fontSize(16)
        .fillColor('#00a859')
        .text(`Relatório de ${getTipoLabel(tipo)}`, { align: 'center' });

      doc.moveDown(1);

      // Período
      if (periodo.inicio || periodo.fim) {
        doc.fontSize(10).fillColor('#666666');
        const periodoText = `Período: ${
          periodo.inicio ? formatDate(periodo.inicio) : 'Início'
        } até ${periodo.fim ? formatDate(periodo.fim) : 'Fim'}`;
        doc.text(periodoText, { align: 'center' });
        doc.moveDown(1);
      }

      // Data de geração
      doc
        .fontSize(9)
        .fillColor('#999999')
        .text(`Gerado em: ${new Date().toLocaleString('pt-BR')}`, { align: 'center' });

      doc.moveDown(1.5);

      // Tabela
      if (registros.length === 0) {
        doc
          .fontSize(12)
          .fillColor('#666666')
          .text('Nenhum registro encontrado para o período selecionado.', {
            align: 'center',
          });
      } else {
        generateTable(doc, registros, tipo);
      }

      // Rodapé
      const totalPages = doc.bufferedPageRange().count;
      for (let i = 0; i < totalPages; i++) {
        doc.switchToPage(i);
        doc
          .fontSize(8)
          .fillColor('#999999')
          .text(
            `Página ${i + 1} de ${totalPages}`,
            doc.page.width - 100,
            doc.page.height - 30,
            { align: 'right' }
          );
      }

      doc.end();
    } catch (error) {
      reject(error);
    }
  });
};

/**
 * Gera tabela no PDF baseado no tipo de relatório
 */
const generateTable = (doc, registros, tipo) => {
  const startY = doc.y;
  const pageWidth = doc.page.width - 100; // Largura total menos margens (50 + 50)
  const tableTop = startY;
  const rowHeight = 25;
  const headerHeight = 30;

  // Cores
  const headerColor = '#003366';
  const rowColor = '#f4f6f7';
  const textColor = '#333333';

  // Configurar colunas baseado no tipo
  const { columns, getRowData } = getTableConfig(tipo, pageWidth);

  // Cabeçalho da tabela
  doc.rect(50, tableTop, pageWidth, headerHeight).fill(headerColor);

  let x = 50;
  columns.forEach((col) => {
    doc
      .fontSize(10)
      .fillColor('#ffffff')
      .font('Helvetica-Bold')
      .text(col.label, x + 5, tableTop + 8, {
        width: col.width - 10,
        align: col.align || 'left',
      });
    x += col.width;
  });

  // Linhas da tabela
  let currentY = tableTop + headerHeight;
  registros.forEach((registro, index) => {
    // Verificar se precisa de nova página
    if (currentY + rowHeight > doc.page.height - 50) {
      doc.addPage();
      currentY = 50;
    }

    // Cor de fundo alternada
    const fillColor = index % 2 === 0 ? rowColor : '#ffffff';
    doc.rect(50, currentY, pageWidth, rowHeight).fill(fillColor);

    // Dados da linha
    const rowData = getRowData(registro);
    x = 50;
    columns.forEach((col, colIndex) => {
      const cellValue = String(rowData[colIndex] || '-');
      // Ajustar fonte para colunas menores se necessário
      const fontSize = col.width < 50 ? 8 : 9;
      doc
        .fontSize(fontSize)
        .fillColor(textColor)
        .font('Helvetica')
        .text(cellValue, x + 5, currentY + 8, {
          width: col.width - 10,
          align: col.align || 'left',
        });
      x += col.width;
    });

    // Linha divisória
    doc
      .moveTo(50, currentY + rowHeight)
      .lineTo(50 + pageWidth, currentY + rowHeight)
      .strokeColor('#e0e0e0')
      .lineWidth(0.5)
      .stroke();

    currentY += rowHeight;
  });

  // Total de registros
  doc.moveDown(1);
  doc
    .fontSize(10)
    .fillColor('#666666')
    .font('Helvetica-Bold')
    .text(`Total de registros: ${registros.length}`, { align: 'right' });
};

/**
 * Configuração de colunas para cada tipo de relatório
 */
const getTableConfig = (tipo, pageWidth) => {
  switch (tipo) {
    case 'presencas':
      return {
        columns: [
          { label: 'Data', width: pageWidth * 0.12, align: 'left' },
          { label: 'Evento', width: pageWidth * 0.22, align: 'left' },
          { label: 'Local', width: pageWidth * 0.18, align: 'left' },
          { label: 'Idoso', width: pageWidth * 0.20, align: 'left' },
          { label: 'CPF', width: pageWidth * 0.15, align: 'left' },
          { label: 'Presença', width: pageWidth * 0.13, align: 'center' },
        ],
        getRowData: (r) => [
          formatDate(r.evento_data),
          r.evento_nome || '-',
          r.evento_local || '-',
          r.idoso_nome || '-',
          cleanCPF(r.idoso_cpf),
          r.presente ? 'Sim' : 'Não',
        ],
      };

    case 'eventos':
      return {
        columns: [
          { label: 'Data', width: pageWidth * 0.2, align: 'left' },
          { label: 'Evento', width: pageWidth * 0.35, align: 'left' },
          { label: 'Local', width: pageWidth * 0.25, align: 'left' },
          { label: 'Presentes', width: pageWidth * 0.1, align: 'center' },
          { label: 'Total', width: pageWidth * 0.1, align: 'center' },
        ],
        getRowData: (r) => [
          formatDate(r.data_evento),
          r.nome || '-',
          r.local || '-',
          String(r.total_presentes || 0),
          String(r.total_cadastrados || 0),
        ],
      };

    case 'idosos':
      return {
        columns: [
          { label: 'Nome', width: pageWidth * 0.3, align: 'left' },
          { label: 'Idade', width: pageWidth * 0.1, align: 'center' },
          { label: 'Sexo', width: pageWidth * 0.1, align: 'center' },
          { label: 'CPF', width: pageWidth * 0.2, align: 'left' },
          { label: 'Telefone', width: pageWidth * 0.15, align: 'left' },
          { label: 'Presenças', width: pageWidth * 0.15, align: 'center' },
        ],
        getRowData: (r) => [
          r.nome_completo || '-',
          String(r.idade || '-'),
          r.sexo || '-',
          cleanCPF(r.cpf),
          r.telefone || '-',
          String(r.total_presencas || 0),
        ],
      };

    default:
      return {
        columns: [{ label: 'Dados', width: pageWidth, align: 'left' }],
        getRowData: (r) => [JSON.stringify(r)],
      };
  }
};

/**
 * Retorna label do tipo de relatório
 */
const getTipoLabel = (tipo) => {
  const labels = {
    presencas: 'Presenças',
    eventos: 'Eventos',
    idosos: 'Idosos',
  };
  return labels[tipo] || tipo;
};

/**
 * Formata data para exibição
 */
const formatDate = (dateString) => {
  if (!dateString) return '-';
  try {
    const date = new Date(dateString);
    return date.toLocaleDateString('pt-BR');
  } catch (error) {
    return dateString;
  }
};

/**
 * Remove formatação do CPF, retornando apenas números
 */
const cleanCPF = (cpf) => {
  if (!cpf) return '-';
  return String(cpf).replace(/\D/g, '');
};

