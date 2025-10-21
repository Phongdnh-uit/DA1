import PropertyDetailPage from '@/pages/client/property/DetailPage'
import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/__client/detail')({
  component: RouteComponent,
})

function RouteComponent() {
  return <PropertyDetailPage />
}
