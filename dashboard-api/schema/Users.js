cube(`Users`, {
    sql: `SELECT * FROM users`,
  
    measures: {
      count: {
        sql: `id`,
        type: `count`,
      },
    },
  
    dimensions: {
      city: {
        sql: `city`,
        type: `string`,
      },
  
      signedUp: {
        sql: `created_at`,
        type: `time`,
      },
  
      companyName: {
        sql: `company_name`,
        type: `string`,
      },
    },
  });
  