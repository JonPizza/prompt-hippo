export default async function Title(props: {title: string}) {
    return (
        <>
            <h1 className="text-4xl">{props.title}</h1>
            <hr className="my-4 border-gray-400"></hr>
        </>
    );
}
