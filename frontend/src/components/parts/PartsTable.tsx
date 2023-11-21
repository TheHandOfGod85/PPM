import { Part } from '@/models/part'
import Image from 'next/image'
import { FaTrash, FaEdit } from 'react-icons/fa'
import { useMediaQuery } from 'react-responsive'
import PopUpConfirm from '../PopUpConfirm'
import { openModal } from '@/utils/utils'
import { useRouter } from 'next/router'
import * as PartApi from '@/network/api/part.api'
import { useState } from 'react'
import Link from 'next/link'
import useAuthenticatedUser from '@/hooks/useAuthenticatedUser'

interface PartsTableProps {
  parts: Part[]
}

export default function PartsTable({ parts }: PartsTableProps) {
  const { user } = useAuthenticatedUser()
  const [deletePartId, setDeletePartId] = useState('')
  const router = useRouter()
  const isMobile = useMediaQuery({ maxWidth: 640 })
  const generateButtons = (partId: string) => {
    if (user?.role === 'admin') {
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
            <Link className="btn btn-info btn-xs" href={`/edit-part/${partId}`}>
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
            <Link className="btn btn-info btn-sm" href={`/edit-part/${partId}`}>
              Edit
            </Link>
          </div>
        )
      }
    }
  }

  async function onDeletePart(partId: string) {
    try {
      await PartApi.deletePartAsset(partId)
      router.replace(router.asPath)
    } catch (error) {
      console.error(error)
      alert(error)
    }
  }

  return (
    <>
      <table className="table tab-md">
        <thead>
          <tr>
            <th>Name</th>
            <th>Description</th>
            <th>Part Number</th>
            <th>Manufacturer</th>
            <th>Image</th>
            <th></th>
          </tr>
        </thead>
        <tbody>
          {parts.map((part) => (
            <tr key={part._id}>
              <td className="whitespace-nowrap">{part.name}</td>
              <td>
                <div className="collapse collapse-arrow">
                  <input type="checkbox" />
                  <div className="collapse-title whitespace-nowrap">
                    Click to open
                  </div>
                  <div className="collapse-content">
                    <p className="text-accent">{part.description}</p>
                  </div>
                </div>
              </td>
              <td>{part.partNumber}</td>
              <td>{part.manufacturer}</td>
              <td>
                {/* If I want a responsive image
               I need to wrap the image in a container
               with these attributes:
               position: relative;
               width:100%;
               max-width700px;
               aspect-ratio: at your choice;
            */}
                <Image
                  src={part.imageUrl || '/images/no-image.jpg'}
                  alt="part image"
                  width={60}
                  height={60}
                  priority
                  className="rounded"
                />
              </td>
              <td>{generateButtons(part._id)}</td>
            </tr>
          ))}
        </tbody>
      </table>
      <PopUpConfirm
        id="delete_part"
        title={'Delete part'}
        infoMessage={'Are you sure you want to delete?'}
        buttonSubmit="Yes"
        button2="No"
        onSubmit={() => onDeletePart(deletePartId)}
      />
    </>
  )
}