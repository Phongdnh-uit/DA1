import RegisterPage from '@/pages/auth/RegisterPage'
import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/auth/sign-up-addition')({
  component: RouteComponent,
})

function RouteComponent() {
  return <RegisterPage />
}
