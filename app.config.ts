export default defineAppConfig({
  // https://ui3.nuxt.dev/getting-started/theme#design-system
  ui: {
    colors: {
      primary: "green",
      neutral: "gray",
      secondary: "pink",
    },
    checkbox: {
      slots: {
        root: "relative flex items-start",
        base: "shrink-0 flex items-center justify-center rounded-full text-[var(--ui-bg)] ring ring-inset ring-[var(--ui-border-accented)] focus-visible:outline-2 focus-visible:outline-offset-2",
        container: "flex items-center",
        wrapper: "ms-2",
        icon: "shrink-0 size-full",
        label: "block font-medium text-[var(--ui-text)]",
        description: "text-[var(--ui-text-muted)]",
      },
      variants: {
        color: {
          primary: "focus-visible:outline-[var(--ui-primary)]",
          secondary: "focus-visible:outline-[var(--ui-secondary)]",
          success: "focus-visible:outline-[var(--ui-success)]",
          info: "focus-visible:outline-[var(--ui-info)]",
          warning: "focus-visible:outline-[var(--ui-warning)]",
          error: "focus-visible:outline-[var(--ui-error)]",
          neutral: "focus-visible:outline-[var(--ui-border-inverted)]",
        },
        size: {
          xs: { base: "size-3", container: "h-4", wrapper: "text-xs" },
          sm: { base: "size-3.5", container: "h-4", wrapper: "text-xs" },
          md: { base: "size-4", container: "h-5", wrapper: "text-sm" },
          lg: { base: "size-4.5", container: "h-5", wrapper: "text-sm" },
          xl: { base: "size-5", container: "h-6", wrapper: "text-base" },
        },
        required: {
          true: {
            label:
              "after:content-['*'] after:ms-0.5 after:text-[var(--ui-error)]",
          },
        },
        disabled: {
          true: {
            base: "cursor-not-allowed opacity-75",
            label: "cursor-not-allowed opacity-75",
            description: "cursor-not-allowed opacity-75",
          },
        },
        checked: {
          true: "",
        },
      },
      compoundVariants: [
        {
          color: "primary",
          checked: true,
          class: "ring-2 ring-[var(--ui-primary)] bg-[var(--ui-primary)]",
        },
        {
          color: "neutral",
          checked: true,
          class:
            "ring-2 ring-[var(--ui-border-inverted)] bg-[var(--ui-bg-inverted)]",
        },
      ],
      defaultVariants: {
        size: "md",
        color: "primary",
      },
    },
    card: {
      slots: {
        root: "bg-[var(--ui-bg)] ring ring-[var(--ui-border)] divide-y divide-[var(--ui-border)] rounded-[calc(var(--ui-radius)*2)] shadow-sm",
        header: "p-4 sm:px-6",
        body: "p-4 sm:py-2 sm:px-3",
        footer: "p-4 sm:px-6",
      },
    },
  },
})
