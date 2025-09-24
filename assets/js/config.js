// 全局配置
window.APP_CONFIG = {
  // API配置
  api: {
    // Supabase配置
    supabase: {
      url: 'https://glduiypkpsuxzdjscuhq.supabase.co',
      anonKey: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImdsZHVpeXBrcHN1eHpkanNjdWhxIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTU0MzYwOTEsImV4cCI6MjA3MTAxMjA5MX0.dZO3fa7PCcJG0yxSbtJXP'
    }
  },

  // localStorage管理
  userPreferences: {
    // 存储键名
    keys: {
      lastCurrency: 'money_tracker_last_currency',
      lastCategory: 'money_tracker_last_category',
      lastType: 'money_tracker_last_type',
      lastWallet: 'money_tracker_last_wallet'
    },

    // 保存用户选择的币种
    saveLastCurrency(currencyCode) {
      if (currencyCode && window.APP_CONFIG.currencies[currencyCode]) {
        localStorage.setItem(this.keys.lastCurrency, currencyCode);
      }
    },

    // 获取上次选择的币种
    getLastCurrency() {
      const saved = localStorage.getItem(this.keys.lastCurrency);
      return saved && window.APP_CONFIG.currencies[saved] ? saved : null;
    },

    // 保存用户选择的分类
    saveLastCategory(categoryId) {
      if (categoryId) {
        localStorage.setItem(this.keys.lastCategory, categoryId);
      }
    },

    // 获取上次选择的分类
    getLastCategory() {
      return localStorage.getItem(this.keys.lastCategory);
    },

    // 保存用户选择的类型
    saveLastType(type) {
      if (type && (type === 'expense' || type === 'income')) {
        localStorage.setItem(this.keys.lastType, type);
      }
    },

    // 获取上次选择的类型
    getLastType() {
      const saved = localStorage.getItem(this.keys.lastType);
      return saved && (saved === 'expense' || saved === 'income') ? saved : null;
    },

    // 保存最后选择的钱包
    saveLastWallet(walletId) {
      if (walletId) {
        localStorage.setItem(this.keys.lastWallet, walletId);
      }
    },

    // 获取最后选择的钱包
    getLastWallet() {
      return localStorage.getItem(this.keys.lastWallet);
    },

    // 清除所有用户偏好设置
    clearAll() {
      Object.values(this.keys).forEach(key => {
        localStorage.removeItem(key);
      });
    }
  },

  // 页面URL配置
  urls: {
    // 获取当前域名
    getBaseUrl() {
      return window.location.origin;
    },
    
    // 获取页面完整URL
    getPageUrl(pageName) {
      return this.getBaseUrl() + '/' + pageName;
    },
    
    // 环境检测
    isProduction() {
      return window.location.hostname !== 'localhost';
    },
    
    // 获取环境信息
    getEnvironment() {
      return this.isProduction() ? 'production' : 'development';
    },
    
    // 常用页面URL
    home: '/home.html',
    login: '/login.html',
    transaction: '/transaction.html',
    analysis: '/analysis.html',
    settings: '/settings.html',
    test: '/test_basic.html'
  },

  // 访问控制开关（feature flag）
  accessControl: {
    enabled: true,        // 是否启用按成员过滤（已启用用于测试）
    fallbackShowAll: false // 开启后若无可用账本/钱包，是否回退显示"全部"（已关闭，无权限用户应看到空状态）
  },

  // 支持的币种配置
  currencies: {
    SGD: {
      code: 'SGD',
      name: 'Singapore Dollar',
      symbol: 'S$',
      displayOrder: 1,
      decimalPlaces: 2
    },
    CNY: {
      code: 'CNY', 
      name: 'Chinese Yuan',
      symbol: '¥',
      displayOrder: 2,
      decimalPlaces: 2
    },
    USD: {
      code: 'USD',
      name: 'US Dollar', 
      symbol: '$',
      displayOrder: 3,
      decimalPlaces: 2
    },
    MYR: {
      code: 'MYR',
      name: 'Malaysian Ringgit',
      symbol: 'RM', 
      displayOrder: 4,
      decimalPlaces: 2
    }
  },

  // 获取所有币种列表
  getCurrencies() {
    return Object.values(this.currencies);
  },

  // 获取活跃币种列表
  getActiveCurrencies() {
    return this.getCurrencies().filter(c => c.isActive !== false);
  },

  // 根据代码获取币种信息
  getCurrencyByCode(code) {
    return this.currencies[code];
  },

  // 获取币种符号
  getCurrencySymbol(code) {
    return this.currencies[code]?.symbol || code;
  },

  // 获取币种名称
  getCurrencyName(code) {
    return this.currencies[code]?.name || code;
  },

  // 格式化币种显示（显示Code）
  formatCurrencyDisplay(code) {
    return code; // 直接显示Code，如 SGD
  },

  // 生成币种选择器选项
  generateCurrencyOptions() {
    return this.getActiveCurrencies()
      .sort((a, b) => a.displayOrder - b.displayOrder)
      .map(currency => 
        `<option value="${currency.code}">${currency.code}</option>`
      ).join('');
  },

  // 获取币种代码列表
  getCurrencyCodes() {
    return this.getActiveCurrencies()
      .sort((a, b) => a.displayOrder - b.displayOrder)
      .map(c => c.code);
  },

  // 全局色板配置
  colorPalette: [
    '#ef4444', // 支出-红
    '#10b981', // 收入-绿
    '#3b82f6', // 净结果-蓝
    '#f59e0b', // 交易数-橙
    '#8b5cf6', // 紫
    '#06b6d4', // 青
    '#d946ef', // 洋红
    '#facc15', // 黄
    '#a16207', // 棕
    '#ec4899', // 粉
    '#0ea5e9', // 天蓝
    '#6b8e23'  // 橄榄绿
  ],

  // 获取类别颜色（按顺序使用）
  getCategoryColor(index) {
    return this.colorPalette[index % this.colorPalette.length];
  },

  // 获取Financial Trends原始颜色
  getFinancialTrendsColors() {
    return {
      expense: this.colorPalette[0],      // 支出-红
      income: this.colorPalette[1],       // 收入-绿
      net: this.colorPalette[2],          // 净结果-蓝
      transactions: this.colorPalette[3]  // 交易数-橙
    };
  }
};
