'use client'

interface NotificationBannerProps {
  enabled: boolean;
}

export default function NotificationBanner({ enabled }: NotificationBannerProps) {
  if (!enabled) {
    return (
      <div className="mb-4 p-3 bg-yellow-100 text-yellow-800 rounded-lg">
        Please enable notifications to receive due date reminders
      </div>
    )
  }
  return null
} 