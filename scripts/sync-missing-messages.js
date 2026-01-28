// Script para sincronizar mensagens faltantes da Evolution API para o Supabase

const EVOLUTION_URL = 'https://evolution-api-production-eb21.up.railway.app';
const EVOLUTION_KEY = 'Beagle3005';
const INSTANCE = 'whatsapp-principal';
const SUPABASE_URL = 'https://egsmraszqnmosmtjuzhx.supabase.co';
const SUPABASE_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImVnc21yYXN6cW5tb3NtdGp1emh4Iiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc2ODQ4NzcxMCwiZXhwIjoyMDg0MDYzNzEwfQ.wuM5GbYqaDTyf4T3fR62U1sWqZ06RJ3nXHk56I2VcAQ';

// Conversa específica para sincronizar
const TARGET_REMOTE_JID = process.argv[2] || '553199185012@s.whatsapp.net';

async function fetchEvolutionMessages(remoteJid) {
  console.log(`🔍 Buscando mensagens de ${remoteJid} na Evolution API...`);
  
  const response = await fetch(`${EVOLUTION_URL}/chat/findMessages/${INSTANCE}`, {
    method: 'POST',
    headers: {
      'apikey': EVOLUTION_KEY,
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({
      where: { key: { remoteJid } },
      limit: 500
    })
  });
  
  const data = await response.json();
  return data.messages?.records || [];
}

async function getExistingMessageIds(remoteJid) {
  console.log(`🔍 Buscando message_ids existentes no Supabase...`);
  
  const response = await fetch(
    `${SUPABASE_URL}/rest/v1/whatsapp_messages?remote_jid=eq.${encodeURIComponent(remoteJid)}&select=message_id`,
    {
      headers: {
        'apikey': SUPABASE_KEY,
        'Authorization': `Bearer ${SUPABASE_KEY}`
      }
    }
  );
  
  const data = await response.json();
  console.log('📊 Resposta Supabase:', Array.isArray(data) ? `${data.length} registros` : JSON.stringify(data).substring(0, 200));
  
  if (!Array.isArray(data)) {
    console.warn('⚠️ Resposta não é array, retornando vazio');
    return [];
  }
  
  return data.map(m => m.message_id).filter(Boolean);
}

function extractMessageContent(msg) {
  const message = msg.message || {};
  
  // Texto simples
  if (message.conversation) {
    return { content: message.conversation, type: 'text', mediaUrl: null };
  }
  
  // Texto estendido
  if (message.extendedTextMessage?.text) {
    return { content: message.extendedTextMessage.text, type: 'text', mediaUrl: null };
  }
  
  // Imagem
  if (message.imageMessage) {
    return {
      content: message.imageMessage.caption || '[Imagem]',
      type: 'image',
      mediaUrl: message.imageMessage.url || message.imageMessage.mediaUrl || null
    };
  }
  
  // Áudio
  if (message.audioMessage) {
    return {
      content: '[Áudio]',
      type: 'audio',
      mediaUrl: message.audioMessage.url || message.audioMessage.mediaUrl || null
    };
  }
  
  // Documento
  if (message.documentMessage) {
    return {
      content: message.documentMessage.fileName || '[Documento]',
      type: 'document',
      mediaUrl: message.documentMessage.url || message.documentMessage.mediaUrl || null
    };
  }
  
  // Vídeo
  if (message.videoMessage) {
    return {
      content: message.videoMessage.caption || '[Vídeo]',
      type: 'video',
      mediaUrl: message.videoMessage.url || message.videoMessage.mediaUrl || null
    };
  }
  
  // Sticker
  if (message.stickerMessage) {
    return { content: '[Sticker]', type: 'sticker', mediaUrl: null };
  }
  
  return { content: '[Mensagem]', type: 'text', mediaUrl: null };
}

async function insertMessage(msg, remoteJid) {
  const { content, type, mediaUrl } = extractMessageContent(msg);
  const timestamp = new Date(msg.messageTimestamp * 1000).toISOString();
  
  const payload = {
    message_id: msg.key.id,
    remote_jid: remoteJid,
    content: content,
    message_type: type,
    media_url: mediaUrl,
    from_me: msg.key.fromMe,
    timestamp: timestamp,
    status: 'delivered',
    raw_payload: msg
  };
  
  const response = await fetch(`${SUPABASE_URL}/rest/v1/whatsapp_messages`, {
    method: 'POST',
    headers: {
      'apikey': SUPABASE_KEY,
      'Authorization': `Bearer ${SUPABASE_KEY}`,
      'Content-Type': 'application/json',
      'Prefer': 'return=minimal'
    },
    body: JSON.stringify(payload)
  });
  
  if (!response.ok) {
    const error = await response.text();
    throw new Error(`Erro ao inserir: ${error}`);
  }
  
  return true;
}

async function main() {
  try {
    // Buscar mensagens da Evolution
    const evolutionMessages = await fetchEvolutionMessages(TARGET_REMOTE_JID);
    console.log(`📥 Total na Evolution: ${evolutionMessages.length}`);
    
    // Buscar IDs existentes
    const existingIds = await getExistingMessageIds(TARGET_REMOTE_JID);
    console.log(`📊 Total no Supabase: ${existingIds.length}`);
    
    // Filtrar faltantes
    const missing = evolutionMessages.filter(m => {
      const msgId = m.key?.id;
      return msgId && !existingIds.includes(msgId);
    });
    
    console.log(`❌ Faltando: ${missing.length} mensagens`);
    
    if (missing.length === 0) {
      console.log('✅ Todas as mensagens já estão sincronizadas!');
      return;
    }
    
    // Inserir faltantes
    console.log('\n📤 Inserindo mensagens faltantes...\n');
    
    let inserted = 0;
    let errors = 0;
    
    for (const msg of missing) {
      try {
        const { content } = extractMessageContent(msg);
        const preview = content.substring(0, 50).replace(/\n/g, ' ');
        console.log(`  → ${msg.key.id.substring(0, 15)}... | ${msg.key.fromMe ? '➡️' : '⬅️'} | ${preview}...`);
        
        await insertMessage(msg, TARGET_REMOTE_JID);
        inserted++;
      } catch (err) {
        console.error(`  ❌ Erro: ${err.message}`);
        errors++;
      }
    }
    
    console.log(`\n✅ Concluído: ${inserted} inseridas, ${errors} erros`);
    
  } catch (error) {
    console.error('❌ Erro fatal:', error);
    process.exit(1);
  }
}

main();
