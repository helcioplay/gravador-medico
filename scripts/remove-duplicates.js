// Script para remover mensagens duplicatas

const SUPABASE_URL = 'https://egsmraszqnmosmtjuzhx.supabase.co';
const SUPABASE_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImVnc21yYXN6cW5tb3NtdGp1emh4Iiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc2ODQ4NzcxMCwiZXhwIjoyMDg0MDYzNzEwfQ.wuM5GbYqaDTyf4T3fR62U1sWqZ06RJ3nXHk56I2VcAQ';

const REMOTE_JID = process.argv[2] || '553199185012@s.whatsapp.net';

async function main() {
  console.log(`🔍 Buscando mensagens de ${REMOTE_JID}...`);
  
  // Buscar todas as mensagens
  const response = await fetch(
    `${SUPABASE_URL}/rest/v1/whatsapp_messages?remote_jid=eq.${encodeURIComponent(REMOTE_JID)}&select=id,message_id,content,timestamp&order=timestamp.asc`,
    {
      headers: {
        'apikey': SUPABASE_KEY,
        'Authorization': `Bearer ${SUPABASE_KEY}`
      }
    }
  );
  
  const messages = await response.json();
  console.log(`📊 Total de mensagens: ${messages.length}`);
  
  // Identificar duplicatas (mesmo conteúdo + mesmo minuto)
  const seen = new Map();
  const duplicates = [];
  
  for (const msg of messages) {
    const content = (msg.content || '').substring(0, 50);
    const timestamp = (msg.timestamp || '').substring(0, 16); // até minuto
    const key = `${content}|${timestamp}`;
    
    if (seen.has(key)) {
      duplicates.push(msg.id);
    } else {
      seen.set(key, msg.id);
    }
  }
  
  console.log(`✅ Mensagens únicas: ${seen.size}`);
  console.log(`❌ Duplicatas encontradas: ${duplicates.length}`);
  
  if (duplicates.length === 0) {
    console.log('🎉 Nenhuma duplicata para remover!');
    return;
  }
  
  // Remover duplicatas
  console.log('\n🗑️ Removendo duplicatas...');
  
  let removed = 0;
  for (const id of duplicates) {
    try {
      const delResponse = await fetch(
        `${SUPABASE_URL}/rest/v1/whatsapp_messages?id=eq.${id}`,
        {
          method: 'DELETE',
          headers: {
            'apikey': SUPABASE_KEY,
            'Authorization': `Bearer ${SUPABASE_KEY}`
          }
        }
      );
      
      if (delResponse.ok) {
        removed++;
        process.stdout.write('.');
      }
    } catch (err) {
      console.error(`\n❌ Erro ao remover ${id}:`, err.message);
    }
  }
  
  console.log(`\n\n✅ Removidas ${removed} duplicatas!`);
}

main().catch(console.error);
