import { useState } from 'react'
import {
  Plus, Search, X, CheckCircle, UserCheck, UserX,
  Shield, ChevronDown,
} from 'lucide-react'
import { clsx } from 'clsx'
import { Button, Card, Input, Badge, Avatar } from '@/components/ui'
import { useAdminStore } from '@/store/adminStore'
import type { AdminUser, UserRole, UserPermission } from '@/types'

const DIRECTORSHIPS = [
  'Diretoria de Operações','Diretoria de Tecnologia','Diretoria Comercial',
  'Diretoria de Logística','Diretoria Financeira','Diretoria de RH','Diretoria Jurídica',
]
const AREAS = ['Operações','Tecnologia','Comercial','Logística','Financeiro','RH','Jurídico']
const ROLES: { value: UserRole; label: string; color: string }[] = [
  { value: 'user',    label: 'Colaborador', color: 'badge-blue'    },
  { value: 'manager', label: 'Gestor',      color: 'badge-warning' },
  { value: 'admin',   label: 'Admin',       color: 'badge-navy'    },
]
const PERMISSIONS: { value: UserPermission; label: string; desc: string }[] = [
  { value: 'view_reports',    label: 'Ver relatórios',    desc: 'Acesso ao dashboard e métricas' },
  { value: 'manage_courses',  label: 'Gerir cursos',      desc: 'Criar, editar e publicar cursos' },
  { value: 'manage_content',  label: 'Gerir conteúdo',    desc: 'Editar URLs e mídia dos módulos' },
  { value: 'manage_users',    label: 'Gerir usuários',    desc: 'Cadastrar e editar colaboradores' },
]

