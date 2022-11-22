import React from 'react'
import { useForm } from 'react-hook-form'

const CustomComp = React.forwardRef(({ dd, ...rest }, ref) => {
    console.log(dd)
    return <input type="text" className='w-100 form-control mb-3' ref={ref} {...rest} />
})

const CustomForm = () => {

    const { register, handleSubmit, formState: { errors } } = useForm()

    const onSubmit = (data) => {
        console.log(data)
    }
    console.log(errors)
    return (<form style={{
        width: "50%",
        textAlign: "center"
    }} className="mx-auto" onSubmit={handleSubmit(onSubmit)}>
        <CustomComp {...register("first")} dd={"hello"} />
        <CustomComp {...register("second", { required: true })} />
        <CustomComp {...register("third", { required: true })} />
        <CustomComp {...register("fourth", { required: true })} />
        <CustomComp {...register("fifth", { required: true })} />

        <button type="submit" className='mx-auto btn btn-primary'>Submit</button>
    </form>)
}

const Test = () => {
    return (
        <>
            <h2 className='w-100 text-center'>CustomForm</h2>
            <CustomForm />
        </>
    )
}

export default Test