const toast = useToast()

export function showSuccessToast({ title }: { title: string }) {
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
  toast.add({
    title: title,
    ...(description ? { description } : {}),
    icon: "i-lucide-circle-x",
  })
}
