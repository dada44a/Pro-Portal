import { ToastContainer } from "react-toastify";


export const Toast = () => {
    return (
        <ToastContainer
            position="bottom-right"
            autoClose={3000} // 3 seconds
            hideProgressBar={false}
            newestOnTop={false}
            closeOnClick
            rtl={false}
            pauseOnFocusLoss
            draggable
            pauseOnHover
        />
    );
}