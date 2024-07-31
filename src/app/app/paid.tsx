import GridWithValidators from "./components/GridWithValidators";

export default async function PaidAppPage() {
    return (
        <div className="w-full">
            <GridWithValidators paid={true} />
        </div>
    );
}