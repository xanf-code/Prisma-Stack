import axios from "axios";
import { useMutation, useQuery, useQueryClient } from "react-query";
import { useForm, SubmitHandler } from "react-hook-form";

type todoInterface = {
    id: string,
    title: string,
    content: string,
    createdAt: string,
    completed: boolean,
    userId: string
};

type Inputs = {
    title: string,
    content: string,
};

function Todo({ id }: any) {

    async function addTodo(body: Inputs): Promise<todoInterface> {
        const { data } = await axios.post(`http://localhost:3001/api/todo/add?id=${id}`, body);
        return data;
    }


    const fetchTodo = async () => {
        const response = await axios.get(`http://localhost:3001/api/todo?id=${id}`);
        return response.data;
    }

    async function cycleTodo(id: string) {
        const { data } = await axios.put(`http://localhost:3001/api/todo/cycle?id=${id}`);
        return data;
    }

    async function deleteTodo(id: string) {
        const { data } = await axios.delete(`http://localhost:3001/api/delete/todo?id=${id}`);
        return data;
    }

    const queryClient = useQueryClient();

    const mutateCycleTodo = useMutation(cycleTodo, {
        onSuccess: () => queryClient.refetchQueries("individualTodo")
    })

    const mutateDeleteTodo = useMutation(deleteTodo, {
        onSuccess: () => queryClient.refetchQueries("individualTodo")
    })

    const addTodoMutation = useMutation(addTodo, {
        onMutate: (updatedList: any) => {
            queryClient.cancelQueries("individualTodo");
            queryClient.setQueryData('individualTodo', (prev: any) =>
                [...prev, { ...updatedList, id: new Date().toISOString() }]);
        },
        onSettled: () => queryClient.refetchQueries("individualTodo")
    }
    )

    const { data } = useQuery("individualTodo", fetchTodo)

    const { register, handleSubmit, reset, formState: { errors } } = useForm<any>();
    const onSubmit: SubmitHandler<any> = (data) => {
        if (data.title.length > 0 && data.content.length > 0) {
            addTodoMutation.mutate({
                title: data.title,
                content: data.content
            });
            reset({
                title: "",
                content: ""
            })
        } else {
            return;
        }
    };

    return (
        <div className="space-y-4">
            <div className="flex-1 mr-4 space-y-4">
                <input {...register("title")} required={true} className="text-white w-full rounded-l focus:outline-none px-4 py-2 focus:border-gray-1000 text-primary border-gray-800 focus:border-gray-600 bg-white bg-opacity-5 hover:bg-opacity-10 focus:ring-0 block" placeholder="Title">
                </input>
                {errors.title && <span className="text-red-400 font-sans">This field is required</span>}
                <input {...register("content")} required={true} className="text-white w-full rounded-l focus:outline-none px-4 py-2 focus:border-gray-1000 text-primary border-gray-800 focus:border-gray-600 bg-white bg-opacity-5 hover:bg-opacity-10 focus:ring-0 block" placeholder="Content">
                </input>
                {errors.content && <span className="text-red-400 font-sans">This field is required</span>}
                <div onClick={handleSubmit(onSubmit)} className="inline-flex items-center justify-center">
                    <div className="bg-[#262626] hover:bg-gray-700 flex items-center rounded-r cursor-pointer p-2.5">
                        <h1 className="font-sans text-white font-medium text-sm">Add Todo</h1>
                    </div>
                </div>
            </div>
            {data && data.map((ind: todoInterface) => {
                return (
                    <div key={ind.id} className="flex">
                        <div className="flex items-center">
                            <h1 onClick={() => mutateDeleteTodo.mutate(ind.id)} className="mr-6 cursor-pointer">
                                ❌
                            </h1>
                            <div onClick={() => mutateCycleTodo.mutate(ind.id)} className={`w-[20px] h-[20px] border-white border-2 rounded-md mr-4 ${ind.completed === true ? 'bg-white' : ''} cursor-pointer`} />
                        </div>
                        <div className="p-4">
                            <h1 className={`text-white font-QuattroBold text-3xl mb-2 ${ind.completed === true ? 'line-through' : ''}`}>{ind.title}</h1>
                            <p className={`text-white font-Quattro ${ind.completed === true ? 'line-through' : ''}`}>{ind.content}</p>
                        </div>

                    </div>
                )
            })}
            <pre className="text-white p-2 md:p-0">{JSON.stringify(data, null, 2)}</pre>
        </div>
    )
}

export default Todo