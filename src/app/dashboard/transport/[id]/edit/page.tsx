
const page = ({ params }: { params: { id: string } }) => {
  return (
    <div>Edit Transport {params.id}</div>
  )
}

export default page