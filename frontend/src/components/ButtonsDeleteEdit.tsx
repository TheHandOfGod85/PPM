import { useState } from "react"


export const generateButtons = (partId: string) => {
    const [deletePartId, setDeletePartId] = useState('')
    if (isMobile) {
      return (
        <div className="flex gap-1">
          <button
            className="btn btn-warning btn-xs"
            onClick={() => {
              setDeletePartId(partId)
              openModal(`delete_part`)
            }}
          >
            <FaTrash />
          </button>
          <Link className="btn btn-info btn-xs" href={`/part/${partId}`}>
            <FaEdit />
          </Link>
        </div>
      )
    } else {
      return (
        <div className="flex flex-col gap-1">
          <button
            onClick={() => {
              setDeletePartId(partId)
              openModal(`delete_part`)
            }}
            className="btn btn-warning btn-sm"
          >
            Delete
          </button>
          <Link className="btn btn-info btn-sm" href={`/part/${partId}`}>
            Edit
          </Link>
        </div>
      )
    }
  }