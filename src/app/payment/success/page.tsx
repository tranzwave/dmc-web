import LoadingLayout from "~/components/common/dashboardLoading"

export default function PaymentSuccess() {
    return (
        <div>
            <h1>Payment Successful</h1>
            <LoadingLayout/>
            <p>Your subscription is now active!</p>
        </div>
    );
}
