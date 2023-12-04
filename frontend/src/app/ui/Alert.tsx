interface AlertDaisyProps {
  message: string
}

export default function AlertDaisy({ message }: AlertDaisyProps) {
  return (
    <dialog id="alert" className="modal">
      <div className="modal-box">
        <p className="py-4">{message}</p>
        <div className="modal-action justify-start">
          <div className="flex">
            <form method="dialog">
              <button className="btn btn-info btn-sm">Close</button>
            </form>
          </div>
        </div>
      </div>
    </dialog>
  )
}
