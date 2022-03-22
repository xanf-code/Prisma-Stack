import axios from "axios";
import { useForm, SubmitHandler } from "react-hook-form";
import { useMutation, useQueryClient } from "react-query";

type Inputs = {
    name: string,
};

async function createUser(username: string) {
    const body: Inputs = { name: username }
    await axios.post('http://localhost:3001/api/user', body).then((response) => {
        console.log(response.data);
    });
}

function AddUser() {
    const queryClient = useQueryClient();

    const { mutate } = useMutation(createUser, {
        onMutate: (updatedList: any) => {
            queryClient.cancelQueries("allUsers");
            queryClient.setQueryData('allUsers', (prev: any) =>
                [...prev, { ...updatedList, id: new Date().toISOString() }]);
        },
        onSettled: () => queryClient.refetchQueries("allUsers")
    })


    const { register, handleSubmit, reset, formState: { errors } } = useForm<Inputs>();
    const onSubmit: SubmitHandler<Inputs> = (data, e) => {
        if (data.name.length > 0) {
            mutate(data.name);
            reset({
                name: "",
            })
        } else {
            return;
        }
    };

    return (
        <div className="flex">
            <div className="flex-1">
                <form className="items-stretch">
                    <input {...register("name")} required={true} className="text-white w-full rounded-l focus:outline-none px-4 py-2 focus:border-gray-1000 text-primary border-gray-800 focus:border-gray-600 bg-white bg-opacity-5 hover:bg-opacity-10 focus:ring-0 block" placeholder="Darshan Aswath">
                    </input>
                    {errors.name && <span className="text-red-400 font-sans">This field is required</span>}
                </form>
            </div>
            <div onClick={handleSubmit(onSubmit)} className="inline-flex items-center justify-center">
                <div className="bg-[#262626] hover:bg-gray-700 flex items-center rounded-r cursor-pointer p-2.5">
                    <h1 className="font-sans text-white font-medium text-sm">Add User</h1>
                </div>
            </div>
        </div>
    )
}

export default AddUser