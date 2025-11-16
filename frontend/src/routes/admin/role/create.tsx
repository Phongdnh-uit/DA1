import { CreateRolePage } from '@/pages/admin/role/CreateRolePage'
import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/admin/role/create')({
  component: RouteComponent,
})

function RouteComponent() {
  return <CreateRolePage />
}
