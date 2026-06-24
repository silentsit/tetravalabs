import { AccountDashboardHome } from "@/components/account/account-dashboard-home"
import { AccountPageHeader } from "@/components/account/account-page-header"

export default function AccountPage() {
  return (
    <>
      <AccountPageHeader title="Dashboard" />
      <AccountDashboardHome />
    </>
  )
}
