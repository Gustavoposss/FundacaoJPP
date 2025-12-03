const fs = require('fs');
const path = require('path');
const { optimize } = require('svgo');

// Configuração do SVGO para otimizar sem perder qualidade visual
const svgoConfig = {
  multipass: true,
  plugins: [
    {
      name: 'preset-default',
      params: {
        overrides: {
          // Manter atributos importantes
          removeViewBox: false,
          removeDimensions: false,
          // Otimizar paths
          convertPathData: {
            floatPrecision: 2, // Reduzir precisão de floats para reduzir tamanho
            transformPrecision: 2,
          },
          // Remover elementos desnecessários mas manter estrutura
          removeUselessStrokeAndFill: true,
          removeHiddenElems: true,
          removeEmptyContainers: true,
          // Comprimir mas manter qualidade
          cleanupNumericValues: {
            floatPrecision: 2,
          },
          // Remover metadados desnecessários
          removeMetadata: true,
          removeComments: true,
          removeEditorsNSData: true,
          removeEmptyAttrs: true,
          removeUselessDefs: true,
          // Otimizar mas manter IDs importantes
          cleanupIds: {
            remove: false,
            minify: true,
          },
        },
      },
    },
    // Comprimir espaços em branco
    'cleanupListOfValues',
    'minifyStyles',
    'convertStyleToAttrs',
    'convertColors',
    'removeUnknownsAndDefaults',
    'removeNonInheritableGroupAttrs',
    'removeUselessStrokeAndFill',
    'removeUnusedNS',
    'prefixIds',
    'cleanupNumericValues',
    'cleanupIds',
    'removeDoctype',
    'removeXMLProcInst',
    'removeComments',
    'removeMetadata',
    'removeTitle',
    'removeDesc',
    'removeUselessDefs',
    'removeEditorsNSData',
    'removeEmptyAttrs',
    'removeHiddenElems',
    'removeEmptyText',
    'removeEmptyContainers',
    'removeViewBox',
    'cleanupEnableBackground',
    'minifyStyles',
    'convertStyleToAttrs',
    'convertColors',
    'convertPathData',
    'convertTransform',
    'removeUnknownsAndDefaults',
    'removeNonInheritableGroupAttrs',
    'removeUselessStrokeAndFill',
    'removeUselessDefs',
    'cleanupIds',
    'cleanupNumericValues',
    'moveGroupAttrsToElems',
    'collapseGroups',
    'mergePaths',
    'convertShapeToPath',
    'sortAttrs',
    'removeDimensions',
  ],
};

// Arquivos SVG para otimizar
const svgFiles = [
  'possidonioperfil.svg',
  'lucileneperfil.svg',
  'gustavoperfil.svg',
];

const publicDir = path.join(__dirname, '..', 'public');

console.log('Iniciando otimização de SVGs...\n');

svgFiles.forEach((filename) => {
  const filePath = path.join(publicDir, filename);
  const backupPath = path.join(publicDir, filename.replace('.svg', '.svg.backup'));

  if (!fs.existsSync(filePath)) {
    console.error(`Arquivo não encontrado: ${filename}`);
    return;
  }

  // Ler o arquivo original
  const originalContent = fs.readFileSync(filePath, 'utf8');
  const originalSize = fs.statSync(filePath).size;

  // Criar backup
  fs.writeFileSync(backupPath, originalContent);
  console.log(`Backup criado: ${filename}.backup`);

  // Otimizar
  const result = optimize(originalContent, svgoConfig);

  if (result.error) {
    console.error(`Erro ao otimizar ${filename}:`, result.error);
    return;
  }

  // Salvar arquivo otimizado
  fs.writeFileSync(filePath, result.data);
  const optimizedSize = fs.statSync(filePath).size;
  const reduction = ((1 - optimizedSize / originalSize) * 100).toFixed(2);

  console.log(`\n${filename}:`);
  console.log(`  Tamanho original: ${(originalSize / 1024 / 1024).toFixed(2)} MB`);
  console.log(`  Tamanho otimizado: ${(optimizedSize / 1024 / 1024).toFixed(2)} MB`);
  console.log(`  Redução: ${reduction}%`);
});

console.log('\nOtimização concluída!');

