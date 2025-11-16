import CreatePermissionPage from '@/pages/admin/permission/CreatePermissionPage'
import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/admin/permission/create')({
  component: RouteComponent,
})

function RouteComponent() {
  return <CreatePermissionPage />
}
