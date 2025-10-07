import { RoleManage } from '@/pages/admin/role/RoleManage'
import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/admin/role/')({
  component: RouteComponent,
})

function RouteComponent() {
  return <RoleManage />
}
