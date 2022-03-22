import { useRouter } from 'next/router'
import Todo from '../../components/todo'

function todoData() {
  const router = useRouter()
  const { todoData } = router.query
  return (
    <div className='px-4 py-24 md:py-32 lg:px-0'>
      <main>
        <div className='max-w-screen-sm mx-auto justify-content'>
          <div className='flex justify-center'>
            <div className='flex flex-col space-y-4'>
              <Todo id={todoData} />
            </div>
          </div>
        </div>
      </main>
    </div>
  )
}

export default todoData