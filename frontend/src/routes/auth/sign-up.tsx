import RegisterFirstPage from '@/pages/auth/RegisterFirstPage'
import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/auth/sign-up')({
  component: RouteComponent,
})

function RouteComponent() {
  return <RegisterFirstPage />
}