// ── Formulário de usuário (novo ou edição) ─────────────────────────────────────
function UserForm({
  initial, onSave, onClose,
}: {
  initial?: Partial<AdminUser>
  onSave: (data: Omit<AdminUser, 'id' | 'createdAt'>) => void
  onClose: () => void
}) {
  const [name,         setName]         = useState(initial?.name ?? '')
  const [email,        setEmail]        = useState(initial?.email ?? '')
  const [role,         setRole]         = useState<UserRole>(initial?.role ?? 'user')
  const [area,         setArea]         = useState(initial?.area ?? '')
  const [directorship, setDirectorship] = useState(initial?.directorship ?? '')
  const [managerName,  setManagerName]  = useState(initial?.managerName ?? '')
  const [permissions,  setPermissions]  = useState<UserPermission[]>(initial?.permissions ?? [])
  const [status,       setStatus]       = useState<'active'|'inactive'>(initial?.status ?? 'active')

  const togglePerm = (p: UserPermission) =>
    setPermissions((prev) => prev.includes(p) ? prev.filter((x) => x !== p) : [...prev, p])

  const isValid = name.trim() && email.trim() && email.includes('@')

  const handleSubmit = () => {
    if (!isValid) return
    onSave({ name, email, role, area, directorship, managerName, permissions, status })
    onClose()
  }

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-navy/40 p-4"
      onClick={(e) => e.target === e.currentTarget && onClose()}
    >
      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-lg max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="flex items-center justify-between p-5 border-b border-gray-100">
          <h2 className="font-heading font-bold text-gray-800 text-base">
            {initial?.id ? 'Editar usuário' : 'Novo usuário'}
          </h2>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-600 text-xl leading-none">✕</button>
        </div>

        <div className="p-5 space-y-4">
          {/* Dados básicos */}
          <div className="grid grid-cols-1 gap-3">
            <Input
              label="Nome completo *"
              placeholder="Ex: João da Silva"
              value={name}
              onChange={(e) => setName(e.target.value)}
            />
            <Input
              label="E-mail corporativo *"
              placeholder="nome@fretebras.com.br"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>

          {/* Diretoria + Área */}
          <div className="grid grid-cols-2 gap-3">
            <div className="space-y-1">
              <label className="text-xs font-body font-medium text-gray-800">Diretoria</label>
              <div className="relative">
                <select
                  value={directorship}
                  onChange={(e) => setDirectorship(e.target.value)}
                  className="w-full appearance-none px-3 py-2 pr-8 text-sm border border-gray-200 rounded-lg outline-none focus:border-brand focus:ring-2 focus:ring-brand/15 transition font-body bg-white"
                >
                  <option value="">Selecione...</option>
                  {DIRECTORSHIPS.map((d) => <option key={d} value={d}>{d}</option>)}
                </select>
                <ChevronDown className="w-3.5 h-3.5 text-gray-400 absolute right-2.5 top-1/2 -translate-y-1/2 pointer-events-none" />
              </div>
            </div>
            <div className="space-y-1">
              <label className="text-xs font-body font-medium text-gray-800">Área</label>
              <div className="relative">
                <select
                  value={area}
                  onChange={(e) => setArea(e.target.value)}
                  className="w-full appearance-none px-3 py-2 pr-8 text-sm border border-gray-200 rounded-lg outline-none focus:border-brand focus:ring-2 focus:ring-brand/15 transition font-body bg-white"
                >
                  <option value="">Selecione...</option>
                  {AREAS.map((a) => <option key={a} value={a}>{a}</option>)}
                </select>
                <ChevronDown className="w-3.5 h-3.5 text-gray-400 absolute right-2.5 top-1/2 -translate-y-1/2 pointer-events-none" />
              </div>
            </div>
          </div>

          {/* Nome do gestor */}
          <Input
            label="Nome do gestor direto"
            placeholder="Ex: Maria Ferreira"
            value={managerName}
            onChange={(e) => setManagerName(e.target.value)}
          />

          {/* Perfil */}
          <div className="space-y-2">
            <label className="text-xs font-body font-medium text-gray-800">Perfil de acesso</label>
            <div className="flex gap-2">
              {ROLES.map(({ value, label }) => (
                <button
                  key={value}
                  onClick={() => setRole(value)}
                  className={clsx(
                    'flex-1 py-2 text-xs font-body font-medium rounded-lg border transition-all',
                    role === value
                      ? 'bg-navy text-white border-navy'
                      : 'bg-white text-gray-500 border-gray-200 hover:border-gray-300',
                  )}
                >
                  {label}
                </button>
              ))}
            </div>
          </div>

          {/* Permissões */}
          <div className="space-y-2">
            <label className="text-xs font-body font-medium text-gray-800 flex items-center gap-1">
              <Shield className="w-3.5 h-3.5 text-gray-400" /> Permissões específicas
            </label>
            <div className="space-y-1.5">
              {PERMISSIONS.map(({ value, label, desc }) => (
                <label
                  key={value}
                  className={clsx(
                    'flex items-start gap-3 p-2.5 rounded-lg border cursor-pointer transition-all',
                    permissions.includes(value)
                      ? 'border-brand/30 bg-brand-light'
                      : 'border-gray-100 hover:bg-gray-50',
                  )}
                >
                  <input
                    type="checkbox"
                    checked={permissions.includes(value)}
                    onChange={() => togglePerm(value)}
                    className="mt-0.5 accent-brand w-3.5 h-3.5"
                  />
                  <div className="flex-1 min-w-0">
                    <p className="text-xs font-body font-medium text-gray-800">{label}</p>
                    <p className="text-[10px] text-gray-400">{desc}</p>
                  </div>
                </label>
              ))}
            </div>
          </div>

          {/* Status */}
          <div className="flex items-center gap-3 p-3 bg-gray-50 rounded-lg">
            <div className="flex-1">
              <p className="text-xs font-body font-medium text-gray-800">Status da conta</p>
              <p className="text-[10px] text-gray-400 mt-0.5">Usuários inativos não conseguem fazer login</p>
            </div>
            <button
              onClick={() => setStatus((s) => s === 'active' ? 'inactive' : 'active')}
              className={clsx(
                'relative w-10 h-5 rounded-full transition-colors duration-200',
                status === 'active' ? 'bg-success' : 'bg-gray-300',
              )}
            >
              <span className={clsx(
                'absolute top-0.5 w-4 h-4 bg-white rounded-full shadow transition-transform duration-200',
                status === 'active' ? 'translate-x-5' : 'translate-x-0.5',
              )} />
            </button>
          </div>
        </div>

        {/* Footer */}
        <div className="flex justify-end gap-2 p-5 pt-0">
          <Button variant="outline" onClick={onClose}>Cancelar</Button>
          <Button
            variant="primary"
            disabled={!isValid}
            leftIcon={<CheckCircle className="w-4 h-4" />}
            onClick={handleSubmit}
          >
            {initial?.id ? 'Salvar alterações' : 'Cadastrar usuário'}
          </Button>
        </div>
      </div>
    </div>
  )
}

