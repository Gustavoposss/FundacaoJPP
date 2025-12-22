/**
 * Converte URLs do YouTube para o formato de embed necessário para iframes
 * Suporta múltiplos formatos de URL do YouTube
 * 
 * @param {string} url - URL do YouTube (watch, youtu.be, ou embed)
 * @returns {string|null} - URL no formato embed ou null se não for uma URL válida do YouTube
 */
export const converterUrlYouTubeParaEmbed = (url) => {
  if (!url || typeof url !== 'string') return null;
  
  // Se já estiver no formato embed, retorna como está
  if (url.includes('youtube.com/embed/')) {
    return url;
  }
  
  // Padrões de URL do YouTube
  let videoId = null;
  let startTime = null;
  
  // Padrão 1: https://www.youtube.com/watch?v=VIDEO_ID&t=62s
  // Padrão 2: https://youtu.be/VIDEO_ID?t=62s
  const watchPattern = /(?:youtube\.com\/watch\?v=|youtu\.be\/)([a-zA-Z0-9_-]+)/;
  const watchMatch = url.match(watchPattern);
  
  if (watchMatch) {
    videoId = watchMatch[1];
    
    // Extrair tempo de início (t=62s, t=1m2s, start=62)
    const timePatterns = [
      /[?&]t=(\d+)([smh]?)/,  // t=62s ou t=1m2s
      /[?&]start=(\d+)/,       // start=62
    ];
    
    for (const pattern of timePatterns) {
      const timeMatch = url.match(pattern);
      if (timeMatch) {
        const timeValue = parseInt(timeMatch[1]);
        const timeUnit = timeMatch[2] || 's';
        
        // Converter para segundos
        if (timeUnit === 'm') {
          startTime = timeValue * 60;
        } else if (timeUnit === 'h') {
          startTime = timeValue * 3600;
        } else {
          startTime = timeValue;
        }
        break;
      }
    }
  }
  
  if (!videoId) {
    // Se não conseguir extrair, retorna null
    return null;
  }
  
  // Construir URL de embed
  let embedUrl = `https://www.youtube.com/embed/${videoId}`;
  if (startTime) {
    embedUrl += `?start=${startTime}`;
  }
  
  return embedUrl;
};

