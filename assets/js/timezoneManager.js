// 全局时区管理器
class TimezoneManager {
    constructor(supabaseClient) {
        this.userTimezone = this.getUserTimezone();
        this.supabase = supabaseClient;
    }
    
    // 获取用户时区
    getUserTimezone() {
        return Intl.DateTimeFormat().resolvedOptions().timeZone || 'UTC';
    }
    
    // 将本地日期转换为UTC时间范围
    async getUTCDateRange(startDate, endDate) {
        const { data, error } = await this.supabase.rpc('get_utc_date_range', {
            p_start_date: startDate,
            p_end_date: endDate,
            p_timezone: this.userTimezone
        });
        
        if (error) throw error;
        return data[0]; // 返回 { utc_start, utc_end }
    }
    
    // 查询交易数据（使用时区转换）
    async queryTransactionsByLocalDateRange(startDate, endDate, filters = {}) {
        try {
            // 1. 获取UTC时间范围
            const { utc_start, utc_end } = await this.getUTCDateRange(startDate, endDate);
            
            // 2. 构建查询
            let query = this.supabase
                .from('transactions')
                .select('*')
                .gte('transaction_date', utc_start)
                .lte('transaction_date', utc_end);
            
            // 3. 应用其他筛选器
            if (filters.ledger_id) {
                query = query.eq('ledger_id', filters.ledger_id);
            }
            if (filters.payer_id) {
                query = query.eq('payer_id', filters.payer_id);
            }
            if (filters.status) {
                query = query.eq('reimbursement_status', filters.status);
            }
            
            const { data, error } = await query;
            if (error) throw error;
            
            // 4. 转换为本地时间显示
            return data.map(transaction => ({
                ...transaction,
                display_date: this.convertToLocalTime(transaction.transaction_date)
            }));
            
        } catch (error) {
            console.error('Error querying transactions:', error);
            throw error;
        }
    }
    
    // 转换UTC时间为本地时间显示
    convertToLocalTime(utcTime) {
        if (!utcTime) return null;
        return new Date(utcTime).toLocaleString('en-US', {
            timeZone: this.userTimezone,
            year: 'numeric',
            month: '2-digit',
            day: '2-digit',
            hour: '2-digit',
            minute: '2-digit'
        });
    }
    
    // 转换本地时间为UTC时间（用于保存）
    convertToUTC(localTime) {
        if (!localTime) return null;
        const date = new Date(localTime);
        return date.toISOString();
    }
    
    // 获取本地时间字符串（用于数据库查看）
    getLocalTimeString(utcTime) {
        if (!utcTime) return null;
        const date = new Date(utcTime);
        const year = date.getFullYear();
        const month = String(date.getMonth() + 1).padStart(2, '0');
        const day = String(date.getDate()).padStart(2, '0');
        const hours = String(date.getHours()).padStart(2, '0');
        const minutes = String(date.getMinutes()).padStart(2, '0');
        const seconds = String(date.getSeconds()).padStart(2, '0');
        return `${year}-${month}-${day} ${hours}:${minutes}:${seconds}`;
    }
}

// 全局实例 - 将在页面中初始化
window.timezoneManager = null;
