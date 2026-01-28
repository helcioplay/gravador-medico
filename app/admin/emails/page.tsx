'use client'

import { useEffect, useState } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Badge } from '@/components/ui/badge'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { Mail, Search, Eye, RefreshCw, CheckCircle2, XCircle, Clock, Send } from 'lucide-react'
import { format } from 'date-fns'
import { ptBR } from 'date-fns/locale'

interface EmailLog {
  id: string
  email_id: string | null
  recipient_email: string
  recipient_name: string | null
  subject: string
  html_content: string | null
  email_type: string
  status: string
  opened: boolean
  open_count: number
  first_opened_at: string | null
  order_id: string | null
  created_at: string
  sent_at: string | null
  error_message: string | null
  user_agent: string | null
  device_type: string | null
  browser: string | null
  os: string | null
}

interface EmailStats {
  total: number
  sent: number
  opened: number
  failed: number
  open_rate: number
}

export default function EmailManagementPage() {
  const [emails, setEmails] = useState<EmailLog[]>([])
  const [stats, setStats] = useState<EmailStats>({
    total: 0,
    sent: 0,
    opened: 0,
    failed: 0,
    open_rate: 0,
  })
  const [loading, setLoading] = useState(true)
  const [search, setSearch] = useState('')
  const [statusFilter, setStatusFilter] = useState('all')
  const [typeFilter, setTypeFilter] = useState('all')
  const [selectedEmail, setSelectedEmail] = useState<EmailLog | null>(null)
  const [showPreview, setShowPreview] = useState(false)

  useEffect(() => {
    loadEmails()
  }, [statusFilter, typeFilter])

  async function loadEmails() {
    setLoading(true)
    try {
      const params = new URLSearchParams()
      if (statusFilter !== 'all') params.append('status', statusFilter)
      if (typeFilter !== 'all') params.append('type', typeFilter)
      if (search) params.append('search', search)

      const response = await fetch(`/api/admin/emails?${params}`)
      const data = await response.json()

      if (data.success) {
        setEmails(data.emails || [])
        setStats(data.stats || stats)
      }
    } catch (error) {
      console.error('Erro ao carregar e-mails:', error)
    } finally {
      setLoading(false)
    }
  }

  function getStatusBadge(status: string) {
    const variants: Record<string, { label: string; variant: any; icon: any }> = {
      sent: { label: 'Enviado', variant: 'default', icon: Send },
      delivered: { label: 'Entregue', variant: 'success', icon: CheckCircle2 },
      opened: { label: 'Aberto', variant: 'success', icon: Eye },
      failed: { label: 'Falhou', variant: 'destructive', icon: XCircle },
      pending: { label: 'Pendente', variant: 'secondary', icon: Clock },
    }

    const config = variants[status] || variants.pending
    const Icon = config.icon

    return (
      <Badge variant={config.variant} className="flex items-center gap-1">
        <Icon className="w-3 h-3" />
        {config.label}
      </Badge>
    )
  }

  function getTypeBadge(type: string) {
    const types: Record<string, { label: string; color: string }> = {
      welcome: { label: '🎉 Boas-vindas', color: 'bg-blue-100 text-blue-700' },
      pix_pending: { label: '⏳ PIX Pendente', color: 'bg-yellow-100 text-yellow-700' },
      password_reset: { label: '🔑 Reset Senha', color: 'bg-purple-100 text-purple-700' },
      abandoned_cart: { label: '🛒 Carrinho', color: 'bg-orange-100 text-orange-700' },
    }

    const config = types[type] || { label: type, color: 'bg-gray-100 text-gray-700' }

    return (
      <span className={`px-2 py-1 rounded-full text-xs font-medium ${config.color}`}>
        {config.label}
      </span>
    )
  }

  return (
    <div className="p-6 space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold mb-2">📧 Gerenciamento de E-mails</h1>
        <p className="text-muted-foreground">
          Visualize, monitore e analise todos os e-mails enviados pelo sistema
        </p>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
        <Card>
          <CardHeader className="pb-2">
            <CardDescription>Total Enviados</CardDescription>
            <CardTitle className="text-3xl">{stats.total}</CardTitle>
          </CardHeader>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardDescription>Entregues</CardDescription>
            <CardTitle className="text-3xl text-green-600">{stats.sent}</CardTitle>
          </CardHeader>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardDescription>Abertos</CardDescription>
            <CardTitle className="text-3xl text-blue-600">{stats.opened}</CardTitle>
          </CardHeader>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardDescription>Taxa de Abertura</CardDescription>
            <CardTitle className="text-3xl text-purple-600">
              {stats.open_rate.toFixed(1)}%
            </CardTitle>
          </CardHeader>
        </Card>

        <Card>
          <CardHeader className="pb-2">
            <CardDescription>Falhas</CardDescription>
            <CardTitle className="text-3xl text-red-600">{stats.failed}</CardTitle>
          </CardHeader>
        </Card>
      </div>

      {/* Filters */}
      <Card>
        <CardHeader>
          <CardTitle>Filtros</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-4 h-4" />
              <Input
                placeholder="Buscar por e-mail ou pedido..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="pl-10"
              />
            </div>

            <Select value={statusFilter} onValueChange={setStatusFilter}>
              <SelectTrigger>
                <SelectValue placeholder="Status" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Todos os Status</SelectItem>
                <SelectItem value="sent">Enviados</SelectItem>
                <SelectItem value="opened">Abertos</SelectItem>
                <SelectItem value="failed">Falhas</SelectItem>
              </SelectContent>
            </Select>

            <Select value={typeFilter} onValueChange={setTypeFilter}>
              <SelectTrigger>
                <SelectValue placeholder="Tipo" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">Todos os Tipos</SelectItem>
                <SelectItem value="welcome">Boas-vindas</SelectItem>
                <SelectItem value="pix_pending">PIX Pendente</SelectItem>
                <SelectItem value="password_reset">Reset Senha</SelectItem>
              </SelectContent>
            </Select>

            <Button onClick={loadEmails} variant="outline">
              <RefreshCw className="w-4 h-4 mr-2" />
              Atualizar
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Email List */}
      <Card>
        <CardHeader>
          <CardTitle>Histórico de E-mails</CardTitle>
          <CardDescription>
            {emails.length} e-mail(s) encontrado(s)
          </CardDescription>
        </CardHeader>
        <CardContent>
          {loading ? (
            <div className="text-center py-8">
              <RefreshCw className="w-8 h-8 animate-spin mx-auto text-muted-foreground" />
              <p className="text-muted-foreground mt-4">Carregando e-mails...</p>
            </div>
          ) : emails.length === 0 ? (
            <div className="text-center py-8">
              <Mail className="w-12 h-12 mx-auto text-muted-foreground" />
              <p className="text-muted-foreground mt-4">Nenhum e-mail encontrado</p>
            </div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Destinatário</TableHead>
                  <TableHead>Assunto</TableHead>
                  <TableHead>Tipo</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Abertura</TableHead>
                  <TableHead>Data</TableHead>
                  <TableHead>Ações</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {emails.map((email) => (
                  <TableRow key={email.id}>
                    <TableCell>
                      <div>
                        <p className="font-medium">{email.recipient_name || 'N/A'}</p>
                        <p className="text-sm text-muted-foreground">{email.recipient_email}</p>
                      </div>
                    </TableCell>
                    <TableCell className="max-w-xs truncate">{email.subject}</TableCell>
                    <TableCell>{getTypeBadge(email.email_type)}</TableCell>
                    <TableCell>{getStatusBadge(email.status)}</TableCell>
                    <TableCell>
                      {email.opened ? (
                        <div className="text-sm">
                          <Badge variant="success" className="mb-1">
                            ✓ {email.open_count}x
                          </Badge>
                          {email.first_opened_at && (
                            <p className="text-xs text-muted-foreground">
                              {format(new Date(email.first_opened_at), "dd/MM 'às' HH:mm", {
                                locale: ptBR,
                              })}
                            </p>
                          )}
                          {email.device_type && (
                            <p className="text-xs text-muted-foreground">
                              {email.device_type} · {email.browser}
                            </p>
                          )}
                        </div>
                      ) : (
                        <Badge variant="default">Não aberto</Badge>
                      )}
                    </TableCell>
                    <TableCell className="text-sm">
                      {format(new Date(email.created_at), 'dd/MM/yy HH:mm', { locale: ptBR })}
                    </TableCell>
                    <TableCell>
                      <Button
                        size="sm"
                        variant="ghost"
                        onClick={() => {
                          setSelectedEmail(email)
                          setShowPreview(true)
                        }}
                      >
                        <Eye className="w-4 h-4" />
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>

      {/* Email Preview Dialog */}
      <Dialog open={showPreview} onOpenChange={setShowPreview}>
        <DialogContent className="max-w-4xl max-h-[80vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Visualização do E-mail</DialogTitle>
          </DialogHeader>
          {selectedEmail && (
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4 text-sm">
                <div>
                  <p className="font-medium text-muted-foreground">Destinatário</p>
                  <p>{selectedEmail.recipient_email}</p>
                </div>
                <div>
                  <p className="font-medium text-muted-foreground">Status</p>
                  {getStatusBadge(selectedEmail.status)}
                </div>
                <div>
                  <p className="font-medium text-muted-foreground">Assunto</p>
                  <p>{selectedEmail.subject}</p>
                </div>
                <div>
                  <p className="font-medium text-muted-foreground">Tipo</p>
                  {getTypeBadge(selectedEmail.email_type)}
                </div>
                {selectedEmail.order_id && (
                  <div>
                    <p className="font-medium text-muted-foreground">Pedido</p>
                    <p className="font-mono text-xs">{selectedEmail.order_id}</p>
                  </div>
                )}
                {selectedEmail.opened && (
                  <div>
                    <p className="font-medium text-muted-foreground">Tracking</p>
                    <p>
                      Aberto {selectedEmail.open_count}x · {selectedEmail.device_type} ·{' '}
                      {selectedEmail.browser}
                    </p>
                  </div>
                )}
              </div>

              {selectedEmail.error_message && (
                <div className="bg-red-50 border border-red-200 rounded-lg p-4">
                  <p className="font-medium text-red-700 mb-2">Erro no envio:</p>
                  <p className="text-sm text-red-600">{selectedEmail.error_message}</p>
                </div>
              )}

              {selectedEmail.html_content && (
                <div className="border rounded-lg">
                  <div className="bg-muted px-4 py-2 border-b">
                    <p className="text-sm font-medium">Conteúdo do E-mail</p>
                  </div>
                  <div className="p-4 bg-white">
                    <iframe
                      srcDoc={selectedEmail.html_content}
                      className="w-full h-96 border-0"
                      title="Email Preview"
                    />
                  </div>
                </div>
              )}
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  )
}
