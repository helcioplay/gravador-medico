// ================================================================
// Script: Sincronizar Histórico do WhatsApp (Evolution API)
// ================================================================
// node scripts/sync-whatsapp-history.js
// ================================================================

const { syncAllConversations } = require('../lib/whatsapp-sync')

// ================================================================
// CONFIGURAÇÃO - EDITAR AQUI!
// ================================================================
const EVOLUTION_CONFIG = {
  apiUrl: process.env.EVOLUTION_API_URL || 'https://sua-evolution-api.com',
  apiKey: process.env.EVOLUTION_API_KEY || 'sua-api-key-aqui',
  instanceName: process.env.EVOLUTION_INSTANCE_NAME || 'sua-instancia'
}

const MESSAGES_PER_CHAT = 100 // Quantas mensagens buscar por conversa

// ================================================================
// SCRIPT PRINCIPAL
// ================================================================

async function main() {
  console.log('🚀 Iniciando sincronização do WhatsApp...')
  console.log('📡 API URL:', EVOLUTION_CONFIG.apiUrl)
  console.log('🔑 Instance:', EVOLUTION_CONFIG.instanceName)
  console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n')

  try {
    const result = await syncAllConversations(EVOLUTION_CONFIG, MESSAGES_PER_CHAT)

    console.log('\n━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━')
    console.log('✅ SINCRONIZAÇÃO CONCLUÍDA!')
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━')
    console.log(`📊 Total de chats: ${result.totalChats}`)
    console.log(`💬 Total de mensagens: ${result.totalMessages}`)
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n')

    console.log('💡 Próximos passos:')
    console.log('1. Configure o webhook na Evolution API:')
    console.log(`   URL: https://seu-dominio.com/api/webhooks/whatsapp`)
    console.log('   Eventos: messages.upsert')
    console.log('2. Acesse o dashboard: /dashboard/whatsapp')
    console.log('3. Novas mensagens serão salvas automaticamente via webhook\n')

    process.exit(0)
  } catch (error) {
    console.error('\n❌ ERRO NA SINCRONIZAÇÃO:', error)
    console.error('\nVerifique:')
    console.error('1. Se a Evolution API está online')
    console.error('2. Se a API Key está correta')
    console.error('3. Se o nome da instância está correto')
    console.error('4. Se o Supabase está configurado corretamente\n')
    process.exit(1)
  }
}

// Executar
if (require.main === module) {
  main()
}

module.exports = { main }
