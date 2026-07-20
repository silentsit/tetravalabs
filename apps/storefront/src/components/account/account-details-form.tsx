"use client"

import { FormEvent, useEffect, useState } from "react"
import Link from "next/link"
import { FetchError } from "@medusajs/js-sdk"
import { retrieveCustomer, updateCustomerProfile } from "@/lib/medusa-auth"
import { sdk } from "@/lib/medusa-client"

function RequiredLabel({ htmlFor, children }: { htmlFor: string; children: React.ReactNode }) {
  return (
    <label htmlFor={htmlFor} className="block text-sm text-[#0F172A]">
      {children} <span className="text-red-600">*</span>
    </label>
  )
}

export function AccountDetailsForm() {
  const [firstName, setFirstName] = useState("")
  const [lastName, setLastName] = useState("")
  const [email, setEmail] = useState("")
  const [phone, setPhone] = useState("")
  const [profileStatus, setProfileStatus] = useState("")
  const [passwordStatus, setPasswordStatus] = useState("")
  const [profileSaving, setProfileSaving] = useState(false)
  const [passwordSaving, setPasswordSaving] = useState(false)

  useEffect(() => {
    void retrieveCustomer().then((customer) => {
      if (!customer) return
      setFirstName(customer.first_name || "")
      setLastName(customer.last_name || "")
      setEmail(customer.email || "")
      setPhone(customer.phone || "")
    })
  }, [])

  const onSaveProfile = async (event: FormEvent) => {
    event.preventDefault()
    setProfileSaving(true)
    setProfileStatus("")

    try {
      await updateCustomerProfile({
        first_name: firstName.trim(),
        last_name: lastName.trim(),
        phone: phone.trim() || undefined
      })
      setProfileStatus("Account details updated.")
    } catch (error) {
      const fetchError = error as FetchError
      setProfileStatus(fetchError.message || "Unable to update account details.")
    } finally {
      setProfileSaving(false)
    }
  }

  const onRequestPasswordReset = async (event: FormEvent) => {
    event.preventDefault()
    if (!email) {
      setPasswordStatus("Email address is required for password reset.")
      return
    }

    setPasswordSaving(true)
    setPasswordStatus("")

    try {
      await sdk.auth.resetPassword("customer", "emailpass", { identifier: email })
      setPasswordStatus(
        "If an account exists for that email, you will receive a password reset link shortly."
      )
    } catch (error) {
      const fetchError = error as FetchError
      setPasswordStatus(fetchError.message || "Unable to request password reset.")
    } finally {
      setPasswordSaving(false)
    }
  }

  return (
    <div className="space-y-8">
      <form onSubmit={onSaveProfile} className="card space-y-4 p-5">
        <h3 className="text-lg text-[#0F172A]">Account details</h3>
        <div className="grid gap-4 sm:grid-cols-2">
          <div>
            <RequiredLabel htmlFor="details-first-name">First name</RequiredLabel>
            <input
              id="details-first-name"
              className="input-field mt-1"
              value={firstName}
              onChange={(event) => setFirstName(event.target.value)}
              required
            />
          </div>
          <div>
            <RequiredLabel htmlFor="details-last-name">Last name</RequiredLabel>
            <input
              id="details-last-name"
              className="input-field mt-1"
              value={lastName}
              onChange={(event) => setLastName(event.target.value)}
              required
            />
          </div>
        </div>

        <div>
          <label htmlFor="details-email" className="block text-sm text-[#0F172A]">
            Email address
          </label>
          <input id="details-email" className="input-field mt-1 bg-[#F8FAFC]" value={email} readOnly />
          <p className="mt-1 text-xs text-[#64748B]">
            Contact{" "}
            <Link href="/contact" className="text-[#0D9488] hover:underline">
              support
            </Link>{" "}
            to change your login email.
          </p>
        </div>

        <div>
          <label htmlFor="details-phone" className="block text-sm text-[#0F172A]">
            Phone
          </label>
          <input
            id="details-phone"
            className="input-field mt-1"
            value={phone}
            onChange={(event) => setPhone(event.target.value)}
          />
        </div>

        <button type="submit" className="btn-primary" disabled={profileSaving}>
          {profileSaving ? "Saving..." : "Save changes"}
        </button>
        {profileStatus ? <p className="text-sm text-[#475569]">{profileStatus}</p> : null}
      </form>

      <form onSubmit={onRequestPasswordReset} className="card space-y-4 p-5">
        <h3 className="text-lg text-[#0F172A]">Password change</h3>
        <p className="text-sm text-[#475569]">
          To change your password, request a secure reset link for{" "}
          <span className="font-medium text-[#0F172A]">{email || "your account email"}</span>.
        </p>

        <button type="submit" className="btn-secondary" disabled={passwordSaving || !email}>
          {passwordSaving ? "Sending..." : "Email password reset link"}
        </button>
        {passwordStatus ? <p className="text-sm text-[#475569]">{passwordStatus}</p> : null}
      </form>
    </div>
  )
}
