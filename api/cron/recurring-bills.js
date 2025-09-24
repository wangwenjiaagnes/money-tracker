// Vercel Cron Job for Recurring Bills
// 需要在 Vercel 项目设置中配置环境变量

export default async function handler(req, res) {
  // 验证请求来源（可选，增加安全性）
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const response = await fetch(`${process.env.SUPABASE_URL}/functions/v1/recurring-bill-runner`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${process.env.SUPABASE_ANON_KEY}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ action: 'run_recurring_bills' })
    });

    const result = await response.json();
    
    if (response.ok) {
      res.status(200).json({ 
        success: true, 
        message: 'Recurring bills processed successfully',
        data: result 
      });
    } else {
      res.status(500).json({ 
        success: false, 
        error: 'Failed to process recurring bills',
        details: result 
      });
    }
  } catch (error) {
    console.error('Cron job error:', error);
    res.status(500).json({ 
      success: false, 
      error: 'Internal server error',
      details: error.message 
    });
  }
}

// Vercel Cron 配置
export const config = {
  // 每天凌晨 2 点执行（UTC 时间）
  // 格式：分钟 小时 日 月 星期
  cron: '0 2 * * *'
};