// ── Row da tabela ──────────────────────────────────────────────────────────────
function UserRow({ user, onEdit }: { user: AdminUser; onEdit: () => void }) {
  const { toggleUserStatus } = useAdminStore()
  const initials = user.name.split(' ').map((n) => n[0]).slice(0, 2).join('')
  const roleInfo = ROLES.find((r) => r.value === user.role)!

  return (
    <tr className="hover:bg-gray-50 transition-colors">
      <td className="py-3 px-4">
        <div className="flex items-center gap-2.5">
          <Avatar initials={initials} size="sm" variant={user.role === 'admin' ? 'blue' : 'navy'} />
          <div className="min-w-0">
            <p className="text-sm font-body font-medium text-gray-800 truncate">{user.name}</p>
            <p className="text-xs text-gray-400 truncate">{user.email}</p>
          </div>
        </div>
      </td>
      <td className="py-3 px-4 text-xs text-gray-600 hidden md:table-cell">{user.directorship || '—'}</td>
      <td className="py-3 px-4 text-xs text-gray-600 hidden sm:table-cell">{user.managerName || '—'}</td>
      <td className="py-3 px-4 hidden sm:table-cell">
        <Badge variant={roleInfo.color.replace('badge-','') as 'blue'|'warning'|'navy'}>{roleInfo.label}</Badge>
      </td>
      <td className="py-3 px-4">
        <span className={clsx(
          'inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-medium',
          user.status === 'active' ? 'bg-success-light text-success' : 'bg-gray-100 text-gray-400',
        )}>
          <span className={clsx('w-1.5 h-1.5 rounded-full', user.status === 'active' ? 'bg-success' : 'bg-gray-400')} />
          {user.status === 'active' ? 'Ativo' : 'Inativo'}
        </span>
      </td>
      <td className="py-3 px-4">
        <div className="flex items-center gap-1 justify-end">
          <button
            onClick={onEdit}
            className="p-1.5 rounded-md text-gray-400 hover:bg-gray-100 hover:text-gray-600 transition-colors"
            title="Editar"
          >
            <svg width="14" height="14" fill="none" stroke="currentColor" strokeWidth="2" viewBox="0 0 24 24">
              <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"/>
              <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"/>
            </svg>
          </button>
          <button
            onClick={() => toggleUserStatus(user.id)}
            className="p-1.5 rounded-md text-gray-400 hover:bg-gray-100 transition-colors"
            title={user.status === 'active' ? 'Desativar' : 'Ativar'}
          >
            {user.status === 'active'
              ? <UserX className="w-3.5 h-3.5 text-danger" />
              : <UserCheck className="w-3.5 h-3.5 text-success" />
            }
          </button>
        </div>
      </td>
    </tr>
  )
}

