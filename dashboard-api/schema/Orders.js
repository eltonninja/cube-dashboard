cube(`Orders`, {
    sql: `SELECT * FROM orders`,
  
    measures: {
      count: {
        sql: `id`,
        type: `count`,
      },
    },
  
    dimensions: {
      status: {
        sql: `status`,
        type: `string`,
      },
      createdAt: {
        sql: `created_at`,
        type: `time`,
      },
    },
  });
  