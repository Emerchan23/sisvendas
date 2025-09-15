"use client"

import type React from "react"

import Image from "next/image"
import Link from "next/link"
import { usePathname, useRouter } from "next/navigation"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { useEffect, useMemo, useState } from "react"
import { getConfig, CONFIG_CHANGED_EVENT } from "@/lib/config"
import { useAuth } from "@/contexts/AuthContext"
import { LogOut, User, LayoutDashboard, ShoppingCart, Calculator, Users, Building2, Package, CreditCard, BarChart3, Briefcase, FileText, Settings } from "lucide-react"

import { ERP_CHANGED_EVENT } from "@/lib/data-store"

const routes = [
  { href: "/", label: "Dashboard", icon: LayoutDashboard, permission: null }, // Dashboard sempre visível
  { href: "/vendas", label: "Vendas", icon: ShoppingCart, permission: "vendas" },
  { href: "/acertos", label: "Acertos", icon: Calculator, permission: "acertos" },
  { href: "/clientes", label: "Clientes", icon: Users, permission: "clientes" },
  { href: "/fornecedores", label: "Fornecedores", icon: Building2, permission: "fornecedores" },

  { href: "/vales", label: "Vale", icon: CreditCard, permission: "vales" },
  { href: "/relatorios", label: "Relatórios", icon: BarChart3, permission: "relatorios" },
  { href: "/outros-negocios", label: "Outros negócios", icon: Briefcase, permission: "outros-negocios" },
  { href: "/orcamentos", label: "Orçamentos", icon: FileText, permission: "orcamentos" },
  { href: "/configuracoes", label: "Configurações", icon: Settings, permission: "configuracoes" },
]

