import { ProvinceManage } from '@/pages/admin/province/ProvinceManage'
import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/admin/province/')({
  component: RouteComponent,
})

function RouteComponent() {
  return <ProvinceManage />
}
