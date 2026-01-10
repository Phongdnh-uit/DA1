import CreateBookingPage from '@/pages/admin/booking/CreateBookingPage'
import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/admin/booking/create')({
  component: RouteComponent,
})

function RouteComponent() {
  return <CreateBookingPage />
}
