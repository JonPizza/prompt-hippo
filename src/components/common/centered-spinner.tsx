import Spinner from "@/components/common/spinner";

export default function CenteredSpinner() {
    return (
        <div className="w-full">
            <div className="mx-auto w-fit">
                <Spinner />
            </div>
        </div>
    );
}