import format from 'date-fns/format'

export function formatDate(dateString: string) {
  return format(new Date(dateString), 'MMM d, yyyy')
}

export function openModal(modalId: string) {
  const modalElement = document.getElementById(
    modalId
  ) as HTMLFormElement | null

  if (modalElement) {
    modalElement.showModal()
  } else {
    console.error(`Modal with id ${modalId} not found.`)
  }
}
export function closeModal(modalId: string) {
  const modalElement = document.getElementById(
    modalId
  ) as HTMLFormElement | null

  if (modalElement) {
    modalElement.close()
  } else {
    console.error(`Modal with id ${modalId} not found.`)
  }
}
