import axios from "axios"
import Link from "next/link";
import { useMutation, useQuery, useQueryClient } from "react-query";
import Modal from 'react-modal'
import { useRouter } from "next/router";
import Todo from "./todo";

Modal.setAppElement('#__next');

type Inputs = {
    id: string,
    name: string,
};

const fetchUsers = async () => {
    const response = await axios.get('http://localhost:3001/api/users/all');
    return response.data;
}

async function deleteUser(id: string) {
    const { data } = await axios.delete(`http://localhost:3001/api/delete/user?id=${id}`);
    return data;
}

function DisplayUsers() {

    const router = useRouter()

    const queryClient = useQueryClient();

    const { mutate } = useMutation(deleteUser, {
        onMutate: (updatedList: any) => {
            queryClient.cancelQueries("allUsers");
            queryClient.setQueryData('allUsers', (prev: any) =>
                [...prev, { ...updatedList, id: new Date().toISOString() }]);
        },
        onSettled: () => queryClient.refetchQueries("allUsers")
    })

    const { data } = useQuery("allUsers", fetchUsers)

    return (
        <div className="flex-col md:grid md:grid-cols-2 gap-6 py-4">
            {data && data.map((user: Inputs) => {
                return (
                    <Link key={user.id} href={`/?todoData=${user.id}`} as={`/details/${user.id}`}>
                        <div className="transform hover:scale-[1.04] transition-all rounded-md bg-gradient-to-r p-1 from-[#D8B4FE] to-[#818CF8] hover:from-[#FDE68A] via-[#FCA5A5] hover:to-[#FECACA] my-4 md:my-0 cursor-pointer">
                            <div onClick={() => { mutate(user.id) }} className='absolute'>
                                <h1 className="text-white">Delete</h1>
                            </div>
                            <div className="flex flex-col justify-between h-full bg-black rounded-lg p-4">
                                <h1 className="transition ease-in-out duration-600 text-gray-400 hover:text-white font-QuattroBold text-xl py-4 pl-3 rounded-md">{user.name}</h1>
                            </div>
                            {/* <pre className="text-white">
                            {user}
                        </pre> */}
                        </div>
                    </Link>
                )
            })}
            <pre className="text-white">{JSON.stringify(data, null, 2)}</pre>
            <Modal
                isOpen={!!router.query.todoData}
                onRequestClose={() => router.push('/')}
                style={{
                    content: {
                        backgroundColor: 'black'
                    }
                }}
            >
                <Todo id={router.query.todoData} />
            </Modal>
        </div>
    )
}

export default DisplayUsers