import { SupportManage } from '@/pages/admin/support/SupportManage'
import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/admin/support/')({
  component: RouteComponent,
})

function RouteComponent() {
  return <SupportManage />
}
