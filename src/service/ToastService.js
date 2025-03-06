import { ref, reactive } from 'vue'

// const { addToast } = useToast()
const toasts = reactive([])
let toastId = 0

export const useToast = () => {
    const addToast = (type, title, message, duration = 3000) => {
        const id = toastId++
        toasts.push({ id, type, title, message })
        setTimeout(() => removeToast(id), duration)
    }

    const removeToast = (id) => {
        const index = toasts.findIndex(toast => toast.id === id)
        if (index !== -1) {
            toasts.splice(index, 1)
        }
    }

    return {
        toasts,
        addToast,
        removeToast
    }
}
// 可能以后会用到，先留着吧

// export const showSuccessToast = () => {
//     addToast('success', 'Success!', 'This is a success message.')
// }
// export  const showErrorToast = () => {
//     addToast('error', 'Error!', 'This is an error message.')
// }
// export const showWarningToast= () => {
//     addToast('warning', 'Warning!', 'This is a warning message.')
// }
// export const showInfoToast = () => {
//     addToast('info', 'Info!', 'This is an info message.')
// }