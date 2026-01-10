import { BookingForm } from '@/pages/client/booking/BookingForm'
import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/__client/booking')({
  component: RouteComponent,
})

function RouteComponent() {
  return <BookingForm />
}
