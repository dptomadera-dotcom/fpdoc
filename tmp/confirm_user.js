const { Client } = require('pg');

const connectionString = "postgresql://postgres.dsoxbghnlnlpztjnmpak:DBJbaMq*-3%26dY6x@aws-1-eu-west-1.pooler.supabase.com:5432/postgres";

async function confirmUser() {
  const client = new Client({ connectionString });
  try {
    await client.connect();
    console.log('--- Conectando a Supabase DB ---');
    
    const query = `
      UPDATE auth.users 
      SET email_confirmed_at = NOW(), 
          confirmed_at = NOW(), 
          last_sign_in_at = NOW() 
      WHERE id = '9edce74c-caeb-4172-b833-45fe5adbccfa';
    `;
    
    const res = await client.query(query);
    console.log('--- Usuario confirmado con éxito ---');
    console.log('Filas afectadas:', res.rowCount);
  } catch (err) {
    console.error('--- Error al confirmar usuario ---');
    console.error(err);
  } finally {
    await client.end();
  }
}

confirmUser();
