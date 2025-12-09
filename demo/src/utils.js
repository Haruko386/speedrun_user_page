// src/utils.js

// 格式化日期 (Unix 时间戳 -> YYYY-MM-DD)
export function formatDate(timestamp) {
  if (!timestamp) return '-';
  const date = new Date(timestamp * 1000);
  return date.toLocaleDateString('zh-CN', {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  });
}

// 格式化速通时间 (秒 -> HH:MM:SS.ms)
export function formatTime(seconds) {
  if (!seconds) return '-';
  
  const h = Math.floor(seconds / 3600);
  const m = Math.floor((seconds % 3600) / 60);
  const s = Math.floor(seconds % 60);
  const ms = Math.round((seconds - Math.floor(seconds)) * 1000);

  const mStr = m.toString().padStart(2, '0');
  const sStr = s.toString().padStart(2, '0');
  const msStr = ms > 0 ? `.${ms.toString().padStart(3, '0')}` : '';

  if (h > 0) {
    return `${h}:${mStr}:${sStr}${msStr}`;
  }
  return `${m}:${sStr}${msStr}`;
}

// 解析视频链接平台
export function getVideoPlatform(url) {
  if (!url) return null;
  if (url.includes('bilibili') || url.includes('b23.tv')) return 'Bilibili';
  if (url.includes('youtube') || url.includes('youtu.be')) return 'YouTube';
  return 'Video';
}