export default function calculateNextMaintenanceDate(
  startDate: Date,
  interval: number
): Date {
  const nextMaintenanceDate = new Date(startDate)

  if (interval > 0) {
    // Calculate based on weeks or months, adjust as needed
    nextMaintenanceDate.setDate(nextMaintenanceDate.getDate() + 7 * interval)
  }

  return nextMaintenanceDate
}
