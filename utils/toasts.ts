// const toast = useToast()

export function showSuccessToast({ title }: { title: string }) {
  const toast = useToast()
  toast.add({
    title: title,
    icon: "i-lucide-circle-check",
  })
}

export function showErrorToast({
  title,
  description,
}: {
  title: string
  description?: string
}) {
  const toast = useToast()
  toast.add({
    title: title,
    ...(description ? { description } : {}),
    icon: "i-lucide-circle-x",
    color: "error",
  })
}

// export const showSuccessToast = (message: string) => {
//   const toast = useToast()
//   toast.success(message)
// }

// export const showErrorToast = (message: string) => {
//   const toast = useToast()
//   toast.error(message)
// }
