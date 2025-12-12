import { BookingManage } from '@/pages/admin/booking/BookingManage'
import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/admin/booking/')({
  component: RouteComponent,
})

function RouteComponent() {
  return <BookingManage />
}