export function AppHeader({ className = "" }: { className?: string }) {
  const pathname = usePathname()
  const router = useRouter()
  const { usuario, logout, hasPermission, isAdmin } = useAuth()
  const [brand, setBrand] = useState<string>("LP IND")
  const [logoUrl, setLogoUrl] = useState<string | undefined>(undefined)
  const [imageError, setImageError] = useState<boolean>(false)

  // Filtrar rotas baseado nas permissões do usuário
  const filteredRoutes = useMemo(() => {
    if (!usuario) return []
    
    return routes.filter(route => {
      // Dashboard sempre visível
      if (route.permission === null) return true
      
      // Admin tem acesso a tudo
      if (isAdmin()) return true
      
      // Verificar permissão específica
      return hasPermission(route.permission)
    })
  }, [usuario, hasPermission, isAdmin])

  const placeholderLogo = useMemo(() => "/placeholder.svg?height=28&width=28", [])
  
  // Função para sanitizar URLs de logo e evitar erro CORS
  const sanitizeLogoUrl = (url: string | undefined): string => {
    if (!url || url.trim() === "") {
      return placeholderLogo
    }
    
    // Verificar se é um link do Google Drive e substituir por placeholder
    if (url.includes('drive.google.com') || url.includes('googleusercontent.com')) {
      console.warn('URL do Google Drive detectada no cabeçalho, usando placeholder para evitar erro CORS:', url)
      return placeholderLogo
    }
    
    return url
  }

  useEffect(() => {
    const initData = async () => {
      try {
        const cfg = getConfig()
        
        // Usar dados da configuração geral
        setBrand(cfg?.nomeDoSistema || "LP IND")
        setLogoUrl(cfg?.logoUrl || undefined)
        setImageError(false) // Reset error state when URL changes
      } catch (error) {
        console.error("Erro ao carregar dados:", error)
      }
    }

    initData()

    const onConfigChanged = () => {
      const cfg = getConfig()
      setBrand(cfg?.nomeDoSistema || "LP IND")
      setLogoUrl(cfg?.logoUrl || undefined)
      setImageError(false) // Reset error state when URL changes
    }

    window.addEventListener(CONFIG_CHANGED_EVENT, onConfigChanged as EventListener)
    
    return () => {
      window.removeEventListener(CONFIG_CHANGED_EVENT, onConfigChanged as EventListener)
    }
  }, [pathname])

  return (
    <header
      className={cn(
        "sticky top-0 z-40 w-full border-b bg-gradient-to-r from-background/90 via-background/85 to-background/90 backdrop-blur-xl supports-[backdrop-filter]:bg-background/70 shadow-lg shadow-black/5",
        className,
      )}
    >
      <div className="mx-auto flex h-16 min-h-16 items-center gap-2 px-4">
        {/* Marca */}
        <Link href="/" className="flex shrink-0 items-center gap-2" title={brand}>
          {logoUrl && !imageError ? (
            <Image
              src={sanitizeLogoUrl(logoUrl)}
              alt="Logo da empresa"
              width={48}
              height={48}
              className="rounded object-cover"
              onError={() => {
                console.warn('Erro ao carregar imagem do logo:', logoUrl)
                setImageError(true)
              }}
            />
          ) : (
            <div className="w-12 h-12 rounded-full bg-gradient-to-br from-blue-500 to-blue-700 flex flex-col items-center justify-center text-white">
              <div className="text-xs font-bold leading-none">ID</div>
              <div className="text-[6px] font-semibold leading-none tracking-wider">DISTRIBUIÇÃO</div>
            </div>
          )}
          <span className="font-semibold truncate max-w-[40vw]">{brand}</span>
        </Link>

        {/* Navegação principal */}
        <nav
          aria-label="Principal"
          className="hidden md:flex flex-1 items-center gap-2 overflow-x-auto whitespace-nowrap [-ms-overflow-style:none] [scrollbar-width:none] min-w-0"
          style={{ scrollbarWidth: "none" } as React.CSSProperties}
        >
          {filteredRoutes.map((r) => {
            const active = pathname === r.href
            const IconComponent = r.icon
            return (
              <Link key={r.href} href={r.href} className="shrink-0">
                <Button
                  variant={active ? "default" : "ghost"}
                  className={cn(
                    "text-sm font-medium px-4 py-2 rounded-lg border transition-all duration-300 ease-in-out transform hover:scale-105 flex items-center gap-2",
                    active 
                      ? "bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500 text-white shadow-lg border-transparent hover:shadow-xl" 
                      : "text-gray-700 hover:text-white hover:bg-gradient-to-r hover:from-blue-400 hover:to-purple-400 border-gray-200 hover:border-transparent hover:shadow-md"
                  )}
                >
                  <IconComponent className="w-4 h-4" />
                  <span>{r.label}</span>
                </Button>
              </Link>
            )
          })}
        </nav>

        {/* Menu */}
        <div className="ml-auto flex shrink-0 items-center gap-2 min-w-0">
          {/* Informações do usuário */}
          {usuario && (
            <div className="hidden sm:flex items-center gap-2 text-sm text-muted-foreground">
              <User className="h-4 w-4" />
              <span className="truncate max-w-32">{usuario.nome}</span>
            </div>
          )}

          {/* Botão de logout */}
          {usuario && (
            <Button
              variant="ghost"
              size="sm"
              onClick={logout}
              className="text-sm font-medium px-3 py-2 rounded-lg transition-all duration-300 ease-in-out hover:bg-gradient-to-r hover:from-red-50 hover:to-red-100 dark:hover:from-red-900/20 dark:hover:to-red-800/20 hover:text-red-600 dark:hover:text-red-400 hover:shadow-md transform hover:scale-105"
              title="Sair"
            >
              <LogOut className="h-4 w-4" />
              <span className="hidden sm:inline ml-1">Sair</span>
            </Button>
          )}

          {/* Navegação compacta no mobile */}
          <div className="md:hidden">
            <Link href="/menu">
              <Button 
                variant="ghost" 
                className="text-sm font-medium px-4 py-2 rounded-lg transition-all duration-300 ease-in-out hover:bg-gradient-to-r hover:from-blue-50 hover:to-purple-50 dark:hover:from-blue-900/20 dark:hover:to-purple-900/20 hover:shadow-md transform hover:scale-105"
              >
                Menu
              </Button>
            </Link>
          </div>
        </div>
      </div>

      {/* Barra secundária no mobile */}
      <div className="md:hidden border-t bg-gradient-to-r from-background/95 to-background/90 backdrop-blur-sm">
        <div
          className="flex items-center gap-2 overflow-x-auto px-3 py-3 whitespace-nowrap [-ms-overflow-style:none] [scrollbar-width:none]"
          style={{ scrollbarWidth: "none" } as React.CSSProperties}
        >
          {filteredRoutes.map((r) => {
            const active = pathname === r.href
            return (
              <Link key={r.href} href={r.href} className="shrink-0">
                <Button 
                  size="sm" 
                  variant={active ? "secondary" : "ghost"} 
                  className={cn(
                    "text-xs font-medium px-3 py-2 rounded-lg transition-all duration-300 ease-in-out transform hover:scale-105",
                    active 
                      ? "bg-gradient-to-r from-blue-500 to-purple-500 text-white shadow-md shadow-blue-500/20" 
                      : "hover:bg-gradient-to-r hover:from-gray-100 hover:to-gray-50 dark:hover:from-gray-800 dark:hover:to-gray-700 hover:shadow-sm"
                  )}
                >
                  {r.label}
                </Button>
              </Link>
            )
          })}
        </div>
      </div>
    </header>
  )
}