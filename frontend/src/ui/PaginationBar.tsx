import { Fragment } from 'react'

interface PaginationBarProps {
  pageCount: number
  currentPage: number
  onPageItemClicked: (page: number) => void
  className?: string
}

export default function PaginationBar({
  currentPage,
  onPageItemClicked,
  pageCount,
  className,
}: PaginationBarProps) {
  const paginationMaxPage = Math.min(pageCount, Math.max(currentPage + 4, 10))
  const paginationMinPage = Math.max(
    1,
    Math.min(currentPage - 5, paginationMaxPage - 9)
  )
  const numberedPageItems: JSX.Element[] = []
  for (let i = paginationMinPage; i <= paginationMaxPage; i++) {
    let paginationItem: JSX.Element
    if (i === currentPage) {
      const currentPageItemSizeMDOnly = (
        <button className="join-item btn btn-disabled cursor-text hidden md:block md:btn-md">
          {i}
        </button>
      )
      const currentPageItemsSizeSMOnly = (
        <button className="join-item btn  btn-disabled cursor-text btn-sm md:hidden">
          Page: {i}
        </button>
      )
      paginationItem = (
        <Fragment key={i}>
          {currentPageItemSizeMDOnly}
          {currentPageItemsSizeSMOnly}
        </Fragment>
      )
    } else {
      paginationItem = (
        <button
          onClick={() => onPageItemClicked(i)}
          key={i}
          className="join-item btn hidden btn-neutral md:block"
        >
          {i}
        </button>
      )
    }
    numberedPageItems.push(paginationItem)
  }
  return (
    <div className={'join gap-1 ' + className}>
      {currentPage > 1 && (
        <>
          <button
            onClick={() => onPageItemClicked(1)}
            className="join-item btn btn-sm sm:btn-sm md:btn-md btn-accent"
          >
            «
          </button>
          <button
            onClick={() => onPageItemClicked(currentPage - 1)}
            className="join-item btn btn-sm sm:btn-sm md:btn-md btn-accent"
          >
            &#8249;
          </button>
        </>
      )}
      {numberedPageItems}
      {currentPage < pageCount && (
        <>
          <button
            onClick={() => onPageItemClicked(currentPage + 1)}
            className="join-item btn btn-sm sm:btn-sm md:btn-md btn-accent"
          >
            &#8250;
          </button>
          <button
            onClick={() => onPageItemClicked(pageCount)}
            className="join-item btn btn-sm sm:btn-sm md:btn-md btn-accent"
          >
            »
          </button>
        </>
      )}
    </div>
  )
}
