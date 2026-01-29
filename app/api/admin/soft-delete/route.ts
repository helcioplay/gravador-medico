import { createClient } from '@supabase/supabase-js'
import { NextResponse } from 'next/server'

export const dynamic = 'force-dynamic'

export async function POST(request: Request) {
  const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!
  );
  
  try {
    const { table, id } = await request.json();
    
    if (!table || !id) {
      return NextResponse.json(
        { error: 'Table and ID are required' },
        { status: 400 }
      );
    }
    
    // Validar tabela permitida
    const allowedTables = ['sales', 'customers', 'abandoned_carts'];
    if (!allowedTables.includes(table)) {
      return NextResponse.json(
        { error: 'Invalid table' },
        { status: 400 }
      );
    }
    
    // Soft delete: define deleted_at com timestamp atual
    const { error } = await supabase
      .from(table)
      .update({ deleted_at: new Date().toISOString() })
      .eq('id', id);
    
    if (error) {
      console.error('❌ Erro ao excluir:', error);
      return NextResponse.json(
        { error: error.message },
        { status: 500 }
      );
    }
    
    return NextResponse.json({ 
      success: true,
      message: 'Item excluído do dashboard com sucesso'
    });
    
  } catch (error: any) {
    console.error('❌ Erro na API:', error);
    return NextResponse.json(
      { error: error.message },
      { status: 500 }
    );
  }
}
