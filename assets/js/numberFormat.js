/**
 * 数字格式化工具函数
 * 小于1000显示完整值，大于等于1000显示紧凑格式，hover时显示完整值
 */

export function formatCompactWithTitle(num) {
  if (num === null || num === undefined || isNaN(num)) return '-';
  
  const compact = Intl.NumberFormat('en', {
    notation: 'compact',
    minimumFractionDigits: 2,
    maximumFractionDigits: 2
  }).format(num);
  
  const full = Intl.NumberFormat('en', {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2
  }).format(num);
  
  if (Math.abs(num) < 1000) {
    return `<span>${full}</span>`;
  }
  
  // 分离数字和单位（K、M、B等）
  const match = compact.match(/^([\d,.]+)([KMBT]?)$/);
  if (match) {
    const [, number, unit] = match;
    return `<span title="${full}">${number}<strong>${unit}</strong></span>`;
  }
  
  // 如果匹配失败，返回原始格式
  return `<span title="${full}">${compact}</span>`;
}

/**
 * 应用数字格式化到指定元素
 */
export function applyNumberFormat(element, value) {
  if (element) {
    element.innerHTML = formatCompactWithTitle(value);
  }
}

/**
 * 批量应用数字格式化到多个元素
 */
export function applyNumberFormatToElements(elements, values) {
  if (Array.isArray(elements) && Array.isArray(values)) {
    elements.forEach((element, index) => {
      if (element && values[index] !== undefined) {
        applyNumberFormat(element, values[index]);
      }
    });
  }
}

/**
 * 为Chart.js提供纯文本格式的数字（不包含HTML标签）
 */
export function formatCompactText(num) {
  if (num === null || num === undefined || isNaN(num)) return '-';
  
  const compact = Intl.NumberFormat('en', {
    notation: 'compact',
    minimumFractionDigits: 2,
    maximumFractionDigits: 2
  }).format(num);
  
  if (Math.abs(num) < 1000) {
    return Intl.NumberFormat('en', {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2
    }).format(num);
  }
  
  return compact;
}


