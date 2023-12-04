import GoBackButton from '@/app/ui/GoBackButton'

export default function NotFoundPage() {
  return (
    <div className="flex flex-col items-center justify-center h-[40rem]">
      <h1 className="title ">Not found</h1>
      <p className="text-accent-focus mb-3">
        Looks like this page does not exist
      </p>
      <GoBackButton href="/dashboard" buttonName="go home" />
    </div>
  )
}
