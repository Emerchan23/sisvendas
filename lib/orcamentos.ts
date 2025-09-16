"use client"

import { api, type Orcamento, type OrcamentoItem, type OrcamentoCliente } from "@/lib/api-client"

// Re-export types for compatibility
export type { Orcamento, OrcamentoItem, OrcamentoCliente }

// Public API using backend
export async function getOrcamentos(): Promise<Orcamento[]> {
  try {
    return await api.orcamentos.list()
  } catch (error) {
    console.error("Erro ao buscar orçamentos:", error)
    return []
  }
}

export function totalOrcamento(o: Pick<Orcamento, "itens">): number {
  return o.itens.reduce((sum, item) => sum + item.quantidade * item.valor_unitario - (item.desconto || 0), 0)
}

type SaveInput = Partial<Orcamento> & {
  // Additional fields for compatibility
  cliente_id?: string
  data_orcamento?: string
  // Legacy support
  data?: string
  cliente?: any
  // Ensure itens field is properly typed
  itens?: OrcamentoItem[]
  // Override numero to accept string only (consistent with Orcamento type)
  numero?: string
}

export async function saveOrcamento(input: SaveInput): Promise<Orcamento | null> {
  try {
    console.log('📤 [LIB MODALIDADE] Dados recebidos na função saveOrcamento:', JSON.stringify(input, null, 2));
    console.log('📤 [LIB MODALIDADE] Modalidade no input:', input.modalidade);
    console.log('📤 [LIB MODALIDADE] Tipo da modalidade:', typeof input.modalidade);
    console.log('🔍 [LIB] Verificando se tem ID:', !!input.id, 'ID:', input.id);
    
    // Convert input to match API expectations
    const apiInput: Partial<Orcamento> = {
      ...input,
      // Keep numero as string to preserve format (e.g., "01/2025")
      numero: input.numero
    }
    
    console.log('📤 [LIB MODALIDADE] Dados convertidos para API:', JSON.stringify(apiInput, null, 2));
    console.log('📤 [LIB MODALIDADE] Modalidade no apiInput:', apiInput.modalidade);
    
    if (input.id) {
      console.log('📝 [LIB] Atualizando orçamento existente:', input.id);
      
      // Validar se o ID existe antes de tentar atualizar
      try {
        console.log('🔍 [LIB] Verificando se orçamento existe antes do PATCH...');
        const orcamentos = await api.orcamentos.list();
        const orcamentoExiste = orcamentos.find(o => o.id === input.id);
        
        if (!orcamentoExiste) {
          console.warn('⚠️ [LIB] Orçamento com ID', input.id, 'não encontrado. Criando novo orçamento...');
          // Se o ID não existe, criar um novo orçamento
          const result = await api.orcamentos.create(apiInput)
          console.log('✅ [LIB] Novo orçamento criado:', result);
          return { ...input, id: result.id || 'new-id' } as Orcamento
        }
        
        console.log('✅ [LIB] Orçamento existe, prosseguindo com PATCH...');
      } catch (listError) {
        console.warn('⚠️ [LIB] Erro ao verificar existência do orçamento, tentando PATCH direto:', listError);
      }
      
      console.log('🔍 [LIB] Fazendo PATCH para /api/orcamentos/' + input.id);
      console.log('📤 [LIB MODALIDADE] Dados de atualização sendo enviados:', JSON.stringify(apiInput, null, 2));
      const updateResult = await api.orcamentos.update(input.id, apiInput)
      console.log('📥 [LIB MODALIDADE] Resultado da atualização:', updateResult);
      // Return a mock successful result for update
      return { ...input, id: input.id } as Orcamento
    } else {
      console.log('🆕 [LIB] Criando novo orçamento');
      console.log('🔍 [LIB] Fazendo POST para /api/orcamentos');
      console.log('📤 [LIB MODALIDADE] Dados finais sendo enviados para API:', JSON.stringify(apiInput, null, 2));
      const result = await api.orcamentos.create(apiInput)
      console.log('✅ [LIB] Resultado da criação:', result);
      console.log('📥 [LIB MODALIDADE] Resultado da criação:', result);
      // Return a mock successful result for creation
      return { ...input, id: result.id || 'new-id' } as Orcamento
    }
  } catch (error) {
    console.error("❌ [LIB] Erro ao salvar orçamento:", error)
    return null
  }
}

export async function deleteOrcamento(id: string): Promise<boolean> {
  try {
    // Validar se o ID é válido antes de fazer a requisição
    if (!id || id === 'null' || id === 'undefined') {
      console.error('❌ [DELETE] ID inválido fornecido:', id)
      throw new Error('ID do orçamento é inválido')
    }
    
    console.log('🗑️ [DELETE] Deletando orçamento com ID:', id)
    await api.orcamentos.delete(id)
    console.log('✅ [DELETE] Orçamento deletado com sucesso')
    return true
  } catch (error) {
    console.error("❌ [DELETE] Erro ao deletar orçamento:", error)
    return false
  }
}

export async function aprovarOrcamento(id: string): Promise<boolean> {
  try {
    await api.patch(`/api/orcamentos/${id}`, { status: "aprovado" })
    return true
  } catch (error) {
    console.error('Erro ao aprovar orçamento:', error)
    return false
  }
}

export async function desaprovarOrcamento(id: string): Promise<boolean> {
  try {
    await api.patch(`/api/orcamentos/${id}`, { status: "pendente" })
    return true
  } catch (error) {
    console.error('Erro ao desaprovar orçamento:', error)
    return false
  }
}

export function sanitizeOrcamentoForCustomer(o: Orcamento) {
  return {
    numero: o.numero,
    data: o.data,
    cliente: o.cliente,
    itens: o.itens.map((item) => ({
      descricao: item.descricao || "Item",
      marca: item.marca || "",
      quantidade: item.quantidade,
      precoUnitario: item.valor_unitario,
      desconto: item.desconto || 0,
      total: item.quantidade * item.valor_unitario - (item.desconto || 0),
    })),
    observacoes: o.observacoes,
    total: totalOrcamento(o),
  }
}

// Legacy function for compatibility - now uses backend
export async function saveOrcamentoLocal(input: SaveInput): Promise<Orcamento | null> {
  return saveOrcamento(input)
}
