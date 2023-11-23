interface PopUpConfirmProps {
  onSubmit?: () => void
  title: string
  infoMessage: string
  id: string
  buttonSubmit: string
  button2: string
}

export default function PopUpConfirm({
  onSubmit,
  infoMessage,
  title,
  id,
  buttonSubmit: button1,
  button2,
}: PopUpConfirmProps) {
  return (
    <dialog id={id} className="modal">
      <div className="modal-box">
        <h3 className="font-bold text-lg">{title}</h3>
        <p className="py-4">{infoMessage}</p>
        <div className="modal-action justify-start">
          <div className="flex">
            <form method="dialog" onSubmit={onSubmit}>
              <button type="submit" className="btn btn-warning btn-sm mr-1">
                {button1}
              </button>
            </form>
            <form method="dialog">
              <button className="btn btn-info btn-sm">{button2}</button>
            </form>
          </div>
        </div>
      </div>
    </dialog>
  )
}