// ── Página ────────────────────────────────────────────────────────────────────
export default function Users() {
  const { users, addUser, updateUser } = useAdminStore()
  const [search,    setSearch]    = useState('')
  const [roleFilter,setRoleFilter]= useState<UserRole | 'all'>('all')
  const [showForm,  setShowForm]  = useState(false)
  const [editing,   setEditing]   = useState<AdminUser | null>(null)

  const filtered = users.filter((u) => {
    const matchSearch = !search || u.name.toLowerCase().includes(search.toLowerCase()) || u.email.toLowerCase().includes(search.toLowerCase())
    const matchRole   = roleFilter === 'all' || u.role === roleFilter
    return matchSearch && matchRole
  })

  const counts = {
    total:    users.length,
    active:   users.filter((u) => u.status === 'active').length,
    admins:   users.filter((u) => u.role === 'admin').length,
    managers: users.filter((u) => u.role === 'manager').length,
  }

  return (
    <div className="space-y-5">
      {/* Header */}
      <div className="flex items-start justify-between gap-4">
        <div>
          <h1 className="font-heading font-bold text-gray-800 text-2xl">Usuários</h1>
          <p className="text-gray-400 text-sm mt-0.5">Cadastre e gerencie os colaboradores da plataforma.</p>
        </div>
        <Button
          variant="primary"
          leftIcon={<Plus className="w-4 h-4" />}
          onClick={() => { setEditing(null); setShowForm(true) }}
        >
          Novo usuário
        </Button>
      </div>

      {/* Cards de resumo */}
      <div className="grid grid-cols-2 xl:grid-cols-4 gap-3">
        {[
          { label: 'Total de usuários', value: counts.total,    color: 'text-gray-800',  bg: 'bg-gray-50 border-gray-200' },
          { label: 'Usuários ativos',   value: counts.active,   color: 'text-success',   bg: 'bg-success-light border-success/20' },
          { label: 'Administradores',   value: counts.admins,   color: 'text-brand-dark', bg: 'bg-brand-light border-brand/20' },
          { label: 'Gestores',          value: counts.managers, color: 'text-warning',   bg: 'bg-warning-light border-warning/20' },
        ].map(({ label, value, color, bg }) => (
          <div key={label} className={clsx('rounded-xl border p-4', bg)}>
            <p className={clsx('font-heading font-bold text-2xl', color)}>{value}</p>
            <p className="text-gray-600 text-xs font-body mt-0.5">{label}</p>
          </div>
        ))}
      </div>

      {/* Filtros */}
      <Card className="space-y-3">
        <div className="flex flex-col sm:flex-row gap-3">
          {/* Busca */}
          <div className="relative flex-1">
            <Search className="w-4 h-4 text-gray-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Buscar por nome ou e-mail..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full pl-9 pr-3 py-2 text-sm border border-gray-200 rounded-lg outline-none focus:border-brand focus:ring-2 focus:ring-brand/15 transition font-body"
            />
            {search && (
              <button onClick={() => setSearch('')} className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600">
                <X className="w-3.5 h-3.5" />
              </button>
            )}
          </div>

          {/* Filtro perfil */}
          <div className="flex gap-1 bg-gray-100 p-1 rounded-lg">
            {(['all', 'user', 'manager', 'admin'] as const).map((r) => (
              <button
                key={r}
                onClick={() => setRoleFilter(r)}
                className={clsx(
                  'px-3 py-1.5 rounded-md text-xs font-body font-medium transition-all',
                  roleFilter === r ? 'bg-white text-gray-800 shadow-sm' : 'text-gray-400 hover:text-gray-600',
                )}
              >
                {r === 'all' ? 'Todos' : r === 'user' ? 'Colaboradores' : r === 'manager' ? 'Gestores' : 'Admins'}
              </button>
            ))}
          </div>
        </div>

        {/* Tabela */}
        <div className="overflow-x-auto -mx-4 px-4">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-gray-100 text-left">
                <th className="pb-2.5 text-xs font-body font-medium text-gray-400 px-4">Usuário</th>
                <th className="pb-2.5 text-xs font-body font-medium text-gray-400 px-4 hidden md:table-cell">Diretoria</th>
                <th className="pb-2.5 text-xs font-body font-medium text-gray-400 px-4 hidden sm:table-cell">Gestor</th>
                <th className="pb-2.5 text-xs font-body font-medium text-gray-400 px-4 hidden sm:table-cell">Perfil</th>
                <th className="pb-2.5 text-xs font-body font-medium text-gray-400 px-4">Status</th>
                <th className="pb-2.5 text-xs font-body font-medium text-gray-400 px-4 text-right">Ações</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {filtered.length === 0 ? (
                <tr>
                  <td colSpan={6} className="py-12 text-center text-sm text-gray-400">
                    Nenhum usuário encontrado.
                  </td>
                </tr>
              ) : (
                filtered.map((u) => (
                  <UserRow
                    key={u.id}
                    user={u}
                    onEdit={() => { setEditing(u); setShowForm(true) }}
                  />
                ))
              )}
            </tbody>
          </table>
        </div>

        {filtered.length > 0 && (
          <p className="text-xs text-gray-400 text-right pt-1">
            {filtered.length} de {users.length} usuários
          </p>
        )}
      </Card>

      {/* Modal de formulário */}
      {showForm && (
        <UserForm
          initial={editing ?? undefined}
          onSave={(data) => {
            if (editing) updateUser(editing.id, data)
            else addUser(data)
          }}
          onClose={() => setShowForm(false)}
        />
      )}
    </div>
  )
}
