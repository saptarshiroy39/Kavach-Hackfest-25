import * as React from "react"
import { Search } from "lucide-react"
import { Input } from "./input"
import { cn } from "@/lib/utils"

interface SearchInputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  wrapperClassName?: string
  iconClassName?: string
}

const SearchInput = React.forwardRef<HTMLInputElement, SearchInputProps>(
  ({ className, wrapperClassName, iconClassName, ...props }, ref) => {
    return (
      <div className={cn("relative flex-1", wrapperClassName)}>
        <Search className={cn(
          "absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground w-5 h-5 z-10 pointer-events-none",
          iconClassName
        )} />
        <Input
          ref={ref}
          className={cn("pl-12 h-10", className)}
          type="search"
          {...props}
        />
      </div>
    )
  }
)

SearchInput.displayName = "SearchInput"

export { SearchInput } 